import { Metadata } from "next";
import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Phone, Mail, BadgeCheck } from "lucide-react";
import { redirect } from "next/navigation";

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
    description: service.description,
    openGraph: {
      title: service.title,
      description: service.description,
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
      department,
      photos,
      tags,
      created_at,
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
        phone,
        city
      )
    `
    )
    .eq("id", params.slug)
    .eq("status", "published")
    .single();

  if (error || !service) {
    redirect("/services");
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const provider = (Array.isArray(service.provider) ? service.provider[0] : service.provider) as any;

  return (
    <main className="min-h-screen bg-neutral-cream">
      {/* Breadcrumb */}
      <div className="bg-white shadow-subtle">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/services" className="text-primary hover:underline">
              Services
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-neutral-text font-medium">{service.category}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne principale */}
          <div className="lg:col-span-2">
            {/* Images */}
            <div className="bg-white rounded-sm border border-gray-200 p-6 mb-8">
              <div className="aspect-video bg-gradient-to-br from-primary-100 to-accent-100 rounded-sm flex items-center justify-center mb-4">
                <span className="text-white text-sm font-medium">
                  {service.photos?.[0] || "Photo du service"}
                </span>
              </div>
              {service.photos && service.photos.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {service.photos.map((photo: string, idx: number) => (
                    <div
                      key={idx}
                      className="aspect-square bg-gray-200 rounded-sm flex items-center justify-center"
                    >
                      <span className="text-xs text-gray-600">Photo {idx + 1}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Service info */}
            <div className="bg-white rounded-sm border border-gray-200 p-6">
              <div className="mb-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="font-serif text-3xl font-bold text-neutral-text mb-2">
                      {service.title}
                    </h1>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{service.city}</span>
                      {service.department && (
                        <>
                          <span className="text-gray-400">•</span>
                          <span>{service.department}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-accent-50 text-accent text-sm font-semibold rounded-sm">
                    {service.category}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8 border-b border-gray-200 pb-8">
                <h2 className="font-serif text-lg font-bold text-neutral-text mb-4">
                  À propos
                </h2>
                <p className="text-body text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {service.description}
                </p>
              </div>

              {/* Tags */}
              {service.tags && service.tags.length > 0 && (
                <div className="mb-8 border-b border-gray-200 pb-8">
                  <h2 className="font-serif text-lg font-bold text-neutral-text mb-4">
                    Compétences
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {service.tags.map((tag: string) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-accent-50 text-accent text-sm rounded-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Pricing */}
              <div className="bg-gray-50 rounded-sm p-6">
                <h2 className="font-serif text-lg font-bold text-neutral-text mb-4">
                  Tarification
                </h2>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-body text-gray-600">Type:</span>
                    <span className="font-semibold text-neutral-text">
                      {service.price_type === "hourly"
                        ? "Tarif horaire"
                        : service.price_type === "fixed"
                          ? "Tarif fixe"
                          : "À négocier"}
                    </span>
                  </div>
                  {service.price_amount && (
                    <div className="flex justify-between">
                      <span className="text-body text-gray-600">Montant:</span>
                      <span className="text-2xl font-bold text-primary">
                        {service.price_amount}€
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Provider */}
          <aside>
            <div className="bg-white rounded-sm border border-gray-200 p-6 sticky top-4">
              {/* Provider header */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-gray-300 flex-shrink-0 flex items-center justify-center overflow-hidden">
                    {provider?.avatar_url ? (
                      <img
                        src={provider.avatar_url}
                        alt={provider.first_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-sm font-bold text-gray-600">
                        {provider?.first_name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div className="flex-1">
                    <h2 className="font-serif text-xl font-bold text-neutral-text">
                      {provider?.first_name}
                      {provider?.last_name && ` ${provider.last_name}`}
                    </h2>
                    {provider?.is_verified && (
                      <div className="flex items-center gap-1 mt-1">
                        <BadgeCheck className="w-4 h-4 text-accent" />
                        <span className="text-xs font-semibold text-accent">Vérifié</span>
                      </div>
                    )}
                    {provider?.is_super_pro && (
                      <span className="inline-block mt-1 px-2 py-0.5 bg-secondary text-white text-xs font-semibold rounded">
                        Super Pro
                      </span>
                    )}
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(provider?.average_rating || 0)
                            ? "fill-secondary text-secondary"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-neutral-text">
                    {provider?.average_rating.toFixed(1)}
                  </span>
                  {provider?.total_reviews && (
                    <span className="text-sm text-gray-600">
                      ({provider.total_reviews} avis)
                    </span>
                  )}
                </div>
              </div>

              {/* Bio */}
              {provider?.bio && (
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <p className="text-body text-gray-700 leading-relaxed">
                    {provider.bio}
                  </p>
                </div>
              )}

              {/* Contact info */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <h3 className="font-semibold text-neutral-text text-sm mb-3">
                  Contact
                </h3>
                {provider?.phone && (
                  <a
                    href={`tel:${provider.phone}`}
                    className="flex items-center gap-2 text-sm text-primary hover:underline mb-2"
                  >
                    <Phone className="w-4 h-4" />
                    {provider.phone}
                  </a>
                )}
                {provider?.city && (
                  <p className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    {provider.city}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="space-y-2">
                <Link href={`/dashboard/messages?provider=${provider?.id}`}>
                  <Button variant="default" className="w-full">
                    Contacter
                  </Button>
                </Link>
                <Link href={`/services/${service.id}/booking`}>
                  <Button variant="secondary" className="w-full">
                    Réserver maintenant
                  </Button>
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
