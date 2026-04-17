import { createServerSupabaseClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const ROLE_LABEL: Record<string, string> = {
  retiree: "Retraité",
  client: "Client",
  company: "Entreprise",
  admin: "Admin",
};

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams?: { role?: string };
}) {
  const supabase = createServerSupabaseClient();
  const role = searchParams?.role;

  let query = supabase
    .from("user_profiles")
    .select(
      "id, first_name, last_name, role, onboarding_completed, created_at, stripe_account_status"
    )
    .order("created_at", { ascending: false })
    .limit(100);
  if (role) query = query.eq("role", role);

  const { data: users } = await query;

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-serif text-3xl font-bold text-neutral-text">
            Utilisateurs
          </h2>
          <p className="mt-1 text-sm text-neutral-text/70">
            100 derniers comptes — filtrer par rôle.
          </p>
        </div>
        <nav className="flex gap-2">
          {[undefined, "retiree", "client", "company", "admin"].map((r) => (
            <a
              key={r ?? "all"}
              href={r ? `/admin/users?role=${r}` : "/admin/users"}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                (role ?? null) === (r ?? null)
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-neutral-text/70 hover:bg-gray-200"
              }`}
            >
              {r ? ROLE_LABEL[r] : "Tous"}
            </a>
          ))}
        </nav>
      </header>

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-card">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wider text-neutral-text/60">
            <tr>
              <th className="px-4 py-3 text-left">Nom</th>
              <th className="px-4 py-3 text-left">Rôle</th>
              <th className="px-4 py-3 text-left">Onboarding</th>
              <th className="px-4 py-3 text-left">Stripe</th>
              <th className="px-4 py-3 text-left">Inscrit le</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users?.map((u) => (
              <tr key={u.id}>
                <td className="px-4 py-3 font-medium text-neutral-text">
                  {(u.first_name ?? "—") + " " + (u.last_name ?? "")}
                </td>
                <td className="px-4 py-3 text-neutral-text/80">
                  {ROLE_LABEL[u.role ?? ""] ?? u.role ?? "—"}
                </td>
                <td className="px-4 py-3">
                  {u.onboarding_completed ? (
                    <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs font-semibold text-accent">
                      complété
                    </span>
                  ) : (
                    <span className="rounded-full bg-secondary/10 px-2 py-0.5 text-xs font-semibold text-secondary-700">
                      en cours
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-xs text-neutral-text/70">
                  {u.stripe_account_status ?? "—"}
                </td>
                <td className="px-4 py-3 text-xs text-neutral-text/60">
                  {new Date(u.created_at as string).toLocaleDateString("fr-FR")}
                </td>
              </tr>
            ))}
            {(!users || users.length === 0) && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-center text-sm text-neutral-text/50"
                >
                  Aucun utilisateur
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
