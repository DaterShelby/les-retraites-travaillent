import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const containerVariants = cva("mx-auto w-full px-6 sm:px-8 lg:px-12", {
  variants: {
    size: {
      sm: "max-w-3xl",
      default: "max-w-6xl",
      lg: "max-w-7xl",
      xl: "max-w-[88rem]",
      full: "max-w-none",
    },
  },
  defaultVariants: { size: "default" },
});

export interface ContainerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof containerVariants> {}

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(containerVariants({ size }), className)}
      {...props}
    />
  )
);
Container.displayName = "Container";

const sectionVariants = cva("w-full", {
  variants: {
    spacing: {
      sm: "py-10 sm:py-14",
      default: "py-16 sm:py-24",
      lg: "py-24 sm:py-32",
      xl: "py-32 sm:py-40",
    },
    background: {
      default: "bg-transparent",
      cream: "bg-neutral-cream",
      white: "bg-white",
      muted: "bg-gray-50",
      primary: "bg-primary text-white",
      gradient:
        "bg-gradient-to-br from-primary-800 via-primary to-primary-900 text-white",
    },
  },
  defaultVariants: { spacing: "default", background: "default" },
});

export interface SectionProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof sectionVariants> {}

const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ className, spacing, background, ...props }, ref) => (
    <section
      ref={ref}
      className={cn(sectionVariants({ spacing, background }), className)}
      {...props}
    />
  )
);
Section.displayName = "Section";

export { Container, Section, containerVariants, sectionVariants };
