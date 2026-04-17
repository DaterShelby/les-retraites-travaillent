import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Briefcase,
  MapPin,
  Wifi,
  Calendar,
  Users,
  Building2,
  ShieldCheck,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { MissionApplyForm } from "@/components/missions/mission-apply-form";

const CONTRACT_LABEL: Record<string, string> = {
  one_shot: "Mission ponctuelle",
  recurring: "Mission récurrente",
  part_time: "Temps partiel",
  consulting: "Consulting",
};

const BUDGET_UNIT: Record<string, string> = {
  hourly: "€/h",
  daily: "€/jour",
  fixed: "€",
  negotiable: "à négocier",
};

interface PageProps {
  params: { id: string };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const supabase = createServerSupabaseClient();
  const { data: mission } = await supabase
    .from("missions")
    .select("title, description")
    .eq("id", params.id)
    .maybeSingle();

  if (!mission) return { title: "Mission introuvable" };

  return {
    title: `${mission.title} | Les Retraités Travaillent`,
    description: mission.description.slice(0, 160),
  };
}

export default async function MissionDetailPage({ params }: PageProps) {
  const supabase = createServerSupabaseClient();

  const { data: mission } = await supabase
    .from("missions")
    .select(
      `
        id, title, description, category, city, department, remote_allowed,
        contract_type, duration_estimate, budget_type, budget_min, budget_max,
        required_skills, start_date, status, applications_count, views_count,
        created_at, company_id,
        company:user_profiles!missions_company_id_fkey (
          id, first_name, company_name, avatar_url, sector, is_verified, bio
        )
      `
    )
    .eq("id", params.id)
    .maybeSingle();

  if (!mission || (mission.status !== "open" && mission.status !== "filled")) {
    notFound();
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let canApply = false;
  let alreadyApplied = false;
  let isOwner = false;

  if (user) {
    isOwner = user.id === mission.company_id;
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (profile?.role === "retiree" && mission.status === "open") {
      const { data: existing } = await supabase
        .from("mission_applications")
        .select("id")
        .eq("mission_id", mission.id)
        .eq("applicant_id", user.id)
        .maybeSingle();

      alreadyApplied = !!existing;
      canApply = !existing;
    }
  }

  const company = mission.company as {
    company_name?: string | null;
    first_name?: string | null;
    avatar_url?: string | null;
    sector?: string | null;
    is_verified?: boolean | null;
    bio?: string | null;
  } | null;
  const companyName =
    company?.company_name || company?.first_name || "Entreprise";

  const budgetLine =
    mission.budget_type === "negotiable"
      ? "Budget à négocier"
      : mission.budget_min && mission.budget_max
      ? `${mission.budget_min} – ${mission.budget_max} ${BUDGET_UNIT[mission.budget_type]}`
      : `${mission.budget_min ?? mission.budget_max ?? "?"} ${BUDGET_UNIT[mission.budget_type]}`;

  return (
    <main className="min-h-screen bg-neutral-cream pb-20">
      <div className="bg-gradient-to-br from-neutral-text to-primary-900 px-6 pt-8 text-white">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/missions"
            className="inline-flex items-center gap-1 text-sm text-white/60 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour aux missions
          </Link>
        </div>
      </div>

      <article className="mx-auto -mt-2 max-w-4xl px-6">
        <div className="rounded-3xl bg-white p-8 shadow-elevated">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
              {company?.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={company.avatar_url}
                  alt={companyName}
                  className="h-16 w-16 rounded-2xl object-cover"
                />
              ) : (
                <Building2 className="h-8 w-8 text-primary" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="flex items-center gap-1.5 text-sm font-semibold text-neutral-text/80">
                {companyName}
                {company?.is_verified && (
                  <ShieldCheck className="h-4 w-4 text-accent" />
                )}
              </p>
              {company?.sector && (
                <p className="text-xs text-neutral-text/50">
                  {company.sector}
                </p>
              )}
              <h1 className="mt-3 font-serif text-3xl font-bold text-neutral-text sm:text-4xl">
                {mission.title}
              </h1>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <Badge variant="default" size="lg">
              <Briefcase className="h-3.5 w-3.5" />
              {CONTRACT_LABEL[mission.contract_type]}
            </Badge>
            <Badge variant="outline" size="lg">
              <MapPin className="h-3.5 w-3.5" />
              {mission.city}
            </Badge>
            {mission.remote_allowed && (
              <Badge variant="accent" size="lg">
                <Wifi className="h-3.5 w-3.5" />
                Distanciel possible
              </Badge>
            )}
            {mission.duration_estimate && (
              <Badge variant="muted" size="lg">
                <Calendar className="h-3.5 w-3.5" />
                {mission.duration_estimate}
              </Badge>
            )}
          </div>

          <div className="mt-6 flex items-center justify-between rounded-2xl bg-neutral-cream/60 p-4">
            <div>
              <p className="text-xs uppercase tracking-wider text-neutral-text/50">
                Budget
              </p>
              <p className="mt-1 text-xl font-bold text-secondary-700">
                {budgetLine}
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-neutral-text/70">
              <Users className="h-4 w-4" />
              {mission.applications_count ?? 0} candidat
              {(mission.applications_count ?? 0) > 1 ? "s" : ""}
            </div>
          </div>

          <section className="mt-8">
            <h2 className="font-serif text-xl font-bold text-neutral-text">
              Description de la mission
            </h2>
            <div className="mt-3 whitespace-pre-wrap text-base leading-relaxed text-neutral-text/80">
              {mission.description}
            </div>
          </section>

          {(mission.required_skills?.length ?? 0) > 0 && (
            <section className="mt-8">
              <h2 className="font-serif text-xl font-bold text-neutral-text">
                Compétences recherchées
              </h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {(mission.required_skills as string[]).map((s) => (
                  <span
                    key={s}
                    className="rounded-full bg-secondary/10 px-3 py-1 text-sm font-medium text-secondary-700"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </section>
          )}

          {company?.bio && (
            <section className="mt-8">
              <h2 className="font-serif text-xl font-bold text-neutral-text">
                À propos de {companyName}
              </h2>
              <p className="mt-3 text-base leading-relaxed text-neutral-text/80">
                {company.bio}
              </p>
            </section>
          )}
        </div>

        <aside className="mt-6 rounded-3xl bg-white p-8 shadow-card">
          {isOwner ? (
            <div className="space-y-3">
              <p className="font-semibold text-neutral-text">
                C&apos;est votre mission
              </p>
              <p className="text-sm text-neutral-text/70">
                Vous pouvez la modifier ou consulter les candidatures depuis
                votre tableau de bord.
              </p>
              <Link
                href={`/dashboard/missions/${mission.id}`}
                className="inline-flex items-center gap-2 text-sm font-semibold text-secondary hover:text-secondary-500"
              >
                Voir les candidatures →
              </Link>
            </div>
          ) : alreadyApplied ? (
            <div className="space-y-2 rounded-2xl bg-accent/10 p-4">
              <p className="flex items-center gap-2 font-semibold text-accent">
                <ShieldCheck className="h-5 w-5" />
                Candidature envoyée
              </p>
              <p className="text-sm text-neutral-text/70">
                {companyName} reviendra vers vous prochainement. Vous pouvez
                suivre la candidature depuis votre tableau de bord.
              </p>
            </div>
          ) : !user ? (
            <div className="space-y-3 text-center">
              <Sparkles className="mx-auto h-8 w-8 text-secondary" />
              <p className="font-semibold text-neutral-text">
                Cette mission vous intéresse&nbsp;?
              </p>
              <p className="text-sm text-neutral-text/70">
                Connectez-vous pour postuler en quelques clics.
              </p>
              <Link
                href={`/login?next=/missions/${mission.id}`}
                className="inline-flex h-12 items-center justify-center rounded-2xl bg-primary px-6 text-sm font-semibold text-white hover:bg-primary-600"
              >
                Se connecter
              </Link>
            </div>
          ) : canApply ? (
            <MissionApplyForm
              missionId={mission.id}
              companyName={companyName}
            />
          ) : (
            <p className="text-sm text-neutral-text/70">
              Seuls les profils retraités peuvent postuler à cette mission.
            </p>
          )}
        </aside>
      </article>
    </main>
  );
}
