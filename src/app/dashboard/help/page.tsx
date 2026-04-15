"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { HelpCircle, MessageSquare, BookOpen, Mail } from "lucide-react";

export default function HelpPage() {
  const helpItems = [
    {
      icon: BookOpen,
      title: "Centre d'aide",
      description: "Consultez notre documentation complète et les guides",
      href: "/help",
    },
    {
      icon: MessageSquare,
      title: "Contactez notre support",
      description: "Envoyez un message à notre équipe de support",
      href: "/contact",
    },
    {
      icon: HelpCircle,
      title: "FAQ",
      description: "Réponses aux questions les plus fréquemment posées",
      href: "/faq",
    },
    {
      icon: Mail,
      title: "Email support",
      description: "Envoyez-nous un email à contact@lesretraiteestravaillent.fr",
      href: "mailto:contact@lesretraiteestravaillent.fr",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-gray-900">Centre d'aide</h1>
        <p className="text-neutral-text mt-2">Comment pouvons-nous vous aider?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {helpItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href}>
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                      <p className="text-sm text-neutral-text mt-2">{item.description}</p>
                    </div>
                    <Icon className="w-6 h-6 text-primary flex-shrink-0" />
                  </div>
                </CardHeader>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Quick FAQ */}
      <Card>
        <CardHeader>
          <CardTitle>Questions fréquentes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {[
            {
              question: "Comment créer mon profil?",
              answer: "Vous pouvez créer votre profil en cliquant sur S'inscrire et en remplissant vos informations.",
            },
            {
              question: "Comment puis-je contacter un prestataire?",
              answer: "Vous pouvez envoyer un message via la plateforme ou utiliser nos coordonnées de contact.",
            },
            {
              question: "Quels sont les modes de paiement acceptés?",
              answer: "Nous acceptons les cartes de crédit, virement bancaire, et autres méthodes de paiement électronique.",
            },
          ].map((item, index) => (
            <div key={index}>
              <h4 className="font-semibold text-gray-900 mb-2">{item.question}</h4>
              <p className="text-neutral-text mb-4">{item.answer}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
