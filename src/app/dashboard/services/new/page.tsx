"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SERVICE_CATEGORIES } from "@/lib/constants";
import { createServiceAction } from "./actions";

interface FormError {
  field?: string;
  message: string;
}

export default function CreateServicePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<FormError | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    subcategory: "",
    priceType: "hourly",
    priceAmount: "",
    city: "",
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

  const validateStep = (step: number): boolean => {
    if (step === 1) {
      if (!formData.title.trim()) {
        setError({ message: "Le titre est requis" });
        return false;
      }
      if (formData.title.length < 5) {
        setError({
          message: "Le titre doit contenir au moins 5 caractères",
        });
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
    } else if (step === 2) {
      if (!formData.category) {
        setError({ message: "Veuillez choisir une catégorie" });
        return false;
      }
    } else if (step === 3) {
      if (!formData.priceType) {
        setError({ message: "Veuillez choisir un type de tarification" });
        return false;
      }
      if (
        (formData.priceType === "hourly" || formData.priceType === "fixed") &&
        !formData.priceAmount
      ) {
        setError({ message: "Veuillez indiquer le montant" });
        return false;
      }
    } else if (step === 4) {
      if (!formData.city.trim()) {
        setError({ message: "La ville est requise" });
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(4)) return;

    setLoading(true);
    const formDataObj = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formDataObj.append(key, value);
    });

    const result = await createServiceAction(formDataObj);
    if (result?.error) {
      setError({ message: result.error });
      setLoading(false);
    }
    // Sinon, la redirection se fera automatiquement
  };

  return (
    <main className="min-h-screen bg-neutral-cream">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold text-neutral-text mb-2">
            Créer une annonce
          </h1>
          <p className="text-body text-gray-600">
            Publiez votre service et trouvez des clients en quelques minutes
          </p>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`flex-1 h-2 rounded-full transition-colors ${
                  step <= currentStep ? "bg-primary" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
          <p className="mt-2 text-sm text-gray-600">
            Étape {currentStep} sur 4
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-sm border border-gray-200 p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-sm">
              <p className="text-sm font-semibold text-red-800">{error.message}</p>
            </div>
          )}

          {/* Step 1: Title & Description */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="font-serif text-2xl font-bold text-neutral-text">
                Décrivez votre service
              </h2>

              <div>
                <label className="block text-sm font-semibold text-neutral-text mb-2">
                  Titre du service*
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Ex: Assistance informatique pour seniors"
                  className="w-full px-4 py-3 rounded-sm border border-gray-300 focus:border-primary focus:outline-none text-sm"
                  maxLength={100}
                />
                <p className="mt-1 text-xs text-gray-500">
                  {formData.title.length}/100
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-neutral-text mb-2">
                  Description détaillée*
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Décrivez le service que vous proposez, vos qualifications, ce qui vous rend unique..."
                  rows={6}
                  className="w-full px-4 py-3 rounded-sm border border-gray-300 focus:border-primary focus:outline-none text-sm"
                  maxLength={2000}
                />
                <p className="mt-1 text-xs text-gray-500">
                  {formData.description.length}/2000
                </p>
              </div>
            </div>
          )}

          {/* Step 2: Category */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="font-serif text-2xl font-bold text-neutral-text">
                Catégorie et compétences
              </h2>

              <div>
                <label className="block text-sm font-semibold text-neutral-text mb-2">
                  Catégorie*
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-sm border border-gray-300 focus:border-primary focus:outline-none text-sm"
                >
                  <option value="">Sélectionnez une catégorie</option>
                  {SERVICE_CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-neutral-text mb-2">
                  Sous-catégorie (optionnel)
                </label>
                <input
                  type="text"
                  name="subcategory"
                  value={formData.subcategory}
                  onChange={handleChange}
                  placeholder="Ex: Dépannage réseau WiFi"
                  className="w-full px-4 py-3 rounded-sm border border-gray-300 focus:border-primary focus:outline-none text-sm"
                />
              </div>
            </div>
          )}

          {/* Step 3: Pricing */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="font-serif text-2xl font-bold text-neutral-text">
                Tarification
              </h2>

              <div>
                <label className="block text-sm font-semibold text-neutral-text mb-2">
                  Type de tarification*
                </label>
                <select
                  name="priceType"
                  value={formData.priceType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-sm border border-gray-300 focus:border-primary focus:outline-none text-sm"
                >
                  <option value="hourly">Tarif horaire</option>
                  <option value="fixed">Tarif fixe</option>
                  <option value="negotiable">À négocier</option>
                </select>
              </div>

              {formData.priceType !== "negotiable" && (
                <div>
                  <label className="block text-sm font-semibold text-neutral-text mb-2">
                    Montant (€)*
                  </label>
                  <input
                    type="number"
                    name="priceAmount"
                    value={formData.priceAmount}
                    onChange={handleChange}
                    placeholder="Ex: 25"
                    className="w-full px-4 py-3 rounded-sm border border-gray-300 focus:border-primary focus:outline-none text-sm"
                    min="0"
                    step="0.01"
                  />
                  {formData.priceType === "hourly" && (
                    <p className="mt-1 text-xs text-gray-500">
                      Tarif par heure
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Step 4: Location */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h2 className="font-serif text-2xl font-bold text-neutral-text">
                Localisation
              </h2>

              <div>
                <label className="block text-sm font-semibold text-neutral-text mb-2">
                  Ville*
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Ex: Paris"
                  className="w-full px-4 py-3 rounded-sm border border-gray-300 focus:border-primary focus:outline-none text-sm"
                />
              </div>

              <div className="bg-accent-50 border border-accent-200 rounded-sm p-4">
                <p className="text-sm text-accent-900">
                  Votre adresse complète ne sera pas affichée publiquement pour
                  votre sécurité. Seule la ville apparaîtra.
                </p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-8 flex gap-4">
            {currentStep > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={handlePrev}
                disabled={loading}
                className="flex-1"
              >
                Précédent
              </Button>
            )}

            {currentStep < 4 ? (
              <Button
                type="button"
                onClick={handleNext}
                disabled={loading}
                className="flex-1"
              >
                Suivant
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={loading}
                className="flex-1"
              >
                {loading ? "Création en cours..." : "Créer l'annonce"}
              </Button>
            )}
          </div>
        </form>
      </div>
    </main>
  );
}
