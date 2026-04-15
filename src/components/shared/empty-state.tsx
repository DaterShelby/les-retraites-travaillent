import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center gap-4">
      {icon && (
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-50 text-primary">
          {icon}
        </div>
      )}
      <h3 className="text-xl font-serif font-bold text-primary">{title}</h3>
      <p className="text-body text-gray-500 max-w-md">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} className="mt-2">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
