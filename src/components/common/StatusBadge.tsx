interface StatusBadgeProps {
  status: string;
  bgClass: string;
  colorClass: string;
}

export function StatusBadge({ status, bgClass, colorClass }: StatusBadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide ${colorClass}`}>
      <span className={`h-2 w-2 rounded-full ${bgClass} animate-pulse`} />
      {status}
    </span>
  );
}
