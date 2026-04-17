"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Search,
  Filter,
  MapPin,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ServiceCard } from "@/components/services/service-card";
import { cn } from "@/lib/utils";

interface ServiceRow {
  id: string;
  title: string;
  description?: string | null;
  category?: string | null;
  price_type?: string | null;
  price_amount?: number | null;
  city?: string | null;
  department?: string | null;
  photos?: string[] | null;
  provider?: {
    first_name: string;
    avatar_url?: string | null;
    average_rating?: number;
    total_reviews?: number;
    is_verified?: boolean;
    is_super_pro?: boolean;
  } | null;
}

interface MarketplaceClientProps {
  services: ServiceRow[];
  total: number;
  page: number;
  pageSize: number;
  categories: string[];
  searchParams: {
    q?: string;
    category?: string;
    city?: string;
    priceMax?: string;
    sort?: "recent" | "rating" | "price_asc" | "price_desc";
  };
}

export function MarketplaceClient({
  services,
  total,
  page,
  pageSize,
  categories,
  searchParams: initial,
}: MarketplaceClientProps) {
  const router = useRouter();
  const params = useSearchParams();

  const [q, setQ] = useState(initial.q ?? "");
  const [city, setCity] = useState(initial.city ?? "");
  const [priceMax, setPriceMax] = useState(initial.priceMax ?? "");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const apply = (next: Record<string, string | undefined>) => {
    const url = new URLSearchParams(params.toString());
    Object.entries(next).forEach(([k, v]) => {
      if (!v) url.delete(k);
      else url.set(k, v);
    });
    url.delete("page");
    router.push(`/marketplace?${url.toString()}`);
  };

  const goToPage = (p: number) => {
    const url = new URLSearchParams(params.toString());
    if (p === 1) url.delete("page");
    else url.set("page", String(p));
    router.push(`/marketplace?${url.toString()}`);
  };

  const activeFilters = useMemo(() => {
    const out: Array<{ key: string; label: string }> = [];
    if (initial.category)
      out.push({ key: "category", label: initial.category });
    if (initial.city) out.push({ key: "city", label: initial.city });
    if (initial.priceMax)
      out.push({ key: "priceMax", label: `≤ ${initial.priceMax}€` });
    return out;
  }, [initial]);

  return (
    <main className="min-h-screen bg-neutral-cream pb-20">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-800 via-primary to-primary-900 px-6 pb-16 pt-12 text-white">
        <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-secondary/20 blur-3xl" />
        <div className="mx-auto max-w-6xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-medium text-white/80 backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5" />
            {total} expert{total > 1 ? "s" : ""} disponible
            {total > 1 ? "s" : ""}
          </div>
          <h1 className="font-serif text-3xl font-bold sm:text-4xl lg:text-5xl">
            Trouvez l&apos;expertise dont vous avez besoin
          </h1>
          <p className="mt-3 max-w-2xl text-base text-white/70 lg:text-lg">
            Des retraités passionnés et expérimentés à votre service, près de
            chez vous.
          </p>

          {/* Search */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              apply({ q, city, priceMax });
            }}
            className="mt-8 flex flex-col gap-3 rounded-3xl bg-white p-3 shadow-elevated sm:flex-row sm:items-center"
          >
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Rechercher un service, une compétence…"
                className="h-12 w-full rounded-2xl bg-transparent pl-12 pr-4 text-sm text-neutral-text outline-none placeholder:text-gray-400"
              />
            </div>
            <div className="relative sm:w-56">
              <MapPin className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Ville"
                className="h-12 w-full rounded-2xl bg-transparent pl-12 pr-4 text-sm text-neutral-text outline-none placeholder:text-gray-400"
              />
            </div>
            <Button
              type="submit"
              className="h-12 rounded-2xl bg-secondary px-6 text-sm font-semibold text-white hover:bg-secondary-500"
            >
              Rechercher
            </Button>
          </form>

          {/* Categories */}
          {categories.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => apply({ category: undefined })}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
                  !initial.category
                    ? "border-secondary bg-secondary text-white"
                    : "border-white/20 bg-white/5 text-white/70 hover:border-white/40 hover:text-white"
                )}
              >
                Tous
              </button>
              {categories.slice(0, 12).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => apply({ category: c })}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
                    initial.category === c
                      ? "border-secondary bg-secondary text-white"
                      : "border-white/20 bg-white/5 text-white/70 hover:border-white/40 hover:text-white"
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Toolbar */}
      <div className="sticky top-0 z-20 border-b border-gray-100 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-3 overflow-x-auto">
            <button
              type="button"
              onClick={() => setFiltersOpen(true)}
              className="flex shrink-0 items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-text hover:border-primary"
            >
              <Filter className="h-4 w-4" />
              Filtres
              {activeFilters.length > 0 && (
                <span className="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-white">
                  {activeFilters.length}
                </span>
              )}
            </button>
            {activeFilters.map((f) => (
              <Badge
                key={f.key}
                variant="default"
                className="shrink-0 cursor-pointer"
                onClick={() => apply({ [f.key]: undefined })}
              >
                {f.label}
                <X className="ml-1 h-3 w-3" />
              </Badge>
            ))}
          </div>
          <select
            value={initial.sort ?? "recent"}
            onChange={(e) => apply({ sort: e.target.value })}
            className="shrink-0 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-neutral-text focus:border-primary focus:outline-none"
          >
            <option value="recent">Plus récents</option>
            <option value="rating">Mieux notés</option>
            <option value="price_asc">Prix croissant</option>
            <option value="price_desc">Prix décroissant</option>
          </select>
        </div>
      </div>

      {/* Results */}
      <section className="mx-auto max-w-6xl px-6 py-10">
        {services.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={{
                    ...service,
                    provider: service.provider ?? undefined,
                  }}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => goToPage(page - 1)}
                  disabled={page <= 1}
                  className="flex h-10 items-center gap-1 rounded-xl border border-gray-200 bg-white px-4 text-sm font-semibold text-neutral-text transition-colors hover:border-primary disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Précédent
                </button>
                <span className="px-4 text-sm font-medium text-neutral-text/70">
                  Page {page} sur {totalPages}
                </span>
                <button
                  type="button"
                  onClick={() => goToPage(page + 1)}
                  disabled={page >= totalPages}
                  className="flex h-10 items-center gap-1 rounded-xl border border-gray-200 bg-white px-4 text-sm font-semibold text-neutral-text transition-colors hover:border-primary disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Suivant
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* Filters drawer */}
      {filtersOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40"
          onClick={() => setFiltersOpen(false)}
        >
          <div
            className="absolute right-0 top-0 flex h-full w-[min(420px,100vw)] flex-col bg-white shadow-elevated"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <h2 className="font-serif text-xl font-bold text-neutral-text">
                Filtres
              </h2>
              <button
                type="button"
                onClick={() => setFiltersOpen(false)}
                className="rounded-xl p-2 hover:bg-neutral-cream"
                aria-label="Fermer"
              >
                <X className="h-5 w-5 text-neutral-text" />
              </button>
            </div>
            <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-neutral-text">
                  Ville
                </label>
                <input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Toutes"
                  className="h-12 w-full rounded-2xl border-2 border-gray-200 bg-white px-4 text-sm text-neutral-text outline-none focus:border-primary"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-neutral-text">
                  Prix max (€/h)
                </label>
                <input
                  type="number"
                  min={0}
                  value={priceMax}
                  onChange={(e) => setPriceMax(e.target.value)}
                  placeholder="Sans limite"
                  className="h-12 w-full rounded-2xl border-2 border-gray-200 bg-white px-4 text-sm text-neutral-text outline-none focus:border-primary"
                />
              </div>
              <div className="space-y-3">
                <p className="text-sm font-semibold text-neutral-text">
                  Catégorie
                </p>
                <div className="flex flex-wrap gap-2">
                  {categories.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() =>
                        apply({
                          category: initial.category === c ? undefined : c,
                          q,
                          city,
                          priceMax,
                        })
                      }
                      className={cn(
                        "rounded-full border-2 px-3 py-1.5 text-xs font-semibold transition-colors",
                        initial.category === c
                          ? "border-primary bg-primary text-white"
                          : "border-gray-200 bg-white text-neutral-text hover:border-primary"
                      )}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="border-t border-gray-100 px-6 py-4">
              <Button
                type="button"
                onClick={() => {
                  setFiltersOpen(false);
                  apply({ q, city, priceMax });
                }}
                className="w-full"
              >
                Appliquer les filtres
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function EmptyState() {
  return (
    <div className="rounded-3xl border-2 border-dashed border-gray-200 bg-white px-6 py-16 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-primary/10">
        <Search className="h-7 w-7 text-primary" />
      </div>
      <h3 className="mt-6 font-serif text-2xl font-bold text-neutral-text">
        Aucun résultat
      </h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-neutral-text/60">
        Essayez d&apos;élargir votre recherche ou retirez certains filtres.
      </p>
      <Link
        href="/marketplace"
        className="mt-6 inline-flex items-center text-sm font-semibold text-secondary hover:text-secondary-500"
      >
        Voir tous les services
      </Link>
    </div>
  );
}
