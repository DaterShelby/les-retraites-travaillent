'use client';

import { Card } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';
import type { UserRole } from '@/types/database';

interface RoleSelectorProps {
  selected: UserRole | null;
  onSelect: (role: UserRole) => void;
}

const ROLES: Array<{
  id: UserRole;
  title: string;
  description: string;
  icon: React.ReactNode;
  highlight: string;
}> = [
  {
    id: 'retiree',
    title: 'Je suis retraité',
    description: 'Je veux partager mon expertise et gagner un complément de revenus',
    icon: '👴',
    highlight: 'Proposer des services',
  },
  {
    id: 'client',
    title: 'Je cherche un service',
    description: 'Je veux trouver quelqu\'un pour m\'aider dans mes tâches du quotidien',
    icon: '🔍',
    highlight: 'Trouver de l\'aide',
  },
  {
    id: 'company',
    title: 'Je recrute pour mon entreprise',
    description: 'Je veux accéder au talent et à l\'expérience des retraités',
    icon: '🏢',
    highlight: 'Poster une offre',
  },
];

export function RoleSelector({ selected, onSelect }: RoleSelectorProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-3">
      {ROLES.map((role) => (
        <button
          key={role.id}
          onClick={() => onSelect(role.id)}
          className="group relative focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E07A5F]"
        >
          <Card
            className={`relative overflow-hidden transition-all duration-300 h-full cursor-pointer ${
              selected === role.id
                ? 'border-[#E07A5F] border-2 shadow-lg shadow-[#E07A5F]/20 bg-[#E07A5F]/5'
                : 'border-[#E07A5F]/20 hover:border-[#E07A5F]/50 hover:shadow-md'
            }`}
          >
            {/* Background gradient */}
            <div
              className={`absolute inset-0 opacity-0 transition-opacity duration-300 ${
                selected === role.id ? 'opacity-100' : 'group-hover:opacity-50'
              }`}
              style={{
                background: 'linear-gradient(135deg, #E07A5F/10 0%, #81B29A/10 100%)',
              }}
            />

            <div className="relative space-y-4 p-6 sm:p-8">
              {/* Selection Indicator */}
              <div className="absolute top-4 right-4">
                {selected === role.id && (
                  <CheckCircle2 className="h-6 w-6 text-[#81B29A]" />
                )}
              </div>

              {/* Icon */}
              <div className="text-5xl">{role.icon}</div>

              {/* Content */}
              <div className="space-y-2 text-left">
                <h3 className="font-serif text-xl font-bold text-[#1B4965]">
                  {role.title}
                </h3>
                <p className="text-sm text-[#3D405B]/80">
                  {role.description}
                </p>
              </div>

              {/* Highlight Badge */}
              <div className="pt-2 inline-block">
                <span className="inline-block rounded-full bg-[#81B29A]/20 px-3 py-1 text-xs font-medium text-[#81B29A]">
                  {role.highlight}
                </span>
              </div>
            </div>
          </Card>
        </button>
      ))}
    </div>
  );
}
