"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Briefcase, Plus } from "lucide-react";

interface JobOffer {
  id: string;
  title: string;
  description: string;
  created_at: string;
  status: string;
}

export default function OffersPage() {
  const { user, loading: authLoading } = useAuth();
  const [offers, setOffers] = useState<JobOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    if (authLoading || !user) return;

    const fetchOffers = async () => {
      try {
        // Fetch job offers marked with special tag
        const { data } = await supabase
          .from("services")
          .select("id, title, description, created_at, status")
          .eq("provider_id", user.id)
          .contains("tags", ["job_offer"])
          .order("created_at", { ascending: false });

        setOffers((data || []) as JobOffer[]);
      } catch (error) {
        console.error("Error fetching offers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, [user, authLoading, supabase]);

  if (authLoading) {
    return (
      <div className="max-w-5xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-serif font-bold text-gray-900">Mes offres</h1>
            <p className="text-neutral-text mt-3">Chargement...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl">
      {/* Header */}
      <div className="mb-12 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-serif font-bold text-gray-900">Mes offres d'emploi</h1>
          <p className="text-neutral-text mt-3">Publiez et gérez vos offres d'emploi</p>
        </div>
        <Link href="/dashboard/offers/create">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Nouvelle offre
          </Button>
        </Link>
      </div>

      {offers.length === 0 ? (
        // Empty State
        <Card className="rounded-3xl border-gray-200/50 overflow-hidden">
          <CardContent className="p-12 md:p-16">
            <div className="flex flex-col items-center justify-center text-center">
              {/* Icon */}
              <div className="mb-6 p-4 rounded-3xl bg-orange-50">
                <Briefcase className="w-12 h-12 text-orange-600" />
              </div>

              <h3 className="text-2xl font-serif font-bold text-gray-900 mb-3">
                Aucune offre pour le moment
              </h3>
              <p className="text-gray-600 max-w-md mb-8">
                Publiez votre première offre d'emploi et commencez à recruter les meilleurs talents pour votre entreprise.
              </p>

              <Link href="/dashboard/offers/create">
                <Button variant="default" size="lg" className="gap-2">
                  <Plus className="w-5 h-5" />
                  Publier votre première offre
                </Button>
              </Link>

              {/* Feature Highlights */}
              <div className="mt-12 w-full">
                <p className="text-sm font-semibold text-gray-700 mb-4">Avantages</p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-secondary font-bold">✓</span>
                    <p className="text-sm text-gray-600">Accès à des candidats vérifiés</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-secondary font-bold">✓</span>
                    <p className="text-sm text-gray-600">Gestion simple de vos candidatures</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-secondary font-bold">✓</span>
                    <p className="text-sm text-gray-600">Visibilité maximale sur la plateforme</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        // Offers List
        <div className="space-y-4">
          {offers.map((offer) => (
            <Card key={offer.id} className="rounded-3xl border-gray-200/50 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {offer.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                      {offer.description}
                    </p>
                    <p className="text-xs text-gray-500">
                      Créée le {new Date(offer.created_at).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      offer.status === "published"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}>
                      {offer.status === "published" ? "Publiée" : "Brouillon"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Add another offer button */}
          <div className="pt-4">
            <Link href="/dashboard/offers/create">
              <Button variant="outline" className="w-full rounded-3xl">
                <Plus className="w-4 h-4 mr-2" />
                Ajouter une autre offre
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
