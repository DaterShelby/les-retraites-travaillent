import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de confidentialité - Les Retraités Travaillent",
  description: "Politique de confidentialité et protection des données",
  robots: "index, follow",
};

export default function ConfidentialitePage() {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-serif font-bold text-primary mb-8">
          Politique de confidentialité
        </h1>

        <div className="prose prose-sm max-w-none space-y-8 text-gray-700">
          <section>
            <h2 className="text-2xl font-serif font-bold text-primary mb-4">
              1. Introduction
            </h2>
            <p className="text-body">
              Les Retraités Travaillent s'engage à protéger votre vie privée. Cette
              politique de confidentialité explique comment nous collectons,
              utilisons et protégeons vos données personnelles conformément au
              Règlement Général sur la Protection des Données (RGPD).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-primary mb-4">
              2. Données collectées
            </h2>
            <p className="text-body mb-4">Nous collectons les données suivantes:</p>
            <ul className="list-disc list-inside space-y-2 text-body">
              <li>
                <strong>Données d'identification:</strong> Nom, prénom, email,
                téléphone
              </li>
              <li>
                <strong>Données de profil:</strong> Photo, biographie, compétences,
                localisation
              </li>
              <li>
                <strong>Données de transaction:</strong> Historique de paiement,
                services réservés
              </li>
              <li>
                <strong>Données de communication:</strong> Messages, avis, évaluations
              </li>
              <li>
                <strong>Données techniques:</strong> Adresse IP, cookies, logs
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-primary mb-4">
              3. Base juridique du traitement
            </h2>
            <p className="text-body mb-4">Nous traitons vos données sur les bases suivantes:</p>
            <ul className="list-disc list-inside space-y-2 text-body">
              <li>Exécution du contrat d'utilisation du service</li>
              <li>Respect de nos obligations légales</li>
              <li>Intérêts légitimes (sécurité, fraude)</li>
              <li>Votre consentement explicite</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-primary mb-4">
              4. Utilisation des données
            </h2>
            <p className="text-body mb-4">Nous utilisons vos données pour:</p>
            <ul className="list-disc list-inside space-y-2 text-body">
              <li>Fournir et améliorer nos services</li>
              <li>Traiter les paiements et réservations</li>
              <li>Communiquer avec vous (notifications, support)</li>
              <li>Prévenir la fraude et la sécurité</li>
              <li>Respecter nos obligations légales</li>
              <li>Analyser l'utilisation du site (analytics)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-primary mb-4">
              5. Partage des données
            </h2>
            <p className="text-body mb-4">
              Nous ne vendons jamais vos données. Nous pouvons les partager avec:
            </p>
            <ul className="list-disc list-inside space-y-2 text-body">
              <li>
                <strong>Autres utilisateurs:</strong> Informations publiques de votre
                profil
              </li>
              <li>
                <strong>Prestataires:</strong> Paiement, email, hébergement
              </li>
              <li>
                <strong>Autorités:</strong> Si requis par la loi
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-primary mb-4">
              6. Cookies
            </h2>
            <p className="text-body mb-4">
              Le site utilise des cookies pour améliorer votre expérience. Vous
              pouvez configurer votre navigateur pour refuser les cookies. Les
              cookies utilisés incluent:
            </p>
            <ul className="list-disc list-inside space-y-2 text-body">
              <li>
                <strong>Cookies essentiels:</strong> Authentification, sécurité
              </li>
              <li>
                <strong>Cookies de performance:</strong> Analytics, amélioration
              </li>
              <li>
                <strong>Cookies de marketing:</strong> Personnalisation (avec
                consentement)
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-primary mb-4">
              7. Droits des utilisateurs
            </h2>
            <p className="text-body mb-4">Vous disposez des droits suivants:</p>
            <ul className="list-disc list-inside space-y-2 text-body">
              <li>Droit d'accès à vos données</li>
              <li>Droit de rectification des données inexactes</li>
              <li>Droit à l'effacement ("droit à l'oubli")</li>
              <li>Droit à la limitation du traitement</li>
              <li>Droit à la portabilité des données</li>
              <li>Droit d'opposition au traitement</li>
            </ul>
            <p className="text-body mt-4">
              Pour exercer ces droits, contactez-nous à:
              privacy@lesretraitestravaillent.fr
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-primary mb-4">
              8. Sécurité des données
            </h2>
            <p className="text-body">
              Nous utilisons le chiffrement SSL/TLS et d'autres mesures de sécurité
              pour protéger vos données. Cependant, aucune transmission sur Internet
              n'est 100% sécurisée. Nous vous recommandons de protéger votre mot de
              passe.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-primary mb-4">
              9. Conservation des données
            </h2>
            <p className="text-body">
              Nous conservons vos données aussi longtemps que nécessaire pour
              fournir nos services et respecter nos obligations légales, généralement
              5 ans. Les données de paiement sont conservées conformément à la
              législation fiscale.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-primary mb-4">
              10. Modifications de cette politique
            </h2>
            <p className="text-body">
              Nous pouvons modifier cette politique à tout moment. Les modifications
              entrent en vigueur dès leur publication. Nous vous aviserons des
              modifications importantes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold text-primary mb-4">
              11. Contact
            </h2>
            <p className="text-body mb-2">
              <strong>Email:</strong> privacy@lesretraitestravaillent.fr
            </p>
            <p className="text-body mb-2">
              <strong>Délégué à la Protection des Données:</strong> dpo@lesretraitestravaillent.fr
            </p>
            <p className="text-body">
              Vous avez également le droit de saisir la CNIL si vous estimez que vos
              droits ne sont pas respectés.
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
