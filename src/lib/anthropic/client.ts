import Anthropic from "@anthropic-ai/sdk";

const apiKey = process.env.ANTHROPIC_API_KEY;

if (!apiKey && process.env.NODE_ENV !== "test") {
  console.warn(
    "[anthropic] ANTHROPIC_API_KEY missing — AI agent features disabled."
  );
}

export const anthropic = new Anthropic({
  apiKey: apiKey ?? "missing-key",
});

export const CLAUDE_MODEL = "claude-sonnet-4-6" as const;
export const CLAUDE_MODEL_FALLBACK = "claude-haiku-4-5-20251001" as const;
export const MAX_OUTPUT_TOKENS = 1024;
