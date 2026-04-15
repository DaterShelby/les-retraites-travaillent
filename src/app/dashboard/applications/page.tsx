"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Inbox } from "lucide-react";

export default function ApplicationsPage() {
  return (
    <div className="max-w-5xl">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-serif font-bold text-gray-900">Candidatures</h1>
        <p className="text-neutral-text mt-3">Gérez les candidatures pour vos offres d'emploi</p>
      </div>

      {/* Empty State */}
      <Card className="rounded-3xl border-gray-200/50 overflow-hidden">
        <CardContent className="p-12 md:p-16">
          <div className="flex flex-col items-center justify-center text-center">
            {/* Icon */}
            <div className="mb-6 p-4 rounded-3xl bg-green-50">
              <Inbox className="w-12 h-12 text-green-600" />
            </div>

            <h3 className="text-2xl font-serif font-bold text-gray-900 mb-3">
              Aucune candidature pour le moment
            </h3>
            <p className="text-gray-600 max-w-md mb-8">
              Lorsque vous publierez une offre d'emploi et recevrez des candidatures, elles apparaîtront ici. Vous pourrez alors examiner les profils, envoyer des messages et gérer les candidatures.
            </p>

            {/* Features Preview */}
            <div className="mt-12 w-full max-w-md">
              <p className="text-sm font-semibold text-gray-700 mb-4">À bientôt disponible</p>
              <div className="space-y-3 text-left">
                <div className="flex items-start gap-3">
                  <span className="text-accent font-bold text-lg mt-0.5">✓</span>
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold text-gray-900">Profils des candidats</span> - Consultez les CV et compétences
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-accent font-bold text-lg mt-0.5">✓</span>
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold text-gray-900">Suivi des statuts</span> - Visualisez l'avancement de chaque candidature
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-accent font-bold text-lg mt-0.5">✓</span>
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold text-gray-900">Communication directe</span> - Échangez avec les candidats via la plateforme
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-accent font-bold text-lg mt-0.5">✓</span>
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold text-gray-900">Notes et commentaires</span> - Gardez des notes sur chaque candidat
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
