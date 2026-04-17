import { z } from "zod";

// =====================================================
//  AUTH
// =====================================================

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "L'adresse email est requise")
    .email("Adresse email invalide"),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
});

export const registerSchema = z
  .object({
    firstName: z
      .string()
      .min(2, "Le prénom doit contenir au moins 2 caractères")
      .max(50, "Le prénom ne peut pas dépasser 50 caractères"),
    email: z
      .string()
      .min(1, "L'adresse email est requise")
      .email("Adresse email invalide"),
    password: z
      .string()
      .min(8, "Le mot de passe doit contenir au moins 8 caractères")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Doit contenir au moins une majuscule, une minuscule et un chiffre"
      ),
    confirmPassword: z.string().min(1, "Veuillez confirmer votre mot de passe"),
    role: z.enum(["retiree", "client", "company"], {
      required_error: "Veuillez choisir votre profil",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "L'adresse email est requise")
    .email("Adresse email invalide"),
});

export const magicLinkSchema = z.object({
  email: z
    .string()
    .min(1, "L'adresse email est requise")
    .email("Adresse email invalide"),
});

// =====================================================
//  ONBOARDING
// =====================================================

export const onboardingStep1Schema = z.object({
  role: z.enum(["retiree", "client", "company"], {
    required_error: "Veuillez sélectionner un profil pour continuer",
  }),
});

export const onboardingStep2Schema = z.object({
  firstName: z
    .string()
    .min(2, "Le prénom doit contenir au moins 2 caractères")
    .max(50, "Le prénom ne peut pas dépasser 50 caractères"),
  lastName: z.string().optional(),
  city: z
    .string()
    .min(2, "La ville est requise")
    .max(100, "La ville ne peut pas dépasser 100 caractères"),
  avatarUrl: z.string().url().optional().or(z.literal("")),
});

export const onboardingStep2CompanySchema = z.object({
  companyName: z
    .string()
    .min(2, "Le nom de l'entreprise est requis")
    .max(100, "Le nom ne peut pas dépasser 100 caractères"),
  siret: z
    .string()
    .regex(/^\d{14}$/, "Le SIRET doit contenir exactement 14 chiffres"),
  sector: z.string().min(1, "Le secteur est requis"),
  companySize: z.string().min(1, "La taille de l'entreprise est requise"),
});

export const onboardingStep3Schema = z.object({
  selectedCategories: z
    .array(z.string())
    .min(1, "Veuillez sélectionner au moins une catégorie"),
  freeDescription: z
    .string()
    .max(500, "La description ne peut pas dépasser 500 caractères")
    .optional(),
});

export const onboardingStep4Schema = z
  .object({
    availableDays: z.array(z.string()).default([]),
    travelRadiusKm: z.number().min(0).max(200).default(20),
    hourlyRate: z
      .number({ invalid_type_error: "Veuillez entrer un tarif valide" })
      .positive("Le tarif doit être positif")
      .max(500, "Le tarif maximum est de 500€/h")
      .optional(),
    role: z.enum(["retiree", "client", "company"]).optional(),
  })
  .refine(
    (data) => {
      if (data.role === "retiree") return data.availableDays.length > 0;
      return true;
    },
    {
      message: "Veuillez sélectionner au moins un jour de disponibilité",
      path: ["availableDays"],
    }
  )
  .refine(
    (data) => {
      if (data.role === "retiree") return data.hourlyRate !== undefined && data.hourlyRate > 0;
      return true;
    },
    {
      message: "Veuillez entrer votre tarif horaire",
      path: ["hourlyRate"],
    }
  );

// =====================================================
//  PROFILE
// =====================================================

export const profileUpdateSchema = z.object({
  firstName: z.string().min(2, "Prénom requis").max(50).optional(),
  lastName: z.string().max(50).optional(),
  bio: z.string().max(2000, "La bio ne peut pas dépasser 2000 caractères").optional(),
  city: z.string().max(100).optional(),
  phone: z
    .string()
    .regex(/^(\+33|0)[1-9](\d{2}){4}$/, "Numéro de téléphone français invalide")
    .optional()
    .or(z.literal("")),
  hourlyRate: z.number().positive().max(500).optional(),
  travelRadiusKm: z.number().min(0).max(200).optional(),
  avatarUrl: z.string().url().optional().or(z.literal("")),
});

// =====================================================
//  SERVICES
// =====================================================

export const serviceSchema = z.object({
  title: z
    .string()
    .min(5, "Le titre doit contenir au moins 5 caractères")
    .max(100, "Le titre ne peut pas dépasser 100 caractères"),
  description: z
    .string()
    .min(20, "La description doit contenir au moins 20 caractères")
    .max(2000, "La description ne peut pas dépasser 2000 caractères"),
  category: z.string().min(1, "La catégorie est requise"),
  subcategory: z.string().optional(),
  priceType: z.enum(["hourly", "fixed", "negotiable"], {
    required_error: "Veuillez choisir un type de tarif",
  }),
  priceAmount: z.number().positive("Le montant doit être positif").optional(),
  city: z.string().min(1, "La ville est requise"),
  photos: z.array(z.string().url()).max(8, "Maximum 8 photos").default([]),
});

// =====================================================
//  BOOKINGS
// =====================================================

export const bookingCreateSchema = z.object({
  serviceId: z.string().uuid("Service invalide"),
  scheduledAt: z
    .string()
    .datetime("Date invalide")
    .refine((d) => new Date(d) > new Date(), "La date doit être dans le futur"),
  message: z
    .string()
    .min(10, "Veuillez décrire votre besoin (minimum 10 caractères)")
    .max(1000, "Maximum 1000 caractères"),
  estimatedDurationMin: z.number().min(15).max(480).optional(),
});

export const bookingActionSchema = z.object({
  bookingId: z.string().uuid(),
  action: z.enum(["accept", "decline", "cancel", "complete"], {
    required_error: "Action invalide",
  }),
  reason: z.string().max(500).optional(),
});

// =====================================================
//  REVIEWS
// =====================================================

export const reviewSchema = z.object({
  rating: z
    .number()
    .min(1, "Veuillez donner une note")
    .max(5, "La note maximale est 5"),
  comment: z
    .string()
    .min(20, "Le commentaire doit contenir au moins 20 caractères")
    .max(1000, "Le commentaire ne peut pas dépasser 1000 caractères"),
});

// =====================================================
//  MESSAGES
// =====================================================

export const messageSchema = z.object({
  content: z
    .string()
    .min(1, "Le message ne peut pas être vide")
    .max(5000, "Le message ne peut pas dépasser 5000 caractères"),
});

// =====================================================
//  NEWSLETTER
// =====================================================

export const newsletterSchema = z.object({
  email: z
    .string()
    .min(1, "L'adresse email est requise")
    .email("Adresse email invalide"),
});

// =====================================================
//  MISSIONS / JOB BOARD (Sprint 5)
// =====================================================

export const missionCreateSchema = z.object({
  title: z
    .string()
    .min(8, "Le titre doit contenir au moins 8 caractères")
    .max(120, "Le titre ne peut pas dépasser 120 caractères"),
  description: z
    .string()
    .min(40, "La description doit contenir au moins 40 caractères")
    .max(4000, "La description ne peut pas dépasser 4000 caractères"),
  category: z.string().min(1, "La catégorie est requise"),
  city: z.string().min(2, "La ville est requise"),
  remoteAllowed: z.boolean().default(false),
  contractType: z.enum(["one_shot", "recurring", "part_time", "consulting"], {
    required_error: "Choisissez un type de contrat",
  }),
  durationEstimate: z.string().max(100).optional(),
  budgetType: z.enum(["hourly", "daily", "fixed", "negotiable"], {
    required_error: "Choisissez un type de budget",
  }),
  budgetMin: z.number().int().min(0).optional(),
  budgetMax: z.number().int().min(0).optional(),
  requiredSkills: z.array(z.string()).max(20).default([]),
  startDate: z.string().optional(),
  status: z.enum(["draft", "open"]).default("open"),
});

export const missionApplicationSchema = z.object({
  missionId: z.string().uuid(),
  coverMessage: z
    .string()
    .min(40, "Présentez-vous en quelques mots (40 caractères min)")
    .max(2000, "Maximum 2000 caractères"),
  proposedRate: z.number().int().positive().max(5000).optional(),
});

export const missionApplicationActionSchema = z.object({
  applicationId: z.string().uuid(),
  action: z.enum(["shortlist", "accept", "reject", "withdraw"]),
});

// =====================================================
//  AI AGENT (Sprint 3)
// =====================================================

export const chatMessageSchema = z.object({
  conversationId: z.string().uuid().optional(),
  content: z
    .string()
    .min(1, "Message vide")
    .max(2000, "Message trop long (2000 caractères max)"),
  context: z
    .object({
      page: z.string().optional(),
      role: z.enum(["retiree", "client", "company"]).optional(),
    })
    .optional(),
});

// =====================================================
//  TYPES INFÉRÉS
// =====================================================

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type MagicLinkInput = z.infer<typeof magicLinkSchema>;
export type OnboardingStep1Input = z.infer<typeof onboardingStep1Schema>;
export type OnboardingStep2Input = z.infer<typeof onboardingStep2Schema>;
export type OnboardingStep2CompanyInput = z.infer<typeof onboardingStep2CompanySchema>;
export type OnboardingStep3Input = z.infer<typeof onboardingStep3Schema>;
export type OnboardingStep4Input = z.infer<typeof onboardingStep4Schema>;
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
export type ServiceInput = z.infer<typeof serviceSchema>;
export type BookingCreateInput = z.infer<typeof bookingCreateSchema>;
export type BookingActionInput = z.infer<typeof bookingActionSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
export type MessageInput = z.infer<typeof messageSchema>;
export type NewsletterInput = z.infer<typeof newsletterSchema>;
export type ChatMessageInput = z.infer<typeof chatMessageSchema>;
export type MissionCreateInput = z.infer<typeof missionCreateSchema>;
export type MissionApplicationInput = z.infer<typeof missionApplicationSchema>;
export type MissionApplicationActionInput = z.infer<typeof missionApplicationActionSchema>;
