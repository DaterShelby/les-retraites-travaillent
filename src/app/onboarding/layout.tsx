'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useOnboardingStore } from '@/stores/onboarding';
import { StepIndicator } from '@/components/onboarding/step-indicator';
import { VoiceCoach } from '@/components/onboarding/voice-coach';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { currentStep, reset } = useOnboardingStore();

  // Extraire le numéro d'étape du pathname
  const getStepFromPath = (path: string): number => {
    if (path.includes('step-1')) return 1;
    if (path.includes('step-2')) return 2;
    if (path.includes('step-3')) return 3;
    if (path.includes('step-4')) return 4;
    return 1;
  };

  const pathStep = getStepFromPath(pathname);

  const handleBack = () => {
    if (pathStep > 1) {
      router.push(`/onboarding/step-${pathStep - 1}`);
    }
  };

  const handleReset = () => {
    if (confirm('Êtes-vous sûr de vouloir recommencer ?')) {
      reset();
      router.push('/onboarding/step-1');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F2EE] to-[#F5F2EE]">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-[#CC8800]/20 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-2xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-serif text-2xl font-bold text-[#2C3E50]">
                Bienvenue
              </h1>
              <p className="mt-1 text-sm text-[#3B2F2F]/70">
                Créons votre profil en quelques minutes
              </p>
            </div>
            <button
              onClick={handleReset}
              className="text-xs text-[#3B2F2F]/60 hover:text-[#3B2F2F] transition-colors"
            >
              Recommencer
            </button>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="border-b border-[#CC8800]/20 bg-white">
        <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6 lg:px-8">
          <StepIndicator currentStep={pathStep} totalSteps={4} />
        </div>
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8 pb-20">
        <div className="space-y-8">
          {children}

          {/* Navigation Bottom */}
          <div className="flex items-center justify-between pt-8 border-t border-[#CC8800]/20">
            {pathStep > 1 && (
              <Button
                onClick={handleBack}
                variant="outline"
                size="lg"
                className="gap-2"
              >
                <ChevronLeft className="h-5 w-5" />
                Précédent
              </Button>
            )}
            {pathStep === 1 && <div />}
          </div>
        </div>
      </main>

      <VoiceCoach />
    </div>
  );
}
