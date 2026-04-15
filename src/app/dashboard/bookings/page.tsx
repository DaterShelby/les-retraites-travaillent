"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function BookingsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-gray-900">Mes réservations</h1>
        <p className="text-neutral-text mt-2">Suivez vos réservations en cours</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Aucune réservation</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-neutral-text">
            Vous n'avez pas de réservations actuellement.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
