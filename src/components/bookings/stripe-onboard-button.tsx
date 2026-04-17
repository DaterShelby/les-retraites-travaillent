"use client";

import { useState } from "react";
import { ExternalLink, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface StripeOnboardButtonProps {
  variant?: "primary" | "outline";
  label?: string;
  className?: string;
}

export function StripeOnboardButton({
  variant = "primary",
  label = "Configurer mes paiements",
  className,
}: StripeOnboardButtonProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleStart = async () => {
    setLoading(true);
    const res = await fetch("/api/stripe/connect/onboard", {
      method: "POST",
    });
    const json = (await res.json()) as { url?: string; error?: string };

    if (!res.ok || !json.url) {
      setLoading(false);
      toast({
        variant: "error",
        title: "Onboarding impossible",
        description: json.error ?? "Réessayez plus tard.",
      });
      return;
    }

    window.location.href = json.url;
  };

  return (
    <Button
      type="button"
      onClick={handleStart}
      variant={variant === "outline" ? "outline" : "default"}
      disabled={loading}
      className={className}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <ExternalLink className="h-4 w-4" />
      )}
      {label}
    </Button>
  );
}
