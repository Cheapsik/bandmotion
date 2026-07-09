import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

interface OnboardingLayoutProps {
  children: ReactNode;
  step?: number;
  totalSteps?: number;
  showBack?: boolean;
  backTo?: string;
}

export function OnboardingLayout({
  children,
  step,
  totalSteps,
  showBack = true,
  backTo,
}: OnboardingLayoutProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (backTo) navigate(backTo);
    else navigate(-1);
  };

  return (
    <div className="app-shell">
      <div className="app-bg" />

      {(showBack || step !== undefined) && (
        <div
          className="relative z-10 flex items-center gap-3 px-4 pb-2 flex-shrink-0"
          style={{ paddingTop: 'max(1rem, env(safe-area-inset-top))' }}
        >
          {showBack ? (
            <button
              type="button"
              onClick={handleBack}
              aria-label="Wstecz"
              className="btn-icon"
            >
              <ChevronLeft size={18} strokeWidth={1.2} className="text-white/85" />
            </button>
          ) : (
            <div className="w-10" />
          )}

          {step !== undefined && totalSteps !== undefined && (
            <div className="flex-1 flex items-center gap-1.5">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <div
                  key={i}
                  className="h-[3px] flex-1 rounded-full transition-all duration-400"
                  style={{
                    background: i < step ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.12)',
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}

      <div className="page-content pb-8 page-bottom pt-0">
        {children}
      </div>
    </div>
  );
}
