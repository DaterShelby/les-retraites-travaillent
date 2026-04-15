"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useProfile } from "@/hooks/use-profile";
import Image from "next/image";
import {
  Home,
  MessageSquare,
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
    icon: MessageSquare,
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
  ],
};

const roleLabels: Record<string, string> = {
  retiree: "Retraité",
  client: "Client",
  company: "Entreprise",
};

export function Sidebar() {
  const pathname = usePathname();
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useProfile();

  if (authLoading || profileLoading || !user) {
    return null;
  }

  const role = (profile?.role || "retiree") as "retiree" | "client" | "company";
  const roleNavItems = roleSpecificNavItems[role] || [];
  const allNavItems = [...commonNavItems, ...roleNavItems];
  const firstName = profile?.first_name || user.email?.split("@")[0] || "Utilisateur";
  const roleLabel = roleLabels[role];

  return (
    <aside className="hidden lg:flex w-64 flex-col bg-gradient-to-b from-white via-[#FAF7F5]/50 to-white border-r border-gray-100">
      <div className="flex flex-col flex-1 overflow-y-auto px-6 py-8">
        {/* User Profile Section */}
        <div className="mb-8 pb-8 border-b border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            {profile?.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt={firstName}
                width={48}
                height={48}
                className="w-12 h-12 rounded-2xl object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#F0917B] to-[#8FBFAD] flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {firstName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 text-sm truncate">
                {firstName}
              </p>
              <span className="inline-block mt-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-[#F0917B]/10 to-[#8FBFAD]/10 text-xs font-medium text-primary">
                {roleLabel}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1">
          {allNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-white text-[#F0917B] shadow-sm border-l-2 border-[#F0917B]"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                )}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Create CTA Button */}
        <div className="mb-6 pt-6 border-t border-gray-100">
          <Link
            href={
              role === "retiree"
                ? "/dashboard/listings/create"
                : role === "company"
                  ? "/dashboard/offers/create"
                  : "/services"
            }
            className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-2xl bg-gradient-to-r from-[#F0917B] to-[#D96850] text-white font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
          >
            <Plus className="h-5 w-5" />
            <span>
              {role === "retiree" && "Créer une annonce"}
              {role === "company" && "Créer une offre"}
              {role === "client" && "Explorer"}
            </span>
          </Link>
        </div>

        {/* Settings Section */}
        <nav className="space-y-1 pt-6 border-t border-gray-100">
          <Link
            href="/dashboard/settings/profile"
            className={cn(
              "group flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200",
              pathname === "/dashboard/settings/profile"
                ? "bg-white text-[#F0917B] shadow-sm border-l-2 border-[#F0917B]"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            )}
          >
            <Settings className="h-5 w-5 flex-shrink-0" />
            <span>Paramètres</span>
          </Link>

          <Link
            href="/dashboard/help"
            className={cn(
              "group flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200",
              pathname === "/dashboard/help"
                ? "bg-white text-[#F0917B] shadow-sm border-l-2 border-[#F0917B]"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
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
