import { createServerSupabaseClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Metadata, ResolvingMetadata } from "next";
import type { ServiceRow } from "@/types/database";
import { Button } from "@/components/ui/button";
import { RatingStars } from "@/components/reviews/rating-stars";
import { MessageCircle, MapPin, Award, Shield, Star } from "lucide-react";
import Link from "next/link";
import { ServiceCard } from "@/components/services/service-card";

type Props = {
  params: { id: string };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const supabase = createServerSupabaseClient();

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("id, first_name, bio, avatar_url")
    .eq("id", params.id)
    .single();

  if (!profile) {
    return {
      title: "Profil non trouvé",
    };
  }

  return {
    title: `${profile.first_name} - Les Retraités Travaillent`,
    description:
      profile.bio ||
      `Découvrez les services et l'expertise de ${profile.first_name} sur Les Retraités Travaillent`,
    openGraph: {
      title: `${profile.first_name} - Les Retraités Travaillent`,
      description:
        profile.bio || "Découvrez les services proposés sur Les Retraités Travaillent",
      images: profile.avatar_url
        ? [
            {
              url: profile.avatar_url,
              width: 200,
              height: 200,
              alt: profile.first_name,
            },
          ]
        : [],
    },
  };
}

async function ProfileContent({ profileId }: { profileId: string }) {
  const supabase = createServerSupabaseClient();

  // Fetch user profile
  const { data: profile, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", profileId)
    .single();

  if (error || !profile) {
    notFound();
  }

  // Fetch published services
  const { data: services } = await supabase
    .from("services")
    .select("*")
    .eq("provider_id", profileId)
    .eq("status", "published")
    .order("created_at", { ascending: false });

  const servicesWithProvider = (services || []).map((service: ServiceRow) => ({
    ...service,
    provider: {
      first_name: profile.first_name,
      avatar_url: profile.avatar_url,
      average_rating: profile.average_rating,
      total_reviews: profile.total_reviews,
      is_verified: profile.is_verified,
      is_super_pro: profile.is_super_pro,
    },
  }));

  // Fetch reviews (as reviewee)
  const { data: reviews } = await supabase
    .from("reviews")
    .select(
      `
      id,
      rating,
      comment,
      response,
      created_at,
      response_at,
      reviewer:reviewer_id(
        id,
        first_name,
        avatar_url
      )
    `
    )
    .eq("reviewee_id", profileId)
    .order("created_at", { ascending: false })
    .limit(10);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-[#F5F2EE]">
      {/* Profile Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-8">
            {/* Avatar and Basic Info */}
            <div className="flex flex-col items-center sm:items-start sm:flex-shrink-0">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gray-100 flex-shrink-0 flex items-center justify-center overflow-hidden mb-4 sm:mb-0">
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.first_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xl sm:text-2xl font-bold text-gray-600">
                    {getInitials(profile.first_name)}
                  </span>
                )}
              </div>

              <div className="text-center sm:text-left sm:flex-1">
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-primary mb-2">
                  {profile.first_name}
                  {profile.last_name && ` ${profile.last_name}`}
                </h1>

                <div className="flex flex-wrap justify-center sm:justify-start gap-2 mb-3">
                  {profile.is_super_pro && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 text-amber-700 rounded-full text-xs font-semibold">
                      <Award className="w-3.5 h-3.5" />
                      Super Pro
                    </div>
                  )}
                  {profile.is_verified && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-accent/10 text-accent rounded-full text-xs font-semibold">
                      <Shield className="w-3.5 h-3.5" />
                      Vérifié
                    </div>
                  )}
                </div>

                {profile.city && (
                  <div className="flex items-center justify-center sm:justify-start gap-2 text-gray-600 text-sm">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <span>{profile.city}</span>
                    {profile.department && <span className="text-gray-400">•</span>}
                    {profile.department && <span>{profile.department}</span>}
                  </div>
                )}
              </div>
            </div>

            {/* Stats and Action */}
            <div className="flex-1 flex flex-col">
              <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6">
                <div className="text-center p-4 bg-gray-50 rounded-2xl">
                  <p className="font-serif text-2xl sm:text-3xl font-bold text-primary mb-1">
                    {profile.total_missions || 0}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600 font-medium">
                    {profile.total_missions > 1 ? "Missions" : "Mission"}
                  </p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-2xl">
                  <p className="font-serif text-2xl sm:text-3xl font-bold text-primary mb-1">
                    {profile.response_rate || 0}%
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600 font-medium">Réactivité</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-2xl">
                  <p className="font-serif text-2xl sm:text-3xl font-bold text-primary mb-1">
                    {profile.total_reviews || 0}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600 font-medium">
                    {profile.total_reviews > 1 ? "Avis" : "Avis"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Link href={`/dashboard/messages?user=${profileId}`} className="block">
                  <Button variant="outline" className="w-full">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Contacter
                  </Button>
                </Link>
                <Link href={`/profile/${profileId}#services`} className="block">
                  <Button className="w-full">Voir les services</Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Bio */}
          {profile.bio && (
            <div className="mt-8 pt-8 border-t border-gray-100">
              <h2 className="font-serif text-lg font-bold text-primary mb-3">À propos</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-base">
                {profile.bio}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 sm:space-y-12">
        {/* Skills */}
        {profile.skills && profile.skills.length > 0 && (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8">
            <h2 className="font-serif text-2xl font-bold text-primary mb-6">Compétences</h2>
            <div className="flex flex-wrap gap-3">
              {profile.skills.map((skill: string) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-semibold"
                >
                  <span className="w-1.5 h-1.5 bg-accent rounded-full" />
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Services */}
        {servicesWithProvider.length > 0 && (
          <div id="services" className="space-y-6 scroll-mt-8">
            <h2 className="font-serif text-2xl font-bold text-primary">Mes services</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {servicesWithProvider.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          </div>
        )}

        {/* Reviews/Ratings */}
        {profile.total_reviews > 0 && (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="font-serif text-2xl font-bold text-primary mb-6">Avis clients</h2>

              {/* Rating Summary */}
              <div className="bg-gray-50 rounded-2xl p-6 mb-8">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                  <div className="text-center sm:text-left">
                    <p className="font-serif text-5xl font-bold text-primary">
                      {profile.average_rating.toFixed(1)}
                    </p>
                    <p className="text-gray-600 text-sm mt-1">sur 5</p>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-center sm:justify-start gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.round(profile.average_rating)
                              ? "fill-accent text-accent"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 font-medium">
                      {profile.total_reviews}{" "}
                      {profile.total_reviews > 1 ? "avis clients" : "avis client"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
              {reviews && reviews.length > 0 ? (
                reviews.map((review: any) => (
                  <div
                    key={review.id}
                    className="border-l-4 border-accent pl-4 sm:pl-6 py-4 space-y-3"
                  >
                    {/* Review Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="flex items-center gap-3">
                        {review.reviewer?.avatar_url && (
                          <img
                            src={review.reviewer.avatar_url}
                            alt={review.reviewer.first_name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        )}
                        <div>
                          <p className="text-sm font-semibold text-primary">
                            {review.reviewer?.first_name || "Anonyme"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(review.created_at).toLocaleDateString("fr-FR", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < review.rating
                                ? "fill-accent text-accent"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Review Comment */}
                    <p className="text-gray-700 text-sm leading-relaxed">{review.comment}</p>

                    {/* Provider Response */}
                    {review.response && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-xs font-semibold text-accent mb-2">
                          Réponse du prestataire
                        </p>
                        <p className="text-sm text-gray-700">{review.response}</p>
                        {review.response_at && (
                          <p className="text-xs text-gray-500 mt-2">
                            {new Date(review.response_at).toLocaleDateString("fr-FR", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-600 text-center py-8">Aucun avis pour le moment</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProfilePage({ params }: Props) {
  return <ProfileContent profileId={params.id} />;
}
