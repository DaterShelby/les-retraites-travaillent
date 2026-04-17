"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { TrendingUp, Eye, CheckSquare, Star, MessageSquare, Users } from "lucide-react";

interface StatData {
  totalServices: number;
  totalBookings: number;
  averageRating: number;
  profileViews: number;
  totalReviews: number;
  responseRate: number | null;
}

function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  color = "primary",
}: {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  trend?: number;
  color?: "primary" | "secondary" | "accent";
}) {
  return (
    <Card className="rounded-3xl border-gray-200/50 overflow-hidden hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
          </div>
          <div className={`p-3 rounded-2xl bg-${color === "secondary" ? "orange" : color === "accent" ? "green" : "blue"}-50`}>
            <Icon className={`w-6 h-6 text-${color === "secondary" ? "orange-500" : color === "accent" ? "green-600" : "blue-600"}`} />
          </div>
        </div>
        {trend !== undefined && (
          <div className="flex items-center gap-2 text-sm">
            {trend >= 0 ? (
              <>
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-green-600 font-medium">{trend > 0 ? "+" : ""}{trend}%</span>
              </>
            ) : (
              <span className="text-gray-500">Pas de données</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function StatsPage() {
  const { user, loading: authLoading } = useAuth();
  const [stats, setStats] = useState<StatData>({
    totalServices: 0,
    totalBookings: 0,
    averageRating: 0,
    profileViews: 0,
    totalReviews: 0,
    responseRate: null,
  });
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    if (authLoading || !user) return;

    const fetchStats = async () => {
      try {
        // Fetch services count
        const { count: servicesCount } = await supabase
          .from("services")
          .select("id", { count: "exact", head: true })
          .eq("provider_id", user.id)
          .eq("status", "published");

        // Fetch bookings count
        const { count: bookingsCount } = await supabase
          .from("bookings")
          .select("id", { count: "exact", head: true })
          .eq("provider_id", user.id)
          .eq("status", "completed");

        // Fetch user profile for rating, reviews, views, and response rate
        const { data: profile } = await supabase
          .from("user_profiles")
          .select("average_rating, total_reviews, views_count, response_rate")
          .eq("id", user.id)
          .single();

        setStats({
          totalServices: servicesCount || 0,
          totalBookings: bookingsCount || 0,
          averageRating: profile?.average_rating || 0,
          profileViews: profile?.views_count || 0,
          totalReviews: profile?.total_reviews || 0,
          responseRate: profile?.response_rate ?? null,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user, authLoading, supabase]);

  if (authLoading || loading) {
    return (
      <div className="max-w-5xl">
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold text-gray-900">Statistiques</h1>
          <p className="text-neutral-text mt-3">Chargement de vos performances...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-40 rounded-3xl bg-gray-200 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-serif font-bold text-gray-900">Statistiques</h1>
        <p className="text-neutral-text mt-3">Suivez vos performances et vos interactions</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <StatCard
          title="Annonces publiées"
          value={stats.totalServices}
          icon={Users}
          color="primary"
        />
        <StatCard
          title="Réservations complétées"
          value={stats.totalBookings}
          icon={CheckSquare}
          color="accent"
        />
        <StatCard
          title="Note moyenne"
          value={stats.averageRating > 0 ? `${stats.averageRating.toFixed(1)}/5` : "N/A"}
          icon={Star}
          color="secondary"
        />
        <StatCard
          title="Vues du profil"
          value={stats.profileViews}
          icon={Eye}
          color="primary"
        />
        <StatCard
          title="Avis reçus"
          value={stats.totalReviews}
          icon={MessageSquare}
          color="accent"
        />
        <StatCard
          title="Taux de réponse"
          value={stats.responseRate != null ? `${stats.responseRate}%` : "N/A"}
          icon={TrendingUp}
          color="secondary"
        />
      </div>

      {/* Insights Card */}
      <Card className="rounded-3xl border-gray-200/50">
        <CardHeader>
          <CardTitle className="text-2xl">Conseils pour améliorer vos statistiques</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="border-l-4 border-secondary pl-4">
            <h4 className="font-semibold text-gray-900 mb-2">Augmentez vos vues</h4>
            <p className="text-gray-600 text-sm">
              Une description détaillée et des photos de qualité augmentent vos chances d'être découvert.
            </p>
          </div>
          <div className="border-l-4 border-accent pl-4">
            <h4 className="font-semibold text-gray-900 mb-2">Développez votre réputation</h4>
            <p className="text-gray-600 text-sm">
              Répondez rapidement aux messages et demandes pour améliorer votre taux de réponse.
            </p>
          </div>
          <div className="border-l-4 border-primary pl-4">
            <h4 className="font-semibold text-gray-900 mb-2">Collectez des avis</h4>
            <p className="text-gray-600 text-sm">
              Plus vous avez d'avis positifs, plus votre profil sera mis en avant dans les résultats de recherche.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
