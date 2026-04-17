import Stripe from "stripe";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

if (!STRIPE_SECRET_KEY && process.env.NODE_ENV !== "test") {
  // Soft-warn: routes that need Stripe will throw when called.
  // We avoid crashing module load so the rest of the app keeps building.
  console.warn(
    "[stripe] STRIPE_SECRET_KEY missing — payment endpoints will fail until configured."
  );
}

export const stripe = new Stripe(STRIPE_SECRET_KEY ?? "sk_test_unset", {
  apiVersion: "2026-03-25.dahlia",
  typescript: true,
});

/** Platform commission in basis points (10% = 1000) */
export const PLATFORM_FEE_BPS = 1000;

export function platformFee(amountCents: number): number {
  return Math.round((amountCents * PLATFORM_FEE_BPS) / 10_000);
}

export function assertStripeConfigured(): void {
  if (!STRIPE_SECRET_KEY) {
    throw new Error(
      "Stripe n'est pas configuré sur ce serveur. Contactez l'équipe."
    );
  }
}
