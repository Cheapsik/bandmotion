import { useNavigate } from 'react-router-dom';
import { OnboardingLayout } from '../../components/layout/OnboardingLayout';
import { Button } from '../../components/ui/Button';
import { ScrollPicker } from '../../components/ui/ScrollPicker';
import { useAppStore } from '../../store/appStore';

const GENDERS = ['Kobieta', 'Mężczyzna', 'Wolę nie podawać'];

export function BodyParams() {
  const navigate = useNavigate();
  const { draftProfile, updateDraft } = useAppStore();

  return (
    <OnboardingLayout step={3} totalSteps={5} backTo="/onboarding/experience">
      <h2 className="font-body text-[26px] font-light text-theme tracking-tight mt-4 mb-6">
        Kilka liczb o Tobie
      </h2>

      <div className="mb-6">
        <div className="text-xs font-medium text-theme-muted mb-2 tracking-wide">Płeć</div>
        <div className="flex gap-2">
          {GENDERS.map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => updateDraft({ gender: g })}
              className={`flex-1 h-10 rounded-full text-[12.5px] font-medium transition-all duration-200 border ${
                draftProfile.gender === g
                  ? 'pill-active border-transparent'
                  : 'pill-inactive'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <div className="text-xs font-medium text-theme-muted mb-2 text-center tracking-wide">Wiek</div>
          <ScrollPicker
            min={14}
            max={90}
            value={draftProfile.age ?? 30}
            unit="lat"
            onChange={(v) => updateDraft({ age: v })}
          />
        </div>
        <div>
          <div className="text-xs font-medium text-theme-muted mb-2 text-center tracking-wide">Wzrost</div>
          <ScrollPicker
            min={120}
            max={220}
            value={draftProfile.heightCm ?? 170}
            unit="cm"
            onChange={(v) => updateDraft({ heightCm: v })}
          />
        </div>
        <div>
          <div className="text-xs font-medium text-theme-muted mb-2 text-center tracking-wide">Waga</div>
          <ScrollPicker
            min={35}
            max={200}
            value={draftProfile.weightKg ?? 70}
            unit="kg"
            onChange={(v) => updateDraft({ weightKg: v })}
          />
        </div>
      </div>

      <div className="mt-8">
        <Button
          fullWidth
          size="lg"
          onClick={() => navigate('/onboarding/bands')}
        >
          Dalej
        </Button>
      </div>
    </OnboardingLayout>
  );
}
