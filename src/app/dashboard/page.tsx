"use client";

import { useAuth } from "@/hooks/use-auth";
import { useProfile } from "@/hooks/use-profile";
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
  CheckCircle2,
  Circle,
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
      <div className="space-y-6">
        {/* Hero Skeleton */}
        <div className="h-40 rounded-3xl bg-gradient-to-r from-gray-200 to-gray-100 animate-pulse" />

        {/* Stats Skeleton */}
        <div className="grid grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-20 rounded-2xl bg-gray-100 animate-pulse"
            />
          ))}
        </div>

        {/* Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              className="h-48 rounded-3xl bg-gray-100 animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md">
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-3">
            Accès refusé
          </h2>
          <p className="text-gray-600 mb-6 text-lg">
            Vous devez être connecté pour accéder au tableau de bord
          </p>
          <Link
            href="/login"
            className="inline-block px-8 py-3 rounded-2xl bg-gradient-to-r from-[#CC8800] to-[#A66E00] text-white font-semibold hover:shadow-lg transition-shadow"
          >
            Se connecter
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero Welcome Card */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#2C3E50] via-[#253544] to-[#2C3E50] p-8 md:p-12 text-white shadow-lg">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48 blur-3xl" />

        <div className="relative z-10">
          <p className="text-white/70 text-sm font-medium mb-2">
            {userRole === "retiree" && "Bienvenue,"}
            {userRole === "client" && "Bienvenue,"}
            {userRole === "company" && "Bienvenue,"}
          </p>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-2">
            {firstName}
          </h1>
          <p className="text-white/80 text-lg mb-6">
            {userRole === "retiree" && "Partagez vos compétences et gagnez en bonne compagnie"}
            {userRole === "client" && "Découvrez les meilleurs services et réservez en confiance"}
            {userRole === "company" && "Trouvez les talents parfaits pour votre équipe"}
          </p>

          {/* Profile Completion */}
          <div className="flex items-center gap-3">
            <div className="w-32 h-2 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#CC8800] to-[#38761D] transition-all"
                style={{
                  width: profile?.avatar_url ? "75%" : "50%",
                }}
              />
            </div>
            <span className="text-sm text-white/70">
              {profile?.avatar_url ? "75%" : "50%"} complet
            </span>
          </div>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-2xl bg-white border border-gray-100 p-4 text-center hover:border-gray-200 transition-colors">
          <div className="text-2xl font-bold text-[#2C3E50] mb-1">
            {stats.servicesCount}
          </div>
          <div className="text-xs text-gray-600">Services</div>
        </div>
        <div className="rounded-2xl bg-white border border-gray-100 p-4 text-center hover:border-gray-200 transition-colors">
          <div className="text-2xl font-bold text-[#2C3E50] mb-1">
            {stats.bookingsCount}
          </div>
          <div className="text-xs text-gray-600">Réservations</div>
        </div>
        <div className="rounded-2xl bg-white border border-gray-100 p-4 text-center hover:border-gray-200 transition-colors">
          <div className="text-2xl font-bold text-[#2C3E50] mb-1">
            {stats.messagesCount}
          </div>
          <div className="text-xs text-gray-600">Messages</div>
        </div>
        <div className="rounded-2xl bg-white border border-gray-100 p-4 text-center hover:border-gray-200 transition-colors">
          <div className="text-2xl font-bold text-[#2C3E50] mb-1">
            {stats.notificationsCount}
          </div>
          <div className="text-xs text-gray-600">Notifs</div>
        </div>
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
  const completionSteps = [
    { done: true, label: "Compte créé" },
    { done: !!stats.servicesCount, label: "Profil complété" },
    { done: !!stats.bookingsCount, label: "Première annonce" },
    { done: !!stats.bookingsCount, label: "Première réservation" },
  ];
  const doneCount = completionSteps.filter((s) => s.done).length;

  return (
    <div className="space-y-6">
      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Create Listing - Hero */}
        <Link href="/dashboard/listings/create">
          <div className="group rounded-3xl bg-gradient-to-br from-[#CC8800] to-[#A66E00] p-8 text-white hover:shadow-xl transition-all duration-300 cursor-pointer h-full">
            <div className="mb-4 p-4 rounded-2xl bg-white/20 w-fit">
              <Plus className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-2xl font-bold mb-2">
              Créer une annonce
            </h3>
            <p className="text-white/90 text-sm mb-6 leading-relaxed">
              Partagez vos compétences et trouvez votre prochain client
            </p>
            <div className="flex items-center gap-2 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
              Commencer <span className="text-lg">→</span>
            </div>
          </div>
        </Link>

        {/* Explore Services */}
        <Link href="/dashboard/bookings">
          <div className="group rounded-3xl bg-gradient-to-br from-[#38761D] to-[#6fa086] p-8 text-white hover:shadow-xl transition-all duration-300 cursor-pointer h-full">
            <div className="mb-4 p-4 rounded-2xl bg-white/20 w-fit">
              <Clock className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-2xl font-bold mb-2">
              Mes réservations
            </h3>
            <p className="text-white/90 text-sm mb-6 leading-relaxed">
              Suivi de {stats.bookingsCount} réservation{stats.bookingsCount !== 1 ? "s" : ""}
            </p>
            <div className="flex items-center gap-2 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
              Voir les détails <span className="text-lg">→</span>
            </div>
          </div>
        </Link>
      </div>

      {/* Onboarding Checklist or Recent Activity */}
      {doneCount < 4 ? (
        <div className="rounded-3xl bg-white border border-gray-100 p-6 shadow-sm">
          <h2 className="font-serif text-xl font-bold text-gray-900 mb-6">
            Complétez votre profil
          </h2>
          <div className="space-y-4">
            {completionSteps.map((step, idx) => (
              <div key={idx} className="flex items-center gap-3">
                {step.done ? (
                  <CheckCircle2 className="w-5 h-5 text-[#38761D]" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-300" />
                )}
                <span
                  className={
                    step.done ? "text-gray-900 font-medium" : "text-gray-500"
                  }
                >
                  {step.label}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-6 border-t border-gray-100">
            <Link
              href="/dashboard/settings/profile"
              className="inline-block px-6 py-2 rounded-2xl bg-gradient-to-r from-[#CC8800] to-[#A66E00] text-white font-semibold text-sm hover:shadow-md transition-shadow"
            >
              Continuer mon profil
            </Link>
          </div>
        </div>
      ) : null}

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/dashboard/listings">
          <div className="rounded-2xl border border-gray-100 p-5 hover:border-gray-200 transition-colors cursor-pointer h-full">
            <div className="flex items-start justify-between mb-3">
              <FileText className="w-6 h-6 text-[#2C3E50]" />
              <span className="text-2xl font-bold text-[#2C3E50]">
                {stats.servicesCount}
              </span>
            </div>
            <h3 className="font-semibold text-gray-900">Annonces actives</h3>
            <p className="text-sm text-gray-600 mt-1">
              Gérez vos annonces en ligne
            </p>
          </div>
        </Link>

        <Link href="/dashboard/messages">
          <div className="rounded-2xl border border-gray-100 p-5 hover:border-gray-200 transition-colors cursor-pointer h-full">
            <div className="flex items-start justify-between mb-3">
              <MessageSquare className="w-6 h-6 text-[#CC8800]" />
              <span className="text-2xl font-bold text-[#CC8800]">
                {stats.messagesCount}
              </span>
            </div>
            <h3 className="font-semibold text-gray-900">Messages</h3>
            <p className="text-sm text-gray-600 mt-1">
              Restez connecté avec vos clients
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}

function ClientDashboard({ stats }: DashboardComponentProps) {
  return (
    <div className="space-y-6">
      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Browse Services - Hero */}
        <Link href="/services">
          <div className="group rounded-3xl bg-gradient-to-br from-[#CC8800] to-[#A66E00] p-8 text-white hover:shadow-xl transition-all duration-300 cursor-pointer h-full">
            <div className="mb-4 p-4 rounded-2xl bg-white/20 w-fit">
              <TrendingUp className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-2xl font-bold mb-2">
              Explorer les services
            </h3>
            <p className="text-white/90 text-sm mb-6 leading-relaxed">
              Découvrez les meilleurs prestataires et réservez
            </p>
            <div className="flex items-center gap-2 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
              Parcourir <span className="text-lg">→</span>
            </div>
          </div>
        </Link>

        {/* My Bookings */}
        <Link href="/dashboard/bookings">
          <div className="group rounded-3xl bg-gradient-to-br from-[#38761D] to-[#6fa086] p-8 text-white hover:shadow-xl transition-all duration-300 cursor-pointer h-full">
            <div className="mb-4 p-4 rounded-2xl bg-white/20 w-fit">
              <Clock className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-2xl font-bold mb-2">
              Mes réservations
            </h3>
            <p className="text-white/90 text-sm mb-6 leading-relaxed">
              Suivi de {stats.bookingsCount} réservation{stats.bookingsCount !== 1 ? "s" : ""}
            </p>
            <div className="flex items-center gap-2 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
              Voir les détails <span className="text-lg">→</span>
            </div>
          </div>
        </Link>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/dashboard/bookings">
          <div className="rounded-2xl border border-gray-100 p-5 hover:border-gray-200 transition-colors cursor-pointer h-full">
            <div className="flex items-start justify-between mb-3">
              <Clock className="w-6 h-6 text-[#2C3E50]" />
              <span className="text-2xl font-bold text-[#2C3E50]">
                {stats.bookingsCount}
              </span>
            </div>
            <h3 className="font-semibold text-gray-900">Réservations actives</h3>
            <p className="text-sm text-gray-600 mt-1">
              Gérez vos services réservés
            </p>
          </div>
        </Link>

        <Link href="/dashboard/favorites">
          <div className="rounded-2xl border border-gray-100 p-5 hover:border-gray-200 transition-colors cursor-pointer h-full">
            <div className="flex items-start justify-between mb-3">
              <TrendingUp className="w-6 h-6 text-[#CC8800]" />
              <span className="text-2xl font-bold text-[#CC8800]">
                {stats.favoritesCount}
              </span>
            </div>
            <h3 className="font-semibold text-gray-900">Favoris</h3>
            <p className="text-sm text-gray-600 mt-1">
              Vos services préférés
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}

function CompanyDashboard({ stats }: DashboardComponentProps) {
  return (
    <div className="space-y-6">
      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Create Offer - Hero */}
        <Link href="/dashboard/offers/create">
          <div className="group rounded-3xl bg-gradient-to-br from-[#CC8800] to-[#A66E00] p-8 text-white hover:shadow-xl transition-all duration-300 cursor-pointer h-full">
            <div className="mb-4 p-4 rounded-2xl bg-white/20 w-fit">
              <Plus className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-2xl font-bold mb-2">
              Créer une offre
            </h3>
            <p className="text-white/90 text-sm mb-6 leading-relaxed">
              Publiez une nouvelle opportunité pour votre équipe
            </p>
            <div className="flex items-center gap-2 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
              Commencer <span className="text-lg">→</span>
            </div>
          </div>
        </Link>

        {/* Applications */}
        <Link href="/dashboard/applications">
          <div className="group rounded-3xl bg-gradient-to-br from-[#38761D] to-[#6fa086] p-8 text-white hover:shadow-xl transition-all duration-300 cursor-pointer h-full">
            <div className="mb-4 p-4 rounded-2xl bg-white/20 w-fit">
              <Users className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-2xl font-bold mb-2">
              Candidatures
            </h3>
            <p className="text-white/90 text-sm mb-6 leading-relaxed">
              Examinez {stats.applicationsCount} candidature{stats.applicationsCount !== 1 ? "s" : ""}
            </p>
            <div className="flex items-center gap-2 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
              Parcourir <span className="text-lg">→</span>
            </div>
          </div>
        </Link>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/dashboard/offers">
          <div className="rounded-2xl border border-gray-100 p-5 hover:border-gray-200 transition-colors cursor-pointer h-full">
            <div className="flex items-start justify-between mb-3">
              <FileText className="w-6 h-6 text-[#2C3E50]" />
              <span className="text-2xl font-bold text-[#2C3E50]">
                {stats.offersCount}
              </span>
            </div>
            <h3 className="font-semibold text-gray-900">Offres actives</h3>
            <p className="text-sm text-gray-600 mt-1">
              Gérez vos offres
            </p>
          </div>
        </Link>

        <Link href="/dashboard/applications">
          <div className="rounded-2xl border border-gray-100 p-5 hover:border-gray-200 transition-colors cursor-pointer h-full">
            <div className="flex items-start justify-between mb-3">
              <Users className="w-6 h-6 text-[#CC8800]" />
              <span className="text-2xl font-bold text-[#CC8800]">
                {stats.applicationsCount}
              </span>
            </div>
            <h3 className="font-semibold text-gray-900">Candidatures</h3>
            <p className="text-sm text-gray-600 mt-1">
              À examiner
            </p>
          </div>
        </Link>

        <Link href="/dashboard/stats">
          <div className="rounded-2xl border border-gray-100 p-5 hover:border-gray-200 transition-colors cursor-pointer h-full">
            <div className="flex items-start justify-between mb-3">
              <BarChart3 className="w-6 h-6 text-[#38761D]" />
              <span className="text-sm font-semibold text-[#38761D]">Voir</span>
            </div>
            <h3 className="font-semibold text-gray-900">Statistiques</h3>
            <p className="text-sm text-gray-600 mt-1">
              Votre performance
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
