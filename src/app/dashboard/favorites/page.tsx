"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function FavoritesPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-gray-900">Mes favoris</h1>
        <p className="text-neutral-text mt-2">Mes services favoris et sauvegardés</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Aucun favori pour le moment</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-neutral-text">
            Vous n'avez pas ajouté de favoris. Explorez nos services et ajoutez-les à vos favoris!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
