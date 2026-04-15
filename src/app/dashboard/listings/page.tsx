"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus, Pause, Play, Trash2, Edit, AlertCircle } from "lucide-react";
import type { ServiceRow } from "@/types/database";

export default function MyListingsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  const supabase = createClient();

  const [listings, setListings] = useState<ServiceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(!!searchParams.get("success"));

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [authLoading, user, router]);

  // Fetch user's listings
  useEffect(() => {
    if (!user) return;

    const fetchListings = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data, error: fetchError } = await supabase
          .from("services")
          .select("*")
          .eq("provider_id", user.id)
          .order("created_at", { ascending: false });

        if (fetchError) {
          setError("Une erreur est survenue lors de la récupération de vos annonces.");
          console.error("Supabase error:", fetchError);
          return;
        }

        setListings(data || []);
      } catch (err) {
        console.error(err);
        setError("Une erreur est survenue.");
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [user, supabase]);

  const handleDeleteListing = async (id: string) => {
    try {
      const { error } = await supabase
        .from("services")
        .delete()
        .eq("id", id)
        .eq("provider_id", user?.id);

      if (error) {
        setError("Impossible de supprimer cette annonce.");
        console.error("Delete error:", error);
        return;
      }

      setListings((prev) => prev.filter((listing) => listing.id !== id));
      setDeleteConfirm(null);
    } catch (err) {
      console.error(err);
      setError("Une erreur est survenue.");
    }
  };

  const handleTogglePause = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "paused" ? "published" : "paused";

    try {
      const { error } = await supabase
        .from("services")
        .update({ status: newStatus })
        .eq("id", id)
        .eq("provider_id", user?.id);

      if (error) {
        setError("Impossible de mettre à jour le statut.");
        console.error("Update error:", error);
        return;
      }

      setListings((prev) =>
        prev.map((listing) =>
          listing.id === id ? { ...listing, status: newStatus } : listing
        )
      );
    } catch (err) {
      console.error(err);
      setError("Une erreur est survenue.");
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-neutral-cream flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 rounded-full border-2 border-gray-200 border-t-secondary animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const priceTypeLabel = (type: string) => {
    switch (type) {
      case "hourly":
        return "À l'heure";
      case "fixed":
        return "Prix fixe";
      case "negotiable":
        return "À négocier";
      default:
        return type;
    }
  };

  const statusLabel = (status: string) => {
    switch (status) {
      case "published":
        return "Publiée";
      case "paused":
        return "En pause";
      case "draft":
        return "Brouillon";
      case "pending_review":
        return "En attente";
      case "archived":
        return "Archivée";
      default:
        return status;
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-success/10 text-success";
      case "paused":
        return "bg-warning/10 text-warning";
      case "draft":
        return "bg-gray-100 text-gray-700";
      case "pending_review":
        return "bg-info/10 text-info";
      case "archived":
        return "bg-gray-100 text-gray-600";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <main className="min-h-screen bg-neutral-cream">
      {/* Header */}
      <div className="border-b border-gray-200/50">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-8 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              Mes annonces
            </h1>
            <p className="text-gray-500">
              Gérez et suivez vos services publiés.
            </p>
          </div>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => router.push("/dashboard/listings/create")}
            className="flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">Nouvelle annonce</span>
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
        {/* Success Message */}
        {showSuccess && (
          <div className="mb-6 p-4 rounded-2xl bg-success/10 border border-success/20 flex items-start gap-3 animate-slideUp">
            <AlertCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
            <p className="text-success font-medium">
              Votre annonce a été créée avec succès !
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-100/80 flex items-start gap-3">
            <div className="w-5 h-5 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-red-600 text-xs font-bold">!</span>
            </div>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && listings.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-gray-900 mb-2">
              Aucune annonce pour le moment
            </h2>
            <p className="text-gray-500 mb-6">
              Commencez à partager votre expertise en créant votre première annonce.
            </p>
            <Button
              variant="secondary"
              onClick={() => router.push("/dashboard/listings/create")}
            >
              Créer une annonce
            </Button>
          </div>
        )}

        {/* Listings Grid */}
        {!loading && listings.length > 0 && (
          <div className="space-y-4">
            {listings.map((listing) => (
              <div
                key={listing.id}
                className="rounded-2xl bg-white border border-gray-200 p-6 shadow-card hover:shadow-elevated transition-shadow"
              >
                {/* Delete Confirmation Modal */}
                {deleteConfirm === listing.id && (
                  <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 max-w-sm mx-auto">
                      <h3 className="font-serif text-lg font-bold text-gray-900 mb-2">
                        Supprimer cette annonce ?
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Cette action est irréversible.
                      </p>
                      <div className="flex gap-3">
                        <Button
                          variant="outline"
                          onClick={() => setDeleteConfirm(null)}
                          className="flex-1"
                        >
                          Annuler
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => handleDeleteListing(listing.id)}
                          className="flex-1"
                        >
                          Supprimer
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
                  {/* Content */}
                  <div className="md:col-span-2 space-y-3">
                    <div>
                      <h3 className="font-serif text-lg font-bold text-gray-900 mb-1">
                        {listing.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {listing.description}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className={`inline-block px-3 py-1.5 rounded-full text-xs font-medium ${statusColor(listing.status)}`}>
                        {statusLabel(listing.status)}
                      </span>
                      <span className="inline-block px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                        {listing.category}
                      </span>
                    </div>
                  </div>

                  {/* Pricing & Details */}
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-gray-500">Type de tarification</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {priceTypeLabel(listing.price_type)}
                      </p>
                    </div>
                    {listing.price_amount && (
                      <div>
                        <p className="text-xs text-gray-500">Tarif</p>
                        <p className="text-sm font-semibold text-secondary">
                          {listing.price_amount} €
                          {listing.price_type === "hourly" ? "/h" : ""}
                        </p>
                      </div>
                    )}
                    <div>
                      <p className="text-xs text-gray-500">Créée le</p>
                      <p className="text-sm font-medium text-gray-700">
                        {new Date(listing.created_at).toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 md:justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        router.push(`/dashboard/listings/${listing.id}/edit`)
                      }
                      className="flex items-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      <span className="hidden sm:inline">Modifier</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        handleTogglePause(listing.id, listing.status)
                      }
                      className="flex items-center gap-2"
                    >
                      {listing.status === "paused" ? (
                        <>
                          <Play className="w-4 h-4" />
                          <span className="hidden sm:inline">Publier</span>
                        </>
                      ) : (
                        <>
                          <Pause className="w-4 h-4" />
                          <span className="hidden sm:inline">Mettre en pause</span>
                        </>
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteConfirm(listing.id)}
                      className="flex items-center gap-2 text-error hover:text-error/80"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="hidden sm:inline">Supprimer</span>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="w-10 h-10 rounded-full border-2 border-gray-200 border-t-secondary animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement de vos annonces...</p>
          </div>
        )}
      </div>
    </main>
  );
}
