"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface BookingService {
  id: string;
  title: string;
  category: string;
  provider_id?: string;
}

interface BookingUser {
  id: string;
  first_name: string;
  last_name?: string | null;
  avatar_url?: string | null;
}

interface BookingData {
  id: string;
  service_id: string;
  client_id: string;
  provider_id: string;
  slot_start: string;
  slot_end: string;
  description?: string | null;
  status: "pending" | "confirmed" | "in_progress" | "completed" | "cancelled" | "disputed";
  cancellation_reason?: string | null;
  created_at: string;
  updated_at: string;
  services?: BookingService;
  client?: BookingUser;
  provider?: BookingUser;
}

type TabType = "pending" | "confirmed" | "completed" | "cancelled";

const STATUS_LABELS: Record<string, string> = {
  pending: "En attente",
  confirmed: "Confirmée",
  in_progress: "En cours",
  completed: "Terminée",
  cancelled: "Annulée",
  disputed: "Litigieuse",
};

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  pending: { bg: "bg-yellow-50", text: "text-yellow-700" },
  confirmed: { bg: "bg-blue-50", text: "text-blue-700" },
  in_progress: { bg: "bg-purple-50", text: "text-purple-700" },
  completed: { bg: "bg-green-50", text: "text-green-700" },
  cancelled: { bg: "bg-gray-50", text: "text-gray-700" },
  disputed: { bg: "bg-red-50", text: "text-red-700" },
};

const TABS: { id: TabType; label: string; filter: string[] }[] = [
  { id: "pending", label: "En attente", filter: ["pending"] },
  { id: "confirmed", label: "Confirmées", filter: ["confirmed", "in_progress"] },
  { id: "completed", label: "Terminées", filter: ["completed"] },
  { id: "cancelled", label: "Annulées", filter: ["cancelled"] },
];

export default function BookingsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("pending");
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }

    if (!authLoading && user) {
      fetchBookings();
    }
  }, [user, authLoading, router]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/bookings");
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des réservations");
      }

      const data = await response.json();
      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Une erreur est survenue";
      setError(errorMsg);
      console.error("Error fetching bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (
    bookingId: string,
    newStatus: string,
    cancellationReason?: string
  ) => {
    try {
      setActionLoading((prev) => ({ ...prev, [bookingId]: true }));

      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          ...(newStatus === "cancelled" && { cancellation_reason: cancellationReason }),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de la mise à jour");
      }

      const updatedBooking = await response.json();
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? updatedBooking : b))
      );
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Une erreur est survenue";
      alert(errorMsg);
    } finally {
      setActionLoading((prev) => ({ ...prev, [bookingId]: false }));
    }
  };

  const getOtherParty = (booking: BookingData) => {
    if (!user) return null;
    return user.id === booking.client_id ? booking.provider : booking.client;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isProvider = (booking: BookingData) => user?.id === booking.provider_id;
  const isClient = (booking: BookingData) => user?.id === booking.client_id;

  const filteredBookings = bookings.filter((booking) =>
    TABS.find((tab) => tab.id === activeTab)?.filter.includes(booking.status)
  );

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#E07A5F]"></div>
          <p className="mt-4 text-gray-600">Chargement des réservations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-gray-900">
          Mes réservations
        </h1>
        <p className="text-gray-600 mt-2">
          Suivez vos réservations en cours et passées
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-8 border-b border-gray-200">
        {TABS.map((tab) => {
          const count = bookings.filter((b) =>
            tab.filter.includes(b.status)
          ).length;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 font-medium text-sm transition-colors border-b-2 ${
                activeTab === tab.id
                  ? "border-[#E07A5F] text-[#E07A5F]"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab.label} {count > 0 && <span className="ml-1">({count})</span>}
            </button>
          );
        })}
      </div>

      {/* Bookings List */}
      <div>
        {filteredBookings.length === 0 ? (
          <div className="py-12 text-center">
            <div className="mb-4">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <p className="text-gray-600 text-lg">
              {activeTab === "pending" && "Aucune réservation en attente"}
              {activeTab === "confirmed" && "Aucune réservation confirmée"}
              {activeTab === "completed" && "Aucune réservation terminée"}
              {activeTab === "cancelled" && "Aucune réservation annulée"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => {
              const otherParty = getOtherParty(booking);
              const statusColor = STATUS_COLORS[booking.status];

              return (
                <div
                  key={booking.id}
                  className="rounded-3xl border border-gray-200 p-6 hover:border-gray-300 transition-colors"
                >
                  {/* Header with service and status */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {booking.services?.title || "Service"}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {booking.services?.category || "Catégorie"}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${statusColor.bg} ${statusColor.text}`}
                    >
                      {STATUS_LABELS[booking.status]}
                    </span>
                  </div>

                  {/* Other party info */}
                  {otherParty && (
                    <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
                      {otherParty.avatar_url ? (
                        <Image
                          src={otherParty.avatar_url}
                          alt={otherParty.first_name}
                          width={40}
                          height={40}
                          className="rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-600">
                            {otherParty.first_name.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-gray-900">
                          {otherParty.first_name}{" "}
                          {otherParty.last_name || ""}
                        </p>
                        <p className="text-sm text-gray-600">
                          {isProvider(booking) ? "Client" : "Prestataire"}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Date and time */}
                  <div className="mb-4 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase">
                        Début
                      </p>
                      <p className="text-sm text-gray-900 mt-1">
                        {formatDate(booking.slot_start)}
                      </p>
                      <p className="text-sm text-gray-600">
                        {formatTime(booking.slot_start)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase">
                        Fin
                      </p>
                      <p className="text-sm text-gray-900 mt-1">
                        {formatDate(booking.slot_end)}
                      </p>
                      <p className="text-sm text-gray-600">
                        {formatTime(booking.slot_end)}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  {booking.description && (
                    <div className="mb-4 pb-4 border-b border-gray-100">
                      <p className="text-xs font-medium text-gray-500 uppercase">
                        Notes
                      </p>
                      <p className="text-sm text-gray-700 mt-2">
                        {booking.description}
                      </p>
                    </div>
                  )}

                  {/* Cancellation reason */}
                  {booking.status === "cancelled" && booking.cancellation_reason && (
                    <div className="mb-4 pb-4 border-b border-gray-100">
                      <p className="text-xs font-medium text-gray-500 uppercase">
                        Raison de l'annulation
                      </p>
                      <p className="text-sm text-gray-700 mt-2">
                        {booking.cancellation_reason}
                      </p>
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="flex gap-3">
                    {booking.status === "pending" && isProvider(booking) && (
                      <>
                        <button
                          onClick={() =>
                            updateBookingStatus(booking.id, "confirmed")
                          }
                          disabled={actionLoading[booking.id]}
                          className="flex-1 px-4 py-2 bg-[#81B29A] text-white rounded-2xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                        >
                          {actionLoading[booking.id]
                            ? "Chargement..."
                            : "Accepter"}
                        </button>
                        <button
                          onClick={() =>
                            updateBookingStatus(booking.id, "cancelled")
                          }
                          disabled={actionLoading[booking.id]}
                          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-2xl font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                          {actionLoading[booking.id]
                            ? "Chargement..."
                            : "Refuser"}
                        </button>
                      </>
                    )}

                    {booking.status === "pending" && isClient(booking) && (
                      <button
                        onClick={() =>
                          updateBookingStatus(booking.id, "cancelled")
                        }
                        disabled={actionLoading[booking.id]}
                        className="flex-1 px-4 py-2 border border-red-300 text-red-700 rounded-2xl font-medium hover:bg-red-50 transition-colors disabled:opacity-50"
                      >
                        {actionLoading[booking.id]
                          ? "Chargement..."
                          : "Annuler"}
                      </button>
                    )}

                    {["confirmed", "in_progress"].includes(booking.status) && (
                      <>
                        {isProvider(booking) && (
                          <button
                            onClick={() =>
                              updateBookingStatus(booking.id, "completed")
                            }
                            disabled={actionLoading[booking.id]}
                            className="flex-1 px-4 py-2 bg-[#81B29A] text-white rounded-2xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                          >
                            {actionLoading[booking.id]
                              ? "Chargement..."
                              : "Marquer terminée"}
                          </button>
                        )}
                        <button
                          onClick={() =>
                            updateBookingStatus(booking.id, "cancelled")
                          }
                          disabled={actionLoading[booking.id]}
                          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-2xl font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                          {actionLoading[booking.id]
                            ? "Chargement..."
                            : "Annuler"}
                        </button>
                      </>
                    )}

                    {booking.status === "completed" && (
                      <button
                        onClick={() => router.push(`/dashboard/reviews?booking=${booking.id}`)}
                        className="flex-1 px-4 py-2 bg-[#E07A5F] text-white rounded-2xl font-medium hover:opacity-90 transition-opacity"
                      >
                        Laisser un avis
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
