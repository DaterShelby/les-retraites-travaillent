"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CompaniesPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">
          Services pour les entreprises
        </h1>
        <p className="text-xl text-neutral-text mb-8">
          Accédez à un réservoir de talents expérimentés pour vos projets.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardHeader>
                <CardTitle className="text-lg">Talent {i}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-neutral-text mb-4">
                  Experts avec des années d'expérience dans leur domaine.
                </p>
                <Button variant="outline" size="sm">
                  Consulter le profil
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
