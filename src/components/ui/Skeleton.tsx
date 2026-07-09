export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-2xl bg-sand-200/40 ${className}`}
      aria-hidden="true"
    />
  );
}
