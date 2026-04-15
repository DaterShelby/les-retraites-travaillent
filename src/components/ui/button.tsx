import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap font-sans font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 min-h-[48px] hover:scale-[1.02] active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-primary text-white hover:bg-primary-600 active:bg-primary-700",
        secondary: "bg-secondary text-white hover:bg-secondary-500 active:bg-secondary-600",
        accent: "bg-accent text-white hover:bg-accent-400 active:bg-accent-500",
        outline: "border-2 border-primary text-primary bg-transparent hover:bg-primary hover:text-white",
        ghost: "text-primary hover:bg-primary-50",
        destructive: "bg-error text-white hover:bg-red-700",
        link: "text-primary underline-offset-4 hover:underline min-h-0 hover:scale-100 active:scale-100",
      },
      size: {
        default: "h-12 px-6 text-base rounded-full",
        sm: "h-10 px-5 text-sm rounded-full",
        lg: "h-14 px-8 text-lg rounded-full",
        icon: "h-12 w-12 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
