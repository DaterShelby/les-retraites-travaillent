import { createServerSupabaseClient } from "@/lib/supabase/server";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminMissionsPage() {
  const supabase = createServerSupabaseClient();
  const { data: missions } = await supabase
    .from("missions")
    .select(
      "id, title, status, location_type, applications_count, created_at, company_id"
    )
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div className="space-y-6">
      <header>
        <h2 className="font-serif text-3xl font-bold text-neutral-text">
          Missions B2B
        </h2>
        <p className="mt-1 text-sm text-neutral-text/70">
          100 dernières offres publiées par les entreprises.
        </p>
      </header>

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-card">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wider text-neutral-text/60">
            <tr>
              <th className="px-4 py-3 text-left">Titre</th>
              <th className="px-4 py-3 text-left">Format</th>
              <th className="px-4 py-3 text-left">Candidatures</th>
              <th className="px-4 py-3 text-left">Statut</th>
              <th className="px-4 py-3 text-left">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {missions?.map((m) => (
              <tr key={m.id}>
                <td className="px-4 py-3 font-medium text-neutral-text">
                  <Link
                    href={`/missions/${m.id}`}
                    className="hover:text-primary"
                  >
                    {m.title}
                  </Link>
                </td>
                <td className="px-4 py-3 text-xs text-neutral-text/70">
                  {m.location_type}
                </td>
                <td className="px-4 py-3 text-xs text-neutral-text/70">
                  {m.applications_count ?? 0}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                      m.status === "open"
                        ? "bg-accent/10 text-accent"
                        : "bg-gray-200 text-neutral-text/70"
                    }`}
                  >
                    {m.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-neutral-text/60">
                  {new Date(m.created_at as string).toLocaleDateString("fr-FR")}
                </td>
              </tr>
            ))}
            {(!missions || missions.length === 0) && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-center text-sm text-neutral-text/50"
                >
                  Aucune mission
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
