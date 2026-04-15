"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ServiceCard } from "@/components/services/service-card";
import { createClient } from "@/lib/supabase/client";
import { Search, SlidersHorizontal, MapPin, ChevronDown, Sparkles } from "lucide-react";
import type { ServiceRow, UserProfileRow } from "@/types/database";

interface ServiceWithProvider extends ServiceRow {
  provider?: {
    first_name: string;
    avatar_url?: string | null;
    average_rating?: number;
    total_reviews?: number;
    is_verified?: boolean;
    is_super_pro?: boolean;
  };
}

// Common service categories
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
  "Autre",
];

export default function ServicesPage() {
  const [services, setServices] = useState<ServiceWithProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [searchQuery, setSearchQuery] = useState("");
  const supabase = createClient();

  // Fetch services from Supabase
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch published services with provider info
        const { data: servicesData, error: servicesError } = await supabase
          .from("services")
          .select("*")
          .eq("status", "published")
          .order("created_at", { ascending: false });

        if (servicesError) {
          throw new Error(servicesError.message);
        }

        if (!servicesData || servicesData.length === 0) {
          setServices([]);
          setLoading(false);
          return;
        }

        // Fetch provider profiles for all services
        const providerIds = [...new Set((servicesData as ServiceRow[]).map((s) => s.provider_id))];

        const { data: profilesData, error: profilesError } = await supabase
          .from("user_profiles")
          .select("id, first_name, avatar_url, average_rating, total_reviews, is_verified, is_super_pro")
          .in("id", providerIds);

        if (profilesError) {
          throw new Error(profilesError.message);
        }

        // Create a map of provider profiles
        const profilesMap = new Map<string, UserProfileRow>();
        if (profilesData) {
          profilesData.forEach((profile: any) => {
            profilesMap.set(profile.id, profile);
          });
        }

        // Merge services with provider data
        const enrichedServices: ServiceWithProvider[] = (servicesData as ServiceRow[]).map((service) => {
          const profile = profilesMap.get(service.provider_id);
          return {
            ...service,
            provider: profile
              ? {
                  first_name: profile.first_name,
                  avatar_url: profile.avatar_url,
                  average_rating: profile.average_rating || 0,
                  total_reviews: profile.total_reviews || 0,
                  is_verified: profile.is_verified || false,
                  is_super_pro: profile.is_super_pro || false,
                }
              : {
                  first_name: "Prestataire",
                  avatar_url: null,
                  average_rating: 0,
                  total_reviews: 0,
                  is_verified: false,
                  is_super_pro: false,
                },
          };
        });

        setServices(enrichedServices);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Erreur lors du chargement des services";
        setError(message);
        console.error("Error fetching services:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [supabase]);

  // Filter services based on search and category
  const filteredServices = services.filter((s) => {
    const matchesCategory =
      selectedCategory === "Tous" || s.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.category?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
      (s.city?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
      (s.description?.toLowerCase().includes(searchQuery.toLowerCase()) || false);
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
            <div className="flex items-center gap-2 bg-[#8FBFAD]/10 text-[#8FBFAD] rounded-2xl px-4 py-2 text-sm font-medium">
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
                className="w-full pl-12 pr-4 h-14 rounded-2xl border border-gray-200 bg-gray-50/80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4A6670]/20 focus:border-[#4A6670]/30 text-base transition-all"
              />
            </div>
            <div className="relative sm:w-56">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Ville ou code postal"
                className="w-full pl-12 pr-4 h-14 rounded-2xl border border-gray-200 bg-gray-50/80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4A6670]/20 focus:border-[#4A6670]/30 text-base transition-all"
              />
            </div>
            <button className="h-14 px-6 rounded-2xl bg-[#4A6670] text-white font-semibold hover:bg-[#3E5760] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md">
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
                      ? "bg-[#4A6670] text-white shadow-sm"
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
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4A6670] mb-4"></div>
            <p className="text-gray-500">Chargement des services...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-20 h-20 rounded-3xl bg-red-50 flex items-center justify-center mb-6">
              <span className="text-2xl">⚠️</span>
            </div>
            <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">
              Erreur de chargement
            </h3>
            <p className="text-gray-500 mb-6 text-center max-w-sm">
              {error}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 rounded-2xl bg-[#4A6670] text-white font-semibold hover:bg-[#3E5760] transition-all shadow-sm"
            >
              Réessayer
            </button>
          </div>
        ) : filteredServices.length > 0 ? (
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
              {services.length === 0
                ? "Aucun service n'est disponible pour le moment. Revenez bientôt !"
                : "Essayez de modifier vos filtres ou votre recherche pour trouver ce que vous cherchez."}
            </p>
            <button
              onClick={() => {
                setSelectedCategory("Tous");
                setSearchQuery("");
              }}
              className="px-6 py-3 rounded-2xl bg-[#4A6670] text-white font-semibold hover:bg-[#3E5760] transition-all shadow-sm"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
