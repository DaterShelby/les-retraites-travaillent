"use client";

import { useState } from "react";
import Link from "next/link";
import { ServiceCard } from "@/components/services/service-card";
import { Search, SlidersHorizontal } from "lucide-react";

const mockServices = [
  {
    id: "1",
    title: "Cours d'informatique à domicile",
    description: "Apprenez l'informatique de base avec un professionnel expérimenté",
    category: "Informatique",
    price_type: "hourly",
    price_amount: 25,
    city: "Paris",
    department: "75",
    photos: ["https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&q=80"],
    provider: {
      first_name: "Laurent",
      avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      average_rating: 4.8,
      total_reviews: 24,
      is_verified: true,
      is_super_pro: true,
    },
  },
  {
    id: "2",
    title: "Jardinage et entretien de jardin",
    description: "Services de jardinage et paysagisme",
    category: "Jardinage",
    price_type: "hourly",
    price_amount: 20,
    city: "Lyon",
    department: "69",
    photos: ["https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=80"],
    provider: {
      first_name: "Marie",
      avatar_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
      average_rating: 4.6,
      total_reviews: 18,
      is_verified: true,
      is_super_pro: false,
    },
  },
  {
    id: "3",
    title: "Aide aux devoirs et soutien scolaire",
    description: "Accompagnement scolaire tous niveaux",
    category: "Formation",
    price_type: "hourly",
    price_amount: 18,
    city: "Marseille",
    department: "13",
    photos: ["https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=80"],
    provider: {
      first_name: "Sophie",
      avatar_url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face",
      average_rating: 4.9,
      total_reviews: 31,
      is_verified: true,
      is_super_pro: false,
    },
  },
  {
    id: "4",
    title: "Petits travaux de bricolage",
    description: "Réparations et petits travaux chez vous",
    category: "Bricolage",
    price_type: "hourly",
    price_amount: 22,
    city: "Toulouse",
    department: "31",
    photos: ["https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=600&q=80"],
    provider: {
      first_name: "Jean",
      avatar_url: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=100&h=100&fit=crop&crop=face",
      average_rating: 4.7,
      total_reviews: 42,
      is_verified: false,
      is_super_pro: false,
    },
  },
  {
    id: "5",
    title: "Cuisine à domicile / Traiteur",
    description: "Repas cuisinés à domicile pour vos événements",
    category: "Cuisine",
    price_type: "hourly",
    price_amount: 30,
    city: "Bordeaux",
    department: "33",
    photos: ["https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600&q=80"],
    provider: {
      first_name: "Pierre",
      avatar_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      average_rating: 4.9,
      total_reviews: 27,
      is_verified: true,
      is_super_pro: true,
    },
  },
  {
    id: "6",
    title: "Garde d'enfants expérimentée",
    description: "Garde d'enfants et babysitting",
    category: "Garde-enfants",
    price_type: "hourly",
    price_amount: 15,
    city: "Nantes",
    department: "44",
    photos: ["https://images.unsplash.com/photo-1587654780291-39c9404d7dd0?w=600&q=80"],
    provider: {
      first_name: "Isabelle",
      avatar_url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      average_rating: 4.8,
      total_reviews: 19,
      is_verified: true,
      is_super_pro: false,
    },
  },
  {
    id: "7",
    title: "Conseil en gestion d'entreprise",
    description: "Coaching et conseil pour entrepreneurs",
    category: "Conseil",
    price_type: "hourly",
    price_amount: 45,
    city: "Paris",
    department: "75",
    photos: ["https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80"],
    provider: {
      first_name: "Olivier",
      avatar_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
      average_rating: 4.9,
      total_reviews: 35,
      is_verified: true,
      is_super_pro: false,
    },
  },
  {
    id: "8",
    title: "Couture et retouches",
    description: "Retouches et confection sur mesure",
    category: "Couture",
    price_type: "hourly",
    price_amount: 20,
    city: "Strasbourg",
    department: "67",
    photos: ["https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&q=80"],
    provider: {
      first_name: "Véronique",
      avatar_url: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=100&h=100&fit=crop&crop=face",
      average_rating: 4.7,
      total_reviews: 22,
      is_verified: false,
      is_super_pro: false,
    },
  },
  {
    id: "9",
    title: "Cours de langue anglaise",
    description: "Apprentissage de l'anglais pour tous",
    category: "Langues",
    price_type: "hourly",
    price_amount: 28,
    city: "Lyon",
    department: "69",
    photos: ["https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=600&q=80"],
    provider: {
      first_name: "Emma",
      avatar_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
      average_rating: 4.8,
      total_reviews: 20,
      is_verified: true,
      is_super_pro: false,
    },
  },
  {
    id: "10",
    title: "Nettoyage et ménage professionnel",
    description: "Nettoyage complet de votre maison",
    category: "Ménage",
    price_type: "hourly",
    price_amount: 18,
    city: "Lille",
    department: "59",
    photos: ["https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&q=80"],
    provider: {
      first_name: "Catherine",
      avatar_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
      average_rating: 4.6,
      total_reviews: 15,
      is_verified: true,
      is_super_pro: false,
    },
  },
  {
    id: "11",
    title: "Plomberie et dépannage",
    description: "Interventions rapides et fiables pour tous vos problèmes de plomberie",
    category: "Plomberie",
    price_type: "hourly",
    price_amount: 35,
    city: "Nice",
    department: "06",
    photos: ["https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=600&q=80"],
    provider: {
      first_name: "François",
      avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      average_rating: 4.7,
      total_reviews: 29,
      is_verified: true,
      is_super_pro: false,
    },
  },
  {
    id: "12",
    title: "Cours de piano et musique",
    description: "Apprentissage du piano et initiation musicale pour tous les âges",
    category: "Musique",
    price_type: "hourly",
    price_amount: 30,
    city: "Montpellier",
    department: "34",
    photos: ["https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=600&q=80"],
    provider: {
      first_name: "Martine",
      avatar_url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face",
      average_rating: 4.9,
      total_reviews: 16,
      is_verified: true,
      is_super_pro: false,
    },
  },
];

const filterCategories = ["Catégorie", "Prix", "Distance", "Note", "Disponibilité"];

export default function ServicesPage() {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const toggleFilter = (filter: string) => {
    setSelectedFilters((prev) =>
      prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6">
        <nav className="flex items-center gap-2 text-sm text-gray-600">
          <Link href="/" className="hover:text-gray-900">
            Accueil
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900 font-medium">Services</span>
        </nav>
      </div>

      {/* Hero Banner Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="absolute inset-0 opacity-10 bg-pattern" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="mb-2">
            <h1 className="text-4xl sm:text-5xl font-serif font-bold mb-3">
              Trouvez le service idéal
            </h1>
            <p className="text-blue-100 text-lg">
              Découvrez nos prestataires vérifiés et réservez le service qui vous convient
            </p>
          </div>
        </div>
      </div>

      {/* Search & Filter Section */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un service..."
            className="w-full pl-12 pr-4 py-3 sm:py-4 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
          />
        </div>

        {/* Filter Pills */}
        <div className="overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex gap-3 min-w-min sm:min-w-full">
            {filterCategories.map((filter) => (
              <button
                key={filter}
                onClick={() => toggleFilter(filter)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border whitespace-nowrap transition-all duration-200 ${
                  selectedFilters.includes(filter)
                    ? "border-gray-900 bg-gray-900 text-white"
                    : "border-gray-300 text-gray-700 hover:border-gray-400"
                }`}
              >
                {filter === "Distance" || filter === "Prix" ? (
                  <SlidersHorizontal className="w-4 h-4" />
                ) : null}
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-6">
        <p className="text-gray-600 font-medium">
          {mockServices.length} services disponibles
        </p>
      </div>

      {/* Services Grid */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-12">
        {mockServices.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {mockServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="text-center">
              <h3 className="text-2xl font-serif font-bold text-gray-900 mb-2">
                Aucun service trouvé
              </h3>
              <p className="text-gray-600 mb-6">
                Essayez de modifier vos filtres ou votre recherche
              </p>
              <button className="px-6 py-2 rounded-full bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors">
                Réinitialiser les filtres
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
