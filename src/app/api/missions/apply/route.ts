import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { missionApplicationSchema } from "@/lib/validation";
import { ZodError } from "zod";
import { createNotification } from "@/lib/notifications";

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

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON invalide." }, { status: 400 });
  }

  let parsed;
  try {
    parsed = missionApplicationSchema.parse(body);
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json(
        { error: err.issues[0]?.message ?? "Données invalides." },
        { status: 422 }
      );
    }
    throw err;
  }

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || profile.role !== "retiree") {
    return NextResponse.json(
      { error: "Seuls les retraités peuvent postuler aux missions." },
      { status: 403 }
    );
  }

  const { error } = await supabase.from("mission_applications").insert({
    mission_id: parsed.missionId,
    applicant_id: user.id,
    cover_message: parsed.coverMessage.trim(),
    proposed_rate: parsed.proposedRate ?? null,
  });

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "Vous avez déjà postulé à cette mission." },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: error.message ?? "Candidature impossible." },
      { status: 500 }
    );
  }

  // Notify mission owner
  try {
    const { data: mission } = await supabase
      .from("missions")
      .select("id, title, company_id")
      .eq("id", parsed.missionId)
      .maybeSingle();
    const { data: applicant } = await supabase
      .from("user_profiles")
      .select("first_name, last_name")
      .eq("id", user.id)
      .maybeSingle();
    if (mission?.company_id) {
      const applicantName =
        [applicant?.first_name, applicant?.last_name]
          .filter(Boolean)
          .join(" ") || "Un candidat";
      await createNotification(
        mission.company_id,
        "new_booking",
        "Nouvelle candidature",
        `${applicantName} a postulé pour : ${mission.title}`,
        { mission_id: mission.id }
      );
    }
  } catch (notifyError) {
    console.error("[missions/apply] notification error:", notifyError);
  }

  return NextResponse.json({ success: true }, { status: 201 });
}
