"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function OffersPage() {
  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900">Mes offres</h1>
          <p className="text-neutral-text mt-2">Gérez vos offres d'emploi</p>
        </div>
        <Link href="/dashboard/offers/create">
          <Button>Créer une offre</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Aucune offre pour le moment</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-neutral-text mb-4">
            Vous n'avez pas encore créé d'offre. Créez votre première offre pour commencer à recruter.
          </p>
          <Link href="/dashboard/offers/create">
            <Button variant="outline">Créer une offre</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
