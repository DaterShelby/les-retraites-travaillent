'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useOnboardingStore } from '@/stores/onboarding';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronRight, Loader2 } from 'lucide-react';
import { saveOnboarding } from './actions';
import { useAuth } from '@/hooks/use-auth';

const DAYS_OF_WEEK = [
  { id: 'monday', label: 'Lundi', shortLabel: 'Lun' },
  { id: 'tuesday', label: 'Mardi', shortLabel: 'Mar' },
  { id: 'wednesday', label: 'Mercredi', shortLabel: 'Mer' },
  { id: 'thursday', label: 'Jeudi', shortLabel: 'Jeu' },
  { id: 'friday', label: 'Vendredi', shortLabel: 'Ven' },
  { id: 'saturday', label: 'Samedi', shortLabel: 'Sam' },
  { id: 'sunday', label: 'Dimanche', shortLabel: 'Dim' },
];

export default function Step4Page() {
  const router = useRouter();
  const { user } = useAuth();
  const store = useOnboardingStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [availableDays, setAvailableDays] = useState<string[]>(store.availableDays);
  const [travelRadius, setTravelRadius] = useState<number>(store.travelRadiusKm);
  const [hourlyRate, setHourlyRate] = useState<string>(
    store.hourlyRate?.toString() || ''
  );

  const isRetired = store.role === 'retiree';
  const isCompany = store.role === 'company';

  const toggleDay = (dayId: string) => {
    setAvailableDays((prev) =>
      prev.includes(dayId)
        ? prev.filter((d) => d !== dayId)
        : [...prev, dayId]
    );
  };

  const handleFinish = async () => {
    setError(null);
    setIsLoading(true);

    try {
      if (!user) {
        throw new Error('Utilisateur non authentifié');
      }

      if (isRetired && availableDays.length === 0) {
        throw new Error('Veuillez sélectionner au moins un jour de disponibilité');
      }

      if (isRetired && !hourlyRate) {
        throw new Error('Veuillez entrer votre tarif horaire');
      }

      // Save to Zustand
      store.setPreferences({
        availableDays,
        travelRadiusKm: travelRadius,
        hourlyRate: isRetired ? parseFloat(hourlyRate) : null,
      });
      store.setStep(4);

      // Get updated state from Zustand
      const currentState = useOnboardingStore.getState();

      // Save to Supabase
      const result = await saveOnboarding(user.id, currentState);

      if (!result.success) {
        throw new Error(result.error || 'Erreur lors de la sauvegarde');
      }

      // Wait a moment to show success state
      await new Promise(resolve => setTimeout(resolve, 500));

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="font-serif text-3xl font-bold text-[#2C3E50]">
          {isCompany ? 'Dernières informations' : 'Vos préférences'}
        </h2>
        <p className="text-lg text-[#3B2F2F]/80">
          {isCompany
            ? 'Presque fini ! Finalisez votre profil'
            : 'Parlez-nous de vos disponibilités et vos attentes'}
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="space-y-6">
        {isRetired && (
          <>
            {/* Days of Week Selection */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-[#2C3E50]">
                Jours de disponibilité *
              </label>
              <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
                {DAYS_OF_WEEK.map((day) => (
                  <button
                    key={day.id}
                    onClick={() => toggleDay(day.id)}
                    className={`h-12 rounded-lg border-2 font-medium transition-all text-xs sm:text-sm ${
                      availableDays.includes(day.id)
                        ? 'border-[#CC8800] bg-[#CC8800]/10 text-[#CC8800]'
                        : 'border-[#CC8800]/30 bg-white text-[#3B2F2F] hover:border-[#CC8800]/60'
                    }`}
                  >
                    <span className="hidden sm:inline">{day.label}</span>
                    <span className="sm:hidden">{day.shortLabel}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Hourly Rate */}
            <div className="space-y-2">
              <label htmlFor="hourlyRate" className="block text-sm font-medium text-[#2C3E50]">
                Tarif horaire (€) *
              </label>
              <div className="relative">
                <Input
                  id="hourlyRate"
                  type="number"
                  min="0"
                  step="0.5"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(e.target.value)}
                  placeholder="25"
                  className="h-12 border-[#CC8800]/30 pr-12"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#3B2F2F]/60">
                  €/h
                </span>
              </div>
              <p className="text-xs text-[#3B2F2F]/60">
                Minimum recommandé: 15€/h
              </p>
            </div>
          </>
        )}

        {/* Travel Radius (pour retraité ET client) */}
        {(isRetired || store.role === 'client') && (
          <div className="space-y-3">
            <label htmlFor="travelRadius" className="block text-sm font-medium text-[#2C3E50]">
              Rayon géographique: <strong>{travelRadius} km</strong>
            </label>
            <input
              id="travelRadius"
              type="range"
              min="1"
              max="100"
              step="1"
              value={travelRadius}
              onChange={(e) => setTravelRadius(parseInt(e.target.value))}
              className="h-2 w-full cursor-pointer rounded-lg bg-[#CC8800]/20 accent-[#CC8800]"
            />
            <div className="flex justify-between text-xs text-[#3B2F2F]/60">
              <span>1 km</span>
              <span>50 km</span>
              <span>100 km</span>
            </div>
          </div>
        )}

        {isCompany && (
          <div className="rounded-lg border border-[#38761D]/30 bg-[#38761D]/5 p-4">
            <p className="text-sm text-[#3B2F2F]">
              ✓ Votre profil professionnel est presque prêt ! Vous pourrez ajouter des offres d'emploi après validation.
            </p>
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleFinish}
          disabled={isLoading}
          size="lg"
          className="gap-2 bg-[#2C3E50] hover:bg-[#2C3E50]/90 text-white"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Finalisation...
            </>
          ) : (
            <>
              Finaliser mon profil
              <ChevronRight className="h-5 w-5" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
