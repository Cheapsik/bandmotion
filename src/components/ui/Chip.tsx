import type { ReactNode } from 'react';
import { X } from 'lucide-react';

interface ChipProps {
  label: string;
  selected?: boolean;
  onClick?: () => void;
  onRemove?: () => void;
  icon?: ReactNode;
}

const chipBase =
  'inline-flex items-center gap-1.5 rounded-full px-4 h-10 text-[13px] font-medium transition-all duration-200 border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-glow)]';

function chipState(selected?: boolean) {
  return selected ? 'pill-active' : 'pill-inactive';
}

export function Chip({ label, selected, onClick, onRemove, icon }: ChipProps) {
  if (onRemove && !onClick) {
    return (
      <div className={`${chipBase} ${chipState(true)}`}>
        {icon}
        {label}
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Usuń ${label}`}
          className="ml-0.5 -mr-1 w-5 h-5 rounded-full flex items-center justify-center opacity-60 hover:opacity-100"
        >
          <X size={12} strokeWidth={1.5} />
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${chipBase} active:scale-[0.97] ${chipState(selected)}`}
    >
      {icon}
      {label}
      {onRemove && (
        <span
          role="presentation"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-0.5 -mr-1 w-5 h-5 rounded-full flex items-center justify-center opacity-60"
        >
          <X size={12} strokeWidth={1.5} />
        </span>
      )}
    </button>
  );
}
