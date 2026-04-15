"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft, Mail, CheckCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login`,
      });

      if (resetError) {
        setError("Une erreur est survenue. Veuillez réessayer.");
        return;
      }

      setSent(true);
    } catch {
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex bg-neutral-cream">
      <div className="w-full lg:w-[48%] flex flex-col px-6 sm:px-12 lg:px-16 py-8">
        {/* Top nav */}
        <div className="flex items-center justify-between mb-12 lg:mb-16">
          <Logo size="sm" />
          <Link
            href="/login"
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à la connexion
          </Link>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-center max-w-[420px] w-full mx-auto">
          {sent ? (
            /* Success state */
            <div className="text-center">
              <div className="w-20 h-20 rounded-3xl bg-accent/10 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-accent" />
              </div>
              <h1 className="font-serif text-3xl font-bold text-gray-900 mb-3">
                Email envoyé !
              </h1>
              <p className="text-gray-500 text-base mb-8 leading-relaxed">
                Si un compte existe avec l&apos;adresse <strong className="text-gray-700">{email}</strong>, vous recevrez un lien de réinitialisation dans quelques minutes.
              </p>
              <p className="text-sm text-gray-400 mb-6">
                Pensez à vérifier vos spams si vous ne voyez rien.
              </p>
              <Link href="/login">
                <Button className="rounded-2xl bg-primary hover:bg-primary-600 text-white px-8 h-12">
                  Retour à la connexion
                </Button>
              </Link>
            </div>
          ) : (
            /* Form state */
            <>
              <div className="mb-8">
                <div className="w-16 h-16 rounded-3xl bg-secondary/10 flex items-center justify-center mb-6">
                  <Mail className="w-8 h-8 text-secondary" />
                </div>
                <h1 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 mb-3 tracking-tight">
                  Mot de passe oublié ?
                </h1>
                <p className="text-gray-400 text-base leading-relaxed">
                  Pas de panique ! Entrez votre email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-100/80 flex items-start gap-3">
                  <div className="w-5 h-5 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-red-600 text-xs font-bold">!</span>
                  </div>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-600">
                    Adresse email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 pointer-events-none" />
                    <input
                      id="email"
                      type="email"
                      placeholder="votre@email.fr"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                      required
                      className="w-full pl-12 pr-4 h-14 rounded-2xl border border-gray-200 bg-white focus:bg-white focus:ring-2 focus:ring-primary/10 focus:border-primary/30 text-base transition-all outline-none"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-14 text-base font-semibold rounded-2xl bg-secondary hover:bg-secondary-500 text-white shadow-sm hover:shadow-md"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Envoi en cours...
                    </span>
                  ) : (
                    "Envoyer le lien de réinitialisation"
                  )}
                </Button>
              </form>
            </>
          )}
        </div>
      </div>

      {/* Right panel — matching login/register design */}
      <div className="hidden lg:flex lg:w-[52%] relative overflow-hidden rounded-l-[48px]">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-800 via-primary to-primary-900" />
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-secondary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/3 w-[300px] h-[300px] bg-accent/15 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col justify-center p-16">
          <div className="max-w-md">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-2 mb-6 border border-white/10">
              <span className="w-2 h-2 bg-accent rounded-full"></span>
              <span className="text-white/70 text-sm font-medium">Sécurité renforcée</span>
            </div>
            <h2 className="font-serif text-4xl font-bold text-white mb-5 tracking-tight leading-tight">
              Votre compte est protégé
            </h2>
            <p className="text-white/50 text-lg leading-relaxed">
              Nous vous enverrons un lien sécurisé pour réinitialiser votre mot de passe en toute sérénité.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
