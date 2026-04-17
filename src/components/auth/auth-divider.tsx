import { cn } from "@/lib/utils";

interface AuthDividerProps {
  label?: string;
  className?: string;
}

export function AuthDivider({ label = "ou", className }: AuthDividerProps) {
  return (
    <div
      className={cn(
        "relative flex items-center gap-3 text-xs font-medium uppercase tracking-wider text-gray-300",
        className
      )}
    >
      <span className="h-px flex-1 bg-gray-200" />
      <span>{label}</span>
      <span className="h-px flex-1 bg-gray-200" />
    </div>
  );
}
