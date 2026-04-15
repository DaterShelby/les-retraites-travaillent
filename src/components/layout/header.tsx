"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Bell, Menu, X, User, LogOut, LayoutDashboard, MessageSquare, Search } from "lucide-react";
import { useState } from "react";

export function Header() {
  const { user, loading, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="font-serif text-lg font-bold text-primary group-hover:opacity-80 transition-opacity">
              Les Retraités Travaillent
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/services" className="text-body text-gray-700 hover:text-primary transition-colors duration-200">
              Services
            </Link>
            <Link href="/comment-ca-marche" className="text-body text-gray-700 hover:text-primary transition-colors duration-200">
              Comment ça marche
            </Link>
          </nav>

          {/* Desktop auth section */}
          <div className="hidden md:flex items-center gap-3">
            {!loading && user ? (
              <>
                <Link href="/dashboard" className="text-gray-700 hover:text-primary transition-colors duration-200 p-2 hover:bg-gray-50 rounded-full">
                  <LayoutDashboard className="w-5 h-5" />
                </Link>
                <Link href="/dashboard/messages" className="text-gray-700 hover:text-primary transition-colors duration-200 p-2 hover:bg-gray-50 rounded-full">
                  <MessageSquare className="w-5 h-5" />
                </Link>
                <button className="text-gray-700 hover:text-primary transition-colors duration-200 p-2 hover:bg-gray-50 rounded-full relative">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full"></span>
                </button>
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary-600 transition-colors duration-200"
                  >
                    <User className="w-5 h-5" />
                  </button>
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white shadow-lg border border-gray-100 py-2">
                      <button
                        onClick={() => { signOut(); setShowUserMenu(false); }}
                        className="w-full px-4 py-2 text-left text-body text-error hover:bg-error-50 transition-colors duration-200 flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Déconnexion
                      </button>
                    </div>
                  )}
                </div>
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
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white/95 backdrop-blur-md animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col px-4 py-4 gap-2">
            <Link
              href="/services"
              className="px-4 py-2 text-body text-gray-700 hover:text-primary hover:bg-gray-50 transition-colors duration-200 rounded-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              Services
            </Link>
            <Link
              href="/comment-ca-marche"
              className="px-4 py-2 text-body text-gray-700 hover:text-primary hover:bg-gray-50 transition-colors duration-200 rounded-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              Comment ça marche
            </Link>
            {user ? (
              <>
                <div className="border-t border-gray-100 my-2"></div>
                <Link
                  href="/dashboard"
                  className="px-4 py-2 text-body text-gray-700 hover:text-primary hover:bg-gray-50 transition-colors duration-200 rounded-lg flex items-center gap-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Tableau de bord
                </Link>
                <Link
                  href="/dashboard/messages"
                  className="px-4 py-2 text-body text-gray-700 hover:text-primary hover:bg-gray-50 transition-colors duration-200 rounded-lg flex items-center gap-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <MessageSquare className="w-4 h-4" />
                  Messages
                </Link>
                <button
                  onClick={() => { signOut(); setMobileMenuOpen(false); }}
                  className="px-4 py-2 text-body text-error hover:bg-error-50 transition-colors duration-200 rounded-lg flex items-center gap-2 text-left w-full"
                >
                  <LogOut className="w-4 h-4" />
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <div className="border-t border-gray-100 my-2"></div>
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-center">Se connecter</Button>
                </Link>
                <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full justify-center">S&apos;inscrire</Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
