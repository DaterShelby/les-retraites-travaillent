"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ApplicationsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-gray-900">Candidatures</h1>
        <p className="text-neutral-text mt-2">Gérez les candidatures pour vos offres</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Aucune candidature</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-neutral-text">
            Vous n'avez pas encore reçu de candidatures.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
