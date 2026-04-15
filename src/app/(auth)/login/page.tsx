"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { ArrowRight, Eye, EyeOff, Mail, Lock, CheckCircle2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        if (signInError.message.includes("Invalid login")) {
          setError("Email ou mot de passe incorrect.");
        } else if (signInError.message.includes("rate")) {
          setError("Trop de tentatives. Veuillez patienter quelques minutes.");
        } else {
          setError(signInError.message);
        }
        return;
      }

      router.push("/dashboard");
    } catch {
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main id="main-content" className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="w-full lg:w-[45%] flex flex-col px-6 sm:px-12 lg:px-16 py-8">
        {/* Top nav */}
        <div className="flex items-center justify-between mb-12 lg:mb-16">
          <Link href="/" className="group flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <span className="text-white font-serif font-bold text-lg">LR</span>
            </div>
            <span className="font-serif text-lg font-bold text-primary hidden sm:inline">
              Les Retraités Travaillent
            </span>
          </Link>
          <Link
            href="/register"
            className="text-sm font-medium text-gray-500 hover:text-primary transition-colors"
          >
            Pas de compte ? <span className="text-primary font-semibold">S'inscrire</span>
          </Link>
        </div>

        {/* Form area - centered */}
        <div className="flex-1 flex flex-col justify-center max-w-[400px] w-full mx-auto">
          <div className="mb-8">
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              Bon retour parmi nous
            </h1>
            <p className="text-gray-500 text-base">
              Connectez-vous pour accéder à votre espace et vos opportunités.
            </p>
          </div>

          {/* Error alert */}
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-100 flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-red-600 text-xs font-bold">!</span>
              </div>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                Adresse email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                <Input
                  id="email"
                  type="email"
                  placeholder="votre@email.fr"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                  className="pl-12 h-14 rounded-2xl border-gray-200 bg-gray-50/50 focus:bg-white text-base"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                  Mot de passe
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-medium text-secondary hover:text-secondary-600 transition-colors"
                >
                  Mot de passe oublié ?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Votre mot de passe"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                  className="pl-12 pr-12 h-14 rounded-2xl border-gray-200 bg-gray-50/50 focus:bg-white text-base"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors min-h-0"
                  aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full h-14 text-base font-semibold rounded-2xl bg-secondary hover:bg-secondary-500 text-white shadow-md hover:shadow-lg transition-all"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Connexion en cours...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Se connecter
                  <ArrowRight className="w-5 h-5" />
                </span>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="my-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-xs text-gray-400 font-medium">OU</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          {/* Social login placeholder */}
          <button
            type="button"
            disabled
            className="w-full h-14 rounded-2xl border-2 border-gray-200 bg-white flex items-center justify-center gap-3 text-gray-600 font-medium text-sm hover:bg-gray-50 transition-colors min-h-[48px] opacity-50 cursor-not-allowed"
          >
            <Mail className="w-5 h-5" />
            Connexion par lien magique (bientôt)
          </button>
        </div>

        {/* Bottom */}
        <div className="mt-8 text-center text-xs text-gray-400">
          En vous connectant, vous acceptez nos{" "}
          <Link href="/cgu" className="underline hover:text-gray-600">conditions d'utilisation</Link>
        </div>
      </div>

      {/* Right side - Visual (desktop only) */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=1200&q=80"
          alt="Retraitée souriante"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent"></div>
        <div className="relative z-10 flex flex-col justify-end p-12 pb-16">
          <div className="max-w-lg">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-5 h-5 text-accent" />
              <span className="text-accent font-medium text-sm">2 400+ retraités actifs</span>
            </div>
            <h2 className="font-serif text-4xl font-bold text-white mb-4">
              Votre expérience a de la valeur
            </h2>
            <p className="text-white/80 text-lg leading-relaxed">
              Rejoignez des milliers de retraités qui partagent leurs talents et trouvent des missions enrichissantes.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
