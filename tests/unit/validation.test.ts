import { describe, it, expect } from "vitest";
import {
  loginSchema,
  registerSchema,
  reviewSchema,
  serviceSchema,
  messageSchema,
} from "@/lib/validation";

describe("loginSchema", () => {
  it("accepte des données valides", () => {
    const result = loginSchema.safeParse({
      email: "test@example.com",
      password: "Password1",
    });
    expect(result.success).toBe(true);
  });

  it("rejette un email invalide", () => {
    const result = loginSchema.safeParse({
      email: "invalid",
      password: "Password1",
    });
    expect(result.success).toBe(false);
  });

  it("rejette un mot de passe trop court", () => {
    const result = loginSchema.safeParse({
      email: "test@example.com",
      password: "short",
    });
    expect(result.success).toBe(false);
  });
});

describe("registerSchema", () => {
  it("accepte une inscription valide", () => {
    const result = registerSchema.safeParse({
      firstName: "Tony",
      email: "retraite@example.com",
      password: "SecurePass1",
      confirmPassword: "SecurePass1",
      role: "retiree",
    });
    expect(result.success).toBe(true);
  });

  it("rejette des mots de passe non identiques", () => {
    const result = registerSchema.safeParse({
      email: "test@example.com",
      password: "SecurePass1",
      confirmPassword: "Different1",
      role: "client",
    });
    expect(result.success).toBe(false);
  });

  it("exige une majuscule, minuscule et chiffre", () => {
    const result = registerSchema.safeParse({
      email: "test@example.com",
      password: "alllowercase",
      confirmPassword: "alllowercase",
      role: "retiree",
    });
    expect(result.success).toBe(false);
  });

  it("rejette un rôle invalide", () => {
    const result = registerSchema.safeParse({
      email: "test@example.com",
      password: "SecurePass1",
      confirmPassword: "SecurePass1",
      role: "hacker",
    });
    expect(result.success).toBe(false);
  });
});

describe("serviceSchema", () => {
  it("accepte un service valide", () => {
    const result = serviceSchema.safeParse({
      title: "Jardinage à domicile",
      description: "Je propose mes services de jardinage avec plus de 30 ans d'expérience.",
      category: "jardinage",
      priceType: "hourly",
      priceAmount: 25,
      city: "Lyon",
    });
    expect(result.success).toBe(true);
  });

  it("rejette un titre trop court", () => {
    const result = serviceSchema.safeParse({
      title: "Ab",
      description: "Description valide de plus de 20 caractères ici.",
      category: "bricolage",
      priceType: "fixed",
      city: "Paris",
    });
    expect(result.success).toBe(false);
  });

  it("rejette une description trop courte", () => {
    const result = serviceSchema.safeParse({
      title: "Titre valide",
      description: "Trop court",
      category: "bricolage",
      priceType: "fixed",
      city: "Paris",
    });
    expect(result.success).toBe(false);
  });
});

describe("reviewSchema", () => {
  it("accepte un avis valide", () => {
    const result = reviewSchema.safeParse({
      rating: 5,
      comment: "Excellent travail, très professionnel et ponctuel !",
    });
    expect(result.success).toBe(true);
  });

  it("rejette une note hors limites", () => {
    const result = reviewSchema.safeParse({
      rating: 6,
      comment: "Ce commentaire est suffisamment long.",
    });
    expect(result.success).toBe(false);
  });

  it("rejette un commentaire trop court", () => {
    const result = reviewSchema.safeParse({
      rating: 4,
      comment: "Bien",
    });
    expect(result.success).toBe(false);
  });
});

describe("messageSchema", () => {
  it("accepte un message valide", () => {
    const result = messageSchema.safeParse({
      content: "Bonjour, je suis intéressé par votre service.",
    });
    expect(result.success).toBe(true);
  });

  it("rejette un message vide", () => {
    const result = messageSchema.safeParse({ content: "" });
    expect(result.success).toBe(false);
  });
});
