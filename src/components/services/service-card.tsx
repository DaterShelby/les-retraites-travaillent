"use client";

import Link from "next/link";
import { Star, MapPin, Shield, Award } from "lucide-react";

interface ServiceCardProps {
  service: {
    id: string;
    title: string;
    description?: string;
    category?: string;
    price_type?: string;
    price_amount?: number | null;
    city?: string;
    department?: string;
    photos?: string[];
    provider?: {
      first_name: string;
      avatar_url?: string | null;
      average_rating?: number;
      total_reviews?: number;
      is_verified?: boolean;
      is_super_pro?: boolean;
    };
  };
}

export function ServiceCard({ service }: ServiceCardProps) {
  const provider = service.provider || {
    first_name: "Prestataire",
    average_rating: 0,
    total_reviews: 0,
    is_verified: false,
    is_super_pro: false,
    avatar_url: null,
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const rating = provider.average_rating || 0;
  const reviews = provider.total_reviews || 0;

  return (
    <Link href={`/services/${service.id}`}>
      <div className="h-full flex flex-col rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-lg hover:scale-[1.01] transition-all duration-300">
        {/* Photo Area */}
        <div className="relative w-full aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden flex items-center justify-center">
          {service.photos && service.photos.length > 0 ? (
            <img
              src={service.photos[0]}
              alt={service.title}
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-gray-300 mx-auto mb-2 flex items-center justify-center text-white font-semibold text-sm">
                  {getInitials(service.title || "Service")}
                </div>
                <span className="text-xs text-gray-500">Service</span>
              </div>
            </div>
          )}

          {/* Verified Badge */}
          {provider.is_verified && (
            <div className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md flex items-center gap-1">
              <Shield className="w-4 h-4 text-green-600" />
              <span className="text-xs font-semibold text-green-600">
                Vérifié
              </span>
            </div>
          )}

          {/* Super Pro Badge */}
          {provider.is_super_pro && (
            <div className="absolute top-3 right-3 bg-amber-400 text-white rounded-full p-2 shadow-md flex items-center gap-1">
              <Award className="w-4 h-4" />
              <span className="text-xs font-semibold">Super Pro</span>
            </div>
          )}
        </div>

        {/* Body Section */}
        <div className="flex-1 flex flex-col p-5 justify-between">
          {/* Category Tag */}
          {service.category && (
            <div className="mb-3">
              <span className="inline-block rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-medium">
                {service.category}
              </span>
            </div>
          )}

          {/* Title */}
          <h3 className="font-serif text-lg font-bold text-gray-900 line-clamp-2 mb-2">
            {service.title}
          </h3>

          {/* Location */}
          {service.city && (
            <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-4">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span>{service.city}</span>
            </div>
          )}

          {/* Bottom Row - Price and Rating */}
          <div className="flex items-center justify-between mb-4 pt-3 border-t border-gray-100">
            {/* Price */}
            {service.price_amount !== null && service.price_amount !== undefined ? (
              <div>
                <span className="text-lg font-bold text-gray-900">
                  {service.price_amount}€
                </span>
                {service.price_type === "hourly" && (
                  <span className="text-xs text-gray-500 ml-1">/h</span>
                )}
              </div>
            ) : (
              <span className="text-sm text-gray-500">À négocier</span>
            )}

            {/* Rating */}
            {rating > 0 ? (
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-semibold text-gray-900">
                  {rating.toFixed(1)}
                </span>
                {reviews > 0 && (
                  <span className="text-xs text-gray-500">({reviews})</span>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-gray-300" />
                <span className="text-sm text-gray-500">Nouveau</span>
              </div>
            )}
          </div>

          {/* Provider Mini Row */}
          {provider && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
                {provider.avatar_url ? (
                  <img
                    src={provider.avatar_url}
                    alt={provider.first_name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <span className="text-xs font-semibold text-gray-600">
                    {getInitials(provider.first_name)}
                  </span>
                )}
              </div>
              <span className="text-sm text-gray-700 truncate">
                {provider.first_name}
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
