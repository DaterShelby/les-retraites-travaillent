import { createServerSupabaseClient } from "@/lib/supabase/server";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminServicesPage() {
  const supabase = createServerSupabaseClient();
  const { data: services } = await supabase
    .from("services")
    .select(
      "id, title, category, status, price_amount, price_type, city, created_at, provider_id"
    )
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div className="space-y-6">
      <header>
        <h2 className="font-serif text-3xl font-bold text-neutral-text">
          Services
        </h2>
        <p className="mt-1 text-sm text-neutral-text/70">
          100 derniers services publiés.
        </p>
      </header>

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-card">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wider text-neutral-text/60">
            <tr>
              <th className="px-4 py-3 text-left">Titre</th>
              <th className="px-4 py-3 text-left">Catégorie</th>
              <th className="px-4 py-3 text-left">Ville</th>
              <th className="px-4 py-3 text-left">Tarif</th>
              <th className="px-4 py-3 text-left">Statut</th>
              <th className="px-4 py-3 text-left">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {services?.map((s) => (
              <tr key={s.id}>
                <td className="px-4 py-3 font-medium text-neutral-text">
                  <Link
                    href={`/services/${s.id}`}
                    className="hover:text-primary"
                  >
                    {s.title}
                  </Link>
                </td>
                <td className="px-4 py-3 text-xs text-neutral-text/70">
                  {s.category}
                </td>
                <td className="px-4 py-3 text-xs text-neutral-text/70">
                  {s.city}
                </td>
                <td className="px-4 py-3 text-xs text-neutral-text/70">
                  {s.price_amount
                    ? `${s.price_amount} €${
                        s.price_type === "hourly" ? "/h" : ""
                      }`
                    : "—"}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                      s.status === "active"
                        ? "bg-accent/10 text-accent"
                        : s.status === "draft"
                        ? "bg-gray-200 text-neutral-text/70"
                        : "bg-error/10 text-error"
                    }`}
                  >
                    {s.status ?? "—"}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-neutral-text/60">
                  {new Date(s.created_at as string).toLocaleDateString("fr-FR")}
                </td>
              </tr>
            ))}
            {(!services || services.length === 0) && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-sm text-neutral-text/50"
                >
                  Aucun service
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
