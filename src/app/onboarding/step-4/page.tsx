"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useOnboardingStore } from "@/stores/onboarding";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import {
  onboardingStep4Schema,
  type OnboardingStep4Input,
} from "@/lib/validation";
import { ChevronRight, Loader2 } from "lucide-react";
import { saveOnboarding } from "./actions";
import { useAuth } from "@/hooks/use-auth";

const DAYS_OF_WEEK = [
  { id: "monday", label: "Lundi", shortLabel: "Lun" },
  { id: "tuesday", label: "Mardi", shortLabel: "Mar" },
  { id: "wednesday", label: "Mercredi", shortLabel: "Mer" },
  { id: "thursday", label: "Jeudi", shortLabel: "Jeu" },
  { id: "friday", label: "Vendredi", shortLabel: "Ven" },
  { id: "saturday", label: "Samedi", shortLabel: "Sam" },
  { id: "sunday", label: "Dimanche", shortLabel: "Dim" },
];

export default function Step4Page() {
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  const store = useOnboardingStore();
  const [isLoading, setIsLoading] = useState(false);

  const isRetired = store.role === "retiree";
  const isCompany = store.role === "company";
  const isClient = store.role === "client";
  const formRole =
    store.role && store.role !== "admin"
      ? (store.role as OnboardingStep4Input["role"])
      : undefined;

  const form = useForm<OnboardingStep4Input>({
    resolver: zodResolver(onboardingStep4Schema),
    defaultValues: {
      availableDays: store.availableDays ?? [],
      travelRadiusKm: store.travelRadiusKm ?? 20,
      hourlyRate: store.hourlyRate ?? undefined,
      role: formRole,
    },
    mode: "onChange",
  });

  const availableDays = form.watch("availableDays") ?? [];
  const travelRadius = form.watch("travelRadiusKm") ?? 20;

  const toggleDay = (dayId: string) => {
    const next = availableDays.includes(dayId)
      ? availableDays.filter((d) => d !== dayId)
      : [...availableDays, dayId];
    form.setValue("availableDays", next, { shouldValidate: true });
  };

  const onSubmit = async (values: OnboardingStep4Input) => {
    if (!user) {
      toast({
        variant: "error",
        title: "Session expirée",
        description: "Veuillez vous reconnecter.",
      });
      router.push("/login");
      return;
    }

    setIsLoading(true);

    store.setPreferences({
      availableDays: values.availableDays,
      travelRadiusKm: values.travelRadiusKm,
      hourlyRate: isRetired ? values.hourlyRate ?? null : null,
    });
    store.setStep(4);

    const currentState = useOnboardingStore.getState();
    const result = await saveOnboarding(user.id, currentState);

    setIsLoading(false);

    if (!result.success) {
      toast({
        variant: "error",
        title: "Échec de la sauvegarde",
        description: result.error || "Une erreur est survenue.",
      });
      return;
    }

    toast({
      variant: "success",
      title: "Profil finalisé !",
      description: "Bienvenue sur votre tableau de bord.",
    });
    router.push("/dashboard");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-2">
          <h2 className="font-serif text-3xl font-bold text-primary">
            {isCompany ? "Dernières informations" : "Vos préférences"}
          </h2>
          <p className="text-lg text-neutral-text/80">
            {isCompany
              ? "Presque fini ! Finalisez votre profil."
              : "Parlez-nous de vos disponibilités et vos attentes."}
          </p>
        </div>

        {isRetired && (
          <>
            <FormField
              control={form.control}
              name="availableDays"
              render={() => (
                <FormItem>
                  <FormLabel>Jours de disponibilité *</FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
                      {DAYS_OF_WEEK.map((day) => {
                        const selected = availableDays.includes(day.id);
                        return (
                          <button
                            key={day.id}
                            type="button"
                            onClick={() => toggleDay(day.id)}
                            className={`h-12 rounded-2xl border-2 font-medium transition-all text-xs sm:text-sm ${
                              selected
                                ? "border-secondary bg-secondary/10 text-secondary"
                                : "border-gray-200 bg-white text-neutral-text hover:border-gray-300"
                            }`}
                          >
                            <span className="hidden sm:inline">{day.label}</span>
                            <span className="sm:hidden">{day.shortLabel}</span>
                          </button>
                        );
                      })}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="hourlyRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tarif horaire (€) *</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type="number"
                        min="0"
                        step="0.5"
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === "" ? undefined : parseFloat(e.target.value)
                          )
                        }
                        placeholder="25"
                        className="h-12 pr-12"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                        €/h
                      </span>
                    </div>
                  </FormControl>
                  <FormDescription>Minimum recommandé : 15€/h</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        {(isRetired || isClient) && (
          <FormField
            control={form.control}
            name="travelRadiusKm"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Rayon géographique : <strong>{travelRadius} km</strong>
                </FormLabel>
                <FormControl>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    step="1"
                    value={field.value ?? 20}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                    className="h-2 w-full cursor-pointer rounded-lg bg-secondary/20 accent-secondary"
                  />
                </FormControl>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>1 km</span>
                  <span>50 km</span>
                  <span>100 km</span>
                </div>
              </FormItem>
            )}
          />
        )}

        {isCompany && (
          <div className="rounded-2xl border border-accent/30 bg-accent/5 p-4">
            <p className="text-sm text-neutral-text">
              Votre profil professionnel est presque prêt ! Vous pourrez ajouter des
              offres d&apos;emploi après validation.
            </p>
          </div>
        )}

        <div className="flex justify-end">
          <Button
            type="submit"
            size="lg"
            disabled={isLoading || !form.formState.isValid}
            className="gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Finalisation…
              </>
            ) : (
              <>
                Finaliser mon profil
                <ChevronRight className="h-5 w-5" />
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
