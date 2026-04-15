"use client";

import { Database } from "@/types/database";
import { StatCard } from "./stat-card";
import { Button } from "@/components/ui/button";
import { Briefcase, Users, TrendingUp, AlertCircle, Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

interface CompanyDashboardProps {
  profile: Database["public"]["Tables"]["user_profiles"]["Row"];
}

interface CompanyStats {
  activeJobs: number;
  pendingApplications: number;
  totalHired: number;
  complianceScore: number;
}

export function CompanyDashboard({ profile }: CompanyDashboardProps) {
  const [stats, setStats] = useState<CompanyStats>({
    activeJobs: 0,
    pendingApplications: 0,
    totalHired: 0,
    complianceScore: 95,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const supabase = createBrowserSupabaseClient();

        // For now, these are placeholders - would need actual job/application tables
        setStats({
          activeJobs: 0,
          pendingApplications: 0,
          totalHired: 0,
          complianceScore: 95,
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
            Bienvenue, {profile.company_name || profile.first_name}!
          </h1>
          <p className="text-body text-gray-600">
            Recrutez des talents en quelques minutes
          </p>
        </div>
        <Link href="/dashboard/jobs/new">
          <Button className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Nouvelle offre
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Offres actives"
          value={stats.activeJobs}
          subtitle="Postes ouverts"
          icon={<Briefcase className="w-6 h-6" />}
          variant="default"
        />
        <StatCard
          title="Candidatures"
          value={stats.pendingApplications}
          subtitle="En attente d'examen"
          icon={<Users className="w-6 h-6" />}
          variant="info"
        />
        <StatCard
          title="Recrutements"
          value={stats.totalHired}
          subtitle="Talent embauchés"
          icon={<TrendingUp className="w-6 h-6" />}
          variant="success"
        />
        <StatCard
          title="Conformité"
          value={`${stats.complianceScore}%`}
          subtitle="Respect des normes"
          icon={<AlertCircle className="w-6 h-6" />}
          variant="warning"
        />
      </div>

      {/* Compliance Banner */}
      {stats.complianceScore < 100 && (
        <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-6">
          <h2 className="font-serif font-bold text-primary mb-2">Conformité</h2>
          <p className="text-body text-gray-700 mb-4">
            Vous êtes conforme à {stats.complianceScore}% des normes. Améliorez votre profil pour augmenter votre score.
          </p>
          <Link href="/dashboard/compliance">
            <Button variant="outline" size="sm">
              Voir les détails
            </Button>
          </Link>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="font-serif font-bold text-primary mb-4">Offres actives</h2>
          <p className="text-body text-gray-500 mb-4">
            {stats.activeJobs === 0
              ? "Vous n'avez pas d'offres actives"
              : `Vous avez ${stats.activeJobs} offre(s) ouverte(s)`}
          </p>
          <Link href="/dashboard/jobs">
            <Button variant="outline" className="w-full">
              Gérer les offres
            </Button>
          </Link>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="font-serif font-bold text-primary mb-4">Candidatures</h2>
          <p className="text-body text-gray-500 mb-4">
            {stats.pendingApplications === 0
              ? "Aucune candidature en attente"
              : `${stats.pendingApplications} candidature(s) à examiner`}
          </p>
          <Link href="/dashboard/applications">
            <Button variant="outline" className="w-full">
              Examiner les candidatures
            </Button>
          </Link>
        </div>
      </div>

      {/* Info */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h2 className="font-serif font-bold text-primary mb-4">À propos de votre compte</h2>
        <dl className="grid grid-cols-2 gap-4">
          <div>
            <dt className="text-body-sm text-gray-500">Entreprise</dt>
            <dd className="text-body font-semibold text-primary">{profile.company_name || "—"}</dd>
          </div>
          <div>
            <dt className="text-body-sm text-gray-500">SIRET</dt>
            <dd className="text-body font-semibold text-primary">{profile.siret || "—"}</dd>
          </div>
          <div>
            <dt className="text-body-sm text-gray-500">Secteur</dt>
            <dd className="text-body font-semibold text-primary">{profile.sector || "—"}</dd>
          </div>
          <div>
            <dt className="text-body-sm text-gray-500">Taille</dt>
            <dd className="text-body font-semibold text-primary">{profile.company_size || "—"}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
