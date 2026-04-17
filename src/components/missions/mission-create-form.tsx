"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import {
  missionCreateSchema,
  type MissionCreateInput,
} from "@/lib/validation";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  "Conseil & Stratégie",
  "Finance & Audit",
  "Ressources humaines",
  "Marketing & Vente",
  "IT & Digital",
  "Formation & Mentoring",
  "Production & Industrie",
  "Logistique & Supply Chain",
  "Juridique",
  "Autre",
];

const CONTRACT_TYPES: Array<{
  value: MissionCreateInput["contractType"];
  label: string;
  description: string;
}> = [
  { value: "consulting", label: "Consulting", description: "Mission d'expertise ponctuelle" },
  { value: "one_shot", label: "Ponctuel", description: "Intervention courte" },
  { value: "recurring", label: "Récurrent", description: "Engagement régulier" },
  { value: "part_time", label: "Temps partiel", description: "Quelques jours par semaine" },
];

const BUDGET_TYPES: Array<{
  value: MissionCreateInput["budgetType"];
  label: string;
}> = [
  { value: "hourly", label: "Horaire" },
  { value: "daily", label: "Journalier" },
  { value: "fixed", label: "Forfait" },
  { value: "negotiable", label: "À négocier" },
];

export function MissionCreateForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [skillInput, setSkillInput] = useState("");

  const form = useForm<MissionCreateInput>({
    resolver: zodResolver(missionCreateSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      city: "",
      remoteAllowed: false,
      contractType: "consulting",
      durationEstimate: "",
      budgetType: "daily",
      requiredSkills: [],
      status: "open",
    },
    mode: "onChange",
  });

  const skills = form.watch("requiredSkills") ?? [];
  const budgetType = form.watch("budgetType");

  const addSkill = () => {
    const v = skillInput.trim();
    if (!v || skills.includes(v) || skills.length >= 20) {
      setSkillInput("");
      return;
    }
    form.setValue("requiredSkills", [...skills, v], { shouldValidate: true });
    setSkillInput("");
  };

  const removeSkill = (s: string) => {
    form.setValue(
      "requiredSkills",
      skills.filter((x) => x !== s),
      { shouldValidate: true }
    );
  };

  const onSubmit = async (values: MissionCreateInput) => {
    setSubmitting(true);
    const res = await fetch("/api/missions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const json = (await res.json()) as { error?: string; id?: string };
    setSubmitting(false);

    if (!res.ok || json.error || !json.id) {
      toast({
        variant: "error",
        title: "Publication impossible",
        description: json.error ?? "Une erreur est survenue.",
      });
      return;
    }

    toast({
      variant: "success",
      title: "Mission publiée !",
      description: "Elle est maintenant visible par les experts retraités.",
    });
    router.push(`/missions/${json.id}`);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titre de la mission</FormLabel>
              <FormControl>
                <input
                  {...field}
                  placeholder="Ex : Audit financier court terme"
                  disabled={submitting}
                  className="h-12 w-full rounded-2xl border-2 border-gray-200 bg-white px-4 text-sm text-neutral-text outline-none placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description détaillée</FormLabel>
              <FormControl>
                <textarea
                  {...field}
                  rows={6}
                  placeholder="Contexte, objectifs, livrables attendus, prérequis…"
                  disabled={submitting}
                  className="w-full resize-none rounded-2xl border-2 border-gray-200 bg-white px-4 py-3 text-sm text-neutral-text outline-none placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Catégorie</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    disabled={submitting}
                    className="h-12 w-full rounded-2xl border-2 border-gray-200 bg-white px-4 text-sm text-neutral-text outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="">Choisir…</option>
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ville</FormLabel>
                <FormControl>
                  <input
                    {...field}
                    placeholder="Ex : Paris"
                    disabled={submitting}
                    className="h-12 w-full rounded-2xl border-2 border-gray-200 bg-white px-4 text-sm text-neutral-text outline-none placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="remoteAllowed"
          render={({ field }) => (
            <FormItem>
              <label className="flex cursor-pointer items-center gap-3 rounded-2xl border-2 border-gray-200 bg-white px-4 py-3 transition-colors hover:border-primary">
                <input
                  type="checkbox"
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                  disabled={submitting}
                  className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm font-medium text-neutral-text">
                  Mission réalisable à distance (full ou partiel)
                </span>
              </label>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="contractType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type d&apos;engagement</FormLabel>
              <FormControl>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {CONTRACT_TYPES.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => field.onChange(c.value)}
                      disabled={submitting}
                      className={cn(
                        "rounded-2xl border-2 p-3 text-left transition-colors",
                        field.value === c.value
                          ? "border-primary bg-primary/5"
                          : "border-gray-200 bg-white hover:border-primary/40"
                      )}
                    >
                      <p className="text-sm font-semibold text-neutral-text">
                        {c.label}
                      </p>
                      <p className="text-xs text-neutral-text/60">
                        {c.description}
                      </p>
                    </button>
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <FormField
            control={form.control}
            name="budgetType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type de budget</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    disabled={submitting}
                    className="h-12 w-full rounded-2xl border-2 border-gray-200 bg-white px-4 text-sm text-neutral-text outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  >
                    {BUDGET_TYPES.map((b) => (
                      <option key={b.value} value={b.value}>
                        {b.label}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {budgetType !== "negotiable" && (
            <>
              <FormField
                control={form.control}
                name="budgetMin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Min (€)</FormLabel>
                    <FormControl>
                      <input
                        type="number"
                        min={0}
                        value={field.value ?? ""}
                        onChange={(e) => {
                          const v = e.target.value;
                          field.onChange(v === "" ? undefined : Number(v));
                        }}
                        disabled={submitting}
                        className="h-12 w-full rounded-2xl border-2 border-gray-200 bg-white px-4 text-sm text-neutral-text outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="budgetMax"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max (€)</FormLabel>
                    <FormControl>
                      <input
                        type="number"
                        min={0}
                        value={field.value ?? ""}
                        onChange={(e) => {
                          const v = e.target.value;
                          field.onChange(v === "" ? undefined : Number(v));
                        }}
                        disabled={submitting}
                        className="h-12 w-full rounded-2xl border-2 border-gray-200 bg-white px-4 text-sm text-neutral-text outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}
        </div>

        <FormField
          control={form.control}
          name="durationEstimate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Durée estimée (optionnel)</FormLabel>
              <FormControl>
                <input
                  {...field}
                  placeholder="Ex : 3 mois, 20 jours, 1 jour/semaine…"
                  disabled={submitting}
                  className="h-12 w-full rounded-2xl border-2 border-gray-200 bg-white px-4 text-sm text-neutral-text outline-none placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <label className="text-sm font-semibold text-neutral-text">
            Compétences clés
          </label>
          <div className="flex gap-2">
            <input
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addSkill();
                }
              }}
              placeholder="Ex : Stratégie commerciale"
              disabled={submitting || skills.length >= 20}
              className="h-12 flex-1 rounded-2xl border-2 border-gray-200 bg-white px-4 text-sm text-neutral-text outline-none placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            <button
              type="button"
              onClick={addSkill}
              disabled={!skillInput.trim() || skills.length >= 20}
              className="flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-text text-white transition-colors hover:bg-neutral-text/90 disabled:opacity-40"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
          {skills.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {skills.map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center gap-1.5 rounded-full bg-secondary/10 px-3 py-1 text-sm font-medium text-secondary-700"
                >
                  {s}
                  <button
                    type="button"
                    onClick={() => removeSkill(s)}
                    className="rounded-full p-0.5 hover:bg-secondary/20"
                    aria-label={`Retirer ${s}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-gray-100 pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/missions")}
            disabled={submitting}
          >
            Annuler
          </Button>
          <Button
            type="submit"
            disabled={submitting || !form.formState.isValid}
            className="gap-2"
          >
            {submitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : null}
            Publier la mission
          </Button>
        </div>
      </form>
    </Form>
  );
}
