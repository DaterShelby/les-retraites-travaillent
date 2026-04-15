'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SERVICE_CATEGORIES } from '@/lib/constants';
import {
  Hammer,
  TreePine,
  ChefHat,
  Baby,
  Monitor,
  Lightbulb,
  GraduationCap,
  FileText,
  Scissors,
  Sparkles,
  Heart,
  MoreHorizontal,
  ArrowRight,
  Star,
  MapPin,
  Shield,
  Clock,
  Users,
  Search,
  ChevronRight,
  CheckCircle2,
  Menu,
} from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Hammer,
  TreePine,
  ChefHat,
  Baby,
  Monitor,
  Lightbulb,
  GraduationCap,
  FileText,
  Scissors,
  Sparkles,
  Heart,
  MoreHorizontal,
};

export default function HomePage() {
  return (
    <main id="main-content" className="min-h-screen bg-white">
      {/* HEADER - Sticky, transparent to solid */}
      <header className="fixed top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-gray-100/20 transition-all duration-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <span className="font-serif text-xl font-bold text-primary tracking-tight">
                Les Retraités Travaillent
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              <Link
                href="/services"
                className="text-sm font-medium text-gray-700 hover:text-primary transition-colors"
              >
                Services
              </Link>
              <Link
                href="/#how-it-works"
                className="text-sm font-medium text-gray-700 hover:text-primary transition-colors"
              >
                Comment ça marche
              </Link>
              <Link
                href="/register?role=company"
                className="text-sm font-medium text-gray-700 hover:text-primary transition-colors"
              >
                Entreprises
              </Link>
            </nav>

            {/* CTA Buttons */}
            <div className="flex items-center gap-3">
              <Link href="/login" className="hidden sm:block">
                <Button variant="ghost" size="sm">
                  Se connecter
                </Button>
              </Link>
              <Link href="/register?role=retiree">
                <Button
                  size="sm"
                  className="rounded-full bg-secondary hover:bg-secondary/90 text-white"
                >
                  Commencer
                </Button>
              </Link>
              <button className="md:hidden p-2">
                <Menu className="w-5 h-5 text-gray-700" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center justify-center bg-gradient-to-br from-primary to-primary/90 pt-16 overflow-hidden">
        {/* Decorative gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight">
                  L&apos;expérience n&apos;a pas de prix.
                </h1>
                <p className="text-lg sm:text-xl text-white/90 leading-relaxed max-w-2xl font-light">
                  Trouvez des experts retraités pour vos projets, ou proposez vos services et complétez vos revenus à votre rythme.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/services">
                  <Button
                    size="lg"
                    className="rounded-full bg-secondary hover:bg-secondary/90 text-white gap-2 group"
                  >
                    Trouver un expert
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/register?role=retiree">
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full border-2 border-white text-white hover:bg-white/10 transition-colors"
                  >
                    Proposer mes services
                  </Button>
                </Link>
              </div>

              {/* Trust Bar */}
              <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 pt-8 border-t border-white/20">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-white/80" />
                  <span className="text-white/90 text-sm font-medium">2 400+ retraités actifs</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-white/80" />
                  <span className="text-white/90 text-sm font-medium">15 000+ missions réalisées</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-white/80" />
                  <span className="text-white/90 text-sm font-medium">4.8/5 satisfaction</span>
                </div>
              </div>
            </div>

            {/* Right: Floating Cards (Desktop Only) */}
            <div className="hidden lg:flex items-center justify-center relative h-full min-h-[500px]">
              {/* Card 1 */}
              <div className="absolute top-0 right-0 bg-white rounded-2xl shadow-2xl p-6 w-72 transform -rotate-6 hover:rotate-0 transition-transform duration-300">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-secondary to-orange-400 flex items-center justify-center text-white font-bold">
                    MR
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Michel R.</p>
                    <p className="text-xs text-gray-500">Bricolage & Menuiserie</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs text-gray-500 ml-2">(47 avis)</span>
                </div>
              </div>

              {/* Card 2 */}
              <div className="absolute top-32 left-0 bg-white rounded-2xl shadow-2xl p-6 w-72 transform rotate-6 hover:rotate-0 transition-transform duration-300">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-teal-500 flex items-center justify-center text-white font-bold">
                    CB
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Catherine B.</p>
                    <p className="text-xs text-gray-500">Cours d&apos;Informatique</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs text-gray-500 ml-2">(92 avis)</span>
                </div>
              </div>

              {/* Card 3 */}
              <div className="absolute bottom-0 right-12 bg-white rounded-2xl shadow-2xl p-6 w-72 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-rose-400 flex items-center justify-center text-white font-bold">
                    PD
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Pierre D.</p>
                    <p className="text-xs text-gray-500">Jardinage & Paysagisme</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs text-gray-500 ml-2">(63 avis)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEARCH BAR SECTION */}
      <section className="relative -mt-8 pb-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search Input */}
              <div className="flex-1 flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Que recherchez-vous ? (ex: plomberie, jardinage...)"
                  className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-500 text-sm"
                />
              </div>

              {/* Location Input */}
              <div className="flex-1 flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
                <MapPin className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Ville ou code postal"
                  className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-500 text-sm"
                />
              </div>

              {/* Search Button */}
              <Button className="rounded-xl bg-secondary hover:bg-secondary/90 text-white px-8 whitespace-nowrap">
                Rechercher
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES SECTION */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 space-y-4">
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight">
              Explorez nos catégories
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl">
              Trouvez le savoir-faire dont vous avez besoin parmi nos experts retraités.
            </p>
          </div>

          {/* Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICE_CATEGORIES.slice(0, 6).map((category) => {
              const IconComponent = iconMap[category.icon as keyof typeof iconMap];
              return (
                <Link
                  key={category.id}
                  href={`/services?category=${category.id}`}
                  className="group relative overflow-hidden rounded-2xl bg-white border border-gray-100 p-8 hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
                >
                  {/* Icon */}
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-secondary/10 mb-6 group-hover:bg-secondary/20 transition-colors">
                    {IconComponent && (
                      <IconComponent className="w-7 h-7 text-secondary" />
                    )}
                  </div>

                  {/* Content */}
                  <h3 className="font-semibold text-lg text-gray-900 mb-2 tracking-tight">
                    {category.label}
                  </h3>
                  <p className="text-sm text-gray-500 mb-6">
                    +120 experts disponibles
                  </p>

                  {/* Arrow */}
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-50 group-hover:bg-secondary group-hover:text-white transition-all">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </Link>
              );
            })}
          </div>

          {/* View All */}
          <div className="mt-12 text-center">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-lg font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              Voir toutes les catégories
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-20 sm:py-28 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 space-y-4">
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight">
              Comment ça marche
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl">
              Trois étapes simples pour commencer votre aventure.
            </p>
          </div>

          {/* Steps */}
          <div className="grid sm:grid-cols-3 gap-12">
            {[
              {
                number: '01',
                title: 'Créez votre profil',
                description:
                  'En quelques minutes, décrivez vos compétences, votre expérience et vos disponibilités.',
              },
              {
                number: '02',
                title: 'Trouvez la bonne mission',
                description:
                  'Parcourez les demandes de services ou recevez des propositions adaptées à votre profil.',
              },
              {
                number: '03',
                title: 'Partagez votre savoir-faire',
                description:
                  'Réalisez vos missions, recevez des avis, et complétez vos revenus à votre rythme.',
              },
            ].map((step, idx) => (
              <div key={step.number} className="relative">
                {/* Connecting Line (Desktop) */}
                {idx < 2 && (
                  <div className="hidden sm:block absolute top-8 left-1/2 w-full h-0.5 bg-gradient-to-r from-secondary/50 to-secondary/0 -translate-x-1/2" />
                )}

                {/* Step Content */}
                <div className="relative">
                  <p className="font-serif text-7xl font-bold text-secondary/20 mb-4 tracking-tight">
                    {step.number}
                  </p>
                  <h3 className="font-serif text-2xl font-bold text-gray-900 mb-4 tracking-tight -mt-6">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed max-w-sm">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST SECTION */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 space-y-4">
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight">
              Pourquoi nous choisir
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl">
              Une plateforme construite sur la confiance et la qualité.
            </p>
          </div>

          {/* Trust Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Shield,
                title: 'Profils vérifiés',
                description:
                  'Tous les experts sont vérifiés et authentifiés pour votre sécurité.',
              },
              {
                icon: Clock,
                title: 'Flexibilité totale',
                description:
                  'Travaillez selon votre emploi du temps et vos préférences.',
              },
              {
                icon: Star,
                title: 'Avis authentiques',
                description:
                  'Des évaluations vérifiées pour vous aider à choisir.',
              },
              {
                icon: Users,
                title: 'Communauté active',
                description:
                  'Rejoignez 2 400+ retraités qui gagnent déjà avec nous.',
              },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-gray-100 bg-white p-8 hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 mb-6">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg text-gray-900 mb-3 tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-gray-500 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="py-20 sm:py-28 bg-primary/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 space-y-4">
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight">
              Ils nous font confiance
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl">
              Les histoires de réussite de notre communauté.
            </p>
          </div>

          {/* Testimonials */}
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              {
                quote:
                  '"J\'ai retrouvé de la confiance en moi. Les missions me permettent de rester actif et utile."',
                name: 'Jacques M.',
                role: 'Retraité - Bricolage',
                rating: 5,
              },
              {
                quote:
                  '"Incroyable ! Les experts sont professionnels et fiables. Parfait pour mes projets."',
                name: 'Sophie L.',
                role: 'Particulière - Client',
                rating: 5,
              },
              {
                quote:
                  '"Une belle opportunité de compléter ma retraite tout en aidant la communauté locale."',
                name: 'Marie R.',
                role: 'Retraitée - Conseil',
                rating: 5,
              },
            ].map((testimonial, idx) => (
              <div
                key={idx}
                className="rounded-2xl bg-white shadow-sm p-8 border border-gray-100"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed italic">
                  {testimonial.quote}
                </p>
                <div>
                  <p className="font-semibold text-gray-900">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ENTERPRISE CTA */}
      <section className="py-20 sm:py-28 bg-primary text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-4xl sm:text-5xl font-bold mb-6 tracking-tight">
            Entreprises : la loi des 5%
          </h2>
          <p className="text-lg text-white/90 mb-12 max-w-2xl mx-auto leading-relaxed">
            La loi 2026 impose aux entreprises de 1 000+ salariés de maintenir 5% de seniors 60+ dans leurs effectifs. Trouvez les meilleurs profils expérimentés.
          </p>
          <Link href="/register?role=company">
            <Button
              size="lg"
              className="rounded-full bg-secondary hover:bg-secondary/90 text-white gap-2 group"
            >
              Découvrir l&apos;offre entreprise
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-20 sm:py-28 bg-secondary/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-white border border-gray-100 p-12 sm:p-16 text-center">
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
              Prêt à commencer ?
            </h2>
            <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              Rejoignez notre communauté et démarrez vos missions dès aujourd&apos;hui.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register?role=retiree">
                <Button
                  size="lg"
                  className="rounded-full bg-secondary hover:bg-secondary/90 text-white gap-2 group"
                >
                  Je suis retraité
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/register?role=client">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full border-2 border-gray-300 hover:border-primary hover:text-primary transition-colors"
                >
                  Je cherche un service
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div className="space-y-4">
              <h4 className="font-serif text-lg font-bold">
                Les Retraités Travaillent
              </h4>
              <p className="text-sm text-gray-400 leading-relaxed">
                La plateforme de référence pour valoriser l&apos;expérience des retraités français et connecter expertise avec demande.
              </p>
            </div>

            {/* Services */}
            <div className="space-y-4">
              <h4 className="font-semibold text-sm uppercase tracking-wide text-gray-300">
                Services
              </h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/services" className="text-sm text-gray-400 hover:text-white transition-colors">
                    Trouver un expert
                  </Link>
                </li>
                <li>
                  <Link
                    href="/register?role=retiree"
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    Proposer ses services
                  </Link>
                </li>
                <li>
                  <Link
                    href="/register?role=company"
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    Espace entreprise
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div className="space-y-4">
              <h4 className="font-semibold text-sm uppercase tracking-wide text-gray-300">
                Informations
              </h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/blog" className="text-sm text-gray-400 hover:text-white transition-colors">
                    Blog & Conseils
                  </Link>
                </li>
                <li>
                  <Link href="/legal/cgu" className="text-sm text-gray-400 hover:text-white transition-colors">
                    Conditions d&apos;utilisation
                  </Link>
                </li>
                <li>
                  <Link href="/legal/confidentialite" className="text-sm text-gray-400 hover:text-white transition-colors">
                    Politique de confidentialité
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div className="space-y-4">
              <h4 className="font-semibold text-sm uppercase tracking-wide text-gray-300">
                Contact
              </h4>
              <p className="text-sm text-gray-400">
                contact@les-retraites-travaillent.fr
              </p>
              <p className="text-sm text-gray-400">
                +33 (0) 1 23 45 67 89
              </p>
            </div>
          </div>

          {/* Bottom */}
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} Les Retraités Travaillent. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
