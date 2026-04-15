"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useCallback } from "react";
import { SERVICE_CATEGORIES } from "@/lib/constants";
import { Button } from "@/components/ui/button";

export function FilterPanel() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [priceMin, setPriceMin] = useState(searchParams.get("priceMin") || "");
  const [priceMax, setPriceMax] = useState(searchParams.get("priceMax") || "");
  const [city, setCity] = useState(searchParams.get("city") || "");

  const handleFilter = useCallback(() => {
    const params = new URLSearchParams(searchParams);

    if (category) {
      params.set("category", category);
    } else {
      params.delete("category");
    }

    if (priceMin) {
      params.set("priceMin", priceMin);
    } else {
      params.delete("priceMin");
    }

    if (priceMax) {
      params.set("priceMax", priceMax);
    } else {
      params.delete("priceMax");
    }

    if (city) {
      params.set("city", city);
    } else {
      params.delete("city");
    }

    router.push(`/services?${params.toString()}`);
  }, [category, priceMin, priceMax, city, searchParams, router]);

  const handleReset = useCallback(() => {
    setCategory("");
    setPriceMin("");
    setPriceMax("");
    setCity("");
    router.push("/services");
  }, [router]);

  return (
    <div className="bg-white rounded-sm border border-gray-200 p-6 h-fit">
      <h2 className="font-serif font-bold text-lg text-neutral-text mb-6">
        Filtrer
      </h2>

      {/* Catégorie */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-neutral-text mb-2">
          Catégorie
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-3 py-2 rounded-sm border border-gray-300 focus:border-primary focus:outline-none text-sm"
        >
          <option value="">Toutes les catégories</option>
          {SERVICE_CATEGORIES.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      {/* Prix Min */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-neutral-text mb-2">
          Prix minimum (€)
        </label>
        <input
          type="number"
          value={priceMin}
          onChange={(e) => setPriceMin(e.target.value)}
          placeholder="Ex: 20"
          className="w-full px-3 py-2 rounded-sm border border-gray-300 focus:border-primary focus:outline-none text-sm"
          min="0"
        />
      </div>

      {/* Prix Max */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-neutral-text mb-2">
          Prix maximum (€)
        </label>
        <input
          type="number"
          value={priceMax}
          onChange={(e) => setPriceMax(e.target.value)}
          placeholder="Ex: 100"
          className="w-full px-3 py-2 rounded-sm border border-gray-300 focus:border-primary focus:outline-none text-sm"
          min="0"
        />
      </div>

      {/* Ville */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-neutral-text mb-2">
          Ville
        </label>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Ex: Paris"
          className="w-full px-3 py-2 rounded-sm border border-gray-300 focus:border-primary focus:outline-none text-sm"
        />
      </div>

      {/* Boutons */}
      <div className="flex gap-2">
        <Button
          onClick={handleFilter}
          variant="default"
          className="flex-1"
        >
          Appliquer
        </Button>
        <Button
          onClick={handleReset}
          variant="outline"
          className="flex-1"
        >
          Réinitialiser
        </Button>
      </div>
    </div>
  );
}
