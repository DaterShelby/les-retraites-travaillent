/**
 * Schema.org JSON-LD generators for SEO
 */

const SITE_NAME = "Les Retraités Travaillent";
const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://les-retraites-travaillent.netlify.app";

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description:
      "Plateforme française qui connecte les retraités actifs avec des particuliers et entreprises qui ont besoin de leur savoir-faire.",
    foundingDate: "2026",
    address: {
      "@type": "PostalAddress",
      addressCountry: "FR",
    },
    sameAs: [],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: "French",
    },
  };
}

export function generateLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: SITE_NAME,
    url: SITE_URL,
    description:
      "Marketplace de services proposés par des retraités expérimentés en France.",
    address: {
      "@type": "PostalAddress",
      addressCountry: "FR",
    },
    priceRange: "€-€€€",
  };
}

interface ServiceSchemaInput {
  title: string;
  description: string;
  providerName: string;
  price?: number | null;
  priceType?: string | null;
  category?: string | null;
  city?: string | null;
  rating?: number;
  reviewCount?: number;
  url: string;
  imageUrl?: string | null;
}

export function generateServiceSchema(input: ServiceSchemaInput) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: input.title,
    description: input.description,
    url: input.url,
    provider: {
      "@type": "Person",
      name: input.providerName,
    },
    areaServed: {
      "@type": "Country",
      name: "France",
    },
  };

  if (input.city) {
    schema.areaServed = {
      "@type": "City",
      name: input.city,
    };
  }

  if (input.category) {
    schema.category = input.category;
  }

  if (input.price) {
    schema.offers = {
      "@type": "Offer",
      price: input.price,
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
    };
  }

  if (input.rating && input.reviewCount) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: input.rating,
      reviewCount: input.reviewCount,
      bestRating: 5,
    };
  }

  if (input.imageUrl) {
    schema.image = input.imageUrl;
  }

  return schema;
}

interface PersonSchemaInput {
  name: string;
  description?: string;
  city?: string | null;
  skills?: string[];
  url: string;
  imageUrl?: string | null;
}

export function generatePersonSchema(input: PersonSchemaInput) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: input.name,
    url: input.url,
  };

  if (input.description) {
    schema.description = input.description;
  }

  if (input.city) {
    schema.address = {
      "@type": "PostalAddress",
      addressLocality: input.city,
      addressCountry: "FR",
    };
  }

  if (input.skills && input.skills.length > 0) {
    schema.knowsAbout = input.skills;
  }

  if (input.imageUrl) {
    schema.image = input.imageUrl;
  }

  return schema;
}

interface JobPostingSchemaInput {
  title: string;
  description: string;
  companyName: string;
  city?: string | null;
  salary?: string | null;
  employmentType?: string;
  datePosted: string;
  url: string;
}

export function generateJobPostingSchema(input: JobPostingSchemaInput) {
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: input.title,
    description: input.description,
    datePosted: input.datePosted,
    hiringOrganization: {
      "@type": "Organization",
      name: input.companyName,
    },
    jobLocation: input.city
      ? {
          "@type": "Place",
          address: {
            "@type": "PostalAddress",
            addressLocality: input.city,
            addressCountry: "FR",
          },
        }
      : undefined,
    employmentType: input.employmentType || "PART_TIME",
    url: input.url,
  };
}
