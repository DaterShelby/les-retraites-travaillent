import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SERVICE_CATEGORIES } from "@/lib/constants";

export default function HomePage() {
  return (
    <main id="main-content" className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-subtle">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-serif text-xl font-bold text-primary">
                Les Retraités Travaillent
              </span>
            </div>
            <nav className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Se connecter
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">S&apos;inscrire</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-primary py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
              Votre expérience a de la valeur
            </h1>
            <p className="mt-6 text-body-lg text-primary-100 leading-relaxed max-w-2xl">
              La plateforme qui connecte les retraités actifs avec les
              particuliers et entreprises qui ont besoin de leur savoir-faire.
              Trouvez des missions adaptées à votre rythme.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link href="/register?role=retiree">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  Je propose mes services
                </Button>
              </Link>
              <Link href="/register?role=client">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-primary"
                >
                  Je cherche un service
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="py-16 sm:py-20 bg-neutral-cream">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-center mb-12">
            Comment ça marche
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                step: "1",
                title: "Créez votre profil",
                description:
                  "En quelques minutes, décrivez vos compétences, votre expérience et vos disponibilités.",
              },
              {
                step: "2",
                title: "Trouvez la bonne mission",
                description:
                  "Parcourez les demandes de services ou recevez des propositions adaptées à votre profil.",
              },
              {
                step: "3",
                title: "Partagez votre savoir-faire",
                description:
                  "Réalisez vos missions, recevez des avis, et complétez vos revenus à votre rythme.",
              },
            ].map((item) => (
              <div key={item.step} className="flex flex-col items-start">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-white font-bold text-xl mb-4">
                  {item.step}
                </div>
                <h3 className="font-serif text-lg font-bold mb-2">
                  {item.title}
                </h3>
                <p className="text-body text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Catégories */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-center mb-12">
            Des compétences pour chaque besoin
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {SERVICE_CATEGORIES.slice(0, 8).map((category) => (
              <Link
                key={category.id}
                href={`/services?category=${category.id}`}
                className="flex items-center gap-3 rounded-sm border-2 border-gray-200 p-4 hover:border-primary hover:bg-primary-50 transition-colors min-h-[48px]"
              >
                <span className="text-body font-medium text-neutral-text">
                  {category.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Entreprises - Loi 2026 */}
      <section className="py-16 sm:py-20 bg-accent/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold mb-6">
              Entreprises : respectez la loi des 5%
            </h2>
            <p className="text-body-lg text-gray-600 mb-8 leading-relaxed">
              La loi 2026 impose aux entreprises de +1 000 salariés de maintenir
              5% de seniors 60+ dans leurs effectifs. Trouvez les profils
              expérimentés dont vous avez besoin.
            </p>
            <Link href="/register?role=company">
              <Button size="lg">Recruter des seniors</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-16 sm:py-20 bg-primary">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-6">
            Prêt à valoriser votre expérience ?
          </h2>
          <p className="text-body-lg text-primary-100 mb-8 max-w-2xl mx-auto">
            Rejoignez la communauté des retraités actifs et trouvez des missions
            qui vous correspondent.
          </p>
          <Link href="/register">
            <Button variant="secondary" size="lg">
              Créer mon compte gratuitement
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-text py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <h4 className="font-serif font-bold text-white mb-4">
                Les Retraités Travaillent
              </h4>
              <p className="text-body-sm text-gray-400 leading-relaxed">
                La plateforme de référence pour valoriser l&apos;expérience des
                retraités français.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Services</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/services" className="text-body-sm text-gray-400 hover:text-white">
                    Trouver un service
                  </Link>
                </li>
                <li>
                  <Link href="/register?role=retiree" className="text-body-sm text-gray-400 hover:text-white">
                    Proposer ses services
                  </Link>
                </li>
                <li>
                  <Link href="/register?role=company" className="text-body-sm text-gray-400 hover:text-white">
                    Espace entreprise
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Informations</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/blog" className="text-body-sm text-gray-400 hover:text-white">
                    Blog & Conseils
                  </Link>
                </li>
                <li>
                  <Link href="/legal/cgu" className="text-body-sm text-gray-400 hover:text-white">
                    Conditions d&apos;utilisation
                  </Link>
                </li>
                <li>
                  <Link href="/legal/confidentialite" className="text-body-sm text-gray-400 hover:text-white">
                    Politique de confidentialité
                  </Link>
                </li>
                <li>
                  <Link href="/legal/mentions-legales" className="text-body-sm text-gray-400 hover:text-white">
                    Mentions légales
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Contact</h4>
              <p className="text-body-sm text-gray-400">
                contact@les-retraites-travaillent.fr
              </p>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-600 pt-8 text-center">
            <p className="text-body-sm text-gray-400">
              © {new Date().getFullYear()} Les Retraités Travaillent. Tous droits
              réservés.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
