import { useNavigate } from 'react-router-dom';
import { Pencil } from 'lucide-react';
import { OnboardingLayout } from '../../components/layout/OnboardingLayout';
import { Button } from '../../components/ui/Button';
import { useAppStore } from '../../store/appStore';
import { db } from '../../services/db';
import {
  DAYS_LABELS,
  DURATION_LABELS,
  EXPERIENCE_LABELS,
  GOAL_LABELS,
} from '../../data/profileLabels';
import { formatBandsLabel } from '../../utils/units';
import type { UserProfile } from '../../types';

interface SummaryRowProps {
  label: string;
  value: string;
  onEdit: () => void;
}

function SummaryRow({ label, value, onEdit }: SummaryRowProps) {
  return (
    <div className="flex items-center justify-between dashboard-mini-card rounded-2xl px-4 h-14">
      <div className="min-w-0 flex-1">
        <div className="text-[10px] text-white/40 tracking-wide uppercase">{label}</div>
        <div className="text-[14px] font-medium text-white mt-0.5 truncate">{value}</div>
      </div>
      <button
        type="button"
        onClick={onEdit}
        aria-label={`Edytuj ${label}`}
        className="btn-icon w-9 h-9 ml-2"
      >
        <Pencil size={13} strokeWidth={1.2} />
      </button>
    </div>
  );
}

export function Summary() {
  const navigate = useNavigate();
  const { draftProfile, setProfile } = useAppStore();

  const bandsLabel = formatBandsLabel(draftProfile.bands ?? []);

  const handleConfirm = async () => {
    const finalProfile: UserProfile = {
      goal: draftProfile.goal!,
      experienceLevel: draftProfile.experienceLevel!,
      gender: draftProfile.gender ?? 'Wolę nie podawać',
      age: draftProfile.age ?? 30,
      heightCm: draftProfile.heightCm ?? 170,
      weightKg: draftProfile.weightKg ?? 70,
      bands: draftProfile.bands ?? [],
      trainingDaysPerWeek: draftProfile.trainingDaysPerWeek!,
      sessionDurationMinutes: draftProfile.sessionDurationMinutes!,
      onboardingCompleted: true,
    };

    await db.saveProfile(finalProfile);
    await db.saveMeasurement({
      date: new Date().toISOString(),
      weightKg: finalProfile.weightKg,
    });
    setProfile(finalProfile);
    useAppStore.setState((state) => ({
      measurements: [
        ...state.measurements,
        { date: new Date().toISOString(), weightKg: finalProfile.weightKg },
      ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    }));
    navigate('/dashboard', { replace: true });
  };

  return (
    <OnboardingLayout showBack backTo="/onboarding/availability">
      <h2 className="font-body text-[26px] font-light text-white tracking-tight mt-4 mb-6">
        Twoje ustawienia
      </h2>

      <div className="flex flex-col gap-2.5">
        <SummaryRow
          label="Cel"
          value={GOAL_LABELS[draftProfile.goal ?? ''] ?? '—'}
          onEdit={() => navigate('/onboarding/goal')}
        />
        <SummaryRow
          label="Poziom"
          value={EXPERIENCE_LABELS[draftProfile.experienceLevel ?? ''] ?? '—'}
          onEdit={() => navigate('/onboarding/experience')}
        />
        <SummaryRow
          label="Gumy oporowe"
          value={bandsLabel}
          onEdit={() => navigate('/onboarding/bands')}
        />
        <SummaryRow
          label="Dostępność"
          value={`${DAYS_LABELS[draftProfile.trainingDaysPerWeek ?? ''] ?? '—'} · ${
            DURATION_LABELS[draftProfile.sessionDurationMinutes ?? ''] ?? '—'
          }`}
          onEdit={() => navigate('/onboarding/availability')}
        />
      </div>

      <div className="mt-8">
        <Button fullWidth size="lg" onClick={handleConfirm}>
          Przejdź do aplikacji
        </Button>
      </div>
    </OnboardingLayout>
  );
}
