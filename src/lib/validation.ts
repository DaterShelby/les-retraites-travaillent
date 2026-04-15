import { z } from "zod";

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
    email: z
      .string()
      .min(1, "L'adresse email est requise")
      .email("Adresse email invalide"),
    password: z
      .string()
      .min(8, "Le mot de passe doit contenir au moins 8 caractères")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre"
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
  priceType: z.enum(["hourly", "fixed", "negotiable"]),
  priceAmount: z.number().positive("Le montant doit être positif").optional(),
  city: z.string().min(1, "La ville est requise"),
});

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

export const messageSchema = z.object({
  content: z
    .string()
    .min(1, "Le message ne peut pas être vide")
    .max(5000, "Le message ne peut pas dépasser 5000 caractères"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type OnboardingStep2Input = z.infer<typeof onboardingStep2Schema>;
export type ServiceInput = z.infer<typeof serviceSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
export type MessageInput = z.infer<typeof messageSchema>;
