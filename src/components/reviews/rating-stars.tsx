"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingStarsProps {
  value?: number;
  onChange?: (rating: number) => void;
  interactive?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function RatingStars({
  value = 0,
  onChange,
  interactive = true,
  size = "md",
  className,
}: RatingStarsProps) {
  const [hoverValue, setHoverValue] = useState(0);
  const displayValue = hoverValue || value;

  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  return (
    <div className={cn("flex gap-1", className)}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange?.(star)}
          onMouseEnter={() => interactive && setHoverValue(star)}
          onMouseLeave={() => setHoverValue(0)}
          className={cn(
            sizeClasses[size],
            "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
            interactive ? "cursor-pointer" : "cursor-default"
          )}
          disabled={!interactive}
          aria-label={`${star} étoile${star > 1 ? "s" : ""}`}
        >
          <Star
            className={cn(
              sizeClasses[size],
              star <= displayValue
                ? "fill-accent text-accent"
                : "text-gray-300"
            )}
          />
        </button>
      ))}
    </div>
  );
}
