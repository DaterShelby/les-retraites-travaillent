"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceId: string;
  serviceName: string;
  price?: number;
  priceType?: string;
  onSuccess?: () => void;
}

export function BookingModal({
  isOpen,
  onClose,
  serviceId,
  serviceName,
  price,
  priceType,
  onSuccess,
}: BookingModalProps) {
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!date) {
      setError("Veuillez sélectionner une date");
      return;
    }

    if (!startTime || !endTime) {
      setError("Veuillez sélectionner les horaires");
      return;
    }

    setLoading(true);

    try {
      // Combine date with time
      const slotStart = new Date(`${date}T${startTime}`).toISOString();
      const slotEnd = new Date(`${date}T${endTime}`).toISOString();

      if (new Date(slotEnd) <= new Date(slotStart)) {
        setError("L'heure de fin doit être après l'heure de début");
        setLoading(false);
        return;
      }

      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId,
          slotStart,
          slotEnd,
          description: description || null,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Erreur lors de la réservation");
      }

      const booking = await response.json();
      setSuccessMessage("Réservation créée avec succès!");

      setTimeout(() => {
        onSuccess?.();
        onClose();
        setDate("");
        setStartTime("09:00");
        setEndTime("10:00");
        setDescription("");
        setSuccessMessage("");
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur s'est produite");
    } finally {
      setLoading(false);
    }
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split("T")[0];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-6 flex items-center justify-between">
            <h2 className="font-serif text-2xl font-bold text-primary">
              Réserver ce service
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Service Name */}
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Service
              </p>
              <p className="text-lg font-semibold text-primary">{serviceName}</p>
            </div>

            {/* Date Picker */}
            <div>
              <label className="block text-sm font-semibold text-primary mb-2">
                Date
              </label>
              <input
                type="date"
                min={today}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            {/* Time Range */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-primary mb-2">
                  Heure de début
                </label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-primary mb-2">
                  Heure de fin
                </label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-primary mb-2">
                Décrivez votre besoin
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Partagez les détails de votre demande..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-primary transition-colors resize-none"
                rows={4}
              />
            </div>

            {/* Price Summary */}
            {price !== null && price !== undefined && (
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                <div className="flex items-baseline justify-between">
                  <span className="text-sm text-gray-600">Tarif</span>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-primary">
                      {price}€
                    </span>
                    {priceType === "hourly" && (
                      <span className="text-sm text-gray-600 ml-1">/heure</span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Success */}
            {successMessage && (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
                <p className="text-sm text-green-700">{successMessage}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-2xl font-semibold hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-[#CC8800] to-[#A66E00] text-white rounded-2xl font-semibold hover:shadow-md transition-all disabled:opacity-50"
              >
                {loading ? "Création..." : "Confirmer la réservation"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
