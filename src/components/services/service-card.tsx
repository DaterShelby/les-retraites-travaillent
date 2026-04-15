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
      <div className="h-full flex flex-col rounded-3xl overflow-hidden bg-white border border-gray-100/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
        {/* Photo Area — fully rounded */}
        <div className="relative w-full aspect-[4/3] overflow-hidden">
          {service.photos && service.photos.length > 0 ? (
            <img
              src={service.photos[0]}
              alt={service.title}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-bold text-lg">
                  {getInitials(service.title || "S")}
                </span>
              </div>
            </div>
          )}

          {/* Top badges row */}
          <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
            {/* Category pill */}
            {service.category && (
              <span className="inline-block rounded-full bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 text-xs font-semibold shadow-sm">
                {service.category}
              </span>
            )}

            {/* Status badge */}
            {provider.is_super_pro ? (
              <div className="bg-amber-400/90 backdrop-blur-sm text-white rounded-full px-2.5 py-1 shadow-sm flex items-center gap-1">
                <Award className="w-3.5 h-3.5" />
                <span className="text-xs font-semibold">Super Pro</span>
              </div>
            ) : provider.is_verified ? (
              <div className="bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1 shadow-sm flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-accent" />
                <span className="text-xs font-semibold text-accent">Vérifié</span>
              </div>
            ) : null}
          </div>

          {/* Price badge — bottom right of image */}
          {service.price_amount !== null && service.price_amount !== undefined && (
            <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm rounded-2xl px-3 py-1.5 shadow-md">
              <span className="text-base font-bold text-gray-900">
                {service.price_amount}€
              </span>
              {service.price_type === "hourly" && (
                <span className="text-xs text-gray-500">/h</span>
              )}
            </div>
          )}
        </div>

        {/* Body Section */}
        <div className="flex-1 flex flex-col p-4 sm:p-5">
          {/* Title */}
          <h3 className="font-serif text-base sm:text-lg font-bold text-gray-900 line-clamp-2 mb-2 group-hover:text-primary transition-colors">
            {service.title}
          </h3>

          {/* Location */}
          {service.city && (
            <div className="flex items-center gap-1.5 text-sm text-gray-400 mb-3">
              <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{service.city}</span>
            </div>
          )}

          {/* Spacer */}
          <div className="flex-1" />

          {/* Provider row with rating */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-50">
            {/* Provider avatar + name */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                {provider.avatar_url ? (
                  <img
                    src={provider.avatar_url}
                    alt={provider.first_name}
                    className="w-full h-full object-cover rounded-xl"
                    loading="lazy"
                  />
                ) : (
                  <span className="text-xs font-semibold text-gray-500">
                    {getInitials(provider.first_name)}
                  </span>
                )}
              </div>
              <span className="text-sm text-gray-600 font-medium truncate">
                {provider.first_name}
              </span>
            </div>

            {/* Rating */}
            {rating > 0 ? (
              <div className="flex items-center gap-1 bg-gray-50 rounded-xl px-2.5 py-1">
                <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-semibold text-gray-800">
                  {rating.toFixed(1)}
                </span>
                {reviews > 0 && (
                  <span className="text-xs text-gray-400">({reviews})</span>
                )}
              </div>
            ) : (
              <span className="text-xs text-gray-400 bg-gray-50 rounded-xl px-2.5 py-1">
                Nouveau
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
