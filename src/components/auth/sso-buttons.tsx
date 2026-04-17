"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

type Provider = "google" | "apple";

interface SSOButtonsProps {
  /** Where to redirect after a successful OAuth round-trip */
  next?: string;
  /** Optional class for the wrapping grid */
  className?: string;
  /** Disable all buttons (e.g., parent form submitting) */
  disabled?: boolean;
}

const PROVIDER_LABEL: Record<Provider, string> = {
  google: "Continuer avec Google",
  apple: "Continuer avec Apple",
};

export function SSOButtons({ next, className, disabled }: SSOButtonsProps) {
  const supabase = createClient();
  const { toast } = useToast();
  const [pending, setPending] = useState<Provider | null>(null);

  const handleOAuth = async (provider: Provider) => {
    if (pending) return;
    setPending(provider);

    const redirectTo = `${window.location.origin}/auth/callback${
      next ? `?next=${encodeURIComponent(next)}` : ""
    }`;

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo,
        queryParams: { prompt: "select_account" },
      },
    });

    if (error) {
      setPending(null);
      toast({
        variant: "error",
        title: "Connexion impossible",
        description: error.message,
      });
    }
    // On success the browser is redirected, no further action needed
  };

  return (
    <div className={cn("grid grid-cols-1 gap-2 sm:grid-cols-2", className)}>
      <ProviderButton
        provider="google"
        label={PROVIDER_LABEL.google}
        onClick={() => handleOAuth("google")}
        loading={pending === "google"}
        disabled={disabled || (pending !== null && pending !== "google")}
      />
      <ProviderButton
        provider="apple"
        label={PROVIDER_LABEL.apple}
        onClick={() => handleOAuth("apple")}
        loading={pending === "apple"}
        disabled={disabled || (pending !== null && pending !== "apple")}
      />
    </div>
  );
}

interface ProviderButtonProps {
  provider: Provider;
  label: string;
  loading: boolean;
  disabled: boolean;
  onClick: () => void;
}

function ProviderButton({
  provider,
  label,
  loading,
  disabled,
  onClick,
}: ProviderButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      aria-label={label}
      className={cn(
        "flex h-12 items-center justify-center gap-3 rounded-2xl border-2 border-gray-200 bg-white px-4 text-sm font-semibold text-neutral-text transition-all",
        "hover:border-primary/40 hover:bg-neutral-cream/50",
        "focus:outline-none focus:ring-2 focus:ring-primary/20",
        "disabled:cursor-not-allowed disabled:opacity-60"
      )}
    >
      {loading ? (
        <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
      ) : provider === "google" ? (
        <GoogleIcon />
      ) : (
        <AppleIcon />
      )}
      <span>{label}</span>
    </button>
  );
}

function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.56c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.76c-.98.66-2.24 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.11A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.44.34-2.11V7.05H2.18A11 11 0 0 0 1 12c0 1.77.42 3.45 1.18 4.95l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.07.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.05l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"
      />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M16.365 1.43c0 1.14-.42 2.22-1.13 3.04-.78.93-2.05 1.65-3.07 1.56-.13-1.1.42-2.27 1.12-3.05.79-.86 2.13-1.5 3.08-1.55zM21 17.16c-.55 1.27-.81 1.83-1.52 2.95-1 1.55-2.4 3.49-4.13 3.5-1.55.02-1.95-1.01-4.05-1-2.1.01-2.54 1.02-4.09 1-1.74-.02-3.07-1.77-4.06-3.32C.36 16.69-.04 11.04 1.99 8.05 3.43 5.94 5.7 4.7 7.84 4.7c2.18 0 3.55 1.2 5.36 1.2 1.75 0 2.82-1.2 5.34-1.2 1.91 0 3.93 1.04 5.36 2.84-4.71 2.58-3.94 9.31-2.9 9.62z" />
    </svg>
  );
}
