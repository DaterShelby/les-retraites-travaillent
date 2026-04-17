import type { SupabaseClient } from "@supabase/supabase-js";
import type { ToolName } from "@/lib/anthropic/tools";

export interface ToolExecutionContext {
  supabase: SupabaseClient;
  userId: string;
}

export interface ToolResult {
  ok: boolean;
  data?: unknown;
  error?: string;
}

type Executor = (
  args: Record<string, unknown>,
  ctx: ToolExecutionContext
) => Promise<ToolResult>;

const search_services: Executor = async (args, { supabase }) => {
  const query = String(args.query ?? "").trim();
  const limit = Math.min(Number(args.limit ?? 5), 10);

  let q = supabase
    .from("services")
    .select("id, title, description, category, city, price_amount, price_type, provider_id")
    .eq("status", "active")
    .limit(limit);

  if (query) q = q.textSearch("search_vector", query, { type: "websearch", config: "french" });
  if (args.category) q = q.eq("category", String(args.category));
  if (args.city) q = q.ilike("city", `%${String(args.city)}%`);
  if (args.max_price)
    q = q.lte("price_amount", Number(args.max_price));

  const { data, error } = await q;
  if (error) return { ok: false, error: error.message };
  return { ok: true, data: { count: data?.length ?? 0, services: data ?? [] } };
};

const search_retirees: Executor = async (args, { supabase }) => {
  const limit = Math.min(Number(args.limit ?? 5), 10);
  let q = supabase
    .from("user_profiles")
    .select("id, first_name, city, skills, hourly_rate, bio, avatar_url")
    .eq("role", "retiree")
    .limit(limit);

  if (args.city) q = q.ilike("city", `%${String(args.city)}%`);
  if (Array.isArray(args.skills) && args.skills.length > 0)
    q = q.overlaps("skills", args.skills as string[]);

  const { data, error } = await q;
  if (error) return { ok: false, error: error.message };
  return { ok: true, data: { count: data?.length ?? 0, retirees: data ?? [] } };
};

const list_my_bookings: Executor = async (args, { supabase, userId }) => {
  const limit = Math.min(Number(args.limit ?? 10), 20);
  const status = args.status ? String(args.status) : "all";

  let q = supabase
    .from("bookings")
    .select("id, status, slot_start, slot_end, description, services(title, category)")
    .or(`client_id.eq.${userId},provider_id.eq.${userId}`)
    .order("slot_start", { ascending: false })
    .limit(limit);

  if (status !== "all") q = q.eq("status", status);

  const { data, error } = await q;
  if (error) return { ok: false, error: error.message };
  return { ok: true, data: { count: data?.length ?? 0, bookings: data ?? [] } };
};

const create_booking: Executor = async (args, { supabase, userId }) => {
  const serviceId = String(args.service_id ?? "");
  const scheduledAt = String(args.scheduled_at ?? "");
  const message = String(args.message ?? "");
  const durationMin = Number(args.estimated_duration_min ?? 60);

  if (!serviceId || !scheduledAt || message.length < 10) {
    return { ok: false, error: "Champs requis manquants ou message trop court." };
  }
  if (new Date(scheduledAt) <= new Date()) {
    return { ok: false, error: "La date doit être dans le futur." };
  }

  const { data: service, error: svcError } = await supabase
    .from("services")
    .select("id, provider_id")
    .eq("id", serviceId)
    .single();
  if (svcError || !service) return { ok: false, error: "Service introuvable." };

  const slotEnd = new Date(
    new Date(scheduledAt).getTime() + durationMin * 60_000
  ).toISOString();

  const { data, error } = await supabase
    .from("bookings")
    .insert({
      service_id: serviceId,
      client_id: userId,
      provider_id: service.provider_id,
      slot_start: scheduledAt,
      slot_end: slotEnd,
      description: message,
      status: "pending",
    })
    .select("id, status, slot_start")
    .single();

  if (error) return { ok: false, error: error.message };
  return { ok: true, data: { booking: data, message: "Réservation créée." } };
};

const send_message: Executor = async (args, { supabase, userId }) => {
  const conversationId = String(args.conversation_id ?? "");
  const content = String(args.content ?? "").trim();
  if (!conversationId || !content) {
    return { ok: false, error: "conversation_id et content requis." };
  }

  const { data, error } = await supabase
    .from("messages")
    .insert({
      conversation_id: conversationId,
      sender_id: userId,
      content,
    })
    .select("id, created_at")
    .single();

  if (error) return { ok: false, error: error.message };
  return { ok: true, data: { message: data } };
};

const get_my_stats: Executor = async (args, { supabase, userId }) => {
  const period = String(args.period ?? "month");
  const days = period === "week" ? 7 : period === "quarter" ? 90 : period === "year" ? 365 : 30;
  const since = new Date(Date.now() - days * 86_400_000).toISOString();

  const [{ count: totalBookings }, { count: completedBookings }, { data: earnings }] =
    await Promise.all([
      supabase
        .from("bookings")
        .select("id", { count: "exact", head: true })
        .or(`client_id.eq.${userId},provider_id.eq.${userId}`)
        .gte("created_at", since),
      supabase
        .from("bookings")
        .select("id", { count: "exact", head: true })
        .eq("provider_id", userId)
        .eq("status", "completed")
        .gte("created_at", since),
      supabase
        .from("bookings")
        .select("services(price_amount)")
        .eq("provider_id", userId)
        .eq("status", "completed")
        .gte("created_at", since),
    ]);

  const totalEarnings =
    earnings?.reduce((sum, b: any) => sum + (b.services?.price_amount ?? 0), 0) ?? 0;

  return {
    ok: true,
    data: {
      period,
      total_bookings: totalBookings ?? 0,
      completed_bookings: completedBookings ?? 0,
      estimated_earnings_eur: totalEarnings,
    },
  };
};

const EXECUTORS: Record<ToolName, Executor> = {
  search_services,
  search_retirees,
  list_my_bookings,
  create_booking,
  send_message,
  get_my_stats,
};

export async function executeTool(
  name: string,
  args: Record<string, unknown>,
  ctx: ToolExecutionContext
): Promise<ToolResult> {
  const executor = EXECUTORS[name as ToolName];
  if (!executor) {
    return { ok: false, error: `Outil inconnu : ${name}` };
  }
  try {
    return await executor(args, ctx);
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Erreur d'exécution.",
    };
  }
}
