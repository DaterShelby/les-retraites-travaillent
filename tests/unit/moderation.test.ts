import { describe, it, expect } from "vitest";
import { moderateMessage, validateChatFile } from "@/lib/moderation";

describe("moderateMessage", () => {
  it("should pass clean messages", () => {
    const result = moderateMessage("Bonjour, je suis intéressé par votre service de jardinage.");
    expect(result.isClean).toBe(true);
    expect(result.warnings).toHaveLength(0);
  });

  it("should detect French phone numbers (06)", () => {
    const result = moderateMessage("Appelez-moi au 06 12 34 56 78");
    expect(result.isClean).toBe(false);
    expect(result.warnings.length).toBeGreaterThan(0);
    expect(result.warnings[0]).toContain("numéro de téléphone");
  });

  it("should detect phone numbers with +33", () => {
    const result = moderateMessage("Mon numéro : +33 6 12 34 56 78");
    expect(result.isClean).toBe(false);
    expect(result.warnings[0]).toContain("numéro de téléphone");
  });

  it("should detect phone numbers with dots", () => {
    const result = moderateMessage("Contactez-moi au 06.12.34.56.78");
    expect(result.isClean).toBe(false);
  });

  it("should detect email addresses", () => {
    const result = moderateMessage("Écrivez-moi à jean.dupont@gmail.com");
    expect(result.isClean).toBe(false);
    expect(result.warnings.some((w) => w.includes("adresse email"))).toBe(true);
  });

  it("should detect URLs", () => {
    const result = moderateMessage("Visitez https://monsite.com pour plus d'infos");
    expect(result.isClean).toBe(false);
    expect(result.warnings.some((w) => w.includes("lien"))).toBe(true);
  });

  it("should detect social media handles", () => {
    const result = moderateMessage("Ajoutez-moi sur facebook: jean.dupont");
    expect(result.isClean).toBe(false);
    expect(result.warnings.some((w) => w.includes("réseau social"))).toBe(true);
  });

  it("should detect multiple violations", () => {
    const result = moderateMessage("Mon email: test@test.com et mon tel: 06 12 34 56 78");
    expect(result.isClean).toBe(false);
    expect(result.warnings.length).toBeGreaterThanOrEqual(2);
  });

  it("should not flag short digit sequences", () => {
    const result = moderateMessage("J'ai 25 ans d'expérience et je fais du 8h-17h");
    expect(result.isClean).toBe(true);
  });
});

describe("validateChatFile", () => {
  it("should accept JPEG images", () => {
    const file = new File(["test"], "photo.jpg", { type: "image/jpeg" });
    expect(validateChatFile(file).isValid).toBe(true);
  });

  it("should accept PNG images", () => {
    const file = new File(["test"], "photo.png", { type: "image/png" });
    expect(validateChatFile(file).isValid).toBe(true);
  });

  it("should accept PDF files", () => {
    const file = new File(["test"], "doc.pdf", { type: "application/pdf" });
    expect(validateChatFile(file).isValid).toBe(true);
  });

  it("should reject executable files", () => {
    const file = new File(["test"], "virus.exe", { type: "application/x-msdownload" });
    const result = validateChatFile(file);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain("non autorisé");
  });

  it("should reject ZIP files", () => {
    const file = new File(["test"], "archive.zip", { type: "application/zip" });
    const result = validateChatFile(file);
    expect(result.isValid).toBe(false);
  });

  it("should reject files over 10MB", () => {
    // Create a mock large file
    const largeContent = new ArrayBuffer(11 * 1024 * 1024);
    const file = new File([largeContent], "large.jpg", { type: "image/jpeg" });
    const result = validateChatFile(file);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain("volumineux");
  });
});
