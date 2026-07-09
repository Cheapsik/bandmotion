import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';

export function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="app-shell">
      <div className="app-bg-welcome" />

      <div className="absolute top-[14%] left-1/2 -translate-x-1/2 w-[min(68vw,17rem)] aspect-square rounded-full border border-white/10 pointer-events-none" />
      <div className="absolute top-[14%] left-1/2 -translate-x-1/2 w-[min(48vw,12rem)] aspect-square rounded-full border border-white/15 pointer-events-none" />

      <div
        className="relative z-10 flex flex-col flex-1 px-6"
        style={{
          paddingTop: 'max(2rem, env(safe-area-inset-top))',
          paddingBottom: 'max(2rem, env(safe-area-inset-bottom))',
        }}
      >
        <div className="flex-1" />

        <div className="flex flex-col items-center gap-3 animate-fade-in">
          <div className="w-14 h-14 rounded-full glass-strong border border-theme flex items-center justify-center glow-ring">
            <svg width="24" height="24" viewBox="0 0 32 32" fill="none" aria-hidden="true">
              <ellipse cx="16" cy="16" rx="10" ry="6" stroke="rgba(255,255,255,0.8)" strokeWidth="1.2" />
              <ellipse cx="16" cy="16" rx="6" ry="10" stroke="rgba(255,255,255,0.8)" strokeWidth="1.2" />
            </svg>
          </div>
          <h1 className="font-body text-[clamp(2.25rem,9vw,2.75rem)] font-light tracking-tight text-theme text-center">
            BandMotion
          </h1>
          <p className="text-theme-muted text-[13px] text-center max-w-[220px] tracking-wide">
            Trening z gumami oporowymi
          </p>
        </div>

        <div className="flex-[2]" />

        <div className="animate-slide-up w-full max-w-md mx-auto" style={{ animationDelay: '100ms' }}>
          <Button fullWidth size="lg" onClick={() => navigate('/onboarding/goal')}>
            Zacznij
          </Button>
        </div>
      </div>
    </div>
  );
}
