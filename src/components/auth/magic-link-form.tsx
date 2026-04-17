"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Send, Loader2, CheckCircle } from "lucide-react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/lib/supabase/client";
import { magicLinkSchema, type MagicLinkInput } from "@/lib/validation";
import { cn } from "@/lib/utils";

interface MagicLinkFormProps {
  next?: string;
  className?: string;
}

export function MagicLinkForm({ next, className }: MagicLinkFormProps) {
  const supabase = createClient();
  const { toast } = useToast();
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<MagicLinkInput>({
    resolver: zodResolver(magicLinkSchema),
    defaultValues: { email: "" },
    mode: "onChange",
  });

  const onSubmit = async ({ email }: MagicLinkInput) => {
    setSubmitting(true);
    const redirectTo = `${window.location.origin}/auth/callback${
      next ? `?next=${encodeURIComponent(next)}` : ""
    }`;

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectTo, shouldCreateUser: true },
    });
    setSubmitting(false);

    if (error) {
      toast({
        variant: "error",
        title: "Envoi impossible",
        description: error.message,
      });
      return;
    }

    setSent(true);
    toast({
      variant: "success",
      title: "Lien envoyé",
      description: "Consultez votre boîte mail pour vous connecter.",
    });
  };

  if (sent) {
    return (
      <div
        className={cn(
          "flex items-start gap-3 rounded-2xl border border-accent/20 bg-accent/5 p-4",
          className
        )}
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/15">
          <CheckCircle className="h-5 w-5 text-accent" />
        </div>
        <div className="space-y-1">
          <p className="font-semibold text-neutral-text">Lien envoyé</p>
          <p className="text-sm text-neutral-text/70">
            Cliquez sur le lien reçu par email pour vous connecter en un clic.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-2 sm:flex-row sm:items-start"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel className="sr-only">Email pour lien magique</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-300" />
                    <input
                      {...field}
                      type="email"
                      autoComplete="email"
                      placeholder="votre@email.fr"
                      disabled={submitting}
                      className="h-12 w-full rounded-2xl border-2 border-gray-200 bg-white pl-12 pr-4 text-sm text-neutral-text outline-none transition-all placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <button
            type="submit"
            disabled={submitting || !form.formState.isValid}
            className={cn(
              "flex h-12 items-center justify-center gap-2 rounded-2xl bg-neutral-text px-5 text-sm font-semibold text-white transition-colors",
              "hover:bg-neutral-text/90 focus:outline-none focus:ring-2 focus:ring-primary/30",
              "disabled:cursor-not-allowed disabled:opacity-50"
            )}
          >
            {submitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            Lien magique
          </button>
        </form>
      </Form>
    </div>
  );
}
