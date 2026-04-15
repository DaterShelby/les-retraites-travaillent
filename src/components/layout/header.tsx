"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { Menu, X, User, LogOut, LayoutDashboard, MessageSquare, Settings } from "lucide-react";
import { NotificationBell } from "@/components/shared/notification-bell";
import { useState, useEffect } from "react";

export function Header() {
  const { user, loading, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/70 backdrop-blur-2xl shadow-sm border-b border-gray-200/50"
          : "bg-white/50 backdrop-blur-xl"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Logo size="sm" />

          {/* Desktop nav — pill-shaped container */}
          <nav className="hidden md:flex items-center gap-1 bg-gray-100/80 rounded-full px-1.5 py-1">
            <Link
              href="/services"
              className="text-sm font-medium text-gray-700 hover:text-primary hover:bg-white px-4 py-2 rounded-full transition-all duration-200"
            >
              Services
            </Link>
            <Link
              href="/comment-ca-marche"
              className="text-sm font-medium text-gray-700 hover:text-primary hover:bg-white px-4 py-2 rounded-full transition-all duration-200"
            >
              Comment ça marche
            </Link>
            <Link
              href="/register?role=company"
              className="text-sm font-medium text-gray-700 hover:text-primary hover:bg-white px-4 py-2 rounded-full transition-all duration-200"
            >
              Entreprises
            </Link>
          </nav>

          {/* Desktop auth section */}
          <div className="hidden md:flex items-center gap-2">
            {!loading && user ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-gray-500 hover:text-primary p-2.5 hover:bg-gray-100 rounded-2xl transition-all duration-200"
                >
                  <LayoutDashboard className="w-5 h-5" />
                </Link>
                <Link
                  href="/dashboard/messages"
                  className="text-gray-500 hover:text-primary p-2.5 hover:bg-gray-100 rounded-2xl transition-all duration-200"
                >
                  <MessageSquare className="w-5 h-5" />
                </Link>
                <NotificationBell />
                <div className="relative ml-1">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="w-9 h-9 rounded-2xl bg-gradient-to-br from-primary to-primary-600 text-white flex items-center justify-center hover:shadow-md transition-all duration-200"
                  >
                    <User className="w-4 h-4" />
                  </button>
                  {showUserMenu && (
                    <div className="absolute right-0 mt-3 w-52 rounded-2xl bg-white/90 backdrop-blur-xl shadow-xl border border-gray-200/50 py-2 animate-scaleIn">
                      <Link
                        href="/dashboard"
                        onClick={() => setShowUserMenu(false)}
                        className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2.5"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Tableau de bord
                      </Link>
                      <Link
                        href="/dashboard/settings/profile"
                        onClick={() => setShowUserMenu(false)}
                        className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2.5"
                      >
                        <Settings className="w-4 h-4" />
                        Mon profil
                      </Link>
                      <div className="my-1 mx-3 border-t border-gray-100"></div>
                      <button
                        onClick={() => {
                          signOut();
                          setShowUserMenu(false);
                        }}
                        className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2.5"
                      >
                        <LogOut className="w-4 h-4" />
                        Déconnexion
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : !loading ? (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-2xl text-gray-600 hover:text-primary"
                  >
                    Se connecter
                  </Button>
                </Link>
                <Link href="/register">
                  <Button
                    size="sm"
                    className="rounded-2xl bg-primary hover:bg-primary-600 text-white shadow-sm hover:shadow-md"
                  >
                    S&apos;inscrire
                  </Button>
                </Link>
              </div>
            ) : null}
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2.5 hover:bg-gray-100/80 rounded-2xl transition-all duration-200"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5 text-gray-700" />
            ) : (
              <Menu className="w-5 h-5 text-gray-700" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu — frosted glass overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/90 backdrop-blur-2xl border-t border-gray-200/50 animate-slideDown">
          <nav className="flex flex-col px-4 py-4 gap-1">
            <Link
              href="/services"
              className="px-4 py-3 text-sm font-medium text-gray-700 hover:text-primary hover:bg-gray-50 rounded-2xl transition-all"
              onClick={() => setMobileMenuOpen(false)}
            >
              Services
            </Link>
            <Link
              href="/comment-ca-marche"
              className="px-4 py-3 text-sm font-medium text-gray-700 hover:text-primary hover:bg-gray-50 rounded-2xl transition-all"
              onClick={() => setMobileMenuOpen(false)}
            >
              Comment ça marche
            </Link>
            <Link
              href="/register?role=company"
              className="px-4 py-3 text-sm font-medium text-gray-700 hover:text-primary hover:bg-gray-50 rounded-2xl transition-all"
              onClick={() => setMobileMenuOpen(false)}
            >
              Entreprises
            </Link>
            {user ? (
              <>
                <div className="my-2 mx-2 border-t border-gray-100"></div>
                <Link
                  href="/dashboard"
                  className="px-4 py-3 text-sm font-medium text-gray-700 hover:text-primary hover:bg-gray-50 rounded-2xl transition-all flex items-center gap-2.5"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Tableau de bord
                </Link>
                <Link
                  href="/dashboard/messages"
                  className="px-4 py-3 text-sm font-medium text-gray-700 hover:text-primary hover:bg-gray-50 rounded-2xl transition-all flex items-center gap-2.5"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <MessageSquare className="w-4 h-4" />
                  Messages
                </Link>
                <button
                  onClick={() => {
                    signOut();
                    setMobileMenuOpen(false);
                  }}
                  className="px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-2xl transition-all flex items-center gap-2.5 text-left w-full"
                >
                  <LogOut className="w-4 h-4" />
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <div className="my-2 mx-2 border-t border-gray-100"></div>
                <div className="flex gap-2 px-2 pt-2">
                  <Link
                    href="/login"
                    className="flex-1"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button
                      variant="ghost"
                      className="w-full rounded-2xl"
                    >
                      Se connecter
                    </Button>
                  </Link>
                  <Link
                    href="/register"
                    className="flex-1"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button className="w-full rounded-2xl bg-primary text-white">
                      S&apos;inscrire
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
