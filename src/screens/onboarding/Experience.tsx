import { useNavigate } from 'react-router-dom';
import { OnboardingLayout } from '../../components/layout/OnboardingLayout';
import { SelectableTile } from '../../components/ui/SelectableTile';
import { Button } from '../../components/ui/Button';
import { useAppStore } from '../../store/appStore';
import type { ExperienceLevel } from '../../types';

const OPTIONS: { label: string; value: ExperienceLevel }[] = [
  { label: 'Początkujący', value: 'beginner' },
  { label: 'Średniozaawansowany', value: 'intermediate' },
  { label: 'Zaawansowany', value: 'advanced' },
];

export function Experience() {
  const navigate = useNavigate();
  const { draftProfile, updateDraft } = useAppStore();

  return (
    <OnboardingLayout step={2} totalSteps={5} backTo="/onboarding/goal">
      <h2 className="font-body text-[26px] font-light text-theme tracking-tight mt-4 mb-6">
        Jak oceniasz swoje doświadczenie?
      </h2>

      <div className="flex flex-col gap-2.5">
        {OPTIONS.map((opt) => (
          <SelectableTile
            key={opt.value}
            label={opt.label}
            selected={draftProfile.experienceLevel === opt.value}
            onSelect={() => updateDraft({ experienceLevel: opt.value })}
          />
        ))}
      </div>

      <div className="mt-8">
        <Button
          fullWidth
          size="lg"
          disabled={!draftProfile.experienceLevel}
          onClick={() => navigate('/onboarding/body')}
        >
          Dalej
        </Button>
      </div>
    </OnboardingLayout>
  );
}
