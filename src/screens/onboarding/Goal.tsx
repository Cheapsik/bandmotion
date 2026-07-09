import { useNavigate } from 'react-router-dom';
import { OnboardingLayout } from '../../components/layout/OnboardingLayout';
import { SelectableTile } from '../../components/ui/SelectableTile';
import { Button } from '../../components/ui/Button';
import { useAppStore } from '../../store/appStore';
import type { Goal as GoalType } from '../../types';

const OPTIONS: { label: string; value: GoalType }[] = [
  { label: 'Spadek wagi', value: 'weight_loss' },
  { label: 'Siła i masa', value: 'strength' },
  { label: 'Kondycja', value: 'endurance' },
  { label: 'Mobilność i rehabilitacja', value: 'mobility' },
];

export function Goal() {
  const navigate = useNavigate();
  const { draftProfile, updateDraft } = useAppStore();

  return (
    <OnboardingLayout step={1} totalSteps={5} showBack={false}>
      <h2 className="font-body text-[26px] font-light text-theme tracking-tight mt-4 mb-6">
        Jaki jest Twój cel?
      </h2>

      <div className="flex flex-col gap-2.5">
        {OPTIONS.map((opt) => (
          <SelectableTile
            key={opt.value}
            label={opt.label}
            selected={draftProfile.goal === opt.value}
            onSelect={() => updateDraft({ goal: opt.value })}
          />
        ))}
      </div>

      <div className="mt-8">
        <Button
          fullWidth
          size="lg"
          disabled={!draftProfile.goal}
          onClick={() => navigate('/onboarding/experience')}
        >
          Dalej
        </Button>
      </div>
    </OnboardingLayout>
  );
}
