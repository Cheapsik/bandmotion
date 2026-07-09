import type { ReactNode } from 'react';

interface DashboardMiniCardProps {
  icon: ReactNode;
  value: string;
}

export function DashboardMiniCard({ icon, value }: DashboardMiniCardProps) {
  return (
    <div className="dashboard-mini-card rounded-2xl px-3.5 py-3 flex items-center gap-2.5 min-w-0">
      <span className="text-white/70 shrink-0">{icon}</span>
      <span className="text-[14px] font-medium text-white tabular-nums truncate">{value}</span>
    </div>
  );
}
