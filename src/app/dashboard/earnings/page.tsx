import { Metadata } from "next";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import {
  Wallet,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
} from "lucide-react";
import { StripeOnboardButton } from "@/components/bookings/stripe-onboard-button";

export const metadata: Metadata = {
  title: "Mes revenus | Les Retraités Travaillent",
};

interface SearchParams {
  stripe?: string;
}

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  pending: { label: "Compte en cours de création", color: "text-secondary-700" },
  restricted: { label: "Action requise sur votre compte", color: "text-error" },
  active: { label: "Compte actif", color: "text-accent" },
  rejected: { label: "Compte refusé", color: "text-error" },
};

function fmtEur(cents: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}

export default async function EarningsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/dashboard/earnings");

  const { data: profile } = await supabase
    .from("user_profiles")
    .select(
      "role, stripe_account_id, stripe_account_status, stripe_charges_enabled, stripe_payouts_enabled"
    )
    .eq("id", user.id)
    .maybeSingle();

  const isProvider = profile?.role === "retiree" || profile?.role === "company";

  const { data: paidBookings } = await supabase
    .from("bookings")
    .select("id, amount_total, paid_at, payment_status, status, slot_start")
    .eq("provider_id", user.id)
    .in("payment_status", ["paid", "released"])
    .order("paid_at", { ascending: false })
    .limit(50);

  const { data: pendingBookings } = await supabase
    .from("bookings")
    .select("id, amount_total")
    .eq("provider_id", user.id)
    .eq("payment_status", "pending");

  const totalPaid =
    paidBookings?.reduce((sum, b) => sum + (b.amount_total ?? 0), 0) ?? 0;
  const totalPending =
    pendingBookings?.reduce((sum, b) => sum + (b.amount_total ?? 0), 0) ?? 0;
  const totalReleased =
    paidBookings
      ?.filter((b) => b.payment_status === "released")
      .reduce((sum, b) => sum + (b.amount_total ?? 0), 0) ?? 0;

  const showStripeReturn = searchParams.stripe === "return";
  const status = profile?.stripe_account_status ?? null;

  return (
    <div className="max-w-5xl space-y-10">
      <header>
        <h1 className="font-serif text-3xl font-bold text-neutral-text sm:text-4xl">
          Mes revenus
        </h1>
        <p className="mt-2 text-neutral-text/70">
          Encaissez les paiements de vos missions en toute sécurité via Stripe.
        </p>
      </header>

      {!isProvider ? (
        <div className="rounded-3xl border-2 border-dashed border-gray-200 bg-white p-10 text-center">
          <Wallet className="mx-auto h-10 w-10 text-neutral-text/40" />
          <p className="mt-4 text-base text-neutral-text/70">
            Cette section est réservée aux comptes prestataires (retraités et
            entreprises).
          </p>
        </div>
      ) : !profile?.stripe_account_id ? (
        <section className="rounded-3xl bg-gradient-to-br from-secondary/10 to-accent/10 p-10">
          <div className="flex items-start gap-5">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-secondary text-white">
              <Wallet className="h-7 w-7" />
            </div>
            <div className="flex-1">
              <h2 className="font-serif text-2xl font-bold text-neutral-text">
                Activez les paiements
              </h2>
              <p className="mt-2 max-w-2xl text-neutral-text/70">
                Stripe gère vos virements bancaires en toute sécurité. La
                configuration prend ~3 minutes : pièce d&apos;identité, IBAN et
                adresse.
              </p>
              <div className="mt-6">
                <StripeOnboardButton label="Activer mes paiements Stripe" />
              </div>
            </div>
          </div>
        </section>
      ) : (
        <>
          <section
            className={`rounded-2xl border p-5 ${
              status === "active"
                ? "border-accent/20 bg-accent/5"
                : status === "restricted" || status === "rejected"
                ? "border-error/20 bg-error/5"
                : "border-secondary/20 bg-secondary/5"
            }`}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {status === "active" ? (
                  <ShieldCheck className="h-6 w-6 text-accent" />
                ) : (
                  <AlertTriangle className="h-6 w-6 text-secondary-700" />
                )}
                <div>
                  <p
                    className={`font-semibold ${
                      STATUS_LABEL[status ?? "pending"]?.color ??
                      "text-neutral-text"
                    }`}
                  >
                    {STATUS_LABEL[status ?? "pending"]?.label ??
                      "Statut inconnu"}
                  </p>
                  <p className="mt-0.5 text-xs text-neutral-text/60">
                    Encaissements{" "}
                    {profile.stripe_charges_enabled ? "actifs" : "désactivés"} ·
                    Virements{" "}
                    {profile.stripe_payouts_enabled ? "actifs" : "désactivés"}
                  </p>
                </div>
              </div>
              {status !== "active" && (
                <StripeOnboardButton
                  variant="outline"
                  label="Compléter mon compte"
                />
              )}
            </div>
            {showStripeReturn && status === "active" && (
              <p className="mt-3 text-sm text-accent">
                Compte vérifié — vous pouvez recevoir des paiements.
              </p>
            )}
          </section>

          <section className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <StatCard
              icon={<TrendingUp className="h-5 w-5" />}
              label="Total encaissé"
              value={fmtEur(totalPaid)}
              tone="primary"
            />
            <StatCard
              icon={<CheckCircle2 className="h-5 w-5" />}
              label="Versé sur compte"
              value={fmtEur(totalReleased)}
              tone="accent"
            />
            <StatCard
              icon={<Clock className="h-5 w-5" />}
              label="En attente"
              value={fmtEur(totalPending)}
              tone="secondary"
            />
          </section>

          <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-card">
            <h2 className="font-serif text-xl font-bold text-neutral-text">
              Derniers paiements
            </h2>
            {paidBookings && paidBookings.length > 0 ? (
              <ul className="mt-4 divide-y divide-gray-100">
                {paidBookings.slice(0, 10).map((b) => (
                  <li
                    key={b.id}
                    className="flex items-center justify-between py-3 text-sm"
                  >
                    <div>
                      <p className="font-semibold text-neutral-text">
                        Réservation #{b.id.slice(0, 8)}
                      </p>
                      <p className="text-xs text-neutral-text/60">
                        {b.paid_at
                          ? new Date(b.paid_at).toLocaleDateString("fr-FR", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })
                          : "Date inconnue"}
                      </p>
                    </div>
                    <p className="font-semibold text-secondary-700">
                      {fmtEur(b.amount_total ?? 0)}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-neutral-text/60">
                Aucun paiement reçu pour le moment.
              </p>
            )}
          </section>
        </>
      )}
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone: "primary" | "accent" | "secondary";
}) {
  const toneClass =
    tone === "primary"
      ? "from-primary/10 to-primary/5 text-primary"
      : tone === "accent"
      ? "from-accent/10 to-accent/5 text-accent"
      : "from-secondary/10 to-secondary/5 text-secondary-700";
  return (
    <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-card">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-neutral-text/70">{label}</p>
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br ${toneClass}`}
        >
          {icon}
        </div>
      </div>
      <p className="mt-3 font-serif text-3xl font-bold text-neutral-text">
        {value}
      </p>
    </div>
  );
}
