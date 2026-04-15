'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useOnboardingStore } from '@/stores/onboarding';
import { SkillsPicker } from '@/components/onboarding/skills-picker';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

export default function Step3Page() {
  const router = useRouter();
  const { role, selectedCategories, freeDescription, setSkills, setStep } = useOnboardingStore();
  const [selected, setSelected] = useState<string[]>(selectedCategories);
  const [description, setDescription] = useState(freeDescription);

  const handleContinue = () => {
    if (selected.length === 0) {
      alert('Veuillez sélectionner au moins une catégorie');
      return;
    }
    setSkills(selected, description);
    setStep(4);
    router.push('/onboarding/step-4');
  };

  const isRetired = role === 'retiree';

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="font-serif text-3xl font-bold text-[#1B4965]">
          {isRetired ? 'Vos compétences' : 'Vos besoins'}
        </h2>
        <p className="text-lg text-[#3D405B]/80">
          {isRetired
            ? 'Sélectionnez les domaines dans lesquels vous pouvez apporter votre aide'
            : 'Sélectionnez les services dont vous avez besoin'}
        </p>
      </div>

      <SkillsPicker selected={selected} onSelect={setSelected} />

      <div className="space-y-4">
        <label htmlFor="description" className="block text-sm font-medium text-[#1B4965]">
          {isRetired ? 'Vos autres compétences (optionnel)' : 'Précisions supplémentaires (optionnel)'}
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={isRetired
            ? "Décrivez d'autres compétences ou expériences pertinentes..."
            : 'Décrivez vos besoins spécifiques...'}
          className="h-32 w-full rounded-lg border border-[#E07A5F]/30 bg-white p-4 text-[#3D405B] placeholder:text-[#3D405B]/50 focus:border-[#E07A5F] focus:outline-none focus:ring-2 focus:ring-[#E07A5F]/20"
          maxLength={500}
        />
        <p className="text-xs text-[#3D405B]/60">
          {description.length}/500 caractères
        </p>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleContinue}
          size="lg"
          className="gap-2 bg-[#1B4965] hover:bg-[#1B4965]/90 text-white"
        >
          Continuer
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
