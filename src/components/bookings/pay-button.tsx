"use client";

import { useState } from "react";
import { CreditCard, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface PayButtonProps {
  bookingId: string;
  amountCents: number;
  className?: string;
  label?: string;
}

export function PayButton({
  bookingId,
  amountCents,
  className,
  label,
}: PayButtonProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    setLoading(true);
    const res = await fetch("/api/checkout/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookingId }),
    });
    const json = (await res.json()) as { url?: string; error?: string };

    if (!res.ok || !json.url) {
      setLoading(false);
      toast({
        variant: "error",
        title: "Paiement impossible",
        description: json.error ?? "Réessayez dans un instant.",
      });
      return;
    }

    window.location.href = json.url;
  };

  return (
    <Button
      type="button"
      onClick={handlePay}
      disabled={loading}
      className={className}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <CreditCard className="h-4 w-4" />
      )}
      {label ?? `Payer ${(amountCents / 100).toFixed(2)} €`}
    </Button>
  );
}
