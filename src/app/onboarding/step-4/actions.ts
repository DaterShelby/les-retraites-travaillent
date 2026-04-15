'use server';

import { createServerSupabaseClient } from '@/lib/supabase/server';

interface SaveOnboardingResult {
  success: boolean;
  error?: string;
}

interface OnboardingStateData {
  currentStep: number;
  role: string | null;
  firstName: string;
  lastName: string;
  city: string;
  avatarUrl: string;
  companyName: string;
  siret: string;
  sector: string;
  companySize: string;
  selectedCategories: string[];
  freeDescription: string;
  availableDays: string[];
  travelRadiusKm: number;
  hourlyRate: number | null;
}

export async function saveOnboarding(
  userId: string,
  state: Partial<OnboardingStateData>
): Promise<SaveOnboardingResult> {
  try {
    const supabase = createServerSupabaseClient();

    // Préparer les données à sauvegarder selon le rôle
    const profileData: any = {
      role: state.role,
      first_name: state.firstName || '',
      last_name: state.lastName || null,
      city: state.city || null,
      avatar_url: state.avatarUrl || null,
      skills: state.selectedCategories || [],
      bio: state.freeDescription || null,
      travel_radius_km: state.travelRadiusKm || 20,
      availability: state.availableDays
        ? Object.fromEntries(
            ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(
              (day) => [day, (state.availableDays ?? []).includes(day)]
            )
          )
        : {},
      onboarding_completed: true,
    };

    // Données spécifiques à l'entreprise
    if (state.role === 'company') {
      profileData.company_name = state.companyName || null;
      profileData.siret = state.siret || null;
      profileData.sector = state.sector || null;
      profileData.company_size = state.companySize || null;
    }

    // Données spécifiques au retraité
    if (state.role === 'retiree') {
      profileData.hourly_rate = state.hourlyRate || null;
    }

    // Insérer ou mettre à jour le profil
    const { error } = await supabase
      .from('user_profiles')
      .upsert(
        {
          id: userId,
          ...profileData,
        },
        { onConflict: 'id' }
      );

    if (error) {
      console.error('Erreur Supabase:', error);
      return {
        success: false,
        error: error.message || 'Erreur lors de la sauvegarde du profil',
      };
    }

    return { success: true };
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    };
  }
}
