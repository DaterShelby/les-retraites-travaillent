"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, PlusCircle, MessageSquare, User } from "lucide-react";

const navItems = [
  {
    href: "/",
    label: "Accueil",
    icon: Home,
  },
  {
    href: "/services",
    label: "Explorer",
    icon: Search,
  },
  {
    href: "/dashboard/listings/create",
    label: "Publier",
    icon: PlusCircle,
    isAction: true,
  },
  {
    href: "/dashboard/messages",
    label: "Messages",
    icon: MessageSquare,
  },
  {
    href: "/dashboard",
    label: "Profil",
    icon: User,
  },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white border-t border-gray-200 safe-area-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));

          if (item.isAction) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center justify-center -mt-4"
              >
                <div className="w-14 h-14 rounded-full bg-secondary text-white flex items-center justify-center shadow-lg shadow-secondary/30 active:scale-95 transition-transform">
                  <Icon className="w-7 h-7" strokeWidth={2} />
                </div>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 min-w-[60px] py-1 active:scale-95 transition-transform ${
                isActive ? "text-primary" : "text-gray-400"
              }`}
            >
              <Icon
                className={`w-6 h-6 ${isActive ? "text-primary" : "text-gray-400"}`}
                strokeWidth={isActive ? 2.5 : 1.8}
              />
              <span className={`text-[10px] font-medium ${isActive ? "text-primary" : "text-gray-400"}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
