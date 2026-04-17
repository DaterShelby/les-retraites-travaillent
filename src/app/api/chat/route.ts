import { NextResponse, type NextRequest } from "next/server";
import type Anthropic from "@anthropic-ai/sdk";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
  anthropic,
  CLAUDE_MODEL,
  MAX_OUTPUT_TOKENS,
} from "@/lib/anthropic/client";
import { buildSystemPrompt, type AgentContext } from "@/lib/anthropic/prompts";
import { TOOLS } from "@/lib/anthropic/tools";
import { executeTool } from "./tool-executors";
import { chatMessageSchema } from "@/lib/validation";
import { checkRate, clientKey } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_TOOL_ITERATIONS = 5;
const MAX_HISTORY_MESSAGES = 20;
const RATE_LIMIT = { max: 30, windowMs: 60_000 };

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "Service IA non configuré." },
      { status: 503 }
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = chatMessageSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Requête invalide.", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  // Rate limit Anthropic — 30 req/min par utilisateur
  if (!checkRate(`chat:${clientKey(req, user.id)}`, RATE_LIMIT)) {
    return NextResponse.json(
      {
        error:
          "Trop de requêtes. Patientez quelques secondes avant de réessayer.",
      },
      { status: 429 }
    );
  }

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("first_name, city, role, hourly_rate, skills, company_name")
    .eq("id", user.id)
    .single();

  if (!profile) {
    return NextResponse.json(
      { error: "Profil utilisateur introuvable." },
      { status: 404 }
    );
  }

  let conversationId = parsed.data.conversationId;
  if (!conversationId) {
    const { data: conv, error: convErr } = await supabase
      .from("ai_conversations")
      .insert({
        user_id: user.id,
        title: parsed.data.content.slice(0, 60),
        context: parsed.data.context ?? {},
      })
      .select("id")
      .single();
    if (convErr || !conv) {
      return NextResponse.json(
        { error: "Création de conversation impossible." },
        { status: 500 }
      );
    }
    conversationId = conv.id;
  }

  // Persist user message
  await supabase.from("ai_messages").insert({
    conversation_id: conversationId,
    role: "user",
    content: parsed.data.content,
  });

  // Load history
  const { data: history } = await supabase
    .from("ai_messages")
    .select("role, content, tool_calls, tool_call_id")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true })
    .limit(MAX_HISTORY_MESSAGES);

  const ctx: AgentContext = {
    role: profile.role,
    firstName: profile.first_name,
    city: profile.city,
    hourlyRate: profile.hourly_rate,
    skills: profile.skills,
    companyName: profile.company_name,
    page: parsed.data.context?.page,
  };
  const { cacheable, dynamic: dynamicSystem } = buildSystemPrompt(ctx);

  const apiMessages: Anthropic.MessageParam[] = (history ?? []).map((m) => {
    if (m.role === "tool") {
      return {
        role: "user",
        content: [
          {
            type: "tool_result",
            tool_use_id: m.tool_call_id ?? "",
            content: m.content,
          },
        ],
      };
    }
    if (m.role === "assistant" && m.tool_calls) {
      const toolUses = (m.tool_calls as Array<{ id: string; name: string; input: unknown }>).map(
        (t) => ({
          type: "tool_use" as const,
          id: t.id,
          name: t.name,
          input: (t.input ?? {}) as Record<string, unknown>,
        })
      );
      const blocks: Anthropic.ContentBlockParam[] = m.content
        ? [{ type: "text", text: m.content }, ...toolUses]
        : toolUses;
      return { role: "assistant", content: blocks };
    }
    return {
      role: m.role === "assistant" ? "assistant" : "user",
      content: m.content,
    };
  });

  const systemBlocks: Anthropic.TextBlockParam[] = [
    {
      type: "text",
      text: cacheable,
      cache_control: { type: "ephemeral" },
    },
    { type: "text", text: dynamicSystem },
  ];

  let iteration = 0;
  let finalText = "";
  let totalInput = 0;
  let totalOutput = 0;
  let totalCacheRead = 0;
  let totalCacheCreate = 0;

  try {
    while (iteration < MAX_TOOL_ITERATIONS) {
      iteration += 1;

      const response = await anthropic.messages.create({
        model: CLAUDE_MODEL,
        max_tokens: MAX_OUTPUT_TOKENS,
        system: systemBlocks,
        tools: TOOLS,
        messages: apiMessages,
      });

      totalInput += response.usage.input_tokens;
      totalOutput += response.usage.output_tokens;
      totalCacheRead += response.usage.cache_read_input_tokens ?? 0;
      totalCacheCreate += response.usage.cache_creation_input_tokens ?? 0;

      const textBlocks = response.content
        .filter((b): b is Anthropic.TextBlock => b.type === "text")
        .map((b) => b.text)
        .join("\n");

      const toolUses = response.content.filter(
        (b): b is Anthropic.ToolUseBlock => b.type === "tool_use"
      );

      // Persist assistant turn (text + tool_uses)
      await supabase.from("ai_messages").insert({
        conversation_id: conversationId,
        role: "assistant",
        content: textBlocks,
        tool_calls:
          toolUses.length > 0
            ? toolUses.map((t) => ({ id: t.id, name: t.name, input: t.input }))
            : null,
        model: CLAUDE_MODEL,
        input_tokens: response.usage.input_tokens,
        output_tokens: response.usage.output_tokens,
        cache_read_tokens: response.usage.cache_read_input_tokens ?? null,
        cache_creation_tokens:
          response.usage.cache_creation_input_tokens ?? null,
        finish_reason: response.stop_reason,
      });

      apiMessages.push({ role: "assistant", content: response.content });

      if (response.stop_reason !== "tool_use" || toolUses.length === 0) {
        finalText = textBlocks;
        break;
      }

      // Execute tools
      const toolResults: Anthropic.ToolResultBlockParam[] = [];
      for (const toolUse of toolUses) {
        const result = await executeTool(
          toolUse.name,
          toolUse.input as Record<string, unknown>,
          { supabase, userId: user.id }
        );

        const resultText = JSON.stringify(result);
        toolResults.push({
          type: "tool_result",
          tool_use_id: toolUse.id,
          content: resultText,
          is_error: !result.ok,
        });

        await supabase.from("ai_messages").insert({
          conversation_id: conversationId,
          role: "tool",
          content: resultText,
          tool_call_id: toolUse.id,
        });
      }

      apiMessages.push({ role: "user", content: toolResults });
    }

    return NextResponse.json({
      conversationId,
      reply: finalText,
      usage: {
        input_tokens: totalInput,
        output_tokens: totalOutput,
        cache_read_tokens: totalCacheRead,
        cache_creation_tokens: totalCacheCreate,
        iterations: iteration,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur IA inconnue.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
