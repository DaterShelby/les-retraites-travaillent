import { describe, it, expect } from "vitest";
import {
  generateOrganizationSchema,
  generateLocalBusinessSchema,
  generateServiceSchema,
  generatePersonSchema,
  generateJobPostingSchema,
} from "@/lib/schema-org";

describe("generateOrganizationSchema", () => {
  it("should generate valid Organization schema", () => {
    const schema = generateOrganizationSchema();
    expect(schema["@context"]).toBe("https://schema.org");
    expect(schema["@type"]).toBe("Organization");
    expect(schema.name).toBe("Les Retraités Travaillent");
    expect(schema.foundingDate).toBe("2026");
    expect(schema.address).toBeDefined();
  });
});

describe("generateLocalBusinessSchema", () => {
  it("should generate valid LocalBusiness schema", () => {
    const schema = generateLocalBusinessSchema();
    expect(schema["@type"]).toBe("LocalBusiness");
    expect(schema.priceRange).toBe("€-€€€");
  });
});

describe("generateServiceSchema", () => {
  it("should generate schema with all fields", () => {
    const schema = generateServiceSchema({
      title: "Cours de jardinage",
      description: "Apprenez à jardiner avec un expert",
      providerName: "Jean Dupont",
      price: 30,
      priceType: "hourly",
      category: "Jardinage",
      city: "Lyon",
      rating: 4.5,
      reviewCount: 12,
      url: "https://example.com/services/123",
      imageUrl: "https://example.com/photo.jpg",
    });

    expect(schema["@type"]).toBe("Service");
    expect(schema.name).toBe("Cours de jardinage");
    expect(schema.provider).toEqual({ "@type": "Person", name: "Jean Dupont" });
    expect(schema.offers).toEqual({
      "@type": "Offer",
      price: 30,
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
    });
    expect(schema.aggregateRating).toBeDefined();
    expect(schema.image).toBe("https://example.com/photo.jpg");
  });

  it("should handle missing optional fields", () => {
    const schema = generateServiceSchema({
      title: "Service basique",
      description: "Un service",
      providerName: "Marie",
      url: "https://example.com/s/1",
    });

    expect(schema.offers).toBeUndefined();
    expect(schema.aggregateRating).toBeUndefined();
    expect(schema.image).toBeUndefined();
  });

  it("should use city when provided", () => {
    const schema = generateServiceSchema({
      title: "Test",
      description: "Test",
      providerName: "Test",
      city: "Marseille",
      url: "https://example.com",
    });

    expect(schema.areaServed).toEqual({
      "@type": "City",
      name: "Marseille",
    });
  });
});

describe("generatePersonSchema", () => {
  it("should generate valid Person schema", () => {
    const schema = generatePersonSchema({
      name: "Pierre Martin",
      description: "Retraité passionné de jardinage",
      city: "Paris",
      skills: ["Jardinage", "Bricolage"],
      url: "https://example.com/profile/1",
    });

    expect(schema["@type"]).toBe("Person");
    expect(schema.name).toBe("Pierre Martin");
    expect(schema.knowsAbout).toEqual(["Jardinage", "Bricolage"]);
    expect(schema.address).toBeDefined();
  });
});

describe("generateJobPostingSchema", () => {
  it("should generate valid JobPosting schema", () => {
    const schema = generateJobPostingSchema({
      title: "Assistant comptable",
      description: "Recherche retraité expérimenté",
      companyName: "ACME Corp",
      city: "Bordeaux",
      datePosted: "2026-01-15",
      url: "https://example.com/jobs/1",
    });

    expect(schema["@type"]).toBe("JobPosting");
    expect(schema.title).toBe("Assistant comptable");
    expect(schema.employmentType).toBe("PART_TIME");
    expect(schema.hiringOrganization.name).toBe("ACME Corp");
  });
});
