interface StatCardProps {
  label: string;
  value: string;
}

export function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="dashboard-mini-card rounded-2xl px-4 h-14 flex items-center">
      <span className="text-[12px] text-white/40 flex-1 truncate">{label}</span>
      <span className="w-px h-6 bg-white/10 mx-3 shrink-0" />
      <span className="text-[16px] font-medium text-white tabular-nums shrink-0">{value}</span>
    </div>
  );
}
