import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap font-sans font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 min-h-[48px] active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-primary text-white hover:bg-primary-700 shadow-sm hover:shadow-md",
        secondary: "bg-secondary text-white hover:bg-secondary-500 shadow-sm hover:shadow-md",
        accent: "bg-accent text-white hover:bg-accent-400",
        outline: "border-2 border-gray-200 text-gray-700 bg-transparent hover:bg-gray-50 hover:border-gray-300",
        ghost: "text-gray-600 hover:bg-gray-100/80 hover:text-gray-900",
        destructive: "bg-error text-white hover:bg-red-700",
        link: "text-primary underline-offset-4 hover:underline min-h-0 active:scale-100",
      },
      size: {
        default: "h-12 px-6 text-base rounded-2xl",
        sm: "h-10 px-5 text-sm rounded-2xl",
        lg: "h-14 px-8 text-lg rounded-2xl",
        icon: "h-12 w-12 rounded-2xl",
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
