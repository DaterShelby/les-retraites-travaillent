"use client";

import { Database } from "@/types/database";
import { RatingStars } from "./rating-stars";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

interface ReviewCardProps {
  review: Database["public"]["Tables"]["reviews"]["Row"] & {
    reviewer?: { first_name: string; avatar_url?: string };
  };
  canRespond?: boolean;
  onResponseSubmitted?: () => void;
}

export function ReviewCard({
  review,
  canRespond = false,
  onResponseSubmitted,
}: ReviewCardProps) {
  const [isResponding, setIsResponding] = useState(false);
  const [response, setResponse] = useState(review.response || "");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmitResponse = async () => {
    if (!response.trim()) return;

    setSubmitting(true);
    try {
      const supabase = createBrowserSupabaseClient();
      const { error } = await supabase
        .from("reviews")
        .update({
          response,
          response_at: new Date().toISOString(),
        })
        .eq("id", review.id);

      if (error) throw error;
      setIsResponding(false);
      onResponseSubmitted?.();
    } catch (err) {
      console.error("Error submitting response:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const formattedDate = new Date(review.created_at).toLocaleDateString(
    "fr-FR",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
      {/* Review Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {review.reviewer?.avatar_url && (
              <img
                src={review.reviewer.avatar_url}
                alt={review.reviewer.first_name}
                className="w-8 h-8 rounded-full"
              />
            )}
            <div>
              <p className="text-body font-semibold text-primary">
                {review.reviewer?.first_name || "Anonyme"}
              </p>
              <p className="text-body-sm text-gray-500">{formattedDate}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Rating */}
      <div>
        <RatingStars value={review.rating} interactive={false} />
      </div>

      {/* Comment */}
      <div>
        <p className="text-body text-gray-700">{review.comment}</p>
      </div>

      {/* Response */}
      {review.response && (
        <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
          <p className="text-body-sm font-semibold text-primary mb-2">
            Votre réponse
          </p>
          <p className="text-body text-gray-700">{review.response}</p>
          <p className="text-body-sm text-gray-500 mt-2">
            {review.response_at &&
              new Date(review.response_at).toLocaleDateString(
                "fr-FR",
                {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }
              )}
          </p>
        </div>
      )}

      {/* Response Form */}
      {canRespond && !review.response && (
        <div className="bg-gray-50 rounded-lg p-4">
          {!isResponding ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsResponding(true)}
              className="w-full"
            >
              Répondre à cet avis
            </Button>
          ) : (
            <div className="space-y-3">
              <textarea
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder="Écrivez votre réponse…"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary text-body font-sans text-sm"
                rows={3}
              />
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsResponding(false)}
                  className="flex-1"
                >
                  Annuler
                </Button>
                <Button
                  size="sm"
                  onClick={handleSubmitResponse}
                  disabled={!response.trim() || submitting}
                  className="flex-1"
                >
                  {submitting ? "Envoi…" : "Publier"}
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
