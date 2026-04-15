'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useOnboardingStore } from '@/stores/onboarding';
import { RoleSelector } from '@/components/onboarding/role-selector';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import type { UserRole } from '@/types/database';

export default function Step1Page() {
  const router = useRouter();
  const { role, setRole, setStep } = useOnboardingStore();
  const [selected, setSelected] = useState<UserRole | null>(role);

  const handleContinue = () => {
    if (!selected) {
      alert('Veuillez sélectionner un profil');
      return;
    }
    setRole(selected);
    setStep(2);
    router.push('/onboarding/step-2');
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h2 className="font-serif text-3xl font-bold text-[#1B4965]">
          Quel est votre profil ?
        </h2>
        <p className="text-lg text-[#3D405B]/80">
          Choisissez le profil qui vous correspond le mieux pour commencer.
        </p>
      </div>

      <RoleSelector selected={selected} onSelect={setSelected} />

      <div className="flex justify-end">
        <Button
          onClick={handleContinue}
          size="lg"
          disabled={!selected}
          className="gap-2 bg-[#1B4965] hover:bg-[#1B4965]/90 text-white"
        >
          Continuer
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
