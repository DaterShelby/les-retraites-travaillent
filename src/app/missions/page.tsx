import { Metadata } from "next";
import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { Briefcase, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MissionsList } from "@/components/missions/missions-list";

export const metadata: Metadata = {
  title: "Missions B2B — Job Board | Les Retraités Travaillent",
  description:
    "Trouvez des missions de conseil, mentoring et expertise auprès d'entreprises qui valorisent l'expérience.",
};

interface SearchParams {
  q?: string;
  category?: string;
  city?: string;
  contractType?: string;
  remote?: string;
  page?: string;
}

const PAGE_SIZE = 20;

export default async function MissionsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const supabase = createServerSupabaseClient();
  const page = Math.max(1, Number(searchParams.page ?? 1));
  const offset = (page - 1) * PAGE_SIZE;

  let query = supabase
    .from("missions")
    .select(
      `
        id, title, description, category, city, department, remote_allowed,
        contract_type, duration_estimate, budget_type, budget_min, budget_max,
        required_skills, start_date, applications_count, created_at,
        company:user_profiles!missions_company_id_fkey (
          id, first_name, company_name, avatar_url, sector, is_verified
        )
      `,
      { count: "exact" }
    )
    .eq("status", "open");

  if (searchParams.q) {
    query = query.textSearch("search_vector", searchParams.q, {
      type: "websearch",
      config: "french",
    });
  }
  if (searchParams.category) query = query.eq("category", searchParams.category);
  if (searchParams.city) query = query.ilike("city", `%${searchParams.city}%`);
  if (searchParams.contractType)
    query = query.eq("contract_type", searchParams.contractType);
  if (searchParams.remote === "1") query = query.eq("remote_allowed", true);

  query = query.order("created_at", { ascending: false });

  const { data, count } = await query.range(offset, offset + PAGE_SIZE - 1);

  // Flatten Supabase nested fk arrays
  const missions = (data ?? []).map((row: Record<string, unknown>) => {
    const company = Array.isArray(row.company)
      ? (row.company[0] as Record<string, unknown> | undefined)
      : (row.company as Record<string, unknown> | undefined);
    return { ...row, company: company ?? null };
  });

  const { data: { user } } = await supabase.auth.getUser();
  let userRole: string | null = null;
  if (user) {
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();
    userRole = profile?.role ?? null;
  }

  return (
    <main className="min-h-screen bg-neutral-cream pb-20">
      <section className="relative overflow-hidden bg-gradient-to-br from-neutral-text to-primary-900 px-6 pb-16 pt-12 text-white">
        <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-secondary/20 blur-3xl" />
        <div className="mx-auto max-w-6xl">
          <div className="flex items-start justify-between gap-6">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-medium text-white/80 backdrop-blur-sm">
                <Briefcase className="h-3.5 w-3.5" />
                Job board pour entreprises et experts seniors
              </div>
              <h1 className="font-serif text-3xl font-bold sm:text-4xl lg:text-5xl">
                Des missions à la hauteur de votre expérience
              </h1>
              <p className="mt-3 max-w-2xl text-base text-white/70 lg:text-lg">
                {count ?? 0} mission{(count ?? 0) > 1 ? "s" : ""} ouverte
                {(count ?? 0) > 1 ? "s" : ""} · Conseil, mentoring,
                consulting, expertise terrain.
              </p>
            </div>
            {userRole === "company" && (
              <Link href="/missions/new" className="shrink-0">
                <Button
                  size="lg"
                  className="gap-2 bg-secondary text-white hover:bg-secondary-500"
                >
                  <Plus className="h-5 w-5" />
                  Publier une mission
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-10">
        <MissionsList
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          missions={missions as any}
          total={count ?? 0}
          page={page}
          pageSize={PAGE_SIZE}
          searchParams={searchParams}
        />
      </section>
    </main>
  );
}
