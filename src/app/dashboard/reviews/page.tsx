"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { ReviewCard } from "@/components/reviews/review-card";
import { ReviewForm } from "@/components/reviews/review-form";
import { LoadingState } from "@/components/shared/loading-state";
import { Star } from "lucide-react";
import type { Database } from "@/types/database";

type TabType = "received" | "given";

interface ReviewData {
  id: string;
  booking_id: string;
  reviewer_id: string;
  reviewee_id: string;
  rating: number;
  comment: string;
  response?: string | null;
  response_at?: string | null;
  created_at: string;
  updated_at?: string;
  reviewer?: { first_name: string; avatar_url?: string };
  reviewee?: { first_name: string; avatar_url?: string };
}

interface BookingForReview {
  id: string;
  service_id: string;
  status: string;
  services?: { title: string };
  provider_id: string;
  client_id: string;
  provider?: { first_name: string };
  client?: { first_name: string };
}

export default function ReviewsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("received");
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [bookingsWithoutReview, setBookingsWithoutReview] = useState<BookingForReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }

    if (!authLoading && user) {
      fetchReviewsAndBookings();
    }
  }, [user, authLoading, router]);

  const fetchReviewsAndBookings = async () => {
    try {
      setLoading(true);

      // Fetch reviews
      const reviewResponse = await fetch("/api/reviews");
      if (reviewResponse.ok) {
        const reviewsData = await reviewResponse.json();
        setReviews(Array.isArray(reviewsData) ? reviewsData : []);
      }

      // Fetch bookings to find completed ones without reviews
      const bookingResponse = await fetch("/api/bookings");
      if (bookingResponse.ok) {
        const bookingsData = await bookingResponse.json();
        const completedBookings = (Array.isArray(bookingsData) ? bookingsData : []).filter(
          (b: any) => b.status === "completed"
        );

        // Filter out bookings that already have a review from this user
        const bookingsWithoutReviewFromUser = completedBookings.filter((booking: any) => {
          return !reviewsData.some(
            (r: ReviewData) =>
              r.booking_id === booking.id && r.reviewer_id === user?.id
          );
        });

        setBookingsWithoutReview(bookingsWithoutReviewFromUser);
      }
    } catch (err) {
      console.error("Error fetching reviews and bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return <LoadingState message="Chargement de vos avis…" />;
  }

  if (!user) {
    return null;
  }

  const receivedReviews = reviews.filter((r) => r.reviewee_id === user.id);
  const givenReviews = reviews.filter((r) => r.reviewer_id === user.id);

  const displayedReviews = activeTab === "received" ? receivedReviews : givenReviews;

  const receivedAverage =
    receivedReviews.length > 0
      ? (
          receivedReviews.reduce((sum, r) => sum + r.rating, 0) /
          receivedReviews.length
        ).toFixed(1)
      : "—";

  const unrepliedCount = receivedReviews.filter((r) => !r.response).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-serif font-bold text-primary mb-2">
          Avis et évaluations
        </h1>
        <p className="text-gray-600">
          Consultez les avis que vous avez reçus et ceux que vous avez donnés
        </p>
      </div>

      {/* Stats - Only show for received reviews tab */}
      {activeTab === "received" && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm text-center">
            <p className="text-sm text-gray-500 mb-2 font-semibold">Note moyenne</p>
            <p className="text-4xl font-serif font-bold text-primary">
              {receivedAverage}
            </p>
          </div>
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm text-center">
            <p className="text-sm text-gray-500 mb-2 font-semibold">Nombre d'avis</p>
            <p className="text-4xl font-serif font-bold text-primary">
              {receivedReviews.length}
            </p>
          </div>
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm text-center">
            <p className="text-sm text-gray-500 mb-2 font-semibold">Sans réponse</p>
            <p className="text-4xl font-serif font-bold text-primary">
              {unrepliedCount}
            </p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-100">
        <button
          onClick={() => setActiveTab("received")}
          className={`px-4 py-3 font-semibold text-sm border-b-2 transition-colors ${
            activeTab === "received"
              ? "border-primary text-primary"
              : "border-transparent text-gray-600 hover:text-gray-900"
          }`}
        >
          Avis reçus {receivedReviews.length > 0 && `(${receivedReviews.length})`}
        </button>
        <button
          onClick={() => setActiveTab("given")}
          className={`px-4 py-3 font-semibold text-sm border-b-2 transition-colors ${
            activeTab === "given"
              ? "border-primary text-primary"
              : "border-transparent text-gray-600 hover:text-gray-900"
          }`}
        >
          Avis donnés {givenReviews.length > 0 && `(${givenReviews.length})`}
        </button>
      </div>

      {/* CTAs for reviews to write */}
      {activeTab === "given" && bookingsWithoutReview.length > 0 && (
        <div className="space-y-3">
          <div className="bg-accent/10 border border-accent/20 rounded-3xl p-6">
            <h3 className="font-semibold text-primary mb-4">
              Réservations en attente d'évaluation
            </h3>
            <div className="space-y-2">
              {bookingsWithoutReview.map((booking) => (
                <button
                  key={booking.id}
                  onClick={() => setSelectedBooking(booking.id)}
                  className="w-full text-left p-4 bg-white rounded-2xl border border-gray-100 hover:border-accent hover:bg-accent/5 transition-all flex items-center justify-between"
                >
                  <div>
                    <p className="font-semibold text-gray-900">
                      {booking.services?.title || "Service"}
                    </p>
                    <p className="text-sm text-gray-600">
                      avec{" "}
                      {user.id === booking.provider_id
                        ? booking.client?.first_name
                        : booking.provider?.first_name}
                    </p>
                  </div>
                  <Star className="w-5 h-5 text-accent" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Review Form Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/40 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8">
            <h2 className="text-2xl font-serif font-bold text-primary mb-6">
              Laisser un avis
            </h2>
            <ReviewForm
              bookingId={selectedBooking}
              revieweeId={
                user.id ===
                bookingsWithoutReview.find((b) => b.id === selectedBooking)
                  ?.provider_id
                  ? bookingsWithoutReview.find((b) => b.id === selectedBooking)
                      ?.client_id || ""
                  : bookingsWithoutReview.find((b) => b.id === selectedBooking)
                      ?.provider_id || ""
              }
              onSuccess={() => {
                setSelectedBooking(null);
                fetchReviewsAndBookings();
              }}
            />
            <button
              onClick={() => setSelectedBooking(null)}
              className="mt-4 w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-2xl font-semibold hover:bg-gray-50"
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {displayedReviews.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-100">
            <div className="text-5xl mb-4">
              {activeTab === "received" ? "💬" : "✍️"}
            </div>
            <p className="text-lg font-semibold text-gray-900 mb-2">
              {activeTab === "received"
                ? "Vous n'avez pas encore d'avis"
                : "Vous n'avez pas encore donné d'avis"}
            </p>
            <p className="text-gray-600">
              {activeTab === "received"
                ? "Les avis que vous recevrez s'afficheront ici"
                : "Une fois vos réservations complétées, vous pourrez évaluer vos prestataires"}
            </p>
          </div>
        ) : (
          displayedReviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={{
                ...review,
                reviewer: review.reviewer,
              }}
              canRespond={activeTab === "received" && !review.response}
              onResponseSubmitted={() => fetchReviewsAndBookings()}
            />
          ))
        )}
      </div>
    </div>
  );
}
