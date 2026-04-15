import { Metadata } from "next";
import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Award, Shield } from "lucide-react";
import { notFound } from "next/navigation";
import { ServiceDetailClient } from "@/components/services/service-detail-client";

function ServiceDetailClientWrapper(props: any) {
  return <ServiceDetailClient {...props} />;
}

interface ServiceDetailPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({
  params,
}: ServiceDetailPageProps): Promise<Metadata> {
  const supabase = createServerSupabaseClient();

  const { data: service } = await supabase
    .from("services")
    .select("id, title, description, category")
    .eq("id", params.slug)
    .eq("status", "published")
    .single();

  if (!service) {
    return {
      title: "Service non trouvé",
    };
  }

  return {
    title: `${service.title} | Les Retraités Travaillent`,
    description: service.description || "Découvrez ce service sur Les Retraités Travaillent",
    openGraph: {
      title: service.title,
      description: service.description || "Découvrez ce service",
    },
  };
}

export default async function ServiceDetailPage({
  params,
}: ServiceDetailPageProps) {
  const supabase = createServerSupabaseClient();

  const { data: service, error } = await supabase
    .from("services")
    .select(
      `
      id,
      title,
      description,
      category,
      subcategory,
      price_type,
      price_amount,
      city,
      photos,
      tags,
      views_count,
      provider:provider_id(
        id,
        first_name,
        last_name,
        avatar_url,
        bio,
        average_rating,
        total_reviews,
        is_verified,
        is_super_pro,
        city
      )
    `
    )
    .eq("id", params.slug)
    .eq("status", "published")
    .single();

  if (error || !service) {
    notFound();
  }

  // Increment views count (fire and forget)
  supabase
    .from("services")
    .update({ views_count: (service.views_count || 0) + 1 })
    .eq("id", service.id)
    .then();

  // Type the provider properly
  const provider = (Array.isArray(service.provider) ? service.provider[0] : service.provider) as any;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <main className="min-h-screen bg-[#FAF7F5]">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="text-primary hover:text-primary/80 font-medium">
              Accueil
            </Link>
            <span className="text-gray-300">/</span>
            <Link href="/services" className="text-primary hover:text-primary/80 font-medium">
              Services
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-gray-500">{service.category}</span>
            <span className="text-gray-300">/</span>
            <span className="text-gray-500 font-medium truncate">{service.title}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Photo Gallery */}
            <div className="rounded-3xl overflow-hidden bg-white border border-gray-100 shadow-sm">
              {service.photos && service.photos.length > 0 ? (
                <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                  <img
                    src={service.photos[0]}
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                      <span className="text-primary font-bold text-lg">
                        {getInitials(service.title || "S")}
                      </span>
                    </div>
                    <p className="text-gray-500 text-sm">Pas de photo</p>
                  </div>
                </div>
              )}

              {/* Photo Thumbnails */}
              {service.photos && service.photos.length > 1 && (
                <div className="p-3 sm:p-4 border-t border-gray-100 grid grid-cols-4 gap-2">
                  {service.photos.map((photo: string, idx: number) => (
                    <div
                      key={idx}
                      className="aspect-square rounded-2xl overflow-hidden bg-gray-100"
                    >
                      <img
                        src={photo}
                        alt={`${service.title} ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Service Details */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-8">
              {/* Title & Category */}
              <div>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                  <div className="flex-1">
                    <h1 className="font-serif text-3xl sm:text-4xl font-bold text-primary mb-3">
                      {service.title}
                    </h1>
                    {service.city && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4 flex-shrink-0" />
                        <span className="text-sm">{service.city}</span>
                      </div>
                    )}
                  </div>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-semibold whitespace-nowrap">
                    <span className="w-2 h-2 bg-accent rounded-full" />
                    {service.category}
                  </div>
                </div>
              </div>

              {/* Pricing Section */}
              {service.price_amount !== null && service.price_amount !== undefined && (
                <div className="border-t border-gray-100 pt-6">
                  <h2 className="font-serif text-lg font-bold text-primary mb-4">Tarification</h2>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-primary">
                      {service.price_amount}€
                    </span>
                    {service.price_type === "hourly" && (
                      <span className="text-gray-600">/heure</span>
                    )}
                    {service.price_type === "fixed" && (
                      <span className="text-gray-600">tarif fixe</span>
                    )}
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="border-t border-gray-100 pt-6">
                <h2 className="font-serif text-lg font-bold text-primary mb-4">À propos</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-base">
                  {service.description}
                </p>
              </div>

              {/* Tags/Skills */}
              {service.tags && service.tags.length > 0 && (
                <div className="border-t border-gray-100 pt-6">
                  <h2 className="font-serif text-lg font-bold text-primary mb-4">
                    Compétences
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {service.tags.map((tag: string) => (
                      <span
                        key={tag}
                        className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Provider Card */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 sticky top-4 space-y-6">
              {/* Provider Header */}
              <div className="flex gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gray-100 flex-shrink-0 flex items-center justify-center overflow-hidden">
                  {provider?.avatar_url ? (
                    <img
                      src={provider.avatar_url}
                      alt={provider.first_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-sm font-bold text-gray-600">
                      {getInitials(provider?.first_name || "P")}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-serif text-lg font-bold text-primary">
                    {provider?.first_name}
                    {provider?.last_name && ` ${provider.last_name}`}
                  </h2>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {provider?.is_super_pro && (
                      <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-semibold">
                        <Award className="w-3 h-3" />
                        Super Pro
                      </div>
                    )}
                    {provider?.is_verified && (
                      <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-accent/10 text-accent rounded-full text-xs font-semibold">
                        <Shield className="w-3 h-3" />
                        Vérifié
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div className="border-t border-gray-100 pt-6">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.round(provider?.average_rating || 0)
                            ? "fill-accent text-accent"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <div>
                    <p className="font-semibold text-primary">
                      {provider?.average_rating ? provider.average_rating.toFixed(1) : "N/A"}
                    </p>
                    {provider?.total_reviews ? (
                      <p className="text-xs text-gray-500">
                        {provider.total_reviews} {provider.total_reviews > 1 ? "avis" : "avis"}
                      </p>
                    ) : (
                      <p className="text-xs text-gray-500">Nouveau</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Bio */}
              {provider?.bio && (
                <div className="border-t border-gray-100 pt-6">
                  <p className="text-gray-700 text-sm leading-relaxed">{provider.bio}</p>
                </div>
              )}

              {/* Location */}
              {provider?.city && (
                <div className="border-t border-gray-100 pt-6 flex items-center gap-2 text-gray-600 text-sm">
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  {provider.city}
                </div>
              )}

              {/* Action Buttons */}
              <div className="border-t border-gray-100 pt-6 space-y-3">
                <Link href={`/profile/${provider?.id}`} className="block">
                  <Button variant="outline" className="w-full">
                    Voir le profil
                  </Button>
                </Link>
                <Link href={`/dashboard/messages?provider=${provider?.id}`} className="block">
                  <Button className="w-full">
                    Contacter
                  </Button>
                </Link>
              </div>

              {/* Client Wrapper for interactive elements */}
              <ServiceDetailClientWrapper
                serviceId={service.id}
                serviceName={service.title}
                price={service.price_amount}
                priceType={service.price_type}
              />
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
