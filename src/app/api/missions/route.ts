import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { missionCreateSchema } from "@/lib/validation";
import { ZodError } from "zod";

export async function POST(request: Request) {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json(
      { error: "Authentification requise." },
      { status: 401 }
    );
  }

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || profile.role !== "company") {
    return NextResponse.json(
      { error: "Seuls les comptes entreprise peuvent publier une mission." },
      { status: 403 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON invalide." }, { status: 400 });
  }

  let parsed;
  try {
    parsed = missionCreateSchema.parse(body);
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json(
        { error: err.issues[0]?.message ?? "Données invalides." },
        { status: 422 }
      );
    }
    throw err;
  }

  const { data: created, error } = await supabase
    .from("missions")
    .insert({
      company_id: user.id,
      title: parsed.title.trim(),
      description: parsed.description.trim(),
      category: parsed.category,
      city: parsed.city.trim(),
      remote_allowed: parsed.remoteAllowed,
      contract_type: parsed.contractType,
      duration_estimate: parsed.durationEstimate || null,
      budget_type: parsed.budgetType,
      budget_min: parsed.budgetMin ?? null,
      budget_max: parsed.budgetMax ?? null,
      required_skills: parsed.requiredSkills,
      start_date: parsed.startDate || null,
      status: parsed.status,
    })
    .select("id")
    .single();

  if (error || !created) {
    return NextResponse.json(
      { error: error?.message ?? "Création impossible." },
      { status: 500 }
    );
  }

  return NextResponse.json({ id: created.id }, { status: 201 });
}
