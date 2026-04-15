import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions légales - Les Retraités Travaillent",
  description: "Mentions légales du site Les Retraités Travaillent",
  robots: "index, follow",
};

export default function MentionsLegalesPage() {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-serif font-bold text-primary mb-8">
          Mentions légales
        </h1>

        <div className="prose prose-sm max-w-none space-y-8 text-gray-700">
          <section>
            <h2 className="text-2xl font-serif font-bold text-primary mb-4">
              1. Éditeur du site
            </h2>
            <p className="text-body mb-2">
              <strong>Raison sociale:</strong> Les Retraités Travaillent SARL
            </p>
            <p className="text-body mb-2">
              <strong>Siège social:</strong> [À compléter avec l'adresse]
            </p>
            <p className="text-body mb-2">
              <strong>Numéro SIRET:</strong> [À compléter]
            </p>
            <p className="text-body mb-2">
              <strong>Email:</strong> contact@lesretraitestravaillent.fr
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-primary mb-4">
              2. Directeur de la publication
            </h2>
            <p className="text-body">
              [À compléter avec le nom et prénom du directeur]
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-primary mb-4">
              3. Hébergeur
            </h2>
            <p className="text-body mb-2">
              <strong>Entreprise:</strong> Vercel Inc.
            </p>
            <p className="text-body mb-2">
              <strong>Adresse:</strong> 440 N Barranca Ave, Covina, CA 91723, USA
            </p>
            <p className="text-body">
              <strong>Site:</strong> vercel.com
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-primary mb-4">
              4. Propriété intellectuelle
            </h2>
            <p className="text-body mb-4">
              Tous les contenus présents sur ce site (textes, images, graphismes,
              logos, vidéos, applications, etc.) sont la propriété exclusive de Les
              Retraités Travaillent ou de ses partenaires. Toute reproduction,
              représentation, modification ou exploitation non autorisée est
              interdite.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-primary mb-4">
              5. Limitation de responsabilité
            </h2>
            <p className="text-body mb-4">
              Les Retraités Travaillent ne pourra être tenu responsable des
              dommages directs ou indirects résultant de l'accès ou de
              l'utilisation du site. Les utilisateurs utilisent le site à leurs
              propres risques.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-primary mb-4">
              6. Droit applicable
            </h2>
            <p className="text-body">
              Ce site est soumis à la loi française. Les tribunaux français sont
              seuls compétents en cas de litige.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-primary mb-4">
              7. Cookies et suivi
            </h2>
            <p className="text-body mb-4">
              Le site utilise des cookies pour améliorer l'expérience utilisateur.
              En continuant la navigation, vous acceptez notre utilisation des
              cookies conformément à notre Politique de confidentialité.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-primary mb-4">
              8. Modifications
            </h2>
            <p className="text-body">
              Les Retraités Travaillent se réserve le droit de modifier ces
              mentions légales à tout moment. Les modifications entrent en vigueur
              dès leur publication sur le site.
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
