import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ReviewCard } from "@/components/reviews/review-card";
import { LoadingState } from "@/components/shared/loading-state";
import { Suspense } from "react";
import type { Database } from "@/types/database";

export const metadata = {
  title: "Avis - Tableau de bord",
  description: "Gérez vos avis et réponses",
};

async function ReviewsList() {
  const supabase = createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch reviews for this user
  const { data: reviews, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("reviewee_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching reviews:", error);
  }

  const typedReviews = (reviews || []) as Database["public"]["Tables"]["reviews"]["Row"][];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-serif font-bold text-primary mb-2">
          Vos avis
        </h1>
        <p className="text-body text-gray-600">
          Consultez tous les avis que vous avez reçus
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-sm text-center">
          <p className="text-body-sm text-gray-500 mb-1">Note moyenne</p>
          <p className="text-2xl font-serif font-bold text-primary">
            {typedReviews.length > 0
              ? (
                  typedReviews.reduce((sum, r) => sum + r.rating, 0) /
                  typedReviews.length
                ).toFixed(1)
              : "—"}
          </p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm text-center">
          <p className="text-body-sm text-gray-500 mb-1">Nombre d'avis</p>
          <p className="text-2xl font-serif font-bold text-primary">
            {typedReviews.length}
          </p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm text-center">
          <p className="text-body-sm text-gray-500 mb-1">Avis sans réponse</p>
          <p className="text-2xl font-serif font-bold text-primary">
            {typedReviews.filter((r) => !r.response).length}
          </p>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {typedReviews.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center shadow-sm">
            <p className="text-body text-gray-500">
              Vous n'avez pas encore d'avis
            </p>
          </div>
        ) : (
          typedReviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              canRespond={!review.response}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default function ReviewsPage() {
  return (
    <Suspense fallback={<LoadingState message="Chargement de vos avis…" />}>
      <ReviewsList />
    </Suspense>
  );
}
