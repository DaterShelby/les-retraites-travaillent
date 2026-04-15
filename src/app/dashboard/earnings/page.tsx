"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function EarningsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-gray-900">Mes revenus</h1>
        <p className="text-neutral-text mt-2">Suivez vos revenus et paiements</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Revenus ce mois</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-primary">0 EUR</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Revenus total</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-primary">0 EUR</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Paiements en attente</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-gray-900">0 EUR</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Historique des revenus</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-neutral-text">
            Aucun revenu enregistré pour le moment.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
