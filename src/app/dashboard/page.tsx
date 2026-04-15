"use client";

import { useAuth } from "@/hooks/use-auth";
import { useProfile } from "@/hooks/use-profile";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  BarChart3,
  Clock,
  FileText,
  Plus,
  TrendingUp,
  Users,
  MessageSquare,
  Bell,
} from "lucide-react";

interface DashboardStats {
  servicesCount: number;
  bookingsCount: number;
  messagesCount: number;
  notificationsCount: number;
  favoritesCount: number;
  offersCount: number;
  applicationsCount: number;
}

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const [stats, setStats] = useState<DashboardStats>({
    servicesCount: 0,
    bookingsCount: 0,
    messagesCount: 0,
    notificationsCount: 0,
    favoritesCount: 0,
    offersCount: 0,
    applicationsCount: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const supabase = createClient();

  // Fetch dashboard statistics
  useEffect(() => {
    const fetchStats = async () => {
      if (!user?.id) {
        setStatsLoading(false);
        return;
      }

      try {
        setStatsLoading(true);
        const newStats: DashboardStats = {
          servicesCount: 0,
          bookingsCount: 0,
          messagesCount: 0,
          notificationsCount: 0,
          favoritesCount: 0,
          offersCount: 0,
          applicationsCount: 0,
        };

        // Count services (for retiree)
        const { count: servicesCount } = await supabase
          .from("services")
          .select("id", { count: "exact", head: true })
          .eq("provider_id", user.id)
          .eq("status", "published");
        newStats.servicesCount = servicesCount || 0;

        // Count bookings (provider perspective)
        const { count: bookingsCount } = await supabase
          .from("bookings")
          .select("id", { count: "exact", head: true })
          .eq("provider_id", user.id);
        newStats.bookingsCount = bookingsCount || 0;

        // Count unread messages
        const { count: messagesCount } = await supabase
          .from("messages")
          .select("id", { count: "exact", head: true })
          .is("read_at", null);
        newStats.messagesCount = messagesCount || 0;

        // Count unread notifications
        const { count: notificationsCount } = await supabase
          .from("notifications")
          .select("id", { count: "exact", head: true })
          .eq("user_id", user.id)
          .is("read_at", null);
        newStats.notificationsCount = notificationsCount || 0;

        setStats(newStats);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setStatsLoading(false);
      }
    };

    if (!authLoading && !profileLoading) {
      fetchStats();
    }
  }, [user?.id, authLoading, profileLoading, supabase]);

  const isLoading = authLoading || profileLoading || statsLoading;
  const firstName = profile?.first_name || user?.email?.split("@")[0] || "utilisateur";
  const userRole = profile?.role || "retiree";

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a1a2e] mx-auto mb-4"></div>
          <p className="text-gray-500">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Accès refusé</h2>
          <p className="text-gray-500 mb-6">Vous devez être connecté pour accéder au tableau de bord</p>
          <Link href="/login">
            <Button>Se connecter</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold font-serif text-gray-900 mb-2">
          Bienvenue, {firstName}!
        </h1>
        <p className="text-gray-500 text-base sm:text-lg">
          {userRole === "retiree" && "Gérez vos annonces et services"}
          {userRole === "client" && "Découvrez nos services et réservez"}
          {userRole === "company" && "Publiez vos offres et recrutez"}
        </p>
      </div>

      {/* Role-based Dashboard */}
      {userRole === "retiree" && <RetireeDashboard stats={stats} />}
      {userRole === "client" && <ClientDashboard stats={stats} />}
      {userRole === "company" && <CompanyDashboard stats={stats} />}
    </div>
  );
}

interface DashboardComponentProps {
  stats: DashboardStats;
}

function RetireeDashboard({ stats }: DashboardComponentProps) {
  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Create Listing */}
        <Card className="rounded-3xl p-6 hover:shadow-lg transition-shadow bg-white border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-[#1a1a2e]/10 p-3 rounded-2xl">
              <Plus className="w-6 h-6 text-[#1a1a2e]" />
            </div>
            <span className="text-sm font-medium text-[#1a1a2e]">Nouveau</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Créer une annonce</h3>
          <p className="text-sm text-gray-500 mb-4">
            Publiez un nouveau service pour trouver des clients
          </p>
          <Link href="/dashboard/listings/create">
            <Button variant="outline" size="sm" className="w-full rounded-2xl">
              Créer une annonce
            </Button>
          </Link>
        </Card>

        {/* Active Services */}
        <Card className="rounded-3xl p-6 hover:shadow-lg transition-shadow bg-white border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-[#1a1a2e]/10 p-3 rounded-2xl">
              <FileText className="w-6 h-6 text-[#1a1a2e]" />
            </div>
            <span className="text-sm font-medium text-gray-600">{stats.servicesCount}</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Annonces actives</h3>
          <p className="text-sm text-gray-500 mb-4">
            {stats.servicesCount === 0
              ? "Aucune annonce en ligne"
              : `Vous avez ${stats.servicesCount} annonce${stats.servicesCount > 1 ? "s" : ""} en ligne`}
          </p>
          <Link href="/dashboard/listings">
            <Button variant="outline" size="sm" className="w-full rounded-2xl">
              Voir mes annonces
            </Button>
          </Link>
        </Card>

        {/* Bookings */}
        <Card className="rounded-3xl p-6 hover:shadow-lg transition-shadow bg-white border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-[#1a1a2e]/10 p-3 rounded-2xl">
              <Clock className="w-6 h-6 text-[#1a1a2e]" />
            </div>
            <span className="text-sm font-medium text-gray-600">{stats.bookingsCount}</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Réservations</h3>
          <p className="text-sm text-gray-500 mb-4">
            {stats.bookingsCount === 0
              ? "Aucune réservation"
              : `Vous avez ${stats.bookingsCount} réservation${stats.bookingsCount > 1 ? "s" : ""}`}
          </p>
          <Link href="/dashboard/bookings">
            <Button variant="outline" size="sm" className="w-full rounded-2xl">
              Voir les réservations
            </Button>
          </Link>
        </Card>

        {/* Messages */}
        <Card className="rounded-3xl p-6 hover:shadow-lg transition-shadow bg-white border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-[#1a1a2e]/10 p-3 rounded-2xl">
              <MessageSquare className="w-6 h-6 text-[#1a1a2e]" />
            </div>
            <span className="text-sm font-medium text-gray-600">{stats.messagesCount}</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Messages</h3>
          <p className="text-sm text-gray-500 mb-4">
            {stats.messagesCount === 0
              ? "Aucun message non lu"
              : `${stats.messagesCount} message${stats.messagesCount > 1 ? "s" : ""} non lu${stats.messagesCount > 1 ? "s" : ""}`}
          </p>
          <Link href="/dashboard/messages">
            <Button variant="outline" size="sm" className="w-full rounded-2xl">
              Voir les messages
            </Button>
          </Link>
        </Card>

        {/* Notifications */}
        <Card className="rounded-3xl p-6 hover:shadow-lg transition-shadow bg-white border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-[#1a1a2e]/10 p-3 rounded-2xl">
              <Bell className="w-6 h-6 text-[#1a1a2e]" />
            </div>
            <span className="text-sm font-medium text-gray-600">{stats.notificationsCount}</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Notifications</h3>
          <p className="text-sm text-gray-500 mb-4">
            {stats.notificationsCount === 0
              ? "Aucune notification"
              : `${stats.notificationsCount} notification${stats.notificationsCount > 1 ? "s" : ""} non lue${stats.notificationsCount > 1 ? "s" : ""}`}
          </p>
          <Link href="/dashboard/notifications">
            <Button variant="outline" size="sm" className="w-full rounded-2xl">
              Voir les notifications
            </Button>
          </Link>
        </Card>

        {/* Analytics */}
        <Card className="rounded-3xl p-6 hover:shadow-lg transition-shadow bg-white border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-[#1a1a2e]/10 p-3 rounded-2xl">
              <TrendingUp className="w-6 h-6 text-[#1a1a2e]" />
            </div>
            <span className="text-sm font-medium text-[#1a1a2e]">Suivi</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Performance</h3>
          <p className="text-sm text-gray-500 mb-4">
            Consultez vos statistiques et votre engagement
          </p>
          <Link href="/dashboard/analytics">
            <Button variant="outline" size="sm" className="w-full rounded-2xl">
              Voir la performance
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}

function ClientDashboard({ stats }: DashboardComponentProps) {
  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Active Bookings */}
        <Card className="rounded-3xl p-6 hover:shadow-lg transition-shadow bg-white border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-[#1a1a2e]/10 p-3 rounded-2xl">
              <FileText className="w-6 h-6 text-[#1a1a2e]" />
            </div>
            <span className="text-sm font-medium text-gray-600">{stats.bookingsCount}</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Réservations actives</h3>
          <p className="text-sm text-gray-500 mb-4">
            {stats.bookingsCount === 0
              ? "Aucune réservation en cours"
              : `Vous avez ${stats.bookingsCount} réservation${stats.bookingsCount > 1 ? "s" : ""} en cours`}
          </p>
          <Link href="/dashboard/bookings">
            <Button variant="outline" size="sm" className="w-full rounded-2xl">
              Voir les réservations
            </Button>
          </Link>
        </Card>

        {/* Favorites */}
        <Card className="rounded-3xl p-6 hover:shadow-lg transition-shadow bg-white border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-[#1a1a2e]/10 p-3 rounded-2xl">
              <TrendingUp className="w-6 h-6 text-[#1a1a2e]" />
            </div>
            <span className="text-sm font-medium text-gray-600">{stats.favoritesCount}</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Services favoris</h3>
          <p className="text-sm text-gray-500 mb-4">
            {stats.favoritesCount === 0
              ? "Aucun favori sauvegardé"
              : `Vous avez ${stats.favoritesCount} service${stats.favoritesCount > 1 ? "s" : ""} en favoris`}
          </p>
          <Link href="/dashboard/favorites">
            <Button variant="outline" size="sm" className="w-full rounded-2xl">
              Voir mes favoris
            </Button>
          </Link>
        </Card>

        {/* Browse Services */}
        <Card className="rounded-3xl p-6 hover:shadow-lg transition-shadow bg-white border border-gray-100 md:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-[#1a1a2e]/10 p-3 rounded-2xl">
              <Plus className="w-6 h-6 text-[#1a1a2e]" />
            </div>
            <span className="text-sm font-medium text-[#1a1a2e]">Explorer</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Explorer les services</h3>
          <p className="text-sm text-gray-500 mb-4">
            Découvrez de nouveaux services correspondant à vos besoins
          </p>
          <Link href="/services">
            <Button variant="outline" size="sm" className="w-full rounded-2xl">
              Parcourir la marketplace
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}

function CompanyDashboard({ stats }: DashboardComponentProps) {
  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Create Offer */}
        <Card className="rounded-3xl p-6 hover:shadow-lg transition-shadow bg-white border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-[#1a1a2e]/10 p-3 rounded-2xl">
              <Plus className="w-6 h-6 text-[#1a1a2e]" />
            </div>
            <span className="text-sm font-medium text-[#1a1a2e]">Nouveau</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Créer une offre</h3>
          <p className="text-sm text-gray-500 mb-4">
            Publiez une nouvelle offre d'emploi
          </p>
          <Link href="/dashboard/offers/create">
            <Button variant="outline" size="sm" className="w-full rounded-2xl">
              Créer une offre
            </Button>
          </Link>
        </Card>

        {/* Active Offers */}
        <Card className="rounded-3xl p-6 hover:shadow-lg transition-shadow bg-white border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-[#1a1a2e]/10 p-3 rounded-2xl">
              <FileText className="w-6 h-6 text-[#1a1a2e]" />
            </div>
            <span className="text-sm font-medium text-gray-600">{stats.offersCount}</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Offres actives</h3>
          <p className="text-sm text-gray-500 mb-4">
            {stats.offersCount === 0
              ? "Aucune offre publiée"
              : `Vous avez ${stats.offersCount} offre${stats.offersCount > 1 ? "s" : ""} publiée${stats.offersCount > 1 ? "s" : ""}`}
          </p>
          <Link href="/dashboard/offers">
            <Button variant="outline" size="sm" className="w-full rounded-2xl">
              Voir mes offres
            </Button>
          </Link>
        </Card>

        {/* Applications */}
        <Card className="rounded-3xl p-6 hover:shadow-lg transition-shadow bg-white border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-[#1a1a2e]/10 p-3 rounded-2xl">
              <Users className="w-6 h-6 text-[#1a1a2e]" />
            </div>
            <span className="text-sm font-medium text-gray-600">{stats.applicationsCount}</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Candidatures</h3>
          <p className="text-sm text-gray-500 mb-4">
            {stats.applicationsCount === 0
              ? "Aucune candidature"
              : `Vous avez ${stats.applicationsCount} candidature${stats.applicationsCount > 1 ? "s" : ""} en attente`}
          </p>
          <Link href="/dashboard/applications">
            <Button variant="outline" size="sm" className="w-full rounded-2xl">
              Voir les candidatures
            </Button>
          </Link>
        </Card>

        {/* Analytics */}
        <Card className="rounded-3xl p-6 hover:shadow-lg transition-shadow bg-white border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-[#1a1a2e]/10 p-3 rounded-2xl">
              <BarChart3 className="w-6 h-6 text-[#1a1a2e]" />
            </div>
            <span className="text-sm font-medium text-[#1a1a2e]">Suivi</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Statistiques</h3>
          <p className="text-sm text-gray-500 mb-4">
            Consultez vos statistiques et engagement
          </p>
          <Link href="/dashboard/stats">
            <Button variant="outline" size="sm" className="w-full rounded-2xl">
              Voir les stats
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}
