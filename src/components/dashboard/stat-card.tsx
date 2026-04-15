"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  variant?: "default" | "success" | "warning" | "info";
  className?: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon,
  variant = "default",
  className,
}: StatCardProps) {
  const variantStyles = {
    default: "bg-white border-l-4 border-primary",
    success: "bg-white border-l-4 border-accent",
    warning: "bg-white border-l-4 border-secondary",
    info: "bg-white border-l-4 border-blue-500",
  };

  return (
    <div
      className={cn(
        "rounded-lg p-6 shadow-sm transition-shadow hover:shadow-md",
        variantStyles[variant],
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-body-sm text-gray-500 mb-2">{title}</p>
          <p className="text-2xl font-serif font-bold text-primary mb-1">{value}</p>
          {subtitle && <p className="text-body-sm text-gray-400">{subtitle}</p>}
        </div>
        {icon && <div className="ml-4 flex-shrink-0 text-primary">{icon}</div>}
      </div>
    </div>
  );
}
