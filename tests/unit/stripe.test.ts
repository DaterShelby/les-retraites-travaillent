import { describe, it, expect } from "vitest";

describe("Stripe platform fee", () => {
  it("calcule 10 % par défaut sur un montant entier", async () => {
    const { platformFee, PLATFORM_FEE_BPS } = await import("@/lib/stripe/client");
    expect(PLATFORM_FEE_BPS).toBe(1000);
    expect(platformFee(10_000)).toBe(1000); // 100€ → 10€
  });

  it("arrondit correctement les centimes", async () => {
    const { platformFee } = await import("@/lib/stripe/client");
    // 33,33 € → 0,3333€ → 333 cents arrondi
    expect(platformFee(3_333)).toBe(333);
  });

  it("retourne 0 sur un montant nul", async () => {
    const { platformFee } = await import("@/lib/stripe/client");
    expect(platformFee(0)).toBe(0);
  });
});
