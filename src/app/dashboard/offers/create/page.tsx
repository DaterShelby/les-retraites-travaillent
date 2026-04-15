"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function CreateOfferPage() {
  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-gray-900">Créer une offre</h1>
        <p className="text-neutral-text mt-2">Publiez une offre d'emploi pour recruter</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Détails de votre offre</CardTitle>
          <CardDescription>
            Remplissez les informations de votre offre d'emploi
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Titre du poste
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Ex: Chef de projet expérimenté"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description du poste
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              rows={5}
              placeholder="Décrivez le poste en détail..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Domaine
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="">Sélectionnez un domaine</option>
              <option value="it">Informatique</option>
              <option value="consulting">Consulting</option>
              <option value="management">Management</option>
              <option value="sales">Vente</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Salaire (EUR/mois)
            </label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="2000"
            />
          </div>

          <div className="flex gap-4">
            <Button>Publier l'offre</Button>
            <Link href="/dashboard/offers">
              <Button variant="outline">Annuler</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
