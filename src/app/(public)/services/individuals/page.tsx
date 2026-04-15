"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function IndividualsPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">
          Services pour les particuliers
        </h1>
        <p className="text-xl text-neutral-text mb-8">
          Trouvez les services professionnels adaptés à vos besoins.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardHeader>
                <CardTitle className="text-lg">Service {i}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-neutral-text mb-4">
                  Profitez de l'expérience de nos retraités qualifiés.
                </p>
                <Button variant="outline" size="sm">
                  Réserver
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/services">
            <Button variant="outline">Retour aux services</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
