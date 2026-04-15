"use client";

import Link from "next/link";
import { Star, MapPin, BadgeCheck } from "lucide-react";
import type { Database } from "@/types/database";

interface ServiceCardProps {
  service: Database["public"]["Tables"]["services"]["Row"] & {
    provider?: {
      first_name: string;
      average_rating: number;
      is_verified: boolean;
      is_super_pro: boolean;
      avatar_url: string | null;
    };
  };
}

export function ServiceCard({ service }: ServiceCardProps) {
  const displayProvider = service.provider || {
    first_name: "Prestataire",
    average_rating: 0,
    is_verified: false,
    is_super_pro: false,
    avatar_url: null,
  };

  return (
    <Link href={`/services/${service.id}`}>
      <div className="h-full flex flex-col rounded-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200 bg-white">
        {/* Image placeholder */}
        <div className="relative w-full h-48 bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center overflow-hidden">
          <span className="text-white text-sm font-medium">
            {service.photos?.[0] || "Photo"}
          </span>
          {displayProvider.is_verified && (
            <div className="absolute top-2 right-2 bg-white rounded-full p-1">
              <BadgeCheck className="w-5 h-5 text-accent" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col p-4">
          {/* Provider info */}
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-gray-300 flex-shrink-0 flex items-center justify-center overflow-hidden">
              {displayProvider.avatar_url ? (
                <img
                  src={displayProvider.avatar_url}
                  alt={displayProvider.first_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xs font-semibold text-gray-600">
                  {displayProvider.first_name.charAt(0)}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-neutral-text truncate">
                {displayProvider.first_name}
              </p>
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-secondary text-secondary" />
                <span className="text-xs font-medium text-neutral-text">
                  {displayProvider.average_rating.toFixed(1)}
                </span>
              </div>
            </div>
            {displayProvider.is_super_pro && (
              <span className="inline-block px-2 py-0.5 bg-secondary text-white text-xs font-semibold rounded-full whitespace-nowrap flex-shrink-0">
                Super Pro
              </span>
            )}
          </div>

          {/* Service info */}
          <h3 className="font-serif font-bold text-neutral-text mb-2 line-clamp-2 text-sm">
            {service.title}
          </h3>

          <div className="flex items-center gap-2 text-xs text-gray-600 mb-3">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{service.city}</span>
          </div>

          {/* Category */}
          <div className="mb-3">
            <span className="inline-block px-2 py-1 bg-accent-50 text-accent text-xs font-medium rounded-sm">
              {service.category}
            </span>
          </div>

          {/* Price - spacer to bottom */}
          <div className="mt-auto pt-3 border-t border-gray-100">
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-gray-600">
                {service.price_type === "hourly"
                  ? "Tarif horaire"
                  : service.price_type === "fixed"
                    ? "Tarif fixe"
                    : "À négocier"}
              </span>
              {service.price_amount && (
                <span className="text-lg font-bold text-primary">
                  {service.price_amount}€
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
