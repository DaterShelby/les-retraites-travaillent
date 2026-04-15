"use client";

import { Database } from "@/types/database";
import { StatCard } from "./stat-card";
import { Button } from "@/components/ui/button";
import { Calendar, MessageCircle, Heart, Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

interface ClientDashboardProps {
  profile: Database["public"]["Tables"]["user_profiles"]["Row"];
}

interface ClientStats {
  activeBookings: number;
  upcomingServices: number;
  unreadMessages: number;
  favorites: number;
}

export function ClientDashboard({ profile }: ClientDashboardProps) {
  const [stats, setStats] = useState<ClientStats>({
    activeBookings: 0,
    upcomingServices: 0,
    unreadMessages: 0,
    favorites: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const supabase = createBrowserSupabaseClient();

        // Fetch active bookings
        const { data: bookings } = await supabase
          .from("bookings")
          .select("id")
          .eq("client_id", profile.id)
          .in("status", ["pending", "confirmed", "in_progress"]);

        // Fetch unread messages
        const { data: messages } = await supabase
          .from("messages")
          .select("id")
          .is("read_at", null);

        setStats({
          activeBookings: bookings?.length || 0,
          upcomingServices: 0,
          unreadMessages: messages?.length || 0,
          favorites: 0,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, [profile.id]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif font-bold text-primary mb-2">
            Bienvenue, {profile.first_name}!
          </h1>
          <p className="text-body text-gray-600">
            Trouvez et gérez les services dont vous avez besoin
          </p>
        </div>
        <Link href="/search">
          <Button className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Chercher un service
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Réservations actives"
          value={stats.activeBookings}
          subtitle="En attente ou confirmées"
          icon={<Calendar className="w-6 h-6" />}
          variant="default"
        />
        <StatCard
          title="Services à venir"
          value={stats.upcomingServices}
          subtitle="Prochaines réservations"
          icon={<Calendar className="w-6 h-6" />}
          variant="success"
        />
        <StatCard
          title="Messages"
          value={stats.unreadMessages}
          subtitle="Non lus"
          icon={<MessageCircle className="w-6 h-6" />}
          variant="info"
        />
        <StatCard
          title="Favoris"
          value={stats.favorites}
          subtitle="Services sauvegardés"
          icon={<Heart className="w-6 h-6" />}
          variant="warning"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="font-serif font-bold text-primary mb-4">Réservations en cours</h2>
          <p className="text-body text-gray-500 mb-4">
            {stats.activeBookings === 0
              ? "Vous n'avez pas de réservations actives"
              : `Vous avez ${stats.activeBookings} réservation(s)`}
          </p>
          <Link href="/dashboard/bookings">
            <Button variant="outline" className="w-full">
              Gérer les réservations
            </Button>
          </Link>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="font-serif font-bold text-primary mb-4">Services populaires</h2>
          <p className="text-body text-gray-500 mb-4">Découvrez les services les plus réservés près de vous</p>
          <Link href="/search">
            <Button variant="outline" className="w-full">
              Voir les services
            </Button>
          </Link>
        </div>
      </div>

      {/* Suggestions */}
      <div className="bg-amber-50 border-l-4 border-secondary rounded-lg p-6">
        <h2 className="font-serif font-bold text-primary mb-4">Suggestions pour vous</h2>
        <ul className="space-y-2">
          <li className="flex items-start gap-2 text-body text-gray-700">
            <span className="text-secondary mt-0.5">•</span>
            <span>Consultez les services près de {profile.city || "votre lieu"}</span>
          </li>
          <li className="flex items-start gap-2 text-body text-gray-700">
            <span className="text-secondary mt-0.5">•</span>
            <span>Affinez vos recherches avec les filtres avancés</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
