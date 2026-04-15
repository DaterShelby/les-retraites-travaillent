'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useOnboardingStore } from '@/stores/onboarding';
import { useAuth } from '@/hooks/use-auth';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronRight, Check } from 'lucide-react';
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
  const { user } = useAuth();
  const supabase = createClient();
  const { role, setPersonalInfo, setCompanyInfo, setStep } = useOnboardingStore();
  const store = useOnboardingStore();

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [savedSuccessfully, setSavedSuccessfully] = useState(false);

  const isCompany = role === 'company';
  const isRetiredOrClient = role === 'retiree' || role === 'client';

  const [formData, setFormData] = useState({
    firstName: store.firstName,
    lastName: store.lastName,
    city: store.city,
    phone: '',
    bio: '',
    avatarUrl: store.avatarUrl,
    companyName: store.companyName,
    siret: store.siret,
    sector: store.sector,
    companySize: store.companySize,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
    setSavedSuccessfully(false);

    try {
      if (!user) {
        throw new Error('Utilisateur non authentifié');
      }

      if (isRetiredOrClient) {
        const validated = onboardingStep2Schema.parse({
          firstName: formData.firstName,
          lastName: formData.lastName,
          city: formData.city,
          avatarUrl: formData.avatarUrl,
        });
        setPersonalInfo(validated);

        // Save to Supabase
        const { error } = await supabase
          .from('user_profiles')
          .update({
            first_name: validated.firstName,
            last_name: validated.lastName || null,
            city: validated.city || null,
            phone: formData.phone || null,
            bio: formData.bio || null,
            avatar_url: validated.avatarUrl || null,
          })
          .eq('id', user.id);

        if (error) {
          throw error;
        }

      } else if (isCompany) {
        const validated = onboardingStep2CompanySchema.parse({
          companyName: formData.companyName,
          siret: formData.siret,
          sector: formData.sector,
          companySize: formData.companySize,
        });
        setCompanyInfo(validated);

        // Save to Supabase
        const { error } = await supabase
          .from('user_profiles')
          .update({
            company_name: validated.companyName || null,
            siret: validated.siret || null,
            sector: validated.sector || null,
            company_size: validated.companySize || null,
          })
          .eq('id', user.id);

        if (error) {
          throw error;
        }
      }

      setSavedSuccessfully(true);
      setTimeout(() => {
        setStep(3);
        router.push('/onboarding/step-3');
      }, 500);

    } catch (error: any) {
      if (error.errors) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err: any) => {
          const field = err.path[0] as string;
          newErrors[field] = err.message;
        });
        setErrors(newErrors);
      } else {
        setErrors({ submit: error.message || 'Erreur lors de la sauvegarde' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="font-serif text-3xl font-bold text-[#4A6670]">
          {isCompany ? 'Informations de votre entreprise' : 'Vos informations personnelles'}
        </h2>
        <p className="text-lg text-[#2F3D42]/80">
          {isCompany
            ? 'Entrez les détails de votre entreprise'
            : 'Nous aurions besoin de quelques informations pour mieux vous connaître'}
        </p>
      </div>

      {errors.submit && (
        <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-700">
          {errors.submit}
        </div>
      )}

      {savedSuccessfully && (
        <div className="flex items-center gap-2 rounded-lg border border-green-300 bg-green-50 p-4 text-sm text-green-700">
          <Check className="h-5 w-5" />
          Informations sauvegardées avec succès !
        </div>
      )}

      <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleContinue(); }}>
        {isRetiredOrClient ? (
          <>
            {/* Personal Info Fields */}
            <div className="space-y-2">
              <label htmlFor="firstName" className="block text-sm font-medium text-[#4A6670]">
                Prénom *
              </label>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="Jean"
                className="h-12 border-[#F0917B]/30"
              />
              {errors.firstName && (
                <p className="text-sm text-red-600">{errors.firstName}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="lastName" className="block text-sm font-medium text-[#4A6670]">
                Nom (optionnel)
              </label>
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Dupont"
                className="h-12 border-[#F0917B]/30"
              />
              {errors.lastName && (
                <p className="text-sm text-red-600">{errors.lastName}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="city" className="block text-sm font-medium text-[#4A6670]">
                Ville *
              </label>
              <Input
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="Paris"
                className="h-12 border-[#F0917B]/30"
              />
              {errors.city && (
                <p className="text-sm text-red-600">{errors.city}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="phone" className="block text-sm font-medium text-[#4A6670]">
                Téléphone (optionnel)
              </label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+33 6 12 34 56 78"
                className="h-12 border-[#F0917B]/30"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="bio" className="block text-sm font-medium text-[#4A6670]">
                À propos (optionnel)
              </label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Parlez-nous un peu de vous..."
                className="h-24 w-full rounded-lg border border-[#F0917B]/30 bg-white p-3 text-[#2F3D42] placeholder:text-[#2F3D42]/50 focus:border-[#F0917B] focus:outline-none focus:ring-2 focus:ring-[#F0917B]/20"
                maxLength={500}
              />
              <p className="text-xs text-[#2F3D42]/60">
                {formData.bio.length}/500 caractères
              </p>
            </div>
          </>
        ) : (
          <>
            {/* Company Info Fields */}
            <div className="space-y-2">
              <label htmlFor="companyName" className="block text-sm font-medium text-[#4A6670]">
                Nom de l'entreprise *
              </label>
              <Input
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                placeholder="Tech Solutions SARL"
                className="h-12 border-[#F0917B]/30"
              />
              {errors.companyName && (
                <p className="text-sm text-red-600">{errors.companyName}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="siret" className="block text-sm font-medium text-[#4A6670]">
                SIRET *
              </label>
              <Input
                id="siret"
                name="siret"
                value={formData.siret}
                onChange={handleInputChange}
                placeholder="12345678901234"
                maxLength={14}
                className="h-12 border-[#F0917B]/30 font-mono"
              />
              {errors.siret && (
                <p className="text-sm text-red-600">{errors.siret}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="sector" className="block text-sm font-medium text-[#4A6670]">
                Secteur d'activité *
              </label>
              <Select
                value={formData.sector}
                onValueChange={(value) => handleSelectChange('sector', value)}
              >
                <SelectTrigger className="h-12 border-[#F0917B]/30">
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
              <label htmlFor="companySize" className="block text-sm font-medium text-[#4A6670]">
                Taille de l'entreprise *
              </label>
              <Select
                value={formData.companySize}
                onValueChange={(value) => handleSelectChange('companySize', value)}
              >
                <SelectTrigger className="h-12 border-[#F0917B]/30">
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
          disabled={isLoading || savedSuccessfully}
          size="lg"
          className="gap-2 bg-[#4A6670] hover:bg-[#4A6670]/90 text-white disabled:opacity-50"
        >
          {isLoading ? 'Sauvegarde en cours...' : (savedSuccessfully ? 'Continuer...' : 'Continuer')}
          {!isLoading && !savedSuccessfully && <ChevronRight className="h-5 w-5" />}
          {savedSuccessfully && <Check className="h-5 w-5" />}
        </Button>
      </div>
    </div>
  );
}
