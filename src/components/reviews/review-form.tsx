"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RatingStars } from "./rating-stars";

interface ReviewFormProps {
  bookingId: string;
  revieweeId: string;
  onSuccess?: () => void;
}

export function ReviewForm({ bookingId, revieweeId, onSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isValid = rating > 0 && comment.length >= 20;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValid) {
      setError("Le commentaire doit contenir au moins 20 caractères");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId,
          rating,
          comment,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Erreur lors de la création de l'avis");
      }

      setRating(5);
      setComment("");
      onSuccess?.();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Une erreur s'est produite"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-body font-semibold text-primary mb-3">
          Note (1 à 5 étoiles)
        </label>
        <RatingStars value={rating} onChange={setRating} interactive size="lg" />
      </div>

      <div>
        <label className="block text-body font-semibold text-primary mb-3">
          Votre avis
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Partagez votre expérience (minimum 20 caractères)…"
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary text-body font-sans"
          rows={5}
          required
          minLength={20}
        />
        <div className="flex justify-between items-center mt-2">
          <p className="text-body-sm text-gray-500">
            {comment.length}/200
          </p>
          {comment.length < 20 && comment.length > 0 && (
            <p className="text-body-sm text-secondary">
              {20 - comment.length} caractères manquants
            </p>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 rounded p-4">
          <p className="text-body text-red-700">{error}</p>
        </div>
      )}

      <Button
        type="submit"
        disabled={!isValid || loading}
        className="w-full"
      >
        {loading ? "Publication…" : "Publier mon avis"}
      </Button>
    </form>
  );
}
