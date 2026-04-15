export const APP_NAME = "Les Retraités Travaillent";
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const SERVICE_CATEGORIES = [
  { id: "bricolage", label: "Bricolage", icon: "Hammer" },
  { id: "jardinage", label: "Jardinage", icon: "TreePine" },
  { id: "cuisine", label: "Cuisine", icon: "ChefHat" },
  { id: "garde-enfants", label: "Garde d'enfants", icon: "Baby" },
  { id: "informatique", label: "Informatique", icon: "Monitor" },
  { id: "conseil", label: "Conseil & Consulting", icon: "Lightbulb" },
  { id: "formation", label: "Formation", icon: "GraduationCap" },
  { id: "administratif", label: "Administratif", icon: "FileText" },
  { id: "couture", label: "Couture & Retouches", icon: "Scissors" },
  { id: "menage", label: "Ménage & Entretien", icon: "Sparkles" },
  { id: "aide-domicile", label: "Aide à domicile", icon: "Heart" },
  { id: "autre", label: "Autre", icon: "MoreHorizontal" },
] as const;

export const COMPANY_SIZES = [
  { value: "1-10", label: "1 à 10 salariés" },
  { value: "11-50", label: "11 à 50 salariés" },
  { value: "51-200", label: "51 à 200 salariés" },
  { value: "201-1000", label: "201 à 1 000 salariés" },
  { value: "1001+", label: "Plus de 1 000 salariés" },
] as const;

export const SECTORS = [
  "Aide à domicile",
  "Agriculture",
  "BTP",
  "Commerce",
  "Conseil",
  "Éducation & Formation",
  "Hôtellerie & Restauration",
  "Industrie",
  "Informatique & Tech",
  "Maintenance",
  "Santé",
  "Services aux entreprises",
  "Transport & Logistique",
  "Autre",
] as const;

export const MAX_CUMUL_EMPLOI_RETRAITE = 2900;
export const PLATFORM_COMMISSION_RATE = 0.10;
export const CLIENT_COMMISSION_RATE = 0.05;
export const PROVIDER_COMMISSION_RATE = 0.05;

export const MAX_PHOTOS_PER_SERVICE = 5;
export const MAX_FILE_SIZE_MB = 5;
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
