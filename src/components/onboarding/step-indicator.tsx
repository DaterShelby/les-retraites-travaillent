import React from 'react';
import { Check } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

  return (
    <div className="space-y-2">
      {/* Progress Bar */}
      <div className="flex items-center gap-2">
        {steps.map((step, index) => (
          <React.Fragment key={step}>
            {/* Circle */}
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full font-semibold text-sm transition-all duration-300 ${
                step < currentStep
                  ? 'bg-[#38761D] text-white'
                  : step === currentStep
                  ? 'bg-[#CC8800] text-white ring-2 ring-[#CC8800]/30'
                  : 'bg-[#CC8800]/10 text-[#3B2F2F]'
              }`}
            >
              {step < currentStep ? (
                <Check className="h-5 w-5" />
              ) : (
                step
              )}
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-1 transition-colors duration-300 ${
                  step < currentStep
                    ? 'bg-[#38761D]'
                    : 'bg-[#CC8800]/20'
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Step Labels */}
      <div className="flex items-center justify-between pt-2 text-xs text-[#3B2F2F]/60">
        <span>Étape {currentStep}/{totalSteps}</span>
        <span>
          {currentStep === 1 && 'Choisissez votre profil'}
          {currentStep === 2 && 'Informations personnelles'}
          {currentStep === 3 && 'Compétences & Besoins'}
          {currentStep === 4 && 'Préférences & Finalisation'}
        </span>
      </div>
    </div>
  );
}
