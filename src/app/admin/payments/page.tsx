import { createServerSupabaseClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

function fmtEur(cents: number | null | undefined): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format((cents ?? 0) / 100);
}

export default async function AdminPaymentsPage() {
  const supabase = createServerSupabaseClient();
  const { data: bookings } = await supabase
    .from("bookings")
    .select(
      "id, amount_total, platform_fee, payment_status, status, paid_at, client_id, provider_id, currency, stripe_payment_intent_id"
    )
    .not("payment_status", "eq", "unpaid")
    .order("paid_at", { ascending: false, nullsFirst: false })
    .limit(100);

  const { data: events } = await supabase
    .from("payment_events")
    .select("id, event_type, processed_at")
    .order("processed_at", { ascending: false })
    .limit(20);

  return (
    <div className="space-y-8">
      <header>
        <h2 className="font-serif text-3xl font-bold text-neutral-text">
          Paiements
        </h2>
        <p className="mt-1 text-sm text-neutral-text/70">
          100 dernières transactions et 20 derniers évènements Stripe.
        </p>
      </header>

      <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-card">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wider text-neutral-text/60">
            <tr>
              <th className="px-4 py-3 text-left">Réservation</th>
              <th className="px-4 py-3 text-left">Total</th>
              <th className="px-4 py-3 text-left">Commission</th>
              <th className="px-4 py-3 text-left">Statut paiement</th>
              <th className="px-4 py-3 text-left">Statut booking</th>
              <th className="px-4 py-3 text-left">Payé le</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {bookings?.map((b) => (
              <tr key={b.id}>
                <td className="px-4 py-3 font-mono text-xs text-neutral-text/70">
                  {b.id.slice(0, 8)}
                </td>
                <td className="px-4 py-3 font-semibold text-neutral-text">
                  {fmtEur(b.amount_total)}
                </td>
                <td className="px-4 py-3 text-xs text-secondary-700">
                  {fmtEur(b.platform_fee)}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                      b.payment_status === "paid" ||
                      b.payment_status === "released"
                        ? "bg-accent/10 text-accent"
                        : b.payment_status === "refunded"
                        ? "bg-secondary/10 text-secondary-700"
                        : "bg-error/10 text-error"
                    }`}
                  >
                    {b.payment_status}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-neutral-text/70">
                  {b.status}
                </td>
                <td className="px-4 py-3 text-xs text-neutral-text/60">
                  {b.paid_at
                    ? new Date(b.paid_at).toLocaleDateString("fr-FR")
                    : "—"}
                </td>
              </tr>
            ))}
            {(!bookings || bookings.length === 0) && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-sm text-neutral-text/50"
                >
                  Aucun paiement
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-card">
        <h3 className="font-serif text-lg font-bold text-neutral-text">
          Évènements Stripe récents
        </h3>
        <ul className="mt-3 divide-y divide-gray-100 text-sm">
          {events?.map((e) => (
            <li
              key={e.id}
              className="flex items-center justify-between py-2 text-neutral-text/80"
            >
              <span className="font-mono text-xs">{e.event_type}</span>
              <span className="text-xs text-neutral-text/60">
                {new Date(e.processed_at as string).toLocaleString("fr-FR")}
              </span>
            </li>
          ))}
          {(!events || events.length === 0) && (
            <li className="py-4 text-center text-xs text-neutral-text/50">
              Aucun évènement reçu (configurer le webhook Stripe en
              production).
            </li>
          )}
        </ul>
      </section>
    </div>
  );
}
