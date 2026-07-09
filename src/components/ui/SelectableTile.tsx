import type { ReactNode } from 'react';

interface SelectableTileProps {
  label: string;
  sublabel?: string;
  icon?: ReactNode;
  selected: boolean;
  onSelect: () => void;
}

export function SelectableTile({ label, sublabel, icon, selected, onSelect }: SelectableTileProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full text-left rounded-2xl px-4 py-3.5 transition-all duration-200 active:scale-[0.99] border ${
        selected
          ? 'bg-white/15 border-white/35 shadow-[0_0_20px_rgba(255,255,255,0.06)]'
          : 'bg-white/5 border-white/8'
      }`}
    >
      <div className="flex items-center gap-3">
        {icon && (
          <span className={`text-lg ${selected ? 'text-white' : 'text-white/50'}`}>{icon}</span>
        )}
        <div className="flex-1">
          <div className={`font-medium text-[14.5px] ${selected ? 'text-white' : 'text-white/80'}`}>{label}</div>
          {sublabel && (
            <div className="text-xs mt-0.5 text-white/40">{sublabel}</div>
          )}
        </div>
        <div
          className={`w-[18px] h-[18px] rounded-full border transition-all duration-200 flex items-center justify-center ${
            selected ? 'border-white/50' : 'border-white/20'
          }`}
        >
          {selected && <div className="w-2 h-2 rounded-full bg-white/85" />}
        </div>
      </div>
    </button>
  );
}
