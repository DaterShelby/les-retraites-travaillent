"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { Users, Heart, Building2 } from "lucide-react";

type UserRole = "retiree" | "client" | "company";

const ROLES: Array<{
  value: UserRole;
  label: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  {
    value: "retiree",
    label: "Je suis retraité",
    desc: "Je veux proposer mes services",
    icon: Users,
  },
  {
    value: "client",
    label: "Je cherche un service",
    desc: "Je veux trouver un prestataire",
    icon: Heart,
  },
  {
    value: "company",
    label: "Je recrute",
    desc: "Je cherche des profils seniors",
    icon: Building2,
  },
];

export default function RegisterPage() {
  const router = useRouter();
  const supabase = createClient();
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [passwordStrength, setPasswordStrength] = useState<"weak" | "medium" | "strong" | null>(null);

  const calculatePasswordStrength = (pwd: string): "weak" | "medium" | "strong" | null => {
    if (!pwd) return null;
    const hasUpper = /[A-Z]/.test(pwd);
    const hasLower = /[a-z]/.test(pwd);
    const hasNumber = /[0-9]/.test(pwd);
    const isLongEnough = pwd.length >= 8;

    if (hasUpper && hasLower && hasNumber && isLongEnough) return "strong";
    if ((hasUpper || hasLower) && hasNumber && pwd.length >= 6) return "medium";
    return "weak";
  };

  const handlePasswordChange = (pwd: string) => {
    setPassword(pwd);
    setPasswordStrength(calculatePasswordStrength(pwd));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selectedRole) {
      setError("Veuillez sélectionner votre profil");
      return;
    }

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    if (passwordStrength === "weak") {
      setError("Mot de passe trop faible. Utilisez au moins une majuscule, une minuscule et un chiffre.");
      return;
    }

    setLoading(true);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      if (data?.user) {
        const { error: profileError } = await supabase.from("user_profiles").insert({
          id: data.user.id,
          email,
          first_name: firstName,
          role: selectedRole,
          created_at: new Date().toISOString(),
        });

        if (profileError) {
          setError("Erreur lors de la création du profil");
          return;
        }
      }

      router.push("/onboarding");
    } catch (err) {
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main id="main-content" className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-12 py-12">
        <div className="w-full max-w-sm">
          {/* Logo */}
          <Link href="/" className="inline-block mb-12">
            <span className="font-serif text-xl font-bold text-primary hover:opacity-80 transition-opacity">
              Les Retraités Travaillent
            </span>
          </Link>

          {/* Title */}
          <h1 className="font-serif text-3xl font-bold text-gray-900 mb-2">
            Rejoignez la communauté
          </h1>
          <p className="text-body text-gray-600 mb-8">
            Créez votre compte et commencez à faire la différence.
          </p>

          {/* Form Card */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 rounded-lg bg-error-50 border border-error-200 text-error text-body-sm">
                {error}
              </div>
            )}

            {/* Role Selection */}
            <div className="space-y-3">
              <label className="block text-body font-medium text-gray-900">
                Qui êtes-vous ?
              </label>
              <div className="space-y-2">
                {ROLES.map((role) => {
                  const Icon = role.icon;
                  const isSelected = selectedRole === role.value;
                  return (
                    <button
                      key={role.value}
                      type="button"
                      onClick={() => setSelectedRole(role.value)}
                      className={`w-full flex items-start gap-3 p-4 rounded-xl border-2 transition-all duration-200 ${
                        isSelected
                          ? "border-primary bg-primary-50"
                          : "border-gray-200 hover:border-primary-200 bg-white"
                      }`}
                    >
                      <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${isSelected ? "text-primary" : "text-gray-400"}`} />
                      <div className="text-left">
                        <p className={`font-medium ${isSelected ? "text-primary" : "text-gray-900"}`}>
                          {role.label}
                        </p>
                        <p className="text-body-sm text-gray-500">{role.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* First Name */}
            <div className="space-y-2">
              <label htmlFor="firstName" className="block text-body font-medium text-gray-900">
                Prénom
              </label>
              <Input
                id="firstName"
                type="text"
                placeholder="Votre prénom"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-body font-medium text-gray-900">
                Adresse email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="votre@email.fr"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-body font-medium text-gray-900">
                Mot de passe
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Minimum 8 caractères"
                autoComplete="new-password"
                value={password}
                onChange={(e) => handlePasswordChange(e.target.value)}
                disabled={loading}
                required
              />
              {password && (
                <div className="flex gap-2 mt-2">
                  <div className={`h-2 flex-1 rounded-full ${passwordStrength === "weak" ? "bg-error" : passwordStrength === "medium" ? "bg-yellow-400" : "bg-green-500"}`}></div>
                  <div className={`h-2 flex-1 rounded-full ${!passwordStrength || passwordStrength === "weak" ? "bg-gray-200" : passwordStrength === "medium" ? "bg-yellow-400" : "bg-green-500"}`}></div>
                  <div className={`h-2 flex-1 rounded-full ${passwordStrength !== "strong" ? "bg-gray-200" : "bg-green-500"}`}></div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-body font-medium text-gray-900">
                Confirmer le mot de passe
              </label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Retapez votre mot de passe"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Création en cours..." : "Créer mon compte"}
            </Button>
          </form>

          {/* Sign in link */}
          <p className="mt-8 text-center text-body text-gray-600">
            Déjà un compte ?{" "}
            <Link href="/login" className="text-primary font-medium hover:text-primary-600 transition-colors duration-200">
              Se connecter
            </Link>
          </p>
        </div>
      </div>

      {/* Right side - Decorative gradient (desktop only) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-secondary to-secondary-600 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px)",
            backgroundSize: "50px 50px"
          }}></div>
        </div>
        <div className="relative z-10 text-white text-center max-w-sm">
          <h2 className="font-serif text-4xl font-bold mb-4">
            Valorisez votre expérience
          </h2>
          <p className="text-lg text-white/80">
            Partagez vos talents, aidez d'autres, et créez des connexions significatives dans une communauté bienveillante.
          </p>
        </div>
      </div>
    </main>
  );
}
