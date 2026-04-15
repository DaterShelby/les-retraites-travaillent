"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useProfile } from "@/hooks/use-profile";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Check, X, Plus, Trash2 } from "lucide-react";
import type { UserProfileRow } from "@/types/database";

const SKILLS_OPTIONS = [
  "Plomberie",
  "Électricité",
  "Menuiserie",
  "Peinture",
  "Jardinage",
  "Nettoyage",
  "Réparation électronique",
  "Assistance informatique",
  "Couture",
  "Cuisine",
  "Soutien scolaire",
  "Babysitting",
  "Coaching sportif",
  "Photographie",
  "Design graphique",
  "Rédaction",
];

export default function SettingsProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading, error: profileError, refetch } = useProfile();
  const supabase = createClient();

  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
  const [saveMessage, setSaveMessage] = useState("");

  const [formData, setFormData] = useState<Partial<UserProfileRow>>({
    first_name: "",
    last_name: "",
    phone: "",
    city: "",
    department: "",
    bio: "",
    skills: [],
    availability: {},
    travel_radius_km: 20,
  });

  // Load profile data when available
  useEffect(() => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
        phone: profile.phone || "",
        city: profile.city || "",
        department: profile.department || "",
        bio: profile.bio || "",
        skills: profile.skills || [],
        availability: profile.availability || {},
        travel_radius_km: profile.travel_radius_km || 20,
      });
    }
  }, [profile]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev: Partial<UserProfileRow>) => ({ ...prev, [name]: value }));
  };

  const handleAddSkill = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills && !prev.skills.includes(skill)
        ? [...prev.skills, skill]
        : prev.skills,
    }));
  };

  const handleRemoveSkill = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills?.filter((s) => s !== skill) || [],
    }));
  };

  const handleTravelRadiusChange = (value: number) => {
    setFormData((prev) => ({ ...prev, travel_radius_km: value }));
  };

  const handleAvailabilityChange = (day: string) => {
    setFormData((prev) => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: !(prev.availability?.[day] as boolean),
      },
    }));
  };

  const handleSave = async () => {
    if (!user) {
      setSaveMessage("Utilisateur non authentifié");
      setSaveStatus("error");
      return;
    }

    setIsSaving(true);
    setSaveStatus("idle");

    try {
      const updateData: any = {
        first_name: formData.first_name || "",
        last_name: formData.last_name || null,
        phone: formData.phone || null,
        city: formData.city || null,
        department: formData.department || null,
        bio: formData.bio || null,
        skills: formData.skills || [],
        availability: formData.availability || {},
        travel_radius_km: formData.travel_radius_km || 20,
      };

      const { error } = await supabase
        .from("user_profiles")
        .update(updateData)
        .eq("id", user.id);

      if (error) {
        throw error;
      }

      setSaveStatus("success");
      setSaveMessage("Profil mis à jour avec succès");

      // Refetch profile to ensure data is up to date
      await refetch();

      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch (err) {
      setSaveStatus("error");
      setSaveMessage(
        err instanceof Error ? err.message : "Erreur lors de la sauvegarde"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const isLoading = authLoading || profileLoading;
  const selectedSkills = formData.skills || [];
  const availableSkills = SKILLS_OPTIONS.filter(
    (skill) => !selectedSkills.includes(skill)
  );

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-[#4A6670]">
          Paramètres du profil
        </h1>
        <p className="mt-2 text-[#2F3D42]/70">
          Gérez vos informations personnelles
        </p>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center rounded-2xl border border-[#F0917B]/20 bg-white p-12">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-[#F0917B]" />
            <p className="text-[#2F3D42]/60">Chargement du profil...</p>
          </div>
        </div>
      )}

      {profileError && (
        <div className="rounded-2xl border border-red-300 bg-red-50 p-4 text-sm text-red-700">
          Erreur lors du chargement du profil : {profileError.message}
        </div>
      )}

      {!isLoading && (
        <div className="space-y-6">
          {/* Photo Section */}
          <section className="overflow-hidden rounded-3xl border border-[#F0917B]/20 bg-white">
            <div className="border-b border-[#F0917B]/20 px-6 py-4">
              <h2 className="font-semibold text-[#4A6670]">Photo de profil</h2>
            </div>
            <div className="space-y-4 p-6">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-2xl bg-[#F0917B]/10 flex items-center justify-center text-2xl">
                  👤
                </div>
                <div>
                  <p className="text-sm font-medium text-[#4A6670]">
                    Avatar URL
                  </p>
                  <p className="text-xs text-[#2F3D42]/60">
                    Lien vers votre image de profil
                  </p>
                </div>
              </div>
              <Input
                type="url"
                name="avatar_url"
                placeholder="https://example.com/avatar.jpg"
                className="h-12 border-[#F0917B]/30 rounded-2xl"
              />
            </div>
          </section>

          {/* Informations Personnelles */}
          <section className="overflow-hidden rounded-3xl border border-[#F0917B]/20 bg-white">
            <div className="border-b border-[#F0917B]/20 px-6 py-4">
              <h2 className="font-semibold text-[#4A6670]">Informations personnelles</h2>
            </div>
            <div className="space-y-4 p-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-[#4A6670] mb-2">
                    Prénom
                  </label>
                  <Input
                    name="first_name"
                    value={formData.first_name || ""}
                    onChange={handleInputChange}
                    placeholder="Jean"
                    className="h-12 border-[#F0917B]/30 rounded-2xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#4A6670] mb-2">
                    Nom
                  </label>
                  <Input
                    name="last_name"
                    value={formData.last_name || ""}
                    onChange={handleInputChange}
                    placeholder="Dupont"
                    className="h-12 border-[#F0917B]/30 rounded-2xl"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#4A6670] mb-2">
                  Téléphone
                </label>
                <Input
                  name="phone"
                  type="tel"
                  value={formData.phone || ""}
                  onChange={handleInputChange}
                  placeholder="+33 6 12 34 56 78"
                  className="h-12 border-[#F0917B]/30 rounded-2xl"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#4A6670] mb-2">
                  Date de naissance (optionnel)
                </label>
                <Input
                  name="date_of_birth"
                  type="date"
                  className="h-12 border-[#F0917B]/30 rounded-2xl"
                />
              </div>
            </div>
          </section>

          {/* Localisation */}
          <section className="overflow-hidden rounded-3xl border border-[#F0917B]/20 bg-white">
            <div className="border-b border-[#F0917B]/20 px-6 py-4">
              <h2 className="font-semibold text-[#4A6670]">Localisation</h2>
            </div>
            <div className="space-y-4 p-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-[#4A6670] mb-2">
                    Ville
                  </label>
                  <Input
                    name="city"
                    value={formData.city || ""}
                    onChange={handleInputChange}
                    placeholder="Paris"
                    className="h-12 border-[#F0917B]/30 rounded-2xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#4A6670] mb-2">
                    Département
                  </label>
                  <Input
                    name="department"
                    value={formData.department || ""}
                    onChange={handleInputChange}
                    placeholder="75"
                    className="h-12 border-[#F0917B]/30 rounded-2xl"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* À Propos */}
          <section className="overflow-hidden rounded-3xl border border-[#F0917B]/20 bg-white">
            <div className="border-b border-[#F0917B]/20 px-6 py-4">
              <h2 className="font-semibold text-[#4A6670]">À propos</h2>
            </div>
            <div className="space-y-4 p-6">
              <div>
                <label className="block text-sm font-medium text-[#4A6670] mb-2">
                  Biographie
                </label>
                <textarea
                  name="bio"
                  value={formData.bio || ""}
                  onChange={handleInputChange}
                  placeholder="Parlez-nous un peu de vous..."
                  className="h-32 w-full rounded-2xl border border-[#F0917B]/30 bg-white p-4 text-[#2F3D42] placeholder:text-[#2F3D42]/50 focus:border-[#F0917B] focus:outline-none focus:ring-2 focus:ring-[#F0917B]/20"
                  maxLength={500}
                />
                <p className="mt-2 text-xs text-[#2F3D42]/60">
                  {(formData.bio || "").length}/500 caractères
                </p>
              </div>
            </div>
          </section>

          {/* Compétences */}
          <section className="overflow-hidden rounded-3xl border border-[#F0917B]/20 bg-white">
            <div className="border-b border-[#F0917B]/20 px-6 py-4">
              <h2 className="font-semibold text-[#4A6670]">Compétences</h2>
            </div>
            <div className="space-y-4 p-6">
              {selectedSkills.length > 0 && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[#4A6670]">
                    Vos compétences sélectionnées
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {selectedSkills.map((skill) => (
                      <button
                        key={skill}
                        onClick={() => handleRemoveSkill(skill)}
                        className="inline-flex items-center gap-2 rounded-full bg-[#F0917B] px-4 py-2 text-sm font-medium text-white hover:bg-[#F0917B]/90 transition-colors"
                      >
                        {skill}
                        <X className="h-4 w-4" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#4A6670]">
                  Ajouter une compétence
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableSkills.map((skill) => (
                    <button
                      key={skill}
                      onClick={() => handleAddSkill(skill)}
                      className="inline-flex items-center gap-2 rounded-full border border-[#F0917B]/30 bg-white px-4 py-2 text-sm font-medium text-[#4A6670] hover:border-[#F0917B] hover:bg-[#F0917B]/5 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                      {skill}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Préférences */}
          <section className="overflow-hidden rounded-3xl border border-[#F0917B]/20 bg-white">
            <div className="border-b border-[#F0917B]/20 px-6 py-4">
              <h2 className="font-semibold text-[#4A6670]">Préférences</h2>
            </div>
            <div className="space-y-6 p-6">
              {/* Travel Radius */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-[#4A6670]">
                  Rayon géographique: <strong>{formData.travel_radius_km} km</strong>
                </label>
                <input
                  type="range"
                  min="1"
                  max="100"
                  step="1"
                  value={formData.travel_radius_km || 20}
                  onChange={(e) => handleTravelRadiusChange(parseInt(e.target.value))}
                  className="h-2 w-full cursor-pointer rounded-lg bg-[#F0917B]/20 accent-[#F0917B]"
                />
                <div className="flex justify-between text-xs text-[#2F3D42]/60">
                  <span>1 km</span>
                  <span>50 km</span>
                  <span>100 km</span>
                </div>
              </div>

              {/* Availability */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-[#4A6670]">
                  Disponibilités
                </label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {[
                    { id: "monday", label: "Lundi" },
                    { id: "tuesday", label: "Mardi" },
                    { id: "wednesday", label: "Mercredi" },
                    { id: "thursday", label: "Jeudi" },
                    { id: "friday", label: "Vendredi" },
                    { id: "saturday", label: "Samedi" },
                    { id: "sunday", label: "Dimanche" },
                  ].map((day) => (
                    <button
                      key={day.id}
                      onClick={() => handleAvailabilityChange(day.id)}
                      className={`rounded-2xl border-2 py-3 px-4 text-sm font-medium transition-all ${
                        (formData.availability?.[day.id] as boolean)
                          ? "border-[#8FBFAD] bg-[#8FBFAD]/10 text-[#8FBFAD]"
                          : "border-[#F0917B]/30 bg-white text-[#2F3D42] hover:border-[#F0917B]/60"
                      }`}
                    >
                      {day.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Save Status */}
          {saveStatus === "success" && (
            <div className="flex items-center gap-2 rounded-2xl border border-green-300 bg-green-50 p-4 text-sm text-green-700">
              <Check className="h-5 w-5" />
              {saveMessage}
            </div>
          )}
          {saveStatus === "error" && (
            <div className="rounded-2xl border border-red-300 bg-red-50 p-4 text-sm text-red-700">
              {saveMessage}
            </div>
          )}

          {/* Save Button */}
          <div className="flex justify-end">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              size="lg"
              className="gap-2 bg-[#4A6670] hover:bg-[#4A6670]/90 text-white rounded-2xl h-12"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Sauvegarde en cours...
                </>
              ) : (
                <>
                  <Check className="h-5 w-5" />
                  Enregistrer les modifications
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
