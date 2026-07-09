import type { ButtonHTMLAttributes } from 'react';
import { Play } from 'lucide-react';

interface FloatingActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
}

export function FloatingActionButton({
  label = 'Start treningu',
  className = '',
  ...props
}: FloatingActionButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      className={`fixed z-[60] right-5 w-14 h-14 rounded-full flex items-center justify-center btn-primary glow-ring transition-all duration-200 active:scale-95 ${className}`}
      style={{
        bottom: 'calc(var(--tab-bar-height) + env(safe-area-inset-bottom) + 0.5rem)',
      }}
      {...props}
    >
      <Play size={20} fill="currentColor" className="ml-0.5" strokeWidth={0} />
    </button>
  );
}
