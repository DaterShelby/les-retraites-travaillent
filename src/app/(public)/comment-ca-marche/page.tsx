import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  UserPlus,
  Search,
  Handshake,
  Star,
  Shield,
  Clock,
  MessageSquare,
  CreditCard,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export const metadata = {
  title: "Comment ça marche — Les Retraités Travaillent",
  description:
    "Découvrez comment fonctionne la plateforme Les Retraités Travaillent en 3 étapes simples.",
};

export default function CommentCaMarchePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
            Comment ça marche
          </h1>
          <p className="text-xl text-white/85 max-w-2xl leading-relaxed">
            Une plateforme simple et intuitive pour connecter le savoir-faire des retraités avec ceux qui en ont besoin.
          </p>
        </div>
      </section>

      {/* 3 Steps Section */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12 lg:gap-16">
            {[
              {
                step: "01",
                icon: UserPlus,
                title: "Créez votre profil",
                description:
                  "Inscrivez-vous gratuitement en tant que retraité, particulier ou entreprise. Renseignez vos compétences, votre expérience et vos disponibilités en quelques minutes.",
                details: [
                  "Inscription gratuite et rapide",
                  "Onboarding adapté à votre profil",
                  "Ajoutez photos et certifications",
                ],
              },
              {
                step: "02",
                icon: Search,
                title: "Trouvez la bonne mission",
                description:
                  "Parcourez les annonces, utilisez les filtres de recherche avancés, ou laissez notre système de matching vous proposer des missions adaptées.",
                details: [
                  "Recherche par catégorie et localisation",
                  "Filtres par prix, note et disponibilité",
                  "Suggestions personnalisées",
                ],
              },
              {
                step: "03",
                icon: Handshake,
                title: "Collaborez en confiance",
                description:
                  "Échangez via la messagerie intégrée, réservez un créneau, réalisez la mission et laissez un avis pour aider la communauté.",
                details: [
                  "Messagerie sécurisée intégrée",
                  "Réservation de créneaux en ligne",
                  "Système d'avis vérifié",
                ],
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.step} className="relative">
                  {/* Step Number */}
                  <p className="font-serif text-8xl font-bold text-secondary/15 mb-4 tracking-tight leading-none">
                    {item.step}
                  </p>

                  {/* Icon */}
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-secondary/10 mb-6 -mt-4">
                    <Icon className="w-7 h-7 text-secondary" />
                  </div>

                  {/* Content */}
                  <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4 tracking-tight">
                    {item.title}
                  </h2>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {item.description}
                  </p>

                  {/* Details */}
                  <ul className="space-y-3">
                    {item.details.map((detail, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 text-sm">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 sm:py-28 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 space-y-4">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
              Ce qui nous distingue
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl">
              Une expérience pensée pour les retraités et ceux qui font appel à leur expertise.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Shield,
                title: "Profils vérifiés",
                desc: "Chaque expert est vérifié pour garantir votre sécurité et la qualité du service.",
              },
              {
                icon: Star,
                title: "Avis authentiques",
                desc: "Un système d'avis transparent basé uniquement sur des missions réellement effectuées.",
              },
              {
                icon: Clock,
                title: "Flexibilité totale",
                desc: "Travaillez quand vous voulez, où vous voulez. Aucune obligation, aucun minimum.",
              },
              {
                icon: MessageSquare,
                title: "Messagerie sécurisée",
                desc: "Échangez directement avec les prestataires via notre messagerie intégrée.",
              },
            ].map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-white border border-gray-100 p-8 hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-5">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-500 leading-relaxed text-sm">
                    {feature.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* For Retirees / For Clients */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            {/* For Retirees */}
            <div className="rounded-3xl bg-gradient-to-br from-primary/5 to-primary/10 p-10 sm:p-12">
              <h3 className="font-serif text-2xl font-bold text-gray-900 mb-4">
                Pour les retraités
              </h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Valorisez votre expérience, restez actif et complétez vos revenus à votre rythme.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  "Inscription 100% gratuite",
                  "Choisissez vos missions et vos tarifs",
                  "Informations sur le cumul emploi-retraite",
                  "Assistance à chaque étape",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/register?role=retiree">
                <Button className="rounded-full bg-primary hover:bg-primary/90 text-white gap-2 group">
                  Proposer mes services
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>

            {/* For Clients */}
            <div className="rounded-3xl bg-gradient-to-br from-secondary/5 to-secondary/10 p-10 sm:p-12">
              <h3 className="font-serif text-2xl font-bold text-gray-900 mb-4">
                Pour les particuliers
              </h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Trouvez des experts expérimentés pour tous vos projets du quotidien.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  "Accès à des milliers d'experts vérifiés",
                  "Avis et notes pour choisir sereinement",
                  "Réservation simple et rapide",
                  "Paiement sécurisé en ligne",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/register?role=client">
                <Button className="rounded-full bg-secondary hover:bg-secondary/90 text-white gap-2 group">
                  Trouver un expert
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 sm:py-28 bg-secondary/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-white border border-gray-100 p-12 sm:p-16 text-center">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 mb-6 tracking-tight">
              Prêt à rejoindre la communauté ?
            </h2>
            <p className="text-lg text-gray-600 mb-10 max-w-xl mx-auto leading-relaxed">
              Créez votre compte gratuitement et commencez dès aujourd&apos;hui.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button
                  size="lg"
                  className="rounded-full bg-secondary hover:bg-secondary/90 text-white gap-2 group"
                >
                  Créer mon compte
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/services">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full border-2 border-gray-300 hover:border-primary hover:text-primary transition-colors"
                >
                  Explorer les services
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
