"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useOnboardingStore } from "@/stores/onboarding";
import { useAuth } from "@/hooks/use-auth";
import { createClient } from "@/lib/supabase/client";
import { SkillsPicker } from "@/components/onboarding/skills-picker";
import { Button } from "@/components/ui/button";
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
  onboardingStep3Schema,
  type OnboardingStep3Input,
} from "@/lib/validation";
import { ChevronRight, Loader2 } from "lucide-react";

export default function Step3Page() {
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  const supabase = createClient();
  const { role, selectedCategories, freeDescription, setSkills, setStep } =
    useOnboardingStore();
  const [isLoading, setIsLoading] = useState(false);

  const isRetired = role === "retiree";

  const form = useForm<OnboardingStep3Input>({
    resolver: zodResolver(onboardingStep3Schema),
    defaultValues: {
      selectedCategories: selectedCategories ?? [],
      freeDescription: freeDescription ?? "",
    },
    mode: "onChange",
  });

  const description = form.watch("freeDescription") ?? "";

  const onSubmit = async (values: OnboardingStep3Input) => {
    if (!user) {
      toast({
        variant: "error",
        title: "Session expirée",
        description: "Veuillez vous reconnecter pour continuer.",
      });
      router.push("/login");
      return;
    }

    setIsLoading(true);
    setSkills(values.selectedCategories, values.freeDescription ?? "");
    setStep(3);

    const { error: saveError } = await supabase
      .from("user_profiles")
      .update({
        skills: values.selectedCategories,
        bio: values.freeDescription || null,
      })
      .eq("id", user.id);

    setIsLoading(false);

    if (saveError) {
      toast({
        variant: "error",
        title: "Échec de la sauvegarde",
        description: saveError.message,
      });
      return;
    }

    toast({
      variant: "success",
      title: "Compétences enregistrées",
      description: "Encore une étape avant de finaliser.",
    });
    setStep(4);
    router.push("/onboarding/step-4");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-2">
          <h2 className="font-serif text-3xl font-bold text-primary">
            {isRetired ? "Vos compétences" : "Vos besoins"}
          </h2>
          <p className="text-lg text-neutral-text/80">
            {isRetired
              ? "Sélectionnez les domaines dans lesquels vous pouvez apporter votre aide."
              : "Sélectionnez les services dont vous avez besoin."}
          </p>
        </div>

        <FormField
          control={form.control}
          name="selectedCategories"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <SkillsPicker
                  selected={field.value}
                  onSelect={(values) => field.onChange(values)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="freeDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {isRetired
                  ? "Vos autres compétences (optionnel)"
                  : "Précisions supplémentaires (optionnel)"}
              </FormLabel>
              <FormControl>
                <textarea
                  {...field}
                  placeholder={
                    isRetired
                      ? "Décrivez d'autres compétences ou expériences pertinentes…"
                      : "Décrivez vos besoins spécifiques…"
                  }
                  maxLength={500}
                  className="h-32 w-full rounded-2xl border-2 border-gray-200 bg-white p-4 text-base text-neutral-text placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </FormControl>
              <div className="flex items-center justify-between">
                <FormMessage />
                <FormDescription>{description.length}/500 caractères</FormDescription>
              </div>
            </FormItem>
          )}
        />

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
                Sauvegarde…
              </>
            ) : (
              <>
                Continuer
                <ChevronRight className="h-5 w-5" />
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
