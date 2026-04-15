'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MobileNav } from '@/components/layout/mobile-nav';
import { Logo } from '@/components/ui/logo';
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
  Play,
} from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Hammer, TreePine, ChefHat, Baby, Monitor, Lightbulb,
  GraduationCap, FileText, Scissors, Sparkles, Heart, MoreHorizontal,
};

const categoryImages: Record<string, string> = {
  'bricolage': '/images/mixboard/craftsmanship-community-1.jpg',
  'jardinage': '/images/mixboard/hero-garden.jpg',
  'cuisine': '/images/mixboard/social-connection-1.jpg',
  'garde-enfants': '/images/mixboard/social-connection-2.jpg',
  'informatique': '/images/mixboard/remote-collaboration-1.jpg',
  'conseil': '/images/mixboard/workshop-mentoring-1.jpg',
};

export default function HomePage() {
  return (
    <main id="main-content" className="min-h-screen bg-neutral-cream">
      {/* HEADER */}
      <header className="fixed top-0 z-50 w-full bg-white/70 backdrop-blur-2xl border-b border-gray-200/30 transition-all duration-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Logo size="sm" />

            {/* Pill nav */}
            <nav className="hidden md:flex items-center gap-1 bg-gray-100/60 rounded-2xl px-1.5 py-1">
              <Link href="/services" className="text-sm font-medium text-gray-600 hover:text-primary hover:bg-white px-4 py-2 rounded-xl transition-all">
                Services
              </Link>
              <Link href="/#how-it-works" className="text-sm font-medium text-gray-600 hover:text-primary hover:bg-white px-4 py-2 rounded-xl transition-all">
                Comment ça marche
              </Link>
              <Link href="/register?role=company" className="text-sm font-medium text-gray-600 hover:text-primary hover:bg-white px-4 py-2 rounded-xl transition-all">
                Entreprises
              </Link>
            </nav>

            <div className="flex items-center gap-2">
              <Link href="/login" className="hidden sm:block">
                <Button variant="ghost" size="sm" className="rounded-2xl text-gray-600">
                  Se connecter
                </Button>
              </Link>
              <Link href="/register?role=retiree">
                <Button size="sm" className="rounded-2xl bg-secondary hover:bg-secondary-500 text-white shadow-sm">
                  Commencer
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative min-h-[90vh] flex items-center pt-16 overflow-hidden">
        {/* Hero background image */}
        <img src="/images/mixboard/hero-garden.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" aria-hidden="true" />
        {/* Dark overlay for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#2C3E50]/90 via-[#2C3E50]/70 to-[#2C3E50]/40" />
        {/* Warm glow accents */}
        <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-accent/10 rounded-full blur-3xl" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Content */}
            <div className="space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-2 border border-white/10">
                <span className="w-2 h-2 bg-accent rounded-full animate-pulse"></span>
                <span className="text-white/80 text-sm font-medium">2 400+ experts disponibles</span>
              </div>

              <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight">
                L&apos;expérience{' '}
                <span className="text-gradient bg-gradient-to-r from-secondary to-secondary-300 bg-clip-text text-transparent">
                  n&apos;a pas
                </span>{' '}
                de prix.
              </h1>

              <p className="text-lg sm:text-xl text-white/70 leading-relaxed max-w-xl">
                Trouvez des experts pour vos projets, ou proposez vos services et complétez vos revenus à votre rythme.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Link href="/services">
                  <Button size="lg" className="rounded-2xl bg-secondary hover:bg-secondary-500 text-white gap-2 group shadow-lg hover:shadow-xl">
                    Trouver un expert
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/register?role=retiree">
                  <Button size="lg" variant="outline" className="rounded-2xl border-2 border-white/20 text-white hover:bg-white/10 backdrop-blur-sm">
                    Proposer mes services
                  </Button>
                </Link>
              </div>

              {/* Stats row */}
              <div className="flex flex-wrap gap-6 sm:gap-10 pt-8 border-t border-white/10">
                {[
                  { value: "2 400+", label: "Experts actifs" },
                  { value: "15 000+", label: "Missions réalisées" },
                  { value: "4.8/5", label: "Satisfaction" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    <p className="text-sm text-white/50">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Cards stack (Desktop) */}
            <div className="hidden lg:flex items-center justify-center relative h-full min-h-[500px]">
              {/* Card 1 */}
              <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-6 w-72 transform -rotate-3 hover:rotate-0 transition-all duration-500 hover:shadow-xl border border-white/50">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden flex-shrink-0">
                    <img src="/images/mixboard/workshop-mentoring-2.jpg" alt="Michel" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Michel R.</p>
                    <p className="text-xs text-gray-400">Bricolage & Menuiserie</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="text-xs text-gray-400 ml-2">(47 avis)</span>
                </div>
              </div>

              {/* Card 2 */}
              <div className="absolute top-40 left-0 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-6 w-72 transform rotate-3 hover:rotate-0 transition-all duration-500 hover:shadow-xl border border-white/50">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden flex-shrink-0">
                    <img src="/images/mixboard/finance-home-office-2.jpg" alt="Catherine" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Catherine B.</p>
                    <p className="text-xs text-gray-400">Cours d&apos;Informatique</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="text-xs text-gray-400 ml-2">(92 avis)</span>
                </div>
              </div>

              {/* Card 3 */}
              <div className="absolute bottom-4 right-12 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-6 w-72 transform -rotate-1 hover:rotate-0 transition-all duration-500 hover:shadow-xl border border-white/50">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden flex-shrink-0">
                    <img src="/images/mixboard/executive-skyline.jpg" alt="Pierre" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Pierre D.</p>
                    <p className="text-xs text-gray-400">Jardinage & Paysagisme</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="text-xs text-gray-400 ml-2">(63 avis)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEARCH BAR */}
      <section className="relative -mt-8 pb-16 sm:pb-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100/80 p-5 sm:p-6">
            <div className="flex flex-col lg:flex-row gap-3">
              <div className="flex-1 flex items-center gap-3 bg-gray-50 rounded-2xl px-4 py-3">
                <Search className="w-5 h-5 text-gray-400" />
                <input type="text" placeholder="Que recherchez-vous ?" className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400 text-sm" />
              </div>
              <div className="flex-1 flex items-center gap-3 bg-gray-50 rounded-2xl px-4 py-3">
                <MapPin className="w-5 h-5 text-gray-400" />
                <input type="text" placeholder="Ville ou code postal" className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400 text-sm" />
              </div>
              <Button className="rounded-2xl bg-secondary hover:bg-secondary-500 text-white px-8 shadow-sm hover:shadow-md">
                Rechercher
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-10 gap-4">
            <div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-2">
                Explorez les catégories
              </h2>
              <p className="text-gray-400 text-base sm:text-lg">
                Trouvez le savoir-faire dont vous avez besoin.
              </p>
            </div>
            <Link href="/services" className="inline-flex items-center gap-2 text-sm font-semibold text-secondary hover:text-secondary-500 transition-colors">
              Voir tout
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {SERVICE_CATEGORIES.slice(0, 6).map((category) => {
              const IconComponent = iconMap[category.icon as keyof typeof iconMap];
              const bgImage = categoryImages[category.id];

              return (
                <Link
                  key={category.id}
                  href={`/services?category=${category.id}`}
                  className="group relative overflow-hidden rounded-3xl h-56 sm:h-64 hover:shadow-xl transition-all duration-300"
                >
                  {bgImage && (
                    <img src={bgImage} alt={category.label} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-black/80 transition-all duration-300" />
                  <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-between">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md group-hover:bg-secondary/80 transition-all duration-300">
                      {IconComponent && <IconComponent className="w-6 h-6 text-white" />}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg sm:text-xl text-white mb-1 tracking-tight">
                        {category.label}
                      </h3>
                      <p className="text-sm text-white/70 flex items-center gap-1.5">
                        +120 experts
                        <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* FEATURED SERVICES */}
      <section className="py-16 sm:py-24 bg-neutral-cream">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-10 gap-4">
            <div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-2">
                Services en vedette
              </h2>
              <p className="text-gray-400 text-base sm:text-lg">
                Les derniers projets de nos experts.
              </p>
            </div>
            <Link href="/services" className="inline-flex items-center gap-2 text-sm font-semibold text-secondary hover:text-secondary-500 transition-colors">
              Explorer
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {[
              { title: 'Rénovation cuisine', expert: 'Michel R.', price: '75€/h', rating: 4.9, reviews: 47, image: '/images/mixboard/craftsmanship-community-1.jpg' },
              { title: 'Conseil en jardinage', expert: 'Pierre D.', price: '50€/h', rating: 4.8, reviews: 63, image: '/images/mixboard/hero-garden.jpg' },
              { title: "Cours d'informatique", expert: 'Catherine B.', price: '45€/h', rating: 5.0, reviews: 92, image: '/images/mixboard/remote-collaboration-2.jpg' },
              { title: "Garde d'enfants", expert: 'Anne M.', price: '55€/h', rating: 4.9, reviews: 28, image: '/images/mixboard/social-connection-2.jpg' },
            ].map((service, idx) => (
              <div key={idx} className="group rounded-3xl overflow-hidden bg-white border border-gray-100/80 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="relative h-44 sm:h-48 overflow-hidden">
                  <img src={service.image} alt={service.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-base text-gray-900 mb-1.5 group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-sm text-gray-400 mb-3">{service.expert}</p>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`w-3 h-3 ${i < Math.floor(service.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
                      ))}
                    </div>
                    <span className="text-xs text-gray-400">{service.rating} ({service.reviews})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-secondary">{service.price}</span>
                    <Button size="sm" className="rounded-2xl bg-primary hover:bg-primary-700 text-white text-xs h-9 px-4">
                      Réserver
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-16 sm:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-3">
              Comment ça marche
            </h2>
            <p className="text-gray-400 text-base sm:text-lg max-w-lg mx-auto">
              Trois étapes simples pour commencer.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-8 sm:gap-12">
            {[
              { number: '01', title: 'Créez votre profil', desc: 'Décrivez vos compétences, votre expérience et vos disponibilités en quelques minutes.' },
              { number: '02', title: 'Trouvez la bonne mission', desc: 'Parcourez les demandes ou recevez des propositions adaptées à votre profil.' },
              { number: '03', title: 'Partagez votre savoir-faire', desc: 'Réalisez vos missions, recevez des avis et complétez vos revenus.' },
            ].map((step) => (
              <div key={step.number} className="text-center sm:text-left">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-secondary/10 mb-6">
                  <span className="text-xl font-bold text-secondary">{step.number}</span>
                </div>
                <h3 className="font-serif text-xl font-bold text-gray-900 mb-3 tracking-tight">
                  {step.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className="py-16 sm:py-24 bg-neutral-cream">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-3">
              Pourquoi nous choisir
            </h2>
            <p className="text-gray-400 text-base sm:text-lg">
              Une plateforme construite sur la confiance.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: Shield, title: 'Profils vérifiés', desc: 'Experts authentifiés pour votre sécurité.' },
              { icon: Clock, title: 'Flexibilité totale', desc: 'Travaillez à votre rythme et vos horaires.' },
              { icon: Star, title: 'Avis authentiques', desc: 'Évaluations vérifiées par la communauté.' },
              { icon: Users, title: 'Communauté active', desc: '2 400+ experts qui partagent leur savoir.' },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="rounded-3xl bg-white p-7 sm:p-8 border border-gray-100/80 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/5 mb-5">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-base text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-3">
              Ils nous font confiance
            </h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-5">
            {[
              { quote: "J'ai retrouvé de la confiance en moi. Les missions me permettent de rester actif et utile.", name: 'Jacques M.', role: 'Retraité - Bricolage', image: '/images/mixboard/workshop-mentoring-2.jpg' },
              { quote: "Les experts sont professionnels et fiables. Parfait pour mes projets de rénovation.", name: 'Sophie L.', role: 'Particulière', image: '/images/mixboard/workshop-mentoring-1.jpg' },
              { quote: "Une belle opportunité de compléter ma retraite tout en aidant la communauté.", name: 'Marie R.', role: 'Retraitée - Conseil', image: '/images/mixboard/wellness-yoga.jpg' },
            ].map((t, idx) => (
              <div key={idx} className="rounded-3xl bg-neutral-cream p-7 sm:p-8 border border-gray-100/50 hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-11 h-11 rounded-2xl overflow-hidden flex-shrink-0">
                    <img src={t.image} alt={t.name} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-900">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.role}</p>
                  </div>
                </div>
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ENTERPRISE CTA */}
      <section className="relative py-16 sm:py-24 overflow-hidden">
        <img src="/images/mixboard/learning-library.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" aria-hidden="true" />
        <div className="absolute inset-0 bg-[#2C3E50]/85" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-2 mb-8 border border-white/10">
            <span className="text-white/70 text-sm font-medium">Conforme loi 2026</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white mb-5 tracking-tight">
            Entreprises : la loi des 5%
          </h2>
          <p className="text-lg text-white/60 mb-10 max-w-2xl mx-auto leading-relaxed">
            La loi impose aux grandes entreprises de maintenir 5% de seniors 60+ dans leurs effectifs. Trouvez les meilleurs profils.
          </p>
          <Link href="/register?role=company">
            <Button size="lg" className="rounded-2xl bg-secondary hover:bg-secondary-500 text-white gap-2 group shadow-lg">
              Découvrir l&apos;offre entreprise
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-neutral-cream border border-gray-100/80 p-10 sm:p-16 text-center">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
              Prêt à commencer ?
            </h2>
            <p className="text-base sm:text-lg text-gray-400 mb-10 max-w-xl mx-auto">
              Rejoignez notre communauté et démarrez vos missions dès aujourd&apos;hui.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/register?role=retiree">
                <Button size="lg" className="rounded-2xl bg-secondary hover:bg-secondary-500 text-white gap-2 group shadow-sm">
                  Je suis retraité
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/register?role=client">
                <Button size="lg" variant="outline" className="rounded-2xl border-2 border-gray-200 hover:border-primary hover:text-primary">
                  Je cherche un service
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-primary-800 text-white py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            <div className="space-y-4">
              <Logo size="sm" variant="light" />
              <p className="text-sm text-white/40 leading-relaxed mt-4">
                La plateforme de référence pour valoriser l&apos;expérience et connecter expertise avec demande.
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-xs uppercase tracking-wider text-white/50">Services</h4>
              <ul className="space-y-2.5">
                <li><Link href="/services" className="text-sm text-white/40 hover:text-white transition-colors">Trouver un expert</Link></li>
                <li><Link href="/register?role=retiree" className="text-sm text-white/40 hover:text-white transition-colors">Proposer ses services</Link></li>
                <li><Link href="/register?role=company" className="text-sm text-white/40 hover:text-white transition-colors">Espace entreprise</Link></li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-xs uppercase tracking-wider text-white/50">Informations</h4>
              <ul className="space-y-2.5">
                <li><Link href="/blog" className="text-sm text-white/40 hover:text-white transition-colors">Blog & Conseils</Link></li>
                <li><Link href="/legal/cgu" className="text-sm text-white/40 hover:text-white transition-colors">Conditions d&apos;utilisation</Link></li>
                <li><Link href="/legal/confidentialite" className="text-sm text-white/40 hover:text-white transition-colors">Confidentialité</Link></li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-xs uppercase tracking-wider text-white/50">Contact</h4>
              <p className="text-sm text-white/40">contact@les-retraites-travaillent.fr</p>
              <p className="text-sm text-white/40">+33 (0) 1 23 45 67 89</p>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center">
            <p className="text-sm text-white/30">
              © {new Date().getFullYear()} Les Retraités Travaillent. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>

      <MobileNav />
    </main>
  );
}
