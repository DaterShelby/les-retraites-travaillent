export function LoadingState({ message = "Chargement en cours…" }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4" role="status" aria-label={message}>
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      <p className="text-body text-gray-500">{message}</p>
    </div>
  );
}
