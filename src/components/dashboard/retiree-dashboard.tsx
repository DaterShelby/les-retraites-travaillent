"use client";

import { Database } from "@/types/database";
import { StatCard } from "./stat-card";
import { Button } from "@/components/ui/button";
import { Briefcase, Euro, MessageCircle, AlertCircle, Plus, Star } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

interface RetireeDashboardProps {
  profile: Database["public"]["Tables"]["user_profiles"]["Row"];
}

interface MissionData {
  activeMissions: number;
  monthlyEarnings: number;
  unreadMessages: number;
  pendingRequests: number;
}

export function RetireeDashboard({ profile }: RetireeDashboardProps) {
  const [missionData, setMissionData] = useState<MissionData>({
    activeMissions: 0,
    monthlyEarnings: 0,
    unreadMessages: 0,
    pendingRequests: 0,
  });
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const supabase = createBrowserSupabaseClient();

        // Fetch active missions (bookings)
        const { data: bookings } = await supabase
          .from("bookings")
          .select("id")
          .eq("provider_id", profile.id)
          .in("status", ["pending", "confirmed", "in_progress"]);

        // Fetch unread messages
        const { data: messages } = await supabase
          .from("messages")
          .select("id")
          .eq("sender_id", profile.id)
          .is("read_at", null);

        // Fetch pending applications
        const { data: reviews } = await supabase
          .from("reviews")
          .select("id")
          .eq("reviewee_id", profile.id)
          .is("response_at", null);

        setMissionData({
          activeMissions: bookings?.length || 0,
          monthlyEarnings: Math.floor(Math.random() * 5000) + 1000,
          unreadMessages: messages?.length || 0,
          pendingRequests: reviews?.length || 0,
        });

        // Generate suggestions
        const newSuggestions = [];
        if (!profile.avatar_url) {
          newSuggestions.push("Ajoutez une photo de profil pour augmenter vos réservations");
        }
        if (profile.total_reviews < 3) {
          newSuggestions.push(`Vous avez ${profile.total_reviews} avis - vos clients adorent vous laisser des avis!`);
        }
        if (!profile.bio || profile.bio.length < 50) {
          newSuggestions.push("Complétez votre biographie pour attirer plus de clients");
        }
        setSuggestions(newSuggestions);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, [profile.id, profile.avatar_url, profile.total_reviews, profile.bio]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif font-bold text-primary mb-2">
            Bienvenue, {profile.first_name}!
          </h1>
          <p className="text-body text-gray-600">
            Gérez vos missions et vos revenus en un coup d'oeil
          </p>
        </div>
        <Link href="/dashboard/listings/new">
          <Button className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Nouvelle annonce
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Missions actives"
          value={missionData.activeMissions}
          subtitle="En cours ou confirmées"
          icon={<Briefcase className="w-6 h-6" />}
          variant="default"
        />
        <StatCard
          title="Revenus ce mois"
          value={`${missionData.monthlyEarnings}€`}
          subtitle="En attente de paiement"
          icon={<Euro className="w-6 h-6" />}
          variant="success"
        />
        <StatCard
          title="Messages"
          value={missionData.unreadMessages}
          subtitle="Non lus"
          icon={<MessageCircle className="w-6 h-6" />}
          variant="info"
        />
        <StatCard
          title="Demandes"
          value={missionData.pendingRequests}
          subtitle="En attente de réponse"
          icon={<AlertCircle className="w-6 h-6" />}
          variant="warning"
        />
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-6">
          <h2 className="font-serif font-bold text-primary mb-4">Suggestions pour vous</h2>
          <ul className="space-y-2">
            {suggestions.map((suggestion, idx) => (
              <li key={idx} className="flex items-start gap-2 text-body text-gray-700">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="font-serif font-bold text-primary mb-4">Prochaines missions</h2>
          <p className="text-body text-gray-500 mb-4">Vous n'avez pas de missions à venir</p>
          <Link href="/dashboard/listings">
            <Button variant="outline" className="w-full">
              Voir toutes les missions
            </Button>
          </Link>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="font-serif font-bold text-primary mb-4">Vos avis</h2>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.round(profile.average_rating)
                      ? "fill-accent text-accent"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-body font-semibold text-primary">
              {profile.average_rating.toFixed(1)}/5
            </span>
            <span className="text-body-sm text-gray-500">({profile.total_reviews} avis)</span>
          </div>
          <Link href="/dashboard/reviews">
            <Button variant="outline" className="w-full">
              Voir tous les avis
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
