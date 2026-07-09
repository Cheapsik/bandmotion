import { useEffect, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';

interface BottomSheetProps {
  title: string;
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

export function BottomSheet({ title, open, onClose, children }: BottomSheetProps) {
  const [mounted, setMounted] = useState(false);

  useBodyScrollLock(open);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!open || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[200] flex flex-col justify-end">
      <button
        type="button"
        className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"
        onClick={onClose}
        aria-label="Zamknij"
      />
      <div
        className="relative glass-strong rounded-t-3xl flex flex-col max-h-[85dvh] animate-slide-up"
        style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}
      >
        <div className="flex items-center justify-between px-5 pt-4 pb-4 shrink-0">
          <h3 className="font-body text-[20px] font-light text-white tracking-tight">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Zamknij"
            className="btn-icon w-9 h-9"
          >
            <X size={16} strokeWidth={1.2} />
          </button>
        </div>
        <div className="overflow-y-auto px-5 pb-2 no-scrollbar">{children}</div>
      </div>
    </div>,
    document.body,
  );
}
