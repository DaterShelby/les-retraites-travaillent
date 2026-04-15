import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const metadata: Metadata = {
  title: "Mot de passe oublié",
  description: "Réinitialisez votre mot de passe.",
};

export default function ForgotPasswordPage() {
  return (
    <main id="main-content" className="min-h-screen flex items-center justify-start bg-neutral-cream">
      <div className="w-full max-w-md mx-auto px-4 py-12">
        <div className="mb-8">
          <Link href="/" className="font-serif text-xl font-bold text-primary">
            Les Retraités Travaillent
          </Link>
        </div>

        <h1 className="font-serif text-2xl font-bold text-primary mb-2">
          Mot de passe oublié ?
        </h1>
        <p className="text-body text-gray-600 mb-8">
          Entrez votre adresse email et nous vous enverrons un lien pour
          réinitialiser votre mot de passe.
        </p>

        <form className="space-y-4">
          <Input
            label="Adresse email"
            type="email"
            placeholder="votre@email.fr"
            autoComplete="email"
          />

          <Button type="submit" className="w-full">
            Envoyer le lien de réinitialisation
          </Button>
        </form>

        <p className="mt-6 text-center text-body text-gray-600">
          <Link href="/login" className="text-primary font-semibold hover:underline">
            Retour à la connexion
          </Link>
        </p>
      </div>
    </main>
  );
}
