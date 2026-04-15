"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function CreateListingPage() {
  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-gray-900">Créer une annonce</h1>
        <p className="text-neutral-text mt-2">Publiez votre service et trouvez des clients</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Détails de votre service</CardTitle>
          <CardDescription>
            Remplissez les informations de votre service
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Titre du service
            </label>
            <Input placeholder="Ex: Cours de français pour débutants" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              rows={5}
              placeholder="Décrivez votre service en détail..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Catégorie
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="">Sélectionnez une catégorie</option>
              <option value="education">Education</option>
              <option value="services">Services généraux</option>
              <option value="consulting">Consulting</option>
              <option value="craftwork">Travaux manuels</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prix (EUR/heure)
            </label>
            <Input type="number" placeholder="25" />
          </div>

          <div className="flex gap-4">
            <Button>Publier l'annonce</Button>
            <Link href="/dashboard/listings">
              <Button variant="outline">Annuler</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
