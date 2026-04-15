"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import {
  Home,
  FileText,
  Clock,
  Wallet,
  Star,
  Briefcase,
  Users,
  Settings,
  HelpCircle,
  BarChart3,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles?: Array<"retiree" | "client" | "company">;
}

const commonNavItems: NavItem[] = [
  {
    label: "Accueil",
    href: "/dashboard",
    icon: Home,
  },
  {
    label: "Messages",
    href: "/dashboard/messages",
    icon: FileText,
  },
];

const roleSpecificNavItems: Record<string, NavItem[]> = {
  retiree: [
    {
      label: "Mes annonces",
      href: "/dashboard/listings",
      icon: Briefcase,
      roles: ["retiree"],
    },
    {
      label: "Mes réservations",
      href: "/dashboard/bookings",
      icon: Clock,
      roles: ["retiree"],
    },
    {
      label: "Revenus",
      href: "/dashboard/earnings",
      icon: Wallet,
      roles: ["retiree"],
    },
    {
      label: "Créer une annonce",
      href: "/dashboard/listings/create",
      icon: Plus,
      roles: ["retiree"],
    },
  ],
  client: [
    {
      label: "Mes réservations",
      href: "/dashboard/bookings",
      icon: Clock,
      roles: ["client"],
    },
    {
      label: "Favoris",
      href: "/dashboard/favorites",
      icon: Star,
      roles: ["client"],
    },
  ],
  company: [
    {
      label: "Mes offres",
      href: "/dashboard/offers",
      icon: Briefcase,
      roles: ["company"],
    },
    {
      label: "Candidatures",
      href: "/dashboard/applications",
      icon: Users,
      roles: ["company"],
    },
    {
      label: "Statistiques",
      href: "/dashboard/stats",
      icon: BarChart3,
      roles: ["company"],
    },
    {
      label: "Créer une offre",
      href: "/dashboard/offers/create",
      icon: Plus,
      roles: ["company"],
    },
  ],
};

export function Sidebar() {
  const pathname = usePathname();
  const { user, loading } = useAuth();

  if (loading || !user) {
    return null;
  }

  // Le rôle sera chargé depuis le profil Supabase quand connecté
  const role: "retiree" | "client" | "company" = "retiree";
  const roleNavItems = roleSpecificNavItems[role] || [];
  const allNavItems = [...commonNavItems, ...roleNavItems];

  return (
    <aside className="hidden lg:flex w-64 flex-col border-r border-gray-200 bg-white">
      <div className="flex flex-col flex-1 overflow-y-auto px-4 py-6">
        <nav className="flex-1 space-y-2">
          {allNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors min-h-[44px]",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-neutral-text hover:bg-gray-100 hover:text-primary"
                )}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Divider */}
        <div className="my-4 border-t border-gray-200" />

        {/* Settings Section */}
        <nav className="space-y-2">
          <Link
            href="/dashboard/settings/profile"
            className={cn(
              "group flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors min-h-[44px]",
              pathname === "/dashboard/settings/profile"
                ? "bg-primary/10 text-primary"
                : "text-neutral-text hover:bg-gray-100 hover:text-primary"
            )}
          >
            <Settings className="h-5 w-5 flex-shrink-0" />
            <span>Paramètres</span>
          </Link>

          <Link
            href="/dashboard/help"
            className={cn(
              "group flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors min-h-[44px]",
              pathname === "/dashboard/help"
                ? "bg-primary/10 text-primary"
                : "text-neutral-text hover:bg-gray-100 hover:text-primary"
            )}
          >
            <HelpCircle className="h-5 w-5 flex-shrink-0" />
            <span>Aide</span>
          </Link>
        </nav>
      </div>
    </aside>
  );
}
