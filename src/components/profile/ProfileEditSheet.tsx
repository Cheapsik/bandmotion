import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { BottomSheet } from '../ui/BottomSheet';
import { Button } from '../ui/Button';
import { Chip } from '../ui/Chip';
import { SelectableTile } from '../ui/SelectableTile';
import { ScrollPicker } from '../ui/ScrollPicker';
import { BAND_PRESETS } from '../../data/bandPresets';
import type {
  Band,
  ExperienceLevel,
  Goal,
  LengthUnit,
  SessionDuration,
  TrainingDays,
  UserProfile,
  WeightUnit,
} from '../../types';
import {
  displayLength,
  displayWeight,
  lengthPickerRange,
  lengthUnitLabel,
  parseLengthInput,
  parseWeightInput,
  weightPickerRange,
  weightUnitLabel,
} from '../../utils/units';

export type ProfileEditSection =
  | 'goal'
  | 'experience'
  | 'body'
  | 'bands'
  | 'availability'
  | null;

interface ProfileEditSheetProps {
  section: ProfileEditSection;
  profile: UserProfile;
  weightUnit: WeightUnit;
  lengthUnit: LengthUnit;
  onClose: () => void;
  onSave: (partial: Partial<UserProfile>) => void;
}

const GENDERS = ['Kobieta', 'Mężczyzna', 'Wolę nie podawać'];
const GOALS: { label: string; value: Goal }[] = [
  { label: 'Spadek wagi', value: 'weight_loss' },
  { label: 'Siła i masa', value: 'strength' },
  { label: 'Kondycja', value: 'endurance' },
  { label: 'Mobilność i rehabilitacja', value: 'mobility' },
];
const EXPERIENCE: { label: string; value: ExperienceLevel }[] = [
  { label: 'Początkujący', value: 'beginner' },
  { label: 'Średniozaawansowany', value: 'intermediate' },
  { label: 'Zaawansowany', value: 'advanced' },
];
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

function makeId() {
  return Math.random().toString(36).slice(2, 10);
}

const TITLES: Record<NonNullable<ProfileEditSection>, string> = {
  goal: 'Cel treningowy',
  experience: 'Poziom',
  body: 'Parametry ciała',
  bands: 'Gumy oporowe',
  availability: 'Dostępność',
};

const pillClass = (active: boolean) =>
  `flex-1 h-10 rounded-full text-[12px] font-medium border focus-visible:outline-none ${
    active ? 'pill-active' : 'pill-inactive'
  }`;

export function ProfileEditSheet({
  section,
  profile,
  weightUnit,
  lengthUnit,
  onClose,
  onSave,
}: ProfileEditSheetProps) {
  const [draft, setDraft] = useState<UserProfile>(profile);
  const [showCustomBand, setShowCustomBand] = useState(false);
  const [customLabel, setCustomLabel] = useState('');

  useEffect(() => {
    setDraft(profile);
    setShowCustomBand(false);
    setCustomLabel('');
  }, [profile, section]);

  if (!section) return null;

  const update = (partial: Partial<UserProfile>) =>
    setDraft((prev) => ({ ...prev, ...partial }));

  const handleSave = () => {
    onSave(draft);
    onClose();
  };

  const togglePreset = (label: string) => {
    const bands = draft.bands ?? [];
    const existing = bands.find((b) => b.label === label && b.source === 'preset');
    if (existing) {
      update({ bands: bands.filter((b) => b.id !== existing.id) });
    } else {
      const preset = BAND_PRESETS.find((p) => p.label === label);
      const newBand: Band = {
        id: makeId(),
        label,
        source: 'preset',
        minResistanceKg: preset?.minResistanceKg,
        maxResistanceKg: preset?.maxResistanceKg,
      };
      update({ bands: [...bands, newBand] });
    }
  };

  const addCustomBand = () => {
    if (!customLabel.trim()) return;
    update({
      bands: [
        ...(draft.bands ?? []),
        { id: makeId(), label: customLabel.trim(), source: 'custom' },
      ],
    });
    setCustomLabel('');
    setShowCustomBand(false);
  };

  const heightRange = lengthPickerRange(lengthUnit);
  const weightRange = weightPickerRange(weightUnit);

  return (
    <BottomSheet title={TITLES[section]} open={!!section} onClose={onClose}>
      {section === 'goal' && (
        <div className="flex flex-col gap-2.5">
          {GOALS.map((opt) => (
            <SelectableTile
              key={opt.value}
              label={opt.label}
              selected={draft.goal === opt.value}
              onSelect={() => update({ goal: opt.value })}
            />
          ))}
        </div>
      )}

      {section === 'experience' && (
        <div className="flex flex-col gap-2.5">
          {EXPERIENCE.map((opt) => (
            <SelectableTile
              key={opt.value}
              label={opt.label}
              selected={draft.experienceLevel === opt.value}
              onSelect={() => update({ experienceLevel: opt.value })}
            />
          ))}
        </div>
      )}

      {section === 'body' && (
        <div className="space-y-5">
          <div>
            <div className="text-xs text-theme-muted mb-2">Płeć</div>
            <div className="flex gap-2">
              {GENDERS.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => update({ gender: g })}
                  className={pillClass(draft.gender === g)}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <div className="text-xs text-theme-muted mb-2 text-center">Wiek</div>
              <ScrollPicker
                min={14}
                max={90}
                value={draft.age}
                unit="lat"
                onChange={(v) => update({ age: v })}
              />
            </div>
            <div>
              <div className="text-xs text-theme-muted mb-2 text-center">Wzrost</div>
              <ScrollPicker
                min={heightRange.min}
                max={heightRange.max}
                value={displayLength(draft.heightCm, lengthUnit)}
                unit={lengthUnitLabel(lengthUnit)}
                onChange={(v) => update({ heightCm: parseLengthInput(v, lengthUnit) })}
              />
            </div>
            <div>
              <div className="text-xs text-theme-muted mb-2 text-center">Waga</div>
              <ScrollPicker
                min={weightRange.min}
                max={weightRange.max}
                value={displayWeight(draft.weightKg, weightUnit)}
                unit={weightUnitLabel(weightUnit)}
                onChange={(v) => update({ weightKg: parseWeightInput(v, weightUnit) })}
              />
            </div>
          </div>
        </div>
      )}

      {section === 'bands' && (
        <div>
          <div className="flex flex-wrap gap-2 mb-4">
            {BAND_PRESETS.map((preset) => (
              <Chip
                key={preset.label}
                label={preset.label}
                selected={draft.bands.some(
                  (b) => b.label === preset.label && b.source === 'preset',
                )}
                onClick={() => togglePreset(preset.label)}
              />
            ))}
          </div>
          {showCustomBand ? (
            <div className="flex gap-2 mb-4">
              <input
                value={customLabel}
                onChange={(e) => setCustomLabel(e.target.value)}
                placeholder="Nazwa gumy"
                className="input-underline flex-1 text-[14px]"
              />
              <Button size="sm" onClick={addCustomBand}>
                Dodaj
              </Button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowCustomBand(true)}
              className="flex items-center gap-1 text-[13px] text-theme-muted mb-4"
            >
              <Plus size={14} /> Dodaj własną
            </button>
          )}
          <div className="flex flex-wrap gap-2">
            {(draft.bands ?? [])
              .filter((b) => b.source === 'custom')
              .map((band) => (
                <Chip
                  key={band.id}
                  label={band.label}
                  selected
                  onRemove={() =>
                    update({ bands: draft.bands.filter((b) => b.id !== band.id) })
                  }
                />
              ))}
          </div>
        </div>
      )}

      {section === 'availability' && (
        <div className="space-y-5">
          <div>
            <div className="text-xs text-theme-muted mb-2">Dni w tygodniu</div>
            <div className="flex gap-2">
              {DAYS.map((d) => (
                <button
                  key={d.value}
                  type="button"
                  onClick={() => update({ trainingDaysPerWeek: d.value })}
                  className={pillClass(draft.trainingDaysPerWeek === d.value)}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs text-theme-muted mb-2">Długość sesji</div>
            <div className="flex gap-2">
              {DURATIONS.map((d) => (
                <button
                  key={d.value}
                  type="button"
                  onClick={() => update({ sessionDurationMinutes: d.value })}
                  className={pillClass(draft.sessionDurationMinutes === d.value)}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="mt-6">
        <Button
          fullWidth
          size="lg"
          disabled={section === 'bands' && (draft.bands?.length ?? 0) === 0}
          onClick={handleSave}
        >
          Zapisz
        </Button>
      </div>
    </BottomSheet>
  );
}
