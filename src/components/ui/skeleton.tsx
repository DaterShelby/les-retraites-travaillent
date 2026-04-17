import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-2xl bg-gradient-to-r from-gray-100 via-gray-200/60 to-gray-100",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
