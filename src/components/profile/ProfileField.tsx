import { ChevronRight } from 'lucide-react';

interface ProfileFieldProps {
  label: string;
  value: string;
  onEdit: () => void;
}

export function ProfileField({ label, value, onEdit }: ProfileFieldProps) {
  return (
    <button
      type="button"
      onClick={onEdit}
      className="w-full flex items-center justify-between dashboard-mini-card rounded-2xl px-4 h-14 text-left active:scale-[0.99] transition-transform"
    >
      <div className="min-w-0 flex-1">
        <div className="text-[11px] text-white/40 tracking-wide">{label}</div>
        <div className="text-[14px] font-medium text-white mt-0.5 truncate">{value}</div>
      </div>
      <ChevronRight size={16} strokeWidth={1.2} className="text-white/30 shrink-0 ml-2" />
    </button>
  );
}
