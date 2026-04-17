"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useOnboardingStore } from "@/stores/onboarding";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { ChevronRight, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { COMPANY_SIZES, SECTORS } from "@/lib/constants";
import {
  onboardingStep2Schema,
  onboardingStep2CompanySchema,
  type OnboardingStep2Input,
  type OnboardingStep2CompanyInput,
} from "@/lib/validation";

export default function Step2Page() {
  const { role } = useOnboardingStore();
  const isCompany = role === "company";

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="font-serif text-3xl font-bold text-primary">
          {isCompany ? "Informations de votre entreprise" : "Vos informations personnelles"}
        </h2>
        <p className="text-lg text-neutral-text/80">
          {isCompany
            ? "Entrez les détails de votre entreprise."
            : "Quelques informations pour mieux vous connaître."}
        </p>
      </div>

      {isCompany ? <CompanyForm /> : <PersonalForm />}
    </div>
  );
}

function PersonalForm() {
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  const supabase = createClient();
  const store = useOnboardingStore();
  const [isLoading, setIsLoading] = useState(false);
  const [bioValue, setBioValue] = useState("");
  const [phoneValue, setPhoneValue] = useState("");

  const form = useForm<OnboardingStep2Input>({
    resolver: zodResolver(onboardingStep2Schema),
    defaultValues: {
      firstName: store.firstName ?? "",
      lastName: store.lastName ?? "",
      city: store.city ?? "",
      avatarUrl: store.avatarUrl ?? "",
    },
    mode: "onChange",
  });

  const onSubmit = async (values: OnboardingStep2Input) => {
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
    store.setPersonalInfo(values);

    const { error } = await supabase
      .from("user_profiles")
      .update({
        first_name: values.firstName,
        last_name: values.lastName || null,
        city: values.city || null,
        phone: phoneValue || null,
        bio: bioValue || null,
        avatar_url: values.avatarUrl || null,
      })
      .eq("id", user.id);

    setIsLoading(false);

    if (error) {
      toast({
        variant: "error",
        title: "Échec de la sauvegarde",
        description: error.message,
      });
      return;
    }

    toast({
      variant: "success",
      title: "Informations enregistrées",
      description: "Continuons avec vos compétences.",
    });
    store.setStep(3);
    router.push("/onboarding/step-3");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prénom *</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Jean" className="h-12" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom (optionnel)</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Dupont" className="h-12" />
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
              <FormLabel>Ville *</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Paris" className="h-12" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <label htmlFor="phone" className="block text-sm font-semibold text-neutral-text">
            Téléphone (optionnel)
          </label>
          <Input
            id="phone"
            type="tel"
            value={phoneValue}
            onChange={(e) => setPhoneValue(e.target.value)}
            placeholder="+33 6 12 34 56 78"
            className="h-12"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="bio" className="block text-sm font-semibold text-neutral-text">
            À propos (optionnel)
          </label>
          <textarea
            id="bio"
            value={bioValue}
            onChange={(e) => setBioValue(e.target.value)}
            placeholder="Parlez-nous un peu de vous…"
            maxLength={500}
            className="h-24 w-full rounded-2xl border-2 border-gray-200 bg-white p-3 text-neutral-text placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <FormDescription>{bioValue.length}/500 caractères</FormDescription>
        </div>

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

function CompanyForm() {
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  const supabase = createClient();
  const store = useOnboardingStore();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<OnboardingStep2CompanyInput>({
    resolver: zodResolver(onboardingStep2CompanySchema),
    defaultValues: {
      companyName: store.companyName ?? "",
      siret: store.siret ?? "",
      sector: store.sector ?? "",
      companySize: store.companySize ?? "",
    },
    mode: "onChange",
  });

  const onSubmit = async (values: OnboardingStep2CompanyInput) => {
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
    store.setCompanyInfo(values);

    const { error } = await supabase
      .from("user_profiles")
      .update({
        company_name: values.companyName || null,
        siret: values.siret || null,
        sector: values.sector || null,
        company_size: values.companySize || null,
      })
      .eq("id", user.id);

    setIsLoading(false);

    if (error) {
      toast({
        variant: "error",
        title: "Échec de la sauvegarde",
        description: error.message,
      });
      return;
    }

    toast({
      variant: "success",
      title: "Entreprise enregistrée",
      description: "Continuons avec vos besoins.",
    });
    store.setStep(3);
    router.push("/onboarding/step-3");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="companyName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom de l&apos;entreprise *</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Tech Solutions SARL" className="h-12" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="siret"
          render={({ field }) => (
            <FormItem>
              <FormLabel>SIRET *</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="12345678901234"
                  maxLength={14}
                  className="h-12 font-mono"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sector"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Secteur d&apos;activité *</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Sélectionnez un secteur" />
                  </SelectTrigger>
                  <SelectContent>
                    {SECTORS.map((sector) => (
                      <SelectItem key={sector} value={sector}>
                        {sector}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="companySize"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Taille de l&apos;entreprise *</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Sélectionnez la taille" />
                  </SelectTrigger>
                  <SelectContent>
                    {COMPANY_SIZES.map((size) => (
                      <SelectItem key={size.value} value={size.value}>
                        {size.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
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
