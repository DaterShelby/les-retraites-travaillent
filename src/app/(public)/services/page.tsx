"use client";

import { useState } from "react";
import Link from "next/link";
import { ServiceCard } from "@/components/services/service-card";
import { Search, SlidersHorizontal, MapPin, ChevronDown, Sparkles } from "lucide-react";

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
    photos: ["https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=600&q=80"],
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
    photos: ["https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=600&q=80"],
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

const categories = [
  "Tous",
  "Informatique",
  "Jardinage",
  "Bricolage",
  "Cuisine",
  "Formation",
  "Conseil",
  "Ménage",
  "Couture",
  "Langues",
  "Musique",
  "Plomberie",
];

export default function ServicesPage() {
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredServices = mockServices.filter((s) => {
    const matchesCategory =
      selectedCategory === "Tous" || s.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.city?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Clean minimal hero — no banner, just content */}
      <div className="bg-white border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 pb-6 sm:pb-8">
          {/* Breadcrumb */}
          <nav className="hidden sm:flex items-center gap-2 text-sm text-gray-400 mb-6">
            <Link href="/" className="hover:text-gray-600 transition-colors">
              Accueil
            </Link>
            <span>/</span>
            <span className="text-gray-700 font-medium">Services</span>
          </nav>

          {/* Title row */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6 sm:mb-8">
            <div>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-2">
                Explorer les services
              </h1>
              <p className="text-gray-500 text-base sm:text-lg">
                {filteredServices.length} expert{filteredServices.length > 1 ? "s" : ""} disponible{filteredServices.length > 1 ? "s" : ""} près de chez vous
              </p>
            </div>

            {/* Subtle AI suggestion pill */}
            <div className="flex items-center gap-2 bg-accent/10 text-accent rounded-2xl px-4 py-2 text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              <span>Suggestions personnalisées</span>
            </div>
          </div>

          {/* Search bar — Apple-like with rounded corners */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un service, un métier..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 h-14 rounded-2xl border border-gray-200 bg-gray-50/80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 text-base transition-all"
              />
            </div>
            <div className="relative sm:w-56">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Ville ou code postal"
                className="w-full pl-12 pr-4 h-14 rounded-2xl border border-gray-200 bg-gray-50/80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 text-base transition-all"
              />
            </div>
            <button className="h-14 px-6 rounded-2xl bg-primary text-white font-semibold hover:bg-primary-600 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md">
              <Search className="w-4 h-4" />
              <span className="sm:hidden lg:inline">Rechercher</span>
            </button>
          </div>
        </div>
      </div>

      {/* Category pills — horizontal scroll */}
      <div className="sticky top-16 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-100/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
          <div className="overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
            <div className="flex gap-2 min-w-min">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-2xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                    selectedCategory === cat
                      ? "bg-primary text-white shadow-sm"
                      : "bg-gray-100/80 text-gray-600 hover:bg-gray-200/80 hover:text-gray-900"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
            {filteredServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-20 h-20 rounded-3xl bg-gray-100 flex items-center justify-center mb-6">
              <Search className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">
              Aucun service trouvé
            </h3>
            <p className="text-gray-500 mb-6 text-center max-w-sm">
              Essayez de modifier vos filtres ou votre recherche pour trouver ce que vous cherchez.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("Tous");
                setSearchQuery("");
              }}
              className="px-6 py-3 rounded-2xl bg-primary text-white font-semibold hover:bg-primary-600 transition-all shadow-sm"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
