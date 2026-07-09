import { useNavigate } from 'react-router-dom';
import { OnboardingLayout } from '../../components/layout/OnboardingLayout';
import { Button } from '../../components/ui/Button';
import { useAppStore } from '../../store/appStore';
import type { TrainingDays, SessionDuration } from '../../types';

const DAYS: { label: string; value: TrainingDays }[] = [
  { label: '2-3 dni', value: '2-3' },
  { label: '4-5 dni', value: '4-5' },
  { label: 'Codziennie', value: 'daily' },
];

const DURATIONS: { label: string; value: SessionDuration }[] = [
  { label: '10-15 min', value: '10-15' },
  { label: '20-30 min', value: '20-30' },
  { label: '30+ min', value: '30plus' },
];

export function Availability() {
  const navigate = useNavigate();
  const { draftProfile, updateDraft } = useAppStore();

  const canProceed = !!draftProfile.trainingDaysPerWeek && !!draftProfile.sessionDurationMinutes;

  return (
    <OnboardingLayout step={5} totalSteps={5} backTo="/onboarding/bands">
      <h2 className="font-body text-[26px] font-light text-theme tracking-tight mt-4 mb-6">
        Ile czasu masz na trening?
      </h2>

      <div className="mb-7">
        <div className="text-xs font-medium text-theme-muted mb-2.5 tracking-wide">Dni w tygodniu</div>
        <div className="flex gap-2">
          {DAYS.map((d) => (
            <button
              key={d.value}
              type="button"
              onClick={() => updateDraft({ trainingDaysPerWeek: d.value })}
              className={`flex-1 h-11 rounded-full text-[13px] font-medium transition-all duration-200 border ${
                draftProfile.trainingDaysPerWeek === d.value
                  ? 'pill-active border-transparent'
                  : 'pill-inactive'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="text-xs font-medium text-theme-muted mb-2.5 tracking-wide">Długość sesji</div>
        <div className="flex gap-2">
          {DURATIONS.map((d) => (
            <button
              key={d.value}
              type="button"
              onClick={() => updateDraft({ sessionDurationMinutes: d.value })}
              className={`flex-1 h-11 rounded-full text-[13px] font-medium transition-all duration-200 border ${
                draftProfile.sessionDurationMinutes === d.value
                  ? 'pill-active border-transparent'
                  : 'pill-inactive'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <Button
          fullWidth
          size="lg"
          disabled={!canProceed}
          onClick={() => navigate('/onboarding/summary')}
        >
          Dalej
        </Button>
      </div>
    </OnboardingLayout>
  );
}
