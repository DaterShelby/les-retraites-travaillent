"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useOnboardingStore } from "@/stores/onboarding";
import { RoleSelector } from "@/components/onboarding/role-selector";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { onboardingStep1Schema, type OnboardingStep1Input } from "@/lib/validation";
import { ChevronRight } from "lucide-react";

export default function Step1Page() {
  const router = useRouter();
  const { toast } = useToast();
  const { role, setRole, setStep } = useOnboardingStore();

  const initialRole =
    role && role !== "admin" ? (role as OnboardingStep1Input["role"]) : undefined;

  const form = useForm<OnboardingStep1Input>({
    resolver: zodResolver(onboardingStep1Schema),
    defaultValues: { role: initialRole },
    mode: "onChange",
  });

  const onSubmit = (values: OnboardingStep1Input) => {
    setRole(values.role);
    setStep(2);
    toast({
      variant: "success",
      title: "Profil enregistré",
      description: "Continuons votre inscription.",
    });
    router.push("/onboarding/step-2");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-3">
          <h2 className="font-serif text-3xl font-bold text-primary">
            Quel est votre profil&nbsp;?
          </h2>
          <p className="text-lg text-neutral-text/80">
            Choisissez le profil qui vous correspond le mieux pour commencer.
          </p>
        </div>

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <RoleSelector
                  selected={field.value ?? null}
                  onSelect={(role) => field.onChange(role)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button
            type="submit"
            size="lg"
            disabled={!form.formState.isValid}
            className="gap-2"
          >
            Continuer
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </form>
    </Form>
  );
}
