import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const metadata: Metadata = {
  title: "Se connecter",
  description: "Connectez-vous à votre compte Les Retraités Travaillent.",
};

export default function LoginPage() {
  return (
    <main id="main-content" className="min-h-screen flex items-center justify-start bg-neutral-cream">
      <div className="w-full max-w-md mx-auto px-4 py-12">
        <div className="mb-8">
          <Link href="/" className="font-serif text-xl font-bold text-primary">
            Les Retraités Travaillent
          </Link>
        </div>

        <h1 className="font-serif text-2xl font-bold text-primary mb-2">
          Bon retour parmi nous
        </h1>
        <p className="text-body text-gray-600 mb-8">
          Connectez-vous pour accéder à votre espace.
        </p>

        <form className="space-y-4">
          <Input
            label="Adresse email"
            type="email"
            placeholder="votre@email.fr"
            autoComplete="email"
          />
          <Input
            label="Mot de passe"
            type="password"
            placeholder="Votre mot de passe"
            autoComplete="current-password"
          />

          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="text-body-sm text-primary hover:underline min-h-0"
            >
              Mot de passe oublié ?
            </Link>
          </div>

          <Button type="submit" className="w-full">
            Se connecter
          </Button>
        </form>

        <p className="mt-6 text-center text-body text-gray-600">
          Pas encore de compte ?{" "}
          <Link href="/register" className="text-primary font-semibold hover:underline">
            Créer mon compte
          </Link>
        </p>
      </div>
    </main>
  );
}
