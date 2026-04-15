import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const metadata: Metadata = {
  title: "Créer un compte",
  description: "Rejoignez Les Retraités Travaillent et valorisez votre expérience.",
};

export default function RegisterPage() {
  return (
    <main id="main-content" className="min-h-screen flex items-center justify-start bg-neutral-cream">
      <div className="w-full max-w-md mx-auto px-4 py-12">
        <div className="mb-8">
          <Link href="/" className="font-serif text-xl font-bold text-primary">
            Les Retraités Travaillent
          </Link>
        </div>

        <h1 className="font-serif text-2xl font-bold text-primary mb-2">
          Créez votre compte
        </h1>
        <p className="text-body text-gray-600 mb-8">
          Rejoignez la communauté et valorisez votre expérience.
        </p>

        {/* Sélection du rôle */}
        <div className="space-y-3 mb-8">
          <p className="text-body font-semibold text-neutral-text">
            Qui êtes-vous ?
          </p>
          <div className="grid grid-cols-1 gap-3">
            {[
              {
                value: "retiree",
                label: "Je suis retraité",
                desc: "Je veux proposer mes services",
              },
              {
                value: "client",
                label: "Je cherche un service",
                desc: "Je veux trouver un prestataire",
              },
              {
                value: "company",
                label: "Je recrute pour mon entreprise",
                desc: "Je cherche des profils seniors",
              },
            ].map((role) => (
              <button
                key={role.value}
                type="button"
                className="flex flex-col items-start p-4 rounded-sm border-2 border-gray-200 hover:border-primary hover:bg-primary-50 transition-colors text-left min-h-[48px]"
              >
                <span className="font-semibold text-neutral-text">
                  {role.label}
                </span>
                <span className="text-body-sm text-gray-500">{role.desc}</span>
              </button>
            ))}
          </div>
        </div>

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
            placeholder="Minimum 8 caractères"
            hint="Doit contenir une majuscule, une minuscule et un chiffre"
            autoComplete="new-password"
          />
          <Input
            label="Confirmer le mot de passe"
            type="password"
            placeholder="Retapez votre mot de passe"
            autoComplete="new-password"
          />

          <Button type="submit" className="w-full">
            Créer mon compte
          </Button>
        </form>

        <p className="mt-6 text-center text-body text-gray-600">
          Déjà un compte ?{" "}
          <Link href="/login" className="text-primary font-semibold hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </main>
  );
}
