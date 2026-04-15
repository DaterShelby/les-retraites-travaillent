"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/ui/logo";
import { createClient } from "@/lib/supabase/client";
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

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const initialRole = searchParams.get("role") as UserRole | null;

  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(
    initialRole && ["retiree", "client", "company"].includes(initialRole) ? initialRole : null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<
    "weak" | "medium" | "strong" | null
  >(null);

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
    if ((hasUpper || hasLower) && hasNumber && pwd.length >= 6)
      return "medium";
    return "weak";
  };

  const handlePasswordChange = (pwd: string) => {
    setPassword(pwd);
    setPasswordStrength(calculatePasswordStrength(pwd));
  };

  const strengthLabel = {
    weak: "Faible",
    medium: "Moyen",
    strong: "Fort",
  };

  const strengthColor = {
    weak: "bg-red-400",
    medium: "bg-yellow-400",
    strong: "bg-green-500",
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selectedRole) {
      setError("Veuillez sélectionner votre profil pour continuer.");
      return;
    }

    if (!firstName.trim()) {
      setError("Veuillez saisir votre prénom.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }

    if (passwordStrength === "weak") {
      setError(
        "Mot de passe trop faible. Ajoutez une majuscule, une minuscule et un chiffre."
      );
      return;
    }

    setLoading(true);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) {
        if (signUpError.message.includes("rate")) {
          setError(
            "Trop de tentatives d'inscription. Veuillez patienter quelques minutes avant de réessayer."
          );
        } else if (signUpError.message.includes("already")) {
          setError("Un compte existe déjà avec cet email. Essayez de vous connecter.");
        } else {
          setError(signUpError.message);
        }
        return;
      }

      if (data?.user) {
        const { error: profileError } = await supabase
          .from("user_profiles")
          .insert({
            id: data.user.id,
            email,
            first_name: firstName.trim(),
            role: selectedRole,
            created_at: new Date().toISOString(),
          });

        if (profileError) {
          setError(
            "Compte créé mais erreur lors de la configuration du profil. Connectez-vous pour terminer."
          );
          return;
        }
      }

      router.push("/onboarding");
    } catch {
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
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

          {/* Error alert */}
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-100 flex items-start gap-3 animate-slideUp">
              <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-red-600 text-xs font-bold">!</span>
              </div>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role Selection */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">
                Qui êtes-vous ?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {ROLES.map((role) => {
                  const Icon = role.icon;
                  const isSelected = selectedRole === role.value;
                  return (
                    <button
                      key={role.value}
                      type="button"
                      onClick={() => setSelectedRole(role.value)}
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
            </div>

            {/* First Name */}
            <div className="space-y-2">
              <label
                htmlFor="firstName"
                className="block text-sm font-semibold text-gray-700"
              >
                Prénom
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                <Input
                  id="firstName"
                  type="text"
                  placeholder="Votre prénom"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  disabled={loading}
                  required
                  className="pl-12 h-14 rounded-2xl border-gray-200 bg-gray-50/50 focus:bg-white text-base"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700"
              >
                Adresse email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                <Input
                  id="email"
                  type="email"
                  placeholder="votre@email.fr"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                  className="pl-12 h-14 rounded-2xl border-gray-200 bg-gray-50/50 focus:bg-white text-base"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700"
              >
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Minimum 8 caractères"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  disabled={loading}
                  required
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
              {password && passwordStrength && (
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5 flex-1">
                    <div
                      className={`h-1.5 flex-1 rounded-full transition-colors ${strengthColor[passwordStrength]}`}
                    ></div>
                    <div
                      className={`h-1.5 flex-1 rounded-full transition-colors ${
                        passwordStrength === "weak"
                          ? "bg-gray-200"
                          : strengthColor[passwordStrength]
                      }`}
                    ></div>
                    <div
                      className={`h-1.5 flex-1 rounded-full transition-colors ${
                        passwordStrength === "strong"
                          ? strengthColor[passwordStrength]
                          : "bg-gray-200"
                      }`}
                    ></div>
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
                    {strengthLabel[passwordStrength]}
                  </span>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-semibold text-gray-700"
              >
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Retapez votre mot de passe"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  required
                  className="pl-12 h-14 rounded-2xl border-gray-200 bg-gray-50/50 focus:bg-white text-base"
                />
                {confirmPassword && password === confirmPassword && (
                  <Check className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                )}
              </div>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full h-14 text-base font-semibold rounded-2xl bg-secondary hover:bg-secondary-500 text-white shadow-md hover:shadow-lg transition-all"
              disabled={loading}
            >
              {loading ? (
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
        </div>

        {/* Bottom */}
        <div className="mt-6 text-center text-xs text-gray-400">
          En créant un compte, vous acceptez nos{" "}
          <Link href="/cgu" className="underline hover:text-gray-600">
            conditions d'utilisation
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
              <div className="w-12 h-12 rounded-2xl overflow-hidden flex-shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
                  alt="Michel R."
                  className="w-full h-full object-cover"
                />
              </div>
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
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div></div>}>
      <RegisterForm />
    </Suspense>
  );
}
