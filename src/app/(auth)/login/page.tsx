"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
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
import { loginSchema, type LoginInput } from "@/lib/validation";
import { ArrowRight, Eye, EyeOff, Mail, Lock } from "lucide-react";
import { SSOButtons } from "@/components/auth/sso-buttons";
import { MagicLinkForm } from "@/components/auth/magic-link-form";
import { AuthDivider } from "@/components/auth/auth-divider";

export default function LoginPage() {
  return (
    <Suspense>
      <LoginPageInner />
    </Suspense>
  );
}

function LoginPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const errorMessage = searchParams.get("error");
    if (errorMessage) {
      toast({
        variant: "error",
        title: "Connexion impossible",
        description: errorMessage,
      });
      // Clean URL
      router.replace("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
    mode: "onChange",
  });

  const onSubmit = async (values: LoginInput) => {
    setIsLoading(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });
    setIsLoading(false);

    if (signInError) {
      let message = signInError.message;
      if (signInError.message.includes("Invalid login")) {
        message = "Email ou mot de passe incorrect.";
      } else if (signInError.message.includes("rate")) {
        message = "Trop de tentatives. Veuillez patienter quelques minutes.";
      }
      toast({
        variant: "error",
        title: "Connexion impossible",
        description: message,
      });
      return;
    }

    toast({
      variant: "success",
      title: "Bienvenue !",
      description: "Connexion réussie.",
    });
    router.push("/dashboard");
  };

  return (
    <main id="main-content" className="min-h-screen flex bg-neutral-cream">
      {/* Left side - Form */}
      <div className="w-full lg:w-[48%] flex flex-col px-6 sm:px-12 lg:px-16 py-8">
        {/* Top nav */}
        <div className="flex items-center justify-between mb-12 lg:mb-16">
          <Logo size="sm" />
          <Link
            href="/register"
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            Pas de compte ? <span className="text-secondary font-semibold">S&apos;inscrire</span>
          </Link>
        </div>

        {/* Form area */}
        <div className="flex-1 flex flex-col justify-center max-w-[420px] w-full mx-auto">
          <div className="mb-8">
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 mb-3 tracking-tight">
              Bon retour parmi nous
            </h1>
            <p className="text-gray-400 text-base">
              Connectez-vous pour accéder à votre espace.
            </p>
          </div>

          <SSOButtons next="/dashboard" disabled={isLoading} className="mb-5" />

          <AuthDivider label="ou par email" className="mb-5" />

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adresse email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 pointer-events-none" />
                        <input
                          {...field}
                          type="email"
                          placeholder="votre@email.fr"
                          autoComplete="email"
                          disabled={isLoading}
                          className="w-full pl-12 pr-4 h-14 rounded-2xl border border-gray-200 bg-white focus:bg-white focus:ring-2 focus:ring-primary/10 focus:border-primary/30 text-base transition-all outline-none"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between items-center">
                      <FormLabel>Mot de passe</FormLabel>
                      <Link
                        href="/forgot-password"
                        className="text-xs font-medium text-secondary hover:text-secondary-500 transition-colors"
                      >
                        Mot de passe oublié ?
                      </Link>
                    </div>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 pointer-events-none" />
                        <input
                          {...field}
                          type={showPassword ? "text" : "password"}
                          placeholder="Votre mot de passe"
                          autoComplete="current-password"
                          disabled={isLoading}
                          className="w-full pl-12 pr-12 h-14 rounded-2xl border border-gray-200 bg-white focus:bg-white focus:ring-2 focus:ring-primary/10 focus:border-primary/30 text-base transition-all outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors min-h-0"
                          aria-label={showPassword ? "Masquer" : "Afficher"}
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full h-14 text-base font-semibold rounded-2xl bg-secondary hover:bg-secondary-500 text-white shadow-sm hover:shadow-md"
                disabled={isLoading || !form.formState.isValid}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Connexion...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Se connecter
                    <ArrowRight className="w-5 h-5" />
                  </span>
                )}
              </Button>
            </form>
          </Form>

          <div className="mt-6 space-y-3">
            <AuthDivider label="ou recevez un lien magique" />
            <MagicLinkForm next="/dashboard" />
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-gray-300">
          En vous connectant, vous acceptez nos{" "}
          <Link href="/cgu" className="underline hover:text-gray-500">conditions d&apos;utilisation</Link>
        </div>
      </div>

      {/* Right side — gradient visual */}
      <div className="hidden lg:flex lg:w-[52%] relative overflow-hidden rounded-l-[48px]">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-800 via-primary to-primary-900" />
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-secondary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/3 w-[300px] h-[300px] bg-accent/15 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col justify-center p-16">
          <div className="max-w-md">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-2 mb-6 border border-white/10">
              <span className="w-2 h-2 bg-accent rounded-full"></span>
              <span className="text-white/70 text-sm font-medium">2 400+ experts actifs</span>
            </div>
            <h2 className="font-serif text-4xl font-bold text-white mb-5 tracking-tight leading-tight">
              Votre expérience a de la valeur
            </h2>
            <p className="text-white/50 text-lg leading-relaxed">
              Rejoignez des milliers d&apos;experts qui partagent leurs talents et trouvent des missions enrichissantes.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
