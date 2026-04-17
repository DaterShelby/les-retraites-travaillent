import Link from "next/link";
import {
  MapPin,
  Briefcase,
  Wifi,
  Calendar,
  Users,
  Building2,
  ShieldCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface MissionCardData {
  id: string;
  title: string;
  description: string;
  category: string;
  city: string;
  remote_allowed: boolean;
  contract_type: "one_shot" | "recurring" | "part_time" | "consulting";
  duration_estimate?: string | null;
  budget_type: "hourly" | "daily" | "fixed" | "negotiable";
  budget_min?: number | null;
  budget_max?: number | null;
  required_skills?: string[] | null;
  applications_count?: number;
  created_at: string;
  company?: {
    id: string;
    company_name?: string | null;
    first_name?: string | null;
    avatar_url?: string | null;
    sector?: string | null;
    is_verified?: boolean | null;
  } | null;
}

const CONTRACT_LABEL: Record<MissionCardData["contract_type"], string> = {
  one_shot: "Mission ponctuelle",
  recurring: "Mission récurrente",
  part_time: "Temps partiel",
  consulting: "Consulting",
};

const BUDGET_UNIT: Record<MissionCardData["budget_type"], string> = {
  hourly: "€/h",
  daily: "€/jour",
  fixed: "€",
  negotiable: "à négocier",
};

function formatBudget(m: MissionCardData): string {
  if (m.budget_type === "negotiable") return "Budget négociable";
  if (!m.budget_min && !m.budget_max) return "Budget à préciser";
  const unit = BUDGET_UNIT[m.budget_type];
  if (m.budget_min && m.budget_max && m.budget_min !== m.budget_max) {
    return `${m.budget_min}–${m.budget_max} ${unit}`;
  }
  return `${m.budget_min ?? m.budget_max} ${unit}`;
}

function formatRelative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86_400_000);
  if (days === 0) return "Aujourd'hui";
  if (days === 1) return "Hier";
  if (days < 7) return `il y a ${days} j`;
  if (days < 30) return `il y a ${Math.floor(days / 7)} sem`;
  return `il y a ${Math.floor(days / 30)} mois`;
}

interface MissionCardProps {
  mission: MissionCardData;
  className?: string;
}

export function MissionCard({ mission, className }: MissionCardProps) {
  const company = mission.company;
  const companyName =
    company?.company_name || company?.first_name || "Entreprise";

  return (
    <Link
      href={`/missions/${mission.id}`}
      className={cn(
        "group block rounded-3xl border border-gray-100 bg-white p-6 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-elevated",
        className
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
            {company?.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={company.avatar_url}
                alt={companyName}
                className="h-12 w-12 rounded-2xl object-cover"
              />
            ) : (
              <Building2 className="h-6 w-6 text-primary" />
            )}
          </div>
          <div className="min-w-0">
            <p className="flex items-center gap-1.5 text-sm font-semibold text-neutral-text">
              {companyName}
              {company?.is_verified && (
                <ShieldCheck className="h-4 w-4 text-accent" />
              )}
            </p>
            {company?.sector && (
              <p className="text-xs text-neutral-text/60">{company.sector}</p>
            )}
          </div>
        </div>
        <span className="text-xs text-neutral-text/50">
          {formatRelative(mission.created_at)}
        </span>
      </div>

      <h3 className="mt-4 font-serif text-xl font-bold text-neutral-text group-hover:text-primary">
        {mission.title}
      </h3>
      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-neutral-text/70">
        {mission.description}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <Badge variant="default" size="sm">
          <Briefcase className="h-3 w-3" />
          {CONTRACT_LABEL[mission.contract_type]}
        </Badge>
        <Badge variant="outline" size="sm">
          <MapPin className="h-3 w-3" />
          {mission.city}
        </Badge>
        {mission.remote_allowed && (
          <Badge variant="accent" size="sm">
            <Wifi className="h-3 w-3" />
            Distanciel possible
          </Badge>
        )}
        {mission.duration_estimate && (
          <Badge variant="muted" size="sm">
            <Calendar className="h-3 w-3" />
            {mission.duration_estimate}
          </Badge>
        )}
      </div>

      {(mission.required_skills?.length ?? 0) > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {mission.required_skills!.slice(0, 4).map((s) => (
            <span
              key={s}
              className="rounded-full bg-neutral-cream px-2.5 py-0.5 text-[11px] font-medium text-neutral-text/70"
            >
              {s}
            </span>
          ))}
          {(mission.required_skills?.length ?? 0) > 4 && (
            <span className="rounded-full bg-neutral-cream px-2.5 py-0.5 text-[11px] font-medium text-neutral-text/50">
              +{mission.required_skills!.length - 4}
            </span>
          )}
        </div>
      )}

      <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
        <p className="font-semibold text-secondary-700">
          {formatBudget(mission)}
        </p>
        <span className="flex items-center gap-1 text-xs text-neutral-text/60">
          <Users className="h-3.5 w-3.5" />
          {mission.applications_count ?? 0} candidat
          {(mission.applications_count ?? 0) > 1 ? "s" : ""}
        </span>
      </div>
    </Link>
  );
}
