"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Tag, X, Check } from "lucide-react";

const CATEGORIES = [
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
  "Garde d'enfants",
  "Comptabilité",
  "Électricité",
  "Peinture",
];

const PRICE_TYPES = [
  { value: "hourly", label: "À l'heure" },
  { value: "fixed", label: "Prix fixe" },
  { value: "negotiable", label: "À négocier" },
];

export default function CreateListingPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    price_type: "hourly",
    price_amount: "",
    city: "",
    tags: [] as string[],
  });

  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [authLoading, user, router]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-neutral-cream flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 rounded-full border-2 border-gray-200 border-t-secondary animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const handlePriceTypeChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      price_type: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/services", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Une erreur est survenue.");
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard/listings?success=true");
      }, 1000);
    } catch (err) {
      console.error(err);
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  const descriptionLength = formData.description.length;
  const maxDescriptionLength = 2000;

  return (
    <main className="min-h-screen bg-neutral-cream">
      {/* Header */}
      <div className="border-b border-gray-200/50">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 py-8">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Créer une annonce
          </h1>
          <p className="text-gray-500">
            Partagez votre expertise et trouvez des missions enrichissantes.
          </p>
        </div>
      </div>

      {/* Form Container */}
      <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 rounded-2xl bg-success/10 border border-success/20 flex items-start gap-3 animate-slideUp">
            <Check className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
            <p className="text-success font-medium">
              Annonce créée avec succès ! Redirection en cours...
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-100/80 flex items-start gap-3">
            <div className="w-5 h-5 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-red-600 text-xs font-bold">!</span>
            </div>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section: Title */}
          <div className="space-y-2">
            <label htmlFor="title" className="block text-sm font-semibold text-gray-700">
              Titre de l'annonce
            </label>
            <input
              id="title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Ex: Initiation à l'informatique pour seniors"
              required
              disabled={loading}
              className="w-full px-4 py-3 h-12 rounded-2xl border border-gray-200 bg-white focus:bg-white focus:ring-2 focus:ring-primary/10 focus:border-primary/30 text-base transition-all outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <p className="text-xs text-gray-500">Minimum 5 caractères</p>
          </div>

          {/* Section: Description */}
          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-semibold text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Décrivez votre service en détail. Qu'allez-vous faire ? Quel est votre niveau d'expérience ?"
              required
              disabled={loading}
              rows={6}
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white focus:bg-white focus:ring-2 focus:ring-primary/10 focus:border-primary/30 text-base transition-all outline-none disabled:opacity-50 disabled:cursor-not-allowed resize-none"
            />
            <div className="flex justify-between items-center">
              <p className="text-xs text-gray-500">
                Minimum 10 caractères
              </p>
              <p className={`text-xs font-medium ${
                descriptionLength > maxDescriptionLength * 0.9
                  ? "text-red-600"
                  : "text-gray-500"
              }`}>
                {descriptionLength} / {maxDescriptionLength}
              </p>
            </div>
          </div>

          {/* Section: Category & Price Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Category */}
            <div className="space-y-2">
              <label htmlFor="category" className="block text-sm font-semibold text-gray-700">
                Catégorie
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                disabled={loading}
                className="w-full px-4 py-3 h-12 rounded-2xl border border-gray-200 bg-white focus:bg-white focus:ring-2 focus:ring-primary/10 focus:border-primary/30 text-base transition-all outline-none disabled:opacity-50 disabled:cursor-not-allowed appearance-none pr-10"
              >
                <option value="">Sélectionnez une catégorie</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Type */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">
                Type de tarification
              </label>
              <div className="space-y-2">
                {PRICE_TYPES.map((type) => (
                  <label
                    key={type.value}
                    className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <input
                      type="radio"
                      name="price_type"
                      value={type.value}
                      checked={formData.price_type === type.value}
                      onChange={(e) => handlePriceTypeChange(e.target.value)}
                      disabled={loading}
                      className="w-4 h-4 text-primary cursor-pointer"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      {type.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Section: Price Amount & City */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Price Amount */}
            {formData.price_type !== "negotiable" && (
              <div className="space-y-2">
                <label htmlFor="price_amount" className="block text-sm font-semibold text-gray-700">
                  {formData.price_type === "hourly"
                    ? "Tarif horaire (€)"
                    : "Tarif forfaitaire (€)"}
                </label>
                <input
                  id="price_amount"
                  type="number"
                  name="price_amount"
                  value={formData.price_amount}
                  onChange={handleInputChange}
                  placeholder="Ex: 25"
                  min="0"
                  step="0.01"
                  disabled={loading}
                  className="w-full px-4 py-3 h-12 rounded-2xl border border-gray-200 bg-white focus:bg-white focus:ring-2 focus:ring-primary/10 focus:border-primary/30 text-base transition-all outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            )}

            {/* City */}
            <div className="space-y-2">
              <label htmlFor="city" className="block text-sm font-semibold text-gray-700">
                Ville
              </label>
              <input
                id="city"
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="Ex: Paris"
                disabled={loading}
                className="w-full px-4 py-3 h-12 rounded-2xl border border-gray-200 bg-white focus:bg-white focus:ring-2 focus:ring-primary/10 focus:border-primary/30 text-base transition-all outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {/* Section: Tags */}
          <div className="space-y-2">
            <label htmlFor="tags" className="block text-sm font-semibold text-gray-700">
              Mots-clés (compétences)
            </label>
            <div className="flex gap-2">
              <input
                id="tags"
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="Tapez un mot-clé et appuyez sur Entrée"
                disabled={loading}
                className="flex-1 px-4 py-3 h-12 rounded-2xl border border-gray-200 bg-white focus:bg-white focus:ring-2 focus:ring-primary/10 focus:border-primary/30 text-base transition-all outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button
                type="button"
                onClick={handleAddTag}
                disabled={loading || !tagInput.trim()}
                className="px-6 h-12 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Tag className="w-4 h-4" />
              </button>
            </div>

            {/* Tags Pills */}
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-3">
                {formData.tags.map((tag) => (
                  <div
                    key={tag}
                    className="inline-flex items-center gap-2 bg-primary text-white px-3 py-1.5 rounded-full text-sm font-medium"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:opacity-80 transition-opacity"
                      aria-label={`Supprimer ${tag}`}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section: Preview */}
          <div className="border-t border-gray-200 pt-8">
            <h3 className="font-serif text-xl font-bold text-gray-900 mb-4">
              Aperçu de votre annonce
            </h3>
            <div className="rounded-3xl bg-white border border-gray-200 p-6 shadow-card hover:shadow-elevated transition-shadow">
              <div className="space-y-3">
                <h4 className="font-serif text-lg font-bold text-gray-900">
                  {formData.title || "Titre de l'annonce"}
                </h4>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {formData.description || "Votre description apparaîtra ici..."}
                </p>
                <div className="flex items-center justify-between pt-3">
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500">Catégorie</p>
                    <p className="text-sm font-medium text-gray-900">
                      {formData.category || "Non sélectionnée"}
                    </p>
                  </div>
                  {formData.price_type !== "negotiable" && formData.price_amount && (
                    <div className="text-right space-y-1">
                      <p className="text-xs text-gray-500">Tarif</p>
                      <p className="text-sm font-semibold text-secondary">
                        {formData.price_amount} €
                        {formData.price_type === "hourly" ? "/h" : ""}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Submit Section */}
          <div className="flex gap-4 pt-8">
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => router.back()}
              disabled={loading}
              className="flex-1"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              variant="secondary"
              size="lg"
              disabled={loading}
              className="flex-1"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Création en cours...
                </span>
              ) : (
                "Créer l'annonce"
              )}
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}
