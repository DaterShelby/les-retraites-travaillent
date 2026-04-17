"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { registerSchema, type RegisterInput } from "@/lib/validation";
import { SSOButtons } from "@/components/auth/sso-buttons";
import { AuthDivider } from "@/components/auth/auth-divider";
import {
  Users,
  Heart,
  Building2,
  ArrowRight,
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Check,
  Shield,
} from "lucide-react";

type UserRole = "retiree" | "client" | "company";

const ROLES: Array<{
  value: UserRole;
  label: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
}> = [
  {
    value: "retiree",
    label: "Je suis retraité",
    desc: "Je propose mes services et mon savoir-faire",
    icon: Users,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    value: "client",
    label: "Je cherche un service",
    desc: "Je trouve un prestataire de confiance",
    icon: Heart,
    color: "text-secondary",
    bgColor: "bg-secondary/10",
  },
  {
    value: "company",
    label: "Je recrute",
    desc: "Je cherche des profils seniors expérimentés",
    icon: Building2,
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
];

const calculatePasswordStrength = (
  pwd: string
): "weak" | "medium" | "strong" | null => {
  if (!pwd) return null;
  const hasUpper = /[A-Z]/.test(pwd);
  const hasLower = /[a-z]/.test(pwd);
  const hasNumber = /[0-9]/.test(pwd);
  const hasSpecial = /[^A-Za-z0-9]/.test(pwd);
  const isLong = pwd.length >= 8;

  if (hasUpper && hasLower && hasNumber && isLong && (hasSpecial || pwd.length >= 12))
    return "strong";
  if ((hasUpper || hasLower) && hasNumber && pwd.length >= 6) return "medium";
  return "weak";
};

const STRENGTH_LABEL = { weak: "Faible", medium: "Moyen", strong: "Fort" };
const STRENGTH_COLOR = {
  weak: "bg-red-400",
  medium: "bg-yellow-400",
  strong: "bg-green-500",
};

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const { toast } = useToast();

  const initialRole = searchParams.get("role") as UserRole | null;
  const validInitialRole =
    initialRole && ["retiree", "client", "company"].includes(initialRole)
      ? initialRole
      : undefined;

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: validInitialRole,
    },
    mode: "onChange",
  });

  const password = form.watch("password");
  const confirmPassword = form.watch("confirmPassword");
  const selectedRole = form.watch("role");
  const passwordStrength = calculatePasswordStrength(password);

  const onSubmit = async (values: RegisterInput) => {
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
          firstName: values.firstName.trim(),
          role: values.role,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        toast({
          variant: "error",
          title: "Création impossible",
          description: result.error || "Une erreur est survenue.",
        });
        return;
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (signInError) {
        toast({
          variant: "info",
          title: "Compte créé !",
          description: "Connectez-vous avec vos identifiants.",
        });
        router.push("/login");
        return;
      }

      toast({
        variant: "success",
        title: "Bienvenue !",
        description: "Continuons votre inscription.",
      });
      router.push("/onboarding");
    } catch {
      toast({
        variant: "error",
        title: "Erreur réseau",
        description: "Veuillez réessayer dans un instant.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main id="main-content" className="min-h-screen flex bg-neutral-cream">
      {/* Left side - Form */}
      <div className="w-full lg:w-[48%] flex flex-col px-6 sm:px-12 lg:px-16 py-8">
        {/* Top nav */}
        <div className="flex items-center justify-between mb-8 lg:mb-12">
          <Logo size="sm" />
          <Link
            href="/login"
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            Déjà membre ? <span className="text-secondary font-semibold">Se connecter</span>
          </Link>
        </div>

        {/* Form area */}
        <div className="flex-1 flex flex-col justify-center max-w-[440px] w-full mx-auto">
          <div className="mb-6">
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              Rejoignez la communauté
            </h1>
            <p className="text-gray-500 text-base">
              Créez votre compte en 2 minutes et commencez à faire la différence.
            </p>
          </div>

          <SSOButtons next="/onboarding/step-1" className="mb-5" />

          <AuthDivider label="ou avec votre email" className="mb-5" />

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {/* Role Selection */}
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Qui êtes-vous ?</FormLabel>
                    <FormControl>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {ROLES.map((role) => {
                          const Icon = role.icon;
                          const isSelected = selectedRole === role.value;
                          return (
                            <button
                              key={role.value}
                              type="button"
                              onClick={() => field.onChange(role.value)}
                              className={`relative flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-200 text-center group ${
                                isSelected
                                  ? "border-primary bg-primary/5 shadow-md scale-[1.02]"
                                  : "border-gray-200 hover:border-gray-300 bg-white hover:shadow-sm"
                              }`}
                            >
                              {isSelected && (
                                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center shadow-sm">
                                  <Check className="w-3.5 h-3.5 text-white" />
                                </div>
                              )}
                              <div
                                className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors ${
                                  isSelected ? role.bgColor : "bg-gray-100 group-hover:bg-gray-200"
                                }`}
                              >
                                <Icon
                                  className={`w-5 h-5 ${
                                    isSelected ? role.color : "text-gray-400"
                                  }`}
                                />
                              </div>
                              <div>
                                <p
                                  className={`font-semibold text-sm ${
                                    isSelected ? "text-gray-900" : "text-gray-700"
                                  }`}
                                >
                                  {role.label}
                                </p>
                                <p className="text-xs text-gray-500 mt-0.5 leading-tight">
                                  {role.desc}
                                </p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* First Name */}
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prénom</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                        <Input
                          {...field}
                          type="text"
                          placeholder="Votre prénom"
                          disabled={isLoading}
                          className="pl-12 h-14 rounded-2xl border-gray-200 bg-gray-50/50 focus:bg-white text-base"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adresse email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                        <Input
                          {...field}
                          type="email"
                          placeholder="votre@email.fr"
                          autoComplete="email"
                          disabled={isLoading}
                          className="pl-12 h-14 rounded-2xl border-gray-200 bg-gray-50/50 focus:bg-white text-base"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mot de passe</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                        <Input
                          {...field}
                          type={showPassword ? "text" : "password"}
                          placeholder="Minimum 8 caractères"
                          autoComplete="new-password"
                          disabled={isLoading}
                          className="pl-12 pr-12 h-14 rounded-2xl border-gray-200 bg-gray-50/50 focus:bg-white text-base"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors min-h-0"
                          aria-label={
                            showPassword
                              ? "Masquer le mot de passe"
                              : "Afficher le mot de passe"
                          }
                        >
                          {showPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    {password && passwordStrength && (
                      <div className="flex items-center gap-3">
                        <div className="flex gap-1.5 flex-1">
                          <div
                            className={`h-1.5 flex-1 rounded-full transition-colors ${STRENGTH_COLOR[passwordStrength]}`}
                          />
                          <div
                            className={`h-1.5 flex-1 rounded-full transition-colors ${
                              passwordStrength === "weak"
                                ? "bg-gray-200"
                                : STRENGTH_COLOR[passwordStrength]
                            }`}
                          />
                          <div
                            className={`h-1.5 flex-1 rounded-full transition-colors ${
                              passwordStrength === "strong"
                                ? STRENGTH_COLOR[passwordStrength]
                                : "bg-gray-200"
                            }`}
                          />
                        </div>
                        <span
                          className={`text-xs font-medium ${
                            passwordStrength === "weak"
                              ? "text-red-500"
                              : passwordStrength === "medium"
                              ? "text-yellow-600"
                              : "text-green-600"
                          }`}
                        >
                          {STRENGTH_LABEL[passwordStrength]}
                        </span>
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Confirm Password */}
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmer le mot de passe</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                        <Input
                          {...field}
                          type="password"
                          placeholder="Retapez votre mot de passe"
                          autoComplete="new-password"
                          disabled={isLoading}
                          className="pl-12 h-14 rounded-2xl border-gray-200 bg-gray-50/50 focus:bg-white text-base"
                        />
                        {confirmPassword && password === confirmPassword && (
                          <Check className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit */}
              <Button
                type="submit"
                className="w-full h-14 text-base font-semibold rounded-2xl bg-secondary hover:bg-secondary-500 text-white shadow-md hover:shadow-lg transition-all"
                disabled={isLoading || !form.formState.isValid}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Création en cours...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Créer mon compte
                    <ArrowRight className="w-5 h-5" />
                  </span>
                )}
              </Button>

              {/* Trust badges */}
              <div className="flex items-center justify-center gap-4 pt-2">
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Données sécurisées</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <Check className="w-3.5 h-3.5" />
                  <span>Gratuit</span>
                </div>
              </div>
            </form>
          </Form>
        </div>

        {/* Bottom */}
        <div className="mt-6 text-center text-xs text-gray-400">
          En créant un compte, vous acceptez nos{" "}
          <Link href="/cgu" className="underline hover:text-gray-600">
            conditions d&apos;utilisation
          </Link>{" "}
          et notre{" "}
          <Link href="/confidentialite" className="underline hover:text-gray-600">
            politique de confidentialité
          </Link>
        </div>
      </div>

      {/* Right side — gradient visual */}
      <div className="hidden lg:flex lg:w-[52%] relative overflow-hidden rounded-l-[48px]">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-800 via-primary to-primary-900" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-accent/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-secondary/15 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col justify-center p-16">
          <div className="max-w-md">
            <blockquote className="mb-8">
              <p className="text-white/90 text-xl font-serif italic leading-relaxed">
                &ldquo;À 67 ans, j&apos;ai retrouvé le plaisir de transmettre mon savoir. Cette plateforme m&apos;a redonné un but.&rdquo;
              </p>
            </blockquote>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl overflow-hidden flex-shrink-0 bg-white/10" />
              <div>
                <p className="text-white font-semibold text-sm">Michel R.</p>
                <p className="text-white/50 text-sm">Consultant en gestion, Paris</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
