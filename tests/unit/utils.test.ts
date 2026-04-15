import { describe, it, expect } from "vitest";
import {
  formatPrice,
  formatDate,
  calculateDistance,
  truncate,
  slugify,
} from "@/lib/utils";

describe("formatPrice", () => {
  it("formate un prix fixe en euros", () => {
    expect(formatPrice(25)).toMatch(/25/);
    expect(formatPrice(25)).toMatch(/€/);
  });

  it("ajoute /h pour un tarif horaire", () => {
    expect(formatPrice(30, "hourly")).toContain("/h");
  });

  it("affiche 'À convenir' pour negotiable", () => {
    expect(formatPrice(0, "negotiable")).toBe("À convenir");
  });
});

describe("formatDate", () => {
  it("formate une date en français", () => {
    const result = formatDate("2026-04-15");
    expect(result).toContain("avril");
    expect(result).toContain("2026");
  });
});

describe("calculateDistance", () => {
  it("calcule la distance Paris-Lyon (~390km)", () => {
    const distance = calculateDistance(48.8566, 2.3522, 45.764, 4.8357);
    expect(distance).toBeGreaterThan(380);
    expect(distance).toBeLessThan(400);
  });

  it("retourne 0 pour le même point", () => {
    const distance = calculateDistance(48.8566, 2.3522, 48.8566, 2.3522);
    expect(distance).toBe(0);
  });
});

describe("truncate", () => {
  it("tronque les textes longs", () => {
    expect(truncate("Bonjour le monde entier", 10)).toBe("Bonjour le…");
  });

  it("ne tronque pas les textes courts", () => {
    expect(truncate("Court", 10)).toBe("Court");
  });
});

describe("slugify", () => {
  it("convertit en slug français", () => {
    expect(slugify("Jardinage à Lyon")).toBe("jardinage-a-lyon");
  });

  it("supprime les accents", () => {
    expect(slugify("Réparation électrique")).toBe("reparation-electrique");
  });

  it("supprime les caractères spéciaux", () => {
    expect(slugify("Aide à l'informatique!")).toBe("aide-a-l-informatique");
  });
});
