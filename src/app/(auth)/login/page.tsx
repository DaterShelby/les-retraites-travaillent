"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        setError(signInError.message);
        return;
      }

      router.push("/dashboard");
    } catch (err) {
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main id="main-content" className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-12 py-12">
        <div className="w-full max-w-sm">
          {/* Logo */}
          <Link href="/" className="inline-block mb-12">
            <span className="font-serif text-xl font-bold text-primary hover:opacity-80 transition-opacity">
              Les Retraités Travaillent
            </span>
          </Link>

          {/* Title */}
          <h1 className="font-serif text-3xl font-bold text-gray-900 mb-2">
            Bon retour parmi nous
          </h1>
          <p className="text-body text-gray-600 mb-8">
            Connectez-vous pour accéder à votre espace et vos opportunités.
          </p>

          {/* Form Card */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 rounded-lg bg-error-50 border border-error-200 text-error text-body-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="email" className="block text-body font-medium text-gray-900">
                Adresse email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="votre@email.fr"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-body font-medium text-gray-900">
                Mot de passe
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Votre mot de passe"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <div className="flex justify-end">
              <Link
                href="/forgot-password"
                className="text-body-sm text-primary hover:text-primary-600 transition-colors duration-200"
              >
                Mot de passe oublié ?
              </Link>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Connexion en cours..." : "Se connecter"}
            </Button>
          </form>

          {/* Sign up link */}
          <p className="mt-8 text-center text-body text-gray-600">
            Pas encore de compte ?{" "}
            <Link href="/register" className="text-primary font-medium hover:text-primary-600 transition-colors duration-200">
              Créer mon compte
            </Link>
          </p>
        </div>
      </div>

      {/* Right side - Decorative gradient (desktop only) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary to-primary-700 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px)",
            backgroundSize: "50px 50px"
          }}></div>
        </div>
        <div className="relative z-10 text-white text-center max-w-sm">
          <h2 className="font-serif text-4xl font-bold mb-4">
            Votre expérience, notre communauté
          </h2>
          <p className="text-lg text-white/80">
            Rejoignez des milliers de retraités qui partagent leurs talents et créent des connexions significatives.
          </p>
        </div>
      </div>
    </main>
  );
}
