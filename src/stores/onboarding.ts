import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserRole } from "@/types/database";

interface OnboardingState {
  currentStep: number;
  role: UserRole | null;
  // Step 2 — Personal info
  firstName: string;
  lastName: string;
  city: string;
  avatarUrl: string;
  // Step 2 — Company info
  companyName: string;
  siret: string;
  sector: string;
  companySize: string;
  // Step 3 — Skills / Needs
  selectedCategories: string[];
  freeDescription: string;
  // Step 4 — Preferences
  availableDays: string[];
  travelRadiusKm: number;
  hourlyRate: number | null;
  // Actions
  setStep: (step: number) => void;
  setRole: (role: UserRole) => void;
  setPersonalInfo: (info: Partial<Pick<OnboardingState, "firstName" | "lastName" | "city" | "avatarUrl">>) => void;
  setCompanyInfo: (info: Partial<Pick<OnboardingState, "companyName" | "siret" | "sector" | "companySize">>) => void;
  setSkills: (categories: string[], description: string) => void;
  setPreferences: (prefs: Partial<Pick<OnboardingState, "availableDays" | "travelRadiusKm" | "hourlyRate">>) => void;
  reset: () => void;
}

const initialState = {
  currentStep: 1,
  role: null,
  firstName: "",
  lastName: "",
  city: "",
  avatarUrl: "",
  companyName: "",
  siret: "",
  sector: "",
  companySize: "",
  selectedCategories: [] as string[],
  freeDescription: "",
  availableDays: [] as string[],
  travelRadiusKm: 20,
  hourlyRate: null as number | null,
};

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      ...initialState,
      setStep: (step) => set({ currentStep: step }),
      setRole: (role) => set({ role }),
      setPersonalInfo: (info) => set(info),
      setCompanyInfo: (info) => set(info),
      setSkills: (categories, description) =>
        set({ selectedCategories: categories, freeDescription: description }),
      setPreferences: (prefs) => set(prefs),
      reset: () => set(initialState),
    }),
    {
      name: "lrt-onboarding",
    }
  )
);
