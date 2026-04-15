"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Briefcase, Users, Zap, Award, Shield, Clock } from "lucide-react";

export default function ServicesPage() {
  const services = [
    {
      icon: Briefcase,
      title: "Services de retraités",
      description: "Découvrez les compétences et services proposés par nos retraités expérimentés.",
      href: "/services/retiree-services",
    },
    {
      icon: Users,
      title: "Pour les particuliers",
      description: "Trouvez des services professionnels adaptés à vos besoins.",
      href: "/services/individuals",
    },
    {
      icon: Zap,
      title: "Pour les entreprises",
      description: "Accédez à un réservoir de talents expérimentés pour vos projets.",
      href: "/services/companies",
    },
  ];

  const features = [
    {
      icon: Award,
      title: "Expertise reconnue",
      description: "Tous nos retraités ont une expérience professionnelle vérifiée.",
    },
    {
      icon: Shield,
      title: "Sécurisé et fiable",
      description: "Paiements sécurisés et garanties de service.",
    },
    {
      icon: Clock,
      title: "Flexible",
      description: "Choisissez votre propre horaire et vos missions.",
    },
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center">
          <h1 className="text-4xl font-serif font-bold text-gray-900 sm:text-5xl mb-4">
            Nos Services
          </h1>
          <p className="text-xl text-neutral-text max-w-2xl mx-auto">
            Explorez comment notre plateforme connecte les retraités avec les particuliers et entreprises.
          </p>
        </div>
      </div>

      {/* Services Grid */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <Link key={service.href} href={service.href}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{service.title}</CardTitle>
                    <CardDescription>{service.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-12 text-center">
            Pourquoi nous choisir?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="text-center">
                  <div className="bg-primary/10 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-neutral-text">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="bg-primary/5 rounded-lg p-8 sm:p-12 text-center">
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">
            Prêt à commencer?
          </h2>
          <p className="text-lg text-neutral-text mb-8 max-w-2xl mx-auto">
            Rejoignez notre communauté de retraités actifs et de clients satisfaits.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg">S&apos;inscrire maintenant</Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline">Déjà inscrit? Connectez-vous</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
