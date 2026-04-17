import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          "flex h-14 w-full rounded-2xl border-2 border-gray-200 bg-white px-4 py-3 text-base text-neutral-text",
          "placeholder:text-gray-400",
          "transition-all duration-200",
          "focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white",
          "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50",
          "aria-[invalid=true]:border-error aria-[invalid=true]:focus:border-error aria-[invalid=true]:focus:ring-error/20",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
