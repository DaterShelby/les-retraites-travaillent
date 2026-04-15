"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ListingsPage() {
  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900">Mes annonces</h1>
          <p className="text-neutral-text mt-2">Gérez vos annonces de services</p>
        </div>
        <Link href="/dashboard/listings/create">
          <Button>Créer une annonce</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Aucune annonce pour le moment</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-neutral-text mb-4">
            Vous n'avez pas encore créé d'annonce. Créez votre première annonce pour commencer à recevoir des demandes.
          </p>
          <Link href="/dashboard/listings/create">
            <Button variant="outline">Créer une annonce</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
