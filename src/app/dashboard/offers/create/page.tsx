"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";

interface FormError {
  field?: string;
  message: string;
}

const JOB_CATEGORIES = [
  { value: "it", label: "Informatique & Tech" },
  { value: "consulting", label: "Consulting" },
  { value: "management", label: "Management & Leadership" },
  { value: "sales", label: "Vente & Business Development" },
  { value: "marketing", label: "Marketing & Communication" },
  { value: "finance", label: "Finance & Comptabilité" },
  { value: "hr", label: "Ressources Humaines" },
  { value: "operations", label: "Opérations" },
  { value: "other", label: "Autre" },
];

const CONTRACT_TYPES = [
  { value: "cdi", label: "CDI" },
  { value: "cdd", label: "CDD" },
  { value: "stage", label: "Stage" },
  { value: "alternance", label: "Alternance" },
];

export default function CreateOfferPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<FormError | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    salary_min: "",
    salary_max: "",
    contract_type: "cdi",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
  };

  const validateForm = (): boolean => {
    if (!formData.title.trim()) {
      setError({ message: "Le titre du poste est requis" });
      return false;
    }
    if (formData.title.length < 5) {
      setError({ message: "Le titre doit contenir au moins 5 caractères" });
      return false;
    }
    if (!formData.description.trim()) {
      setError({ message: "La description est requise" });
      return false;
    }
    if (formData.description.length < 20) {
      setError({
        message: "La description doit contenir au moins 20 caractères",
      });
      return false;
    }
    if (!formData.category) {
      setError({ message: "Veuillez sélectionner une catégorie" });
      return false;
    }
    if (!formData.location.trim()) {
      setError({ message: "La localisation est requise" });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !user) return;

    setLoading(true);
    try {
      const { error: insertError } = await supabase.from("services").insert({
        provider_id: user.id,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        city: formData.location,
        price_type: "negotiable",
        tags: ["job_offer"],
        status: "published",
      });

      if (insertError) {
        setError({ message: "Erreur lors de la création de l'offre" });
        setLoading(false);
        return;
      }

      router.push("/dashboard/offers");
    } catch (err) {
      setError({
        message:
          err instanceof Error
            ? err.message
            : "Une erreur est survenue",
      });
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="max-w-3xl">
        <div className="h-96 bg-gray-100 rounded-3xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-serif font-bold text-gray-900">Publier une offre d'emploi</h1>
        <p className="text-neutral-text mt-3">Décrivez le poste et trouvez les meilleurs candidats</p>
      </div>

      {/* Form Card */}
      <Card className="rounded-3xl border-gray-200/50">
        <CardHeader>
          <CardTitle className="text-2xl">Détails de l'offre</CardTitle>
          <CardDescription>
            Remplissez les informations concernant le poste
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl">
              <p className="text-sm font-semibold text-red-800">{error.message}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Titre du poste*
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Ex: Chef de projet Senior"
                maxLength={100}
                className="w-full px-4 py-3 rounded-2xl border border-gray-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors text-sm"
              />
              <p className="mt-1 text-xs text-gray-500">
                {formData.title.length}/100 caractères
              </p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Description du poste*
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Décrivez les responsabilités, les qualifications requises, les avantages du poste..."
                rows={6}
                maxLength={2000}
                className="w-full px-4 py-3 rounded-2xl border border-gray-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors text-sm"
              />
              <p className="mt-1 text-xs text-gray-500">
                {formData.description.length}/2000 caractères
              </p>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Domaine*
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-2xl border border-gray-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors text-sm"
              >
                <option value="">Sélectionnez un domaine</option>
                {JOB_CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Localisation*
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Ex: Paris, France"
                className="w-full px-4 py-3 rounded-2xl border border-gray-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors text-sm"
              />
            </div>

            {/* Salary Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Salaire minimum (EUR/mois)
                </label>
                <input
                  type="number"
                  name="salary_min"
                  value={formData.salary_min}
                  onChange={handleChange}
                  placeholder="Ex: 2500"
                  className="w-full px-4 py-3 rounded-2xl border border-gray-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Salaire maximum (EUR/mois)
                </label>
                <input
                  type="number"
                  name="salary_max"
                  value={formData.salary_max}
                  onChange={handleChange}
                  placeholder="Ex: 4000"
                  className="w-full px-4 py-3 rounded-2xl border border-gray-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors text-sm"
                />
              </div>
            </div>

            {/* Contract Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Type de contrat
              </label>
              <select
                name="contract_type"
                value={formData.contract_type}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-2xl border border-gray-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors text-sm"
              >
                {CONTRACT_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Info Box */}
            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200">
              <p className="text-sm text-blue-900">
                Vous pouvez modifier ou supprimer votre offre à tout moment depuis votre tableau de bord.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1"
              >
                {loading ? "Publication en cours..." : "Publier l'offre"}
              </Button>
              <Link href="/dashboard/offers" className="flex-1">
                <Button
                  type="button"
                  variant="outline"
                  disabled={loading}
                  className="w-full"
                >
                  Annuler
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
