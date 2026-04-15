import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { Metadata, ResolvingMetadata } from "next";
import type { Database } from "@/types/database";
import { Button } from "@/components/ui/button";
import { RatingStars } from "@/components/reviews/rating-stars";
import { MessageCircle, MapPin, Award } from "lucide-react";
import Link from "next/link";

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
    .select("*")
    .eq("id", params.id)
    .eq("role", "retiree")
    .single();

  if (!profile) {
    return {
      title: "Profil non trouvé",
    };
  }

  const typedProfile = profile as Database["public"]["Tables"]["user_profiles"]["Row"];

  return {
    title: `${typedProfile.first_name} - Les Retraités Travaillent`,
    description: typedProfile.bio || `Découvrez les services de ${typedProfile.first_name}`,
    openGraph: {
      title: `${typedProfile.first_name} - Les Retraités Travaillent`,
      description: typedProfile.bio || "Découvrez les services proposés",
      images: typedProfile.avatar_url
        ? [
            {
              url: typedProfile.avatar_url,
              width: 200,
              height: 200,
              alt: typedProfile.first_name,
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
    .eq("role", "retiree")
    .single();

  if (error || !profile) {
    notFound();
  }

  const typedProfile = profile as Database["public"]["Tables"]["user_profiles"]["Row"];

  // Fetch reviews
  const { data: reviews } = await supabase
    .from("reviews")
    .select("*")
    .eq("reviewee_id", profileId)
    .order("created_at", { ascending: false })
    .limit(5);

  const typedReviews = (reviews || []) as Database["public"]["Tables"]["reviews"]["Row"][];

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Avatar and Basic Info */}
            <div className="flex flex-col items-center md:items-start">
              {typedProfile.avatar_url && (
                <img
                  src={typedProfile.avatar_url}
                  alt={typedProfile.first_name}
                  className="w-32 h-32 rounded-full object-cover mb-4"
                />
              )}
              <h1 className="text-3xl font-serif font-bold text-primary mb-2">
                {typedProfile.first_name}
                {typedProfile.is_super_pro && (
                  <span className="ml-2 inline-flex items-center gap-1 text-sm bg-accent text-white px-3 py-1 rounded-full">
                    <Award className="w-4 h-4" />
                    Super Pro
                  </span>
                )}
              </h1>
              {typedProfile.city && (
                <div className="flex items-center gap-2 text-body text-gray-600 mb-4">
                  <MapPin className="w-4 h-4" />
                  {typedProfile.city}
                  {typedProfile.department && ` (${typedProfile.department})`}
                </div>
              )}
            </div>

            {/* Stats and Action */}
            <div className="flex-1 md:text-right">
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <p className="text-2xl font-serif font-bold text-primary">
                    {typedProfile.total_missions}
                  </p>
                  <p className="text-body-sm text-gray-500">Missions</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-serif font-bold text-primary">
                    {typedProfile.response_rate}%
                  </p>
                  <p className="text-body-sm text-gray-500">Réactivité</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-serif font-bold text-primary">
                    {typedProfile.total_reviews}
                  </p>
                  <p className="text-body-sm text-gray-500">Avis</p>
                </div>
              </div>

              <Link href={`/dashboard/messages?user=${typedProfile.id}`}>
                <Button className="w-full flex items-center justify-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Contacter
                </Button>
              </Link>
            </div>
          </div>

          {/* Bio */}
          {typedProfile.bio && (
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h2 className="text-lg font-serif font-bold text-primary mb-4">
                À propos
              </h2>
              <p className="text-body text-gray-700 whitespace-pre-wrap">
                {typedProfile.bio}
              </p>
            </div>
          )}
        </div>

        {/* Skills */}
        {typedProfile.skills && typedProfile.skills.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-serif font-bold text-primary mb-4">
              Compétences
            </h2>
            <div className="flex flex-wrap gap-2">
              {typedProfile.skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-primary rounded-full text-body-sm font-semibold border border-blue-200"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Ratings */}
        {typedProfile.total_reviews > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-serif font-bold text-primary mb-6">
              Avis des clients
            </h2>

            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-4">
                <div>
                  <div className="text-4xl font-serif font-bold text-primary">
                    {typedProfile.average_rating.toFixed(1)}
                  </div>
                  <p className="text-body-sm text-gray-600">sur 5</p>
                </div>
                <div>
                  <RatingStars
                    value={Math.round(typedProfile.average_rating)}
                    interactive={false}
                    size="lg"
                  />
                  <p className="text-body-sm text-gray-600 mt-2">
                    {typedProfile.total_reviews} avis
                  </p>
                </div>
              </div>
            </div>

            {/* Recent Reviews */}
            <div className="space-y-4">
              {typedReviews.length > 0 ? (
                typedReviews.map((review) => (
                  <div key={review.id} className="border-l-4 border-accent pl-4 py-2">
                    <div className="flex items-center justify-between mb-2">
                      <RatingStars
                        value={review.rating}
                        interactive={false}
                        size="sm"
                      />
                      <p className="text-body-sm text-gray-500">
                        {new Date(review.created_at).toLocaleDateString(
                          "fr-FR",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </p>
                    </div>
                    <p className="text-body text-gray-700">{review.comment}</p>
                  </div>
                ))
              ) : (
                <p className="text-body text-gray-500">Aucun avis pour le moment</p>
              )}
            </div>
          </div>
        )}

        {/* Verification Badge */}
        {typedProfile.is_verified && (
          <div className="bg-accent bg-opacity-10 rounded-lg p-6 flex items-center gap-3">
            <Award className="w-6 h-6 text-accent" />
            <div>
              <p className="text-body font-semibold text-accent">Profil vérifié</p>
              <p className="text-body-sm text-gray-600">
                Ce profil a été vérifié et respecte nos standards de qualité
              </p>
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
