"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Bell, Menu, X, User, LogOut, LayoutDashboard, MessageSquare } from "lucide-react";
import { useState } from "react";

export function Header() {
  const { user, loading, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-subtle sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-serif text-lg sm:text-xl font-bold text-primary">
              Les Retraités Travaillent
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-4">
            <Link href="/services" className="text-body text-neutral-text hover:text-primary transition-colors min-h-[48px] flex items-center">
              Services
            </Link>
            {!loading && user ? (
              <>
                <Link href="/dashboard" className="text-body text-neutral-text hover:text-primary transition-colors min-h-[48px] flex items-center">
                  <LayoutDashboard className="w-5 h-5 mr-1" />
                  Tableau de bord
                </Link>
                <Link href="/dashboard/messages" className="text-body text-neutral-text hover:text-primary transition-colors min-h-[48px] flex items-center">
                  <MessageSquare className="w-5 h-5 mr-1" />
                  Messages
                </Link>
                <Link href="/dashboard/notifications" className="relative min-h-[48px] flex items-center">
                  <Bell className="w-5 h-5 text-neutral-text hover:text-primary" />
                </Link>
                <button
                  onClick={() => signOut()}
                  className="flex items-center gap-1 text-body text-neutral-text hover:text-error transition-colors min-h-[48px]"
                >
                  <LogOut className="w-5 h-5" />
                  Déconnexion
                </button>
              </>
            ) : !loading ? (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">Se connecter</Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">S&apos;inscrire</Button>
                </Link>
              </>
            ) : null}
          </nav>

          {/* Mobile toggle */}
          <button
            className="md:hidden min-h-[48px] min-w-[48px] flex items-center justify-center"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <nav className="flex flex-col px-4 py-4 gap-2">
            <Link href="/services" className="flex items-center gap-2 py-3 text-body text-neutral-text hover:text-primary min-h-[48px]" onClick={() => setMobileMenuOpen(false)}>
              Services
            </Link>
            {user ? (
              <>
                <Link href="/dashboard" className="flex items-center gap-2 py-3 text-body text-neutral-text hover:text-primary min-h-[48px]" onClick={() => setMobileMenuOpen(false)}>
                  <LayoutDashboard className="w-5 h-5" /> Tableau de bord
                </Link>
                <Link href="/dashboard/messages" className="flex items-center gap-2 py-3 text-body text-neutral-text hover:text-primary min-h-[48px]" onClick={() => setMobileMenuOpen(false)}>
                  <MessageSquare className="w-5 h-5" /> Messages
                </Link>
                <button onClick={() => { signOut(); setMobileMenuOpen(false); }} className="flex items-center gap-2 py-3 text-body text-error min-h-[48px]">
                  <LogOut className="w-5 h-5" /> Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full">Se connecter</Button>
                </Link>
                <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full">S&apos;inscrire</Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
