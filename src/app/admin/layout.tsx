import { ReactNode } from "react";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin/guard";
import {
  ShieldCheck,
  Users,
  Briefcase,
  CreditCard,
  Megaphone,
  LayoutDashboard,
} from "lucide-react";

const NAV = [
  { href: "/admin", label: "Vue d'ensemble", icon: LayoutDashboard },
  { href: "/admin/users", label: "Utilisateurs", icon: Users },
  { href: "/admin/services", label: "Services", icon: Briefcase },
  { href: "/admin/missions", label: "Missions", icon: Megaphone },
  { href: "/admin/payments", label: "Paiements", icon: CreditCard },
];

export default async function AdminLayout({ children }: { children: ReactNode }) {
  await requireAdmin();
  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-bg to-white">
      <header className="border-b border-gray-200/70 bg-white/80 backdrop-blur sticky top-0 z-30">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-white">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-neutral-text/50">
                Console
              </p>
              <h1 className="font-serif text-lg font-bold text-neutral-text">
                Espace Admin
              </h1>
            </div>
          </div>
          <Link
            href="/dashboard"
            className="text-sm text-neutral-text/70 hover:text-primary"
          >
            ← Retour dashboard
          </Link>
        </div>
      </header>
      <div className="mx-auto max-w-7xl px-6 py-8 grid grid-cols-1 gap-6 lg:grid-cols-[220px_1fr]">
        <aside>
          <nav className="space-y-1 rounded-2xl border border-gray-100 bg-white p-2 shadow-card sticky top-24">
            {NAV.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-neutral-text/80 hover:bg-primary/5 hover:text-primary transition"
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>
        <main>{children}</main>
      </div>
    </div>
  );
}
