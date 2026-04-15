"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Trash2, Star, MapPin } from "lucide-react";

interface Service {
  id: string;
  title: string;
  description: string;
  category: string;
  price_amount: number | null;
  price_type: string | null;
  city: string | null;
  photos: string[];
  average_rating: number | null;
  total_reviews: number | null;
  provider_id: string;
  provider?: {
    first_name: string;
    last_name?: string;
    avatar_url?: string;
  };
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get favorites from localStorage
      const stored = localStorage.getItem("favorites") || "[]";
      const favoriteIds = JSON.parse(stored);
      setFavorites(favoriteIds);

      if (favoriteIds.length === 0) {
        setServices([]);
        return;
      }

      // Fetch services for these IDs
      const response = await fetch(
        `/api/services?ids=${encodeURIComponent(JSON.stringify(favoriteIds))}`
      );

      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des services");
      }

      const data = await response.json();
      setServices(Array.isArray(data) ? data : []);
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Une erreur s'est produite";
      setError(errorMsg);
      console.error("Error loading favorites:", err);
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = (serviceId: string) => {
    const updated = favorites.filter((id) => id !== serviceId);
    localStorage.setItem("favorites", JSON.stringify(updated));
    setFavorites(updated);
    setServices(services.filter((s) => s.id !== serviceId));
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-12 rounded-2xl bg-gray-200 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-96 rounded-3xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-serif font-bold text-primary mb-2">
          Mes favoris
        </h1>
        <p className="text-gray-600">
          Vos services sauvegardés et favoris
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-3xl p-4">
          <p className="text-red-700 font-medium">{error}</p>
        </div>
      )}

      {services.length === 0 ? (
        <div className="rounded-3xl bg-gradient-to-b from-[#F5F2EE] to-white border border-gray-100 p-12 md:p-16 text-center">
          <div className="text-5xl mb-4">💚</div>
          <h3 className="text-2xl font-serif font-bold text-gray-900 mb-2">
            Vous n'avez pas encore de favoris
          </h3>
          <p className="text-gray-600 mb-8">
            Commencez à explorer nos services et ajoutez vos préférés à votre liste
          </p>
          <Link
            href="/services"
            className="inline-block px-6 py-3 bg-gradient-to-r from-[#CC8800] to-[#A66E00] text-white rounded-2xl font-semibold hover:shadow-md transition-all"
          >
            Découvrir les services
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service) => (
            <Link
              key={service.id}
              href={`/services/${service.id}`}
              className="group rounded-3xl bg-white border border-gray-100 overflow-hidden hover:border-gray-200 hover:shadow-lg transition-all"
            >
              {/* Photo */}
              <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                {service.photos && service.photos.length > 0 ? (
                  <img
                    src={service.photos[0]}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-4xl text-gray-300">📸</span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-serif text-lg font-bold text-primary mb-1 line-clamp-2">
                      {service.title}
                    </h3>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-accent/10 text-accent rounded-full text-xs font-semibold">
                      <span className="w-1.5 h-1.5 bg-accent rounded-full" />
                      {service.category}
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      removeFavorite(service.id);
                    }}
                    className="p-2 rounded-2xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                    title="Retirer des favoris"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 line-clamp-2">
                  {service.description}
                </p>

                {/* Location */}
                {service.city && (
                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    {service.city}
                  </div>
                )}

                {/* Price & Rating Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div>
                    {service.price_amount !== null &&
                      service.price_amount !== undefined && (
                        <div className="flex items-baseline gap-1">
                          <span className="text-lg font-bold text-primary">
                            {service.price_amount}€
                          </span>
                          {service.price_type === "hourly" && (
                            <span className="text-xs text-gray-600">/h</span>
                          )}
                        </div>
                      )}
                  </div>
                  <div className="flex items-center gap-2">
                    {service.average_rating && (
                      <>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-accent text-accent" />
                          <span className="font-semibold text-gray-900">
                            {service.average_rating.toFixed(1)}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">
                          ({service.total_reviews || 0})
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
