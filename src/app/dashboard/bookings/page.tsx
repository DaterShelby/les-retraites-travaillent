"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Calendar, Clock, Star, Trash2 } from "lucide-react";

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

const STATUS_COLORS: Record<string, { bg: string; text: string; accent: string }> = {
  pending: { bg: "bg-yellow-50", text: "text-yellow-700", accent: "from-yellow-100 to-yellow-50" },
  confirmed: { bg: "bg-blue-50", text: "text-blue-700", accent: "from-blue-100 to-blue-50" },
  in_progress: { bg: "bg-purple-50", text: "text-purple-700", accent: "from-purple-100 to-purple-50" },
  completed: { bg: "bg-green-50", text: "text-green-700", accent: "from-green-100 to-green-50" },
  cancelled: { bg: "bg-gray-50", text: "text-gray-700", accent: "from-gray-100 to-gray-50" },
  disputed: { bg: "bg-red-50", text: "text-red-700", accent: "from-red-100 to-red-50" },
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
      <div className="space-y-4">
        <div className="h-12 rounded-2xl bg-gray-200 animate-pulse" />
        <div className="grid grid-cols-4 gap-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-10 rounded-2xl bg-gray-100 animate-pulse" />
          ))}
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-40 rounded-3xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-serif font-bold text-gray-900">
          Mes réservations
        </h1>
        <p className="text-gray-600 mt-2">
          Suivez vos réservations en cours et passées
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200">
          <p className="text-red-700 font-medium">{error}</p>
        </div>
      )}

      {/* Pill Tabs */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {TABS.map((tab) => {
          const count = bookings.filter((b) =>
            tab.filter.includes(b.status)
          ).length;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-2xl font-medium text-sm transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-[#CC8800] to-[#A66E00] text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {tab.label} {count > 0 && <span className="ml-1 font-bold">({count})</span>}
            </button>
          );
        })}
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <EmptyState activeTab={activeTab} />
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => {
            const otherParty = getOtherParty(booking);
            const statusColor = STATUS_COLORS[booking.status] || { bg: "bg-gray-50", text: "text-gray-700", accent: "from-gray-100 to-gray-50" };

            return (
              <div
                key={booking.id}
                className="rounded-3xl bg-white border border-gray-100 hover:border-gray-200 transition-all hover:shadow-md overflow-hidden"
              >
                {/* Status Bar */}
                <div className={`h-1 bg-gradient-to-r ${statusColor.accent}`} />

                <div className="p-6">
                  {/* Header Row */}
                  <div className="flex items-start justify-between mb-5">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {booking.services?.title || "Service"}
                      </h3>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">
                        {booking.services?.category || "Catégorie"}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor.bg} ${statusColor.text}`}>
                      {STATUS_LABELS[booking.status]}
                    </span>
                  </div>

                  {/* Other Party Info */}
                  {otherParty && (
                    <div className="flex items-center gap-4 mb-5 pb-5 border-b border-gray-100">
                      {otherParty.avatar_url ? (
                        <Image
                          src={otherParty.avatar_url}
                          alt={otherParty.first_name}
                          width={44}
                          height={44}
                          className="w-11 h-11 rounded-2xl object-cover"
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#CC8800] to-[#38761D] flex items-center justify-center text-white font-semibold">
                          {otherParty.first_name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">
                          {otherParty.first_name}{" "}
                          {otherParty.last_name || ""}
                        </p>
                        <p className="text-xs text-gray-500">
                          {isProvider(booking) ? "Client" : "Prestataire"}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Date & Time Pills */}
                  <div className="flex gap-4 mb-5 flex-wrap">
                    <div className="rounded-2xl bg-gray-50 px-4 py-3 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Début</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {formatDate(booking.slot_start)}
                        </p>
                      </div>
                    </div>
                    <div className="rounded-2xl bg-gray-50 px-4 py-3 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Heure</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {formatTime(booking.slot_start)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  {booking.description && (
                    <div className="mb-5 pb-5 border-b border-gray-100">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                        Notes
                      </p>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {booking.description}
                      </p>
                    </div>
                  )}

                  {/* Cancellation reason */}
                  {booking.status === "cancelled" && booking.cancellation_reason && (
                    <div className="mb-5 pb-5 border-b border-gray-100">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                        Raison de l'annulation
                      </p>
                      <p className="text-sm text-gray-700">
                        {booking.cancellation_reason}
                      </p>
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="flex gap-3 flex-wrap">
                    {booking.status === "pending" && isProvider(booking) && (
                      <>
                        <button
                          onClick={() =>
                            updateBookingStatus(booking.id, "confirmed")
                          }
                          disabled={actionLoading[booking.id]}
                          className="flex-1 min-w-32 px-4 py-2.5 bg-gradient-to-r from-[#38761D] to-[#6fa086] text-white rounded-2xl font-semibold hover:shadow-md transition-all disabled:opacity-50 text-sm"
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
                          className="flex-1 min-w-32 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-2xl font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50 text-sm"
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
                        className="flex-1 px-4 py-2.5 border border-red-300 text-red-700 rounded-2xl font-semibold hover:bg-red-50 transition-colors disabled:opacity-50 text-sm"
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
                            className="flex-1 min-w-32 px-4 py-2.5 bg-gradient-to-r from-[#38761D] to-[#6fa086] text-white rounded-2xl font-semibold hover:shadow-md transition-all disabled:opacity-50 text-sm"
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
                          className="flex-1 min-w-32 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-2xl font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50 text-sm"
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
                        className="flex-1 px-4 py-2.5 bg-gradient-to-r from-[#CC8800] to-[#A66E00] text-white rounded-2xl font-semibold hover:shadow-md transition-all text-sm flex items-center justify-center gap-2"
                      >
                        <Star className="w-4 h-4" />
                        Laisser un avis
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function EmptyState({ activeTab }: { activeTab: TabType }) {
  const emptyMessages: Record<TabType, { title: string; subtitle: string; icon: string }> = {
    pending: {
      title: "Aucune réservation en attente",
      subtitle: "Les réservations que vous attendez s'afficheront ici",
      icon: "🕐",
    },
    confirmed: {
      title: "Aucune réservation confirmée",
      subtitle: "Vous n'avez pas encore de réservations en cours",
      icon: "✓",
    },
    completed: {
      title: "Aucune réservation terminée",
      subtitle: "Vos réservations complétées apparaîtront ici",
      icon: "✨",
    },
    cancelled: {
      title: "Aucune réservation annulée",
      subtitle: "C'est bon signe! Pas d'annulations pour le moment",
      icon: "🎯",
    },
  };

  const message = emptyMessages[activeTab];

  return (
    <div className="rounded-3xl bg-gradient-to-b from-[#F5F2EE] to-white border border-gray-100 p-12 md:p-16 text-center">
      <div className="text-5xl mb-4">{message.icon}</div>
      <h3 className="text-2xl font-serif font-bold text-gray-900 mb-2">
        {message.title}
      </h3>
      <p className="text-gray-600 mb-6">
        {message.subtitle}
      </p>
      <div className="inline-block">
        <svg
          viewBox="0 0 200 100"
          className="w-32 h-16 opacity-10 mx-auto"
        >
          <rect
            x="20"
            y="20"
            width="160"
            height="60"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            rx="8"
          />
          <line x1="50" y1="35" x2="150" y2="35" stroke="currentColor" strokeWidth="1" />
          <line x1="50" y1="50" x2="150" y2="50" stroke="currentColor" strokeWidth="1" />
          <line x1="50" y1="65" x2="120" y2="65" stroke="currentColor" strokeWidth="1" />
        </svg>
      </div>
    </div>
  );
}
