"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send, Loader2, Sparkles } from "lucide-react";
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
  missionApplicationSchema,
  type MissionApplicationInput,
} from "@/lib/validation";

interface MissionApplyFormProps {
  missionId: string;
  companyName: string;
}

export function MissionApplyForm({
  missionId,
  companyName,
}: MissionApplyFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<MissionApplicationInput>({
    resolver: zodResolver(missionApplicationSchema),
    defaultValues: {
      missionId,
      coverMessage: "",
      proposedRate: undefined,
    },
    mode: "onChange",
  });

  const onSubmit = async (values: MissionApplicationInput) => {
    setSubmitting(true);
    const res = await fetch("/api/missions/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const json = (await res.json()) as { error?: string; success?: boolean };
    setSubmitting(false);

    if (!res.ok || json.error) {
      toast({
        variant: "error",
        title: "Candidature impossible",
        description: json.error ?? "Une erreur est survenue.",
      });
      return;
    }

    toast({
      variant: "success",
      title: "Candidature envoyée !",
      description: `${companyName} la consultera dans les prochains jours.`,
    });
    router.refresh();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-secondary">
        <Sparkles className="h-5 w-5" />
        <h3 className="font-serif text-lg font-bold text-neutral-text">
          Postuler à cette mission
        </h3>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="coverMessage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lettre de motivation</FormLabel>
                <FormControl>
                  <textarea
                    {...field}
                    rows={6}
                    placeholder="Présentez-vous en quelques lignes : votre expérience, ce qui vous motive sur cette mission, votre disponibilité…"
                    disabled={submitting}
                    className="w-full resize-none rounded-2xl border-2 border-gray-200 bg-white px-4 py-3 text-sm text-neutral-text outline-none placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="proposedRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tarif proposé (optionnel, en €)</FormLabel>
                <FormControl>
                  <input
                    type="number"
                    min={0}
                    placeholder="Ex : 60"
                    value={field.value ?? ""}
                    onChange={(e) => {
                      const v = e.target.value;
                      field.onChange(v === "" ? undefined : Number(v));
                    }}
                    disabled={submitting}
                    className="h-12 w-full rounded-2xl border-2 border-gray-200 bg-white px-4 text-sm text-neutral-text outline-none placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={submitting || !form.formState.isValid}
            className="w-full gap-2"
          >
            {submitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            Envoyer ma candidature
          </Button>
        </form>
      </Form>
    </div>
  );
}
