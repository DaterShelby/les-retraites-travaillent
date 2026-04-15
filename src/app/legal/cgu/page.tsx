import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conditions générales d'utilisation - Les Retraités Travaillent",
  description: "Conditions générales d'utilisation du site Les Retraités Travaillent",
  robots: "index, follow",
};

export default function CGUPage() {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-serif font-bold text-primary mb-8">
          Conditions générales d'utilisation
        </h1>

        <div className="prose prose-sm max-w-none space-y-8 text-gray-700">
          <section>
            <h2 className="text-2xl font-serif font-bold text-primary mb-4">
              1. Objet
            </h2>
            <p className="text-body">
              Ces conditions générales régissent l'utilisation du site Les Retraités
              Travaillent et de tous ses services. L'accès et l'utilisation du site
              impliquent l'acceptation complète et sans réserve de ces conditions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-primary mb-4">
              2. Accès au site
            </h2>
            <p className="text-body mb-4">
              L'utilisateur s'engage à utiliser le site de manière licite et ne
              portera pas atteinte aux droits d'autrui ni à l'ordre public.
              L'utilisateur s'engage notamment à:
            </p>
            <ul className="list-disc list-inside space-y-2 text-body">
              <li>Ne pas violer les droits de propriété intellectuelle</li>
              <li>Ne pas publier de contenu illégal, offensant ou discriminatoire</li>
              <li>Ne pas harceler ou menacer d'autres utilisateurs</li>
              <li>Ne pas usurper l'identité d'une tierce personne</li>
              <li>Respecter les lois et réglementations applicables</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-primary mb-4">
              3. Responsabilité des utilisateurs
            </h2>
            <p className="text-body mb-4">
              L'utilisateur est responsable de tous les contenus qu'il publie sur le
              site. Il garantit détenir les droits nécessaires et s'engage à ne pas
              publier:
            </p>
            <ul className="list-disc list-inside space-y-2 text-body">
              <li>De contenu frauduleux, mensonger ou trompeur</li>
              <li>De contenu protégé par copyright sans autorisation</li>
              <li>De données personnelles d'autrui sans consentement</li>
              <li>De logiciels malveillants ou code nuisible</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-primary mb-4">
              4. Services offerts
            </h2>
            <p className="text-body mb-4">
              Les Retraités Travaillent met à disposition une plateforme mettant
              en relation retraités, particuliers et entreprises. Les services
              proposés incluent:
            </p>
            <ul className="list-disc list-inside space-y-2 text-body">
              <li>Publication d'annonces de services</li>
              <li>Système de réservation et de paiement</li>
              <li>Messagerie entre utilisateurs</li>
              <li>Système d'avis et de notation</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-primary mb-4">
              5. Transactions
            </h2>
            <p className="text-body mb-4">
              L'utilisateur reconnaît que:
            </p>
            <ul className="list-disc list-inside space-y-2 text-body">
              <li>Les transactions se font sous sa responsabilité</li>
              <li>Les Retraités Travaillent ne garantit pas les services fournis</li>
              <li>Les litiges commerciaux relèvent des utilisateurs</li>
              <li>Les paiements sont traités de manière sécurisée</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-primary mb-4">
              6. Limitation de responsabilité
            </h2>
            <p className="text-body">
              Les Retraités Travaillent ne sera pas responsable des dommages
              indirects, accidentels, spéciaux ou consécutifs résultant de l'accès
              ou de l'utilisation du site, y compris les pertes de données, les
              pertes de revenus ou les atteintes à la réputation.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-primary mb-4">
              7. Modification ou résiliation
            </h2>
            <p className="text-body">
              Les Retraités Travaillent se réserve le droit de modifier ou
              d'interrompre à tout moment le service. L'utilisateur accepte que
              son compte puisse être suspendu ou supprimé en cas de violation de
              ces conditions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-primary mb-4">
              8. Droit applicable
            </h2>
            <p className="text-body">
              Ces conditions sont régies par la loi française. Tout litige sera
              soumis aux tribunaux français.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-primary mb-4">
              9. Contact
            </h2>
            <p className="text-body">
              Pour toute question concernant ces conditions, veuillez nous contacter
              à: contact@lesretraitestravaillent.fr
            </p>
          </section>
        </div>

        <div className="mt-12 p-6 bg-gray-50 rounded-lg">
          <p className="text-body-sm text-gray-600">
            <strong>Dernière mise à jour:</strong> {new Date().toLocaleDateString(
              "fr-FR",
              {
                year: "numeric",
                month: "long",
                day: "numeric",
              }
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
