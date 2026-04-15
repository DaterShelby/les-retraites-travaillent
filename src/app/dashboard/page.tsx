"use client";

import { useAuth } from "@/hooks/use-auth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  BarChart3,
  Clock,
  FileText,
  Plus,
  TrendingUp,
  Users,
} from "lucide-react";

export default function DashboardPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-neutral-text">Chargement...</p>
        </div>
      </div>
    );
  }

  // En attendant le chargement du profil, afficher le dashboard retraité par défaut
  const isRetiree = true;
  const isClient = false;
  const isCompany = false;

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold font-serif text-gray-900 mb-2">
          Bienvenue, {user?.email?.split("@")[0] || "utilisateur"}!
        </h1>
        <p className="text-neutral-text">
          {isRetiree && "Gérez vos annonces et services"}
          {isClient && "Découvrez nos services et réservez"}
          {isCompany && "Publiez vos offres et recrutez"}
        </p>
      </div>

      {/* Role-based Dashboard */}
      {isRetiree && <RetireeDashboard />}
      {isClient && <ClientDashboard />}
      {isCompany && <CompanyDashboard />}
    </div>
  );
}

function RetireeDashboard() {
  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-primary/10 p-3 rounded-lg">
              <Plus className="w-6 h-6 text-primary" />
            </div>
            <span className="text-sm font-medium text-primary">Nouveau</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Créer une annonce</h3>
          <p className="text-sm text-neutral-text mb-4">
            Publiez un nouveau service pour trouver des clients
          </p>
          <Link href="/dashboard/listings/create">
            <Button variant="outline" size="sm" className="w-full">
              Créer une annonce
            </Button>
          </Link>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-primary/10 p-3 rounded-lg">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <span className="text-sm font-medium text-gray-600">3</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Annonces actives</h3>
          <p className="text-sm text-neutral-text mb-4">
            Vous avez 3 annonces en ligne
          </p>
          <Link href="/dashboard/listings">
            <Button variant="outline" size="sm" className="w-full">
              Voir mes annonces
            </Button>
          </Link>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-primary/10 p-3 rounded-lg">
              <Clock className="w-6 h-6 text-primary" />
            </div>
            <span className="text-sm font-medium text-gray-600">5</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Réservations</h3>
          <p className="text-sm text-neutral-text mb-4">
            Vous avez 5 réservations en attente
          </p>
          <Link href="/dashboard/bookings">
            <Button variant="outline" size="sm" className="w-full">
              Voir les réservations
            </Button>
          </Link>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-primary/10 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <span className="text-sm font-medium text-primary">+15%</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Revenus mensuels</h3>
          <p className="text-sm text-neutral-text mb-4">
            1,250 EUR ce mois
          </p>
          <Link href="/dashboard/earnings">
            <Button variant="outline" size="sm" className="w-full">
              Détails des revenus
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}

function ClientDashboard() {
  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-primary/10 p-3 rounded-lg">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <span className="text-sm font-medium text-gray-600">2</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Réservations actives</h3>
          <p className="text-sm text-neutral-text mb-4">
            Vous avez 2 réservations en cours
          </p>
          <Link href="/dashboard/bookings">
            <Button variant="outline" size="sm" className="w-full">
              Voir les réservations
            </Button>
          </Link>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-primary/10 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <span className="text-sm font-medium text-gray-600">8</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Services favoris</h3>
          <p className="text-sm text-neutral-text mb-4">
            Vous avez 8 services en favoris
          </p>
          <Link href="/dashboard/favorites">
            <Button variant="outline" size="sm" className="w-full">
              Voir mes favoris
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}

function CompanyDashboard() {
  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-primary/10 p-3 rounded-lg">
              <Plus className="w-6 h-6 text-primary" />
            </div>
            <span className="text-sm font-medium text-primary">Nouveau</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Créer une offre</h3>
          <p className="text-sm text-neutral-text mb-4">
            Publiez une nouvelle offre d'emploi
          </p>
          <Link href="/dashboard/offers/create">
            <Button variant="outline" size="sm" className="w-full">
              Créer une offre
            </Button>
          </Link>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-primary/10 p-3 rounded-lg">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <span className="text-sm font-medium text-gray-600">5</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Offres actives</h3>
          <p className="text-sm text-neutral-text mb-4">
            Vous avez 5 offres publiées
          </p>
          <Link href="/dashboard/offers">
            <Button variant="outline" size="sm" className="w-full">
              Voir mes offres
            </Button>
          </Link>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-primary/10 p-3 rounded-lg">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <span className="text-sm font-medium text-gray-600">12</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Candidatures</h3>
          <p className="text-sm text-neutral-text mb-4">
            Vous avez 12 candidatures en attente
          </p>
          <Link href="/dashboard/applications">
            <Button variant="outline" size="sm" className="w-full">
              Voir les candidatures
            </Button>
          </Link>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-primary/10 p-3 rounded-lg">
              <BarChart3 className="w-6 h-6 text-primary" />
            </div>
            <span className="text-sm font-medium text-primary">+28%</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Statistiques</h3>
          <p className="text-sm text-neutral-text mb-4">
            Vues en hausse cette semaine
          </p>
          <Link href="/dashboard/stats">
            <Button variant="outline" size="sm" className="w-full">
              Voir les stats
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}
