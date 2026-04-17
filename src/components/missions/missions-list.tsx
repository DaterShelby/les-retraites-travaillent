"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Wifi,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { MissionCard, type MissionCardData } from "./mission-card";
import { cn } from "@/lib/utils";

interface MissionsListProps {
  missions: MissionCardData[];
  total: number;
  page: number;
  pageSize: number;
  searchParams: {
    q?: string;
    category?: string;
    city?: string;
    contractType?: string;
    remote?: string;
  };
}

const CONTRACT_FILTERS: Array<{ value: string; label: string }> = [
  { value: "consulting", label: "Consulting" },
  { value: "one_shot", label: "Ponctuel" },
  { value: "recurring", label: "Récurrent" },
  { value: "part_time", label: "Temps partiel" },
];

export function MissionsList({
  missions,
  total,
  page,
  pageSize,
  searchParams: initial,
}: MissionsListProps) {
  const router = useRouter();
  const params = useSearchParams();
  const [q, setQ] = useState(initial.q ?? "");
  const [city, setCity] = useState(initial.city ?? "");

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const apply = (next: Record<string, string | undefined>) => {
    const url = new URLSearchParams(params.toString());
    Object.entries(next).forEach(([k, v]) => {
      if (!v) url.delete(k);
      else url.set(k, v);
    });
    url.delete("page");
    router.push(`/missions?${url.toString()}`);
  };

  const goToPage = (p: number) => {
    const url = new URLSearchParams(params.toString());
    if (p === 1) url.delete("page");
    else url.set("page", String(p));
    router.push(`/missions?${url.toString()}`);
  };

  return (
    <div className="space-y-8">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          apply({ q, city });
        }}
        className="flex flex-col gap-3 rounded-3xl bg-white p-3 shadow-card sm:flex-row sm:items-center"
      >
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Mots-clés (consulting RH, finance, audit…)"
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
          className="h-12 rounded-2xl bg-primary px-6 text-sm font-semibold text-white hover:bg-primary-600"
        >
          Filtrer
        </Button>
      </form>

      <div className="flex flex-wrap gap-2">
        <FilterChip
          label="Tous"
          active={!initial.contractType}
          onClick={() => apply({ contractType: undefined })}
        />
        {CONTRACT_FILTERS.map((f) => (
          <FilterChip
            key={f.value}
            label={f.label}
            icon={<Briefcase className="h-3 w-3" />}
            active={initial.contractType === f.value}
            onClick={() =>
              apply({
                contractType: initial.contractType === f.value ? undefined : f.value,
              })
            }
          />
        ))}
        <FilterChip
          label="Distanciel"
          icon={<Wifi className="h-3 w-3" />}
          active={initial.remote === "1"}
          onClick={() =>
            apply({ remote: initial.remote === "1" ? undefined : "1" })
          }
        />
      </div>

      {missions.length === 0 ? (
        <div className="rounded-3xl border-2 border-dashed border-gray-200 bg-white px-6 py-16 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-primary/10">
            <Briefcase className="h-7 w-7 text-primary" />
          </div>
          <h3 className="mt-6 font-serif text-2xl font-bold text-neutral-text">
            Aucune mission ne correspond
          </h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-neutral-text/60">
            Essayez d&apos;élargir vos critères ou revenez plus tard — de
            nouvelles missions sont publiées chaque jour.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {missions.map((m) => (
              <MissionCard key={m.id} mission={m} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6">
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
    </div>
  );
}

function FilterChip({
  label,
  icon,
  active,
  onClick,
}: {
  label: string;
  icon?: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border-2 px-3 py-1.5 text-xs font-semibold transition-colors",
        active
          ? "border-primary bg-primary text-white"
          : "border-gray-200 bg-white text-neutral-text hover:border-primary"
      )}
    >
      {icon}
      {label}
    </button>
  );
}
