'use client';

import { SERVICE_CATEGORIES } from '@/lib/constants';
import * as Icons from 'lucide-react';
import { CheckCircle2, Circle } from 'lucide-react';

interface SkillsPickerProps {
  selected: string[];
  onSelect: (selected: string[]) => void;
}

type IconName = keyof typeof Icons;

function getIcon(iconName: string) {
  const Icon = Icons[iconName as IconName] as React.ComponentType<{ className: string }>;
  if (!Icon) {
    return Icons.Circle;
  }
  return Icon;
}

export function SkillsPicker({ selected, onSelect }: SkillsPickerProps) {
  const toggleCategory = (categoryId: string) => {
    onSelect(
      selected.includes(categoryId)
        ? selected.filter((id) => id !== categoryId)
        : [...selected, categoryId]
    );
  };

  return (
    <div className="space-y-4">
      {/* Selection Counter */}
      <div className="rounded-lg bg-[#81B29A]/10 px-4 py-3 text-sm text-[#3D405B]">
        <strong>{selected.length}</strong> catégorie{selected.length > 1 ? 's' : ''} sélectionnée{selected.length > 1 ? 's' : ''}
      </div>

      {/* Categories Grid */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {SERVICE_CATEGORIES.map((category) => {
          const isSelected = selected.includes(category.id);
          const IconComponent = getIcon(category.icon);

          return (
            <button
              key={category.id}
              onClick={() => toggleCategory(category.id)}
              className="group relative focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E07A5F]"
            >
              <div
                className={`rounded-lg border-2 p-4 transition-all duration-300 text-left ${
                  isSelected
                    ? 'border-[#E07A5F] bg-[#E07A5F]/10 shadow-md shadow-[#E07A5F]/20'
                    : 'border-[#E07A5F]/20 bg-white hover:border-[#E07A5F]/50'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  {/* Icon & Label */}
                  <div className="flex items-start gap-3 flex-1">
                    <div
                      className={`flex-shrink-0 rounded-lg p-2 transition-colors ${
                        isSelected
                          ? 'bg-[#E07A5F]/20 text-[#E07A5F]'
                          : 'bg-[#81B29A]/10 text-[#81B29A] group-hover:bg-[#E07A5F]/10 group-hover:text-[#E07A5F]'
                      }`}
                    >
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-[#1B4965]">
                        {category.label}
                      </p>
                    </div>
                  </div>

                  {/* Selection Indicator */}
                  <div className="flex-shrink-0 mt-0.5">
                    {isSelected ? (
                      <CheckCircle2 className="h-6 w-6 text-[#81B29A]" />
                    ) : (
                      <Circle className="h-6 w-6 text-[#E07A5F]/30" />
                    )}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Help Text */}
      <p className="text-xs text-[#3D405B]/60 pt-2">
        Vous pouvez sélectionner plusieurs catégories
      </p>
    </div>
  );
}
