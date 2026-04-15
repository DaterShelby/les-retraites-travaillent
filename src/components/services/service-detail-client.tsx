"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { BookingModal } from "@/components/bookings/booking-modal";

interface ServiceDetailClientProps {
  serviceId: string;
  serviceName: string;
  price?: number;
  priceType?: string;
  providerId?: string;
}

export function ServiceDetailClient({
  serviceId,
  serviceName,
  price,
  priceType,
  providerId,
}: ServiceDetailClientProps) {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleAddFavorite = () => {
    try {
      const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
      if (isFavorite) {
        const updated = favorites.filter((id: string) => id !== serviceId);
        localStorage.setItem("favorites", JSON.stringify(updated));
      } else {
        if (!favorites.includes(serviceId)) {
          favorites.push(serviceId);
          localStorage.setItem("favorites", JSON.stringify(favorites));
        }
      }
      setIsFavorite(!isFavorite);
    } catch (err) {
      console.error("Error updating favorites:", err);
    }
  };

  return (
    <>
      {/* Action Buttons */}
      <div className="border-t border-gray-100 pt-6 space-y-3">
        <button
          onClick={() => setIsBookingModalOpen(true)}
          className="w-full px-4 py-3 bg-gradient-to-r from-[#CC8800] to-[#A66E00] text-white rounded-2xl font-semibold hover:shadow-md transition-all"
        >
          Réserver ce service
        </button>
        <button
          onClick={handleAddFavorite}
          className={`w-full px-4 py-3 rounded-2xl font-semibold transition-all flex items-center justify-center gap-2 ${
            isFavorite
              ? "bg-gradient-to-r from-[#CC8800] to-[#A66E00] text-white"
              : "border border-gray-300 text-gray-700 hover:bg-gray-50"
          }`}
        >
          <Heart className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`} />
          {isFavorite ? "Retiré des favoris" : "Ajouter aux favoris"}
        </button>
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        serviceId={serviceId}
        serviceName={serviceName}
        price={price}
        priceType={priceType}
        onSuccess={() => {
          // Could navigate or show success here
        }}
      />
    </>
  );
}
