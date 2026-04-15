'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useOnboardingStore } from '@/stores/onboarding';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronRight } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { COMPANY_SIZES, SECTORS } from '@/lib/constants';
import { onboardingStep2Schema, onboardingStep2CompanySchema } from '@/lib/validation';

export default function Step2Page() {
  const router = useRouter();
  const { role, setPersonalInfo, setCompanyInfo, setStep } = useOnboardingStore();
  const store = useOnboardingStore();

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const isCompany = role === 'company';
  const isRetiredOrClient = role === 'retiree' || role === 'client';

  const [formData, setFormData] = useState({
    firstName: store.firstName,
    lastName: store.lastName,
    city: store.city,
    avatarUrl: store.avatarUrl,
    companyName: store.companyName,
    siret: store.siret,
    sector: store.sector,
    companySize: store.companySize,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleContinue = async () => {
    setIsLoading(true);
    setErrors({});

    try {
      if (isRetiredOrClient) {
        const validated = onboardingStep2Schema.parse({
          firstName: formData.firstName,
          lastName: formData.lastName,
          city: formData.city,
          avatarUrl: formData.avatarUrl,
        });
        setPersonalInfo(validated);
      } else if (isCompany) {
        const validated = onboardingStep2CompanySchema.parse({
          companyName: formData.companyName,
          siret: formData.siret,
          sector: formData.sector,
          companySize: formData.companySize,
        });
        setCompanyInfo(validated);
      }

      setStep(3);
      router.push('/onboarding/step-3');
    } catch (error: any) {
      if (error.errors) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err: any) => {
          const field = err.path[0] as string;
          newErrors[field] = err.message;
        });
        setErrors(newErrors);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="font-serif text-3xl font-bold text-[#1B4965]">
          {isCompany ? 'Informations de votre entreprise' : 'Vos informations personnelles'}
        </h2>
        <p className="text-lg text-[#3D405B]/80">
          {isCompany
            ? 'Entrez les détails de votre entreprise'
            : 'Nous aurions besoin de quelques informations pour mieux vous connaître'}
        </p>
      </div>

      <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleContinue(); }}>
        {isRetiredOrClient ? (
          <>
            {/* Personal Info Fields */}
            <div className="space-y-2">
              <label htmlFor="firstName" className="block text-sm font-medium text-[#1B4965]">
                Prénom *
              </label>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="Jean"
                className="h-12 border-[#E07A5F]/30"
              />
              {errors.firstName && (
                <p className="text-sm text-red-600">{errors.firstName}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="lastName" className="block text-sm font-medium text-[#1B4965]">
                Nom (optionnel)
              </label>
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Dupont"
                className="h-12 border-[#E07A5F]/30"
              />
              {errors.lastName && (
                <p className="text-sm text-red-600">{errors.lastName}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="city" className="block text-sm font-medium text-[#1B4965]">
                Ville *
              </label>
              <Input
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="Paris"
                className="h-12 border-[#E07A5F]/30"
              />
              {errors.city && (
                <p className="text-sm text-red-600">{errors.city}</p>
              )}
            </div>
          </>
        ) : (
          <>
            {/* Company Info Fields */}
            <div className="space-y-2">
              <label htmlFor="companyName" className="block text-sm font-medium text-[#1B4965]">
                Nom de l'entreprise *
              </label>
              <Input
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                placeholder="Tech Solutions SARL"
                className="h-12 border-[#E07A5F]/30"
              />
              {errors.companyName && (
                <p className="text-sm text-red-600">{errors.companyName}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="siret" className="block text-sm font-medium text-[#1B4965]">
                SIRET *
              </label>
              <Input
                id="siret"
                name="siret"
                value={formData.siret}
                onChange={handleInputChange}
                placeholder="12345678901234"
                maxLength={14}
                className="h-12 border-[#E07A5F]/30 font-mono"
              />
              {errors.siret && (
                <p className="text-sm text-red-600">{errors.siret}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="sector" className="block text-sm font-medium text-[#1B4965]">
                Secteur d'activité *
              </label>
              <Select
                value={formData.sector}
                onValueChange={(value) => handleSelectChange('sector', value)}
              >
                <SelectTrigger className="h-12 border-[#E07A5F]/30">
                  <SelectValue placeholder="Sélectionnez un secteur" />
                </SelectTrigger>
                <SelectContent>
                  {SECTORS.map((sector) => (
                    <SelectItem key={sector} value={sector}>
                      {sector}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.sector && (
                <p className="text-sm text-red-600">{errors.sector}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="companySize" className="block text-sm font-medium text-[#1B4965]">
                Taille de l'entreprise *
              </label>
              <Select
                value={formData.companySize}
                onValueChange={(value) => handleSelectChange('companySize', value)}
              >
                <SelectTrigger className="h-12 border-[#E07A5F]/30">
                  <SelectValue placeholder="Sélectionnez la taille" />
                </SelectTrigger>
                <SelectContent>
                  {COMPANY_SIZES.map((size) => (
                    <SelectItem key={size.value} value={size.value}>
                      {size.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.companySize && (
                <p className="text-sm text-red-600">{errors.companySize}</p>
              )}
            </div>
          </>
        )}
      </form>

      <div className="flex justify-end">
        <Button
          onClick={handleContinue}
          disabled={isLoading}
          size="lg"
          className="gap-2 bg-[#1B4965] hover:bg-[#1B4965]/90 text-white"
        >
          {isLoading ? 'Chargement...' : 'Continuer'}
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
