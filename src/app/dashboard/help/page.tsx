"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Mail, Zap, Clock, Shield, ChevronDown } from "lucide-react";

const FAQ_ITEMS = [
  {
    question: "Comment créer une annonce?",
    answer:
      "Allez dans votre tableau de bord, cliquez sur 'Créer une annonce' et remplissez les détails de votre service. Plus votre description est détaillée, plus vous avez de chances de trouver des clients.",
  },
  {
    question: "Comment fonctionne le système de paiement?",
    answer:
      "Les paiements seront bientôt disponibles via Stripe. Une fois activé, vous pourrez suivre vos revenus en temps réel et les retirer facilement.",
  },
  {
    question: "Quel est le délai de réponse attendu?",
    answer:
      "Notre équipe s'efforce de répondre à tous les messages dans un délai de 24 heures. Pour une réponse plus rapide, consultez notre FAQ ci-dessous.",
  },
  {
    question: "Comment puis-je augmenter ma visibilité?",
    answer:
      "Une note élevée, une description complète et des photos de qualité augmentent votre apparition dans les résultats de recherche. Répondez rapidement aux messages et collectez des avis positifs.",
  },
  {
    question: "Quels types de services puis-je proposer?",
    answer:
      "Vous pouvez proposer une large gamme de services : consulting, assistance, formation, travaux, maintenance, et bien d'autres. Consultez notre guide des catégories pour plus de détails.",
  },
  {
    question: "Comment gérer les candidatures?",
    answer:
      "Une fois que vous publiez une offre d'emploi, les candidatures apparaîtront dans votre tableau de bord. Vous pourrez examiner les profils, communiquer avec les candidats et gérer les statuts.",
  },
  {
    question: "Puis-je modifier mon profil après inscription?",
    answer:
      "Oui, vous pouvez modifier votre profil à tout moment. Allez dans les paramètres de votre tableau de bord pour mettre à jour votre photo, bio, compétences, et autres informations.",
  },
  {
    question: "Comment contacter l'équipe de support?",
    answer:
      "Envoyez-nous un email à contact@lesretraiteestravaillent.fr ou utilisez le formulaire de contact sur notre site. Nous vous répondrons dans les plus brefs délais.",
  },
];

function FAQItem({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start justify-between gap-4 py-4 text-left hover:bg-gray-50/50 px-4 rounded-2xl transition-colors"
      >
        <h4 className="font-semibold text-gray-900 flex-1">{question}</h4>
        <ChevronDown
          className={`w-5 h-5 text-gray-600 flex-shrink-0 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && (
        <div className="px-4 pb-4">
          <p className="text-gray-600 text-sm leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}

export default function HelpPage() {
  return (
    <div className="max-w-5xl">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-serif font-bold text-gray-900">Centre d'aide</h1>
        <p className="text-neutral-text mt-3">Trouvez des réponses à vos questions</p>
      </div>

      {/* Support Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {/* Email Support */}
        <a href="mailto:contact@lesretraiteestravaillent.fr">
          <Card className="h-full rounded-3xl border-gray-200/50 hover:shadow-lg transition-all cursor-pointer">
            <CardContent className="p-8">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-orange-50">
                  <Mail className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Email Support</h3>
                  <p className="text-sm text-gray-600">
                    contact@lesretraiteestravaillent.fr
                  </p>
                  <p className="text-xs text-gray-500 mt-3">
                    Réponse sous 24 heures
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </a>

        {/* Message Support */}
        <Card className="rounded-3xl border-gray-200/50 hover:shadow-lg transition-all cursor-pointer">
          <CardContent className="p-8">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-green-50">
                <MessageSquare className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Messages In-App</h3>
                <p className="text-sm text-gray-600">
                  Utilisez la fonction de messagerie de votre tableau de bord
                </p>
                <p className="text-xs text-gray-500 mt-3">
                  Réponse généralement rapide
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Tips */}
      <div className="mb-12">
        <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">Conseils utiles</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="rounded-3xl border-gray-200/50">
            <CardContent className="p-6">
              <div className="flex gap-3 mb-4">
                <Zap className="w-5 h-5 text-secondary flex-shrink-0" />
                <h3 className="font-semibold text-gray-900">Commencez vite</h3>
              </div>
              <p className="text-sm text-gray-600">
                Complétez votre profil et publiez votre première annonce pour démarrer.
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-gray-200/50">
            <CardContent className="p-6">
              <div className="flex gap-3 mb-4">
                <Clock className="w-5 h-5 text-accent flex-shrink-0" />
                <h3 className="font-semibold text-gray-900">Répondez vite</h3>
              </div>
              <p className="text-sm text-gray-600">
                Répondez rapidement aux messages pour augmenter votre taux de conversion.
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-gray-200/50">
            <CardContent className="p-6">
              <div className="flex gap-3 mb-4">
                <Shield className="w-5 h-5 text-primary flex-shrink-0" />
                <h3 className="font-semibold text-gray-900">Restez professionnel</h3>
              </div>
              <p className="text-sm text-gray-600">
                Maintenez une communication courtoise et professionnelle avec tous.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* FAQ Section */}
      <Card className="rounded-3xl border-gray-200/50">
        <CardHeader>
          <CardTitle className="text-2xl">Questions fréquentes</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-200">
            {FAQ_ITEMS.map((item, index) => (
              <FAQItem
                key={index}
                question={item.question}
                answer={item.answer}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Still Need Help */}
      <div className="mt-12 p-8 rounded-3xl bg-gradient-to-r from-orange-50 to-rose-50 border border-orange-200/50">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          Vous n'avez pas trouvé votre réponse?
        </h3>
        <p className="text-gray-600 mb-6">
          Notre équipe est là pour vous aider. Contactez-nous directement par email et nous répondrons à votre question dans les plus brefs délais.
        </p>
        <a href="mailto:contact@lesretraiteestravaillent.fr">
          <Button className="gap-2">
            <Mail className="w-4 h-4" />
            Envoyer un email
          </Button>
        </a>
      </div>
    </div>
  );
}
