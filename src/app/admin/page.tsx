import { createServerSupabaseClient } from "@/lib/supabase/server";
import { Users, Briefcase, Megaphone, CreditCard, Activity } from "lucide-react";

export const dynamic = "force-dynamic";

interface KPI {
  label: string;
  value: string;
  hint?: string;
  icon: React.ReactNode;
  tone: "primary" | "secondary" | "accent";
}

function fmtEur(cents: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export default async function AdminHomePage() {
  const supabase = createServerSupabaseClient();

  const [
    { count: usersCount },
    { count: providersCount },
    { count: clientsCount },
    { count: companiesCount },
    { count: servicesCount },
    { count: bookingsCount },
    { count: missionsCount },
    { data: paid },
  ] = await Promise.all([
    supabase.from("user_profiles").select("id", { count: "exact", head: true }),
    supabase
      .from("user_profiles")
      .select("id", { count: "exact", head: true })
      .eq("role", "retiree"),
    supabase
      .from("user_profiles")
      .select("id", { count: "exact", head: true })
      .eq("role", "client"),
    supabase
      .from("user_profiles")
      .select("id", { count: "exact", head: true })
      .eq("role", "company"),
    supabase.from("services").select("id", { count: "exact", head: true }),
    supabase.from("bookings").select("id", { count: "exact", head: true }),
    supabase.from("missions").select("id", { count: "exact", head: true }),
    supabase
      .from("bookings")
      .select("amount_total, platform_fee")
      .in("payment_status", ["paid", "released"]),
  ]);

  const gmv =
    paid?.reduce((sum, b) => sum + (b.amount_total ?? 0), 0) ?? 0;
  const fees =
    paid?.reduce((sum, b) => sum + (b.platform_fee ?? 0), 0) ?? 0;

  const kpis: KPI[] = [
    {
      label: "Utilisateurs",
      value: String(usersCount ?? 0),
      hint: `${providersCount ?? 0} retraités · ${clientsCount ?? 0} clients · ${
        companiesCount ?? 0
      } entreprises`,
      icon: <Users className="h-5 w-5" />,
      tone: "primary",
    },
    {
      label: "Services publiés",
      value: String(servicesCount ?? 0),
      icon: <Briefcase className="h-5 w-5" />,
      tone: "secondary",
    },
    {
      label: "Missions B2B",
      value: String(missionsCount ?? 0),
      icon: <Megaphone className="h-5 w-5" />,
      tone: "accent",
    },
    {
      label: "Réservations totales",
      value: String(bookingsCount ?? 0),
      icon: <Activity className="h-5 w-5" />,
      tone: "primary",
    },
    {
      label: "GMV (volume payé)",
      value: fmtEur(gmv),
      hint: `Commissions : ${fmtEur(fees)}`,
      icon: <CreditCard className="h-5 w-5" />,
      tone: "accent",
    },
  ];

  return (
    <div className="space-y-8">
      <header>
        <h2 className="font-serif text-3xl font-bold text-neutral-text">
          Vue d&apos;ensemble
        </h2>
        <p className="mt-1 text-sm text-neutral-text/70">
          Indicateurs en temps réel — mis à jour à chaque chargement.
        </p>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {kpis.map((k) => (
          <KpiCard key={k.label} kpi={k} />
        ))}
      </section>
    </div>
  );
}

function KpiCard({ kpi }: { kpi: KPI }) {
  const toneClass =
    kpi.tone === "primary"
      ? "from-primary/10 to-primary/5 text-primary"
      : kpi.tone === "accent"
      ? "from-accent/10 to-accent/5 text-accent"
      : "from-secondary/10 to-secondary/5 text-secondary-700";
  return (
    <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-card">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-neutral-text/60">
          {kpi.label}
        </p>
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br ${toneClass}`}
        >
          {kpi.icon}
        </div>
      </div>
      <p className="mt-3 font-serif text-3xl font-bold text-neutral-text">
        {kpi.value}
      </p>
      {kpi.hint && (
        <p className="mt-1 text-xs text-neutral-text/60">{kpi.hint}</p>
      )}
    </div>
  );
}
