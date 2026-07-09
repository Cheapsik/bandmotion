import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { OnboardingLayout } from '../../components/layout/OnboardingLayout';
import { Button } from '../../components/ui/Button';
import { Chip } from '../../components/ui/Chip';
import { useAppStore } from '../../store/appStore';
import { BAND_PRESETS } from '../../data/bandPresets';
import type { Band } from '../../types';

function makeId() {
  return Math.random().toString(36).slice(2, 10);
}

export function Bands() {
  const navigate = useNavigate();
  const { draftProfile, updateDraft } = useAppStore();
  const bands = draftProfile.bands ?? [];

  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customLabel, setCustomLabel] = useState('');
  const [customMin, setCustomMin] = useState('');
  const [customMax, setCustomMax] = useState('');

  const togglePreset = (label: string) => {
    const existing = bands.find((b) => b.label === label && b.source === 'preset');
    if (existing) {
      updateDraft({ bands: bands.filter((b) => b.id !== existing.id) });
    } else {
      const preset = BAND_PRESETS.find((p) => p.label === label);
      const newBand: Band = {
        id: makeId(),
        label,
        source: 'preset',
        minResistanceKg: preset?.minResistanceKg,
        maxResistanceKg: preset?.maxResistanceKg,
      };
      updateDraft({ bands: [...bands, newBand] });
    }
  };

  const removeBand = (id: string) => {
    updateDraft({ bands: bands.filter((b) => b.id !== id) });
  };

  const addCustomBand = () => {
    if (!customLabel.trim()) return;
    const newBand: Band = {
      id: makeId(),
      label: customLabel.trim(),
      source: 'custom',
      minResistanceKg: customMin ? Number(customMin) : undefined,
      maxResistanceKg: customMax ? Number(customMax) : undefined,
    };
    updateDraft({ bands: [...bands, newBand] });
    setCustomLabel('');
    setCustomMin('');
    setCustomMax('');
    setShowCustomForm(false);
  };

  const customBands = bands.filter((b) => b.source === 'custom');

  return (
    <OnboardingLayout step={4} totalSteps={5} backTo="/onboarding/body">
      <h2 className="font-body text-[26px] font-light text-theme tracking-tight mt-4 mb-1">
        Jakie masz gumy oporowe?
      </h2>
      <p className="text-theme-muted text-[13px] mb-6">
        Możesz wybrać kilka lub dodać własną
      </p>

      <div className="flex flex-wrap gap-2">
        {BAND_PRESETS.map((preset) => (
          <Chip
            key={preset.label}
            label={preset.label}
            selected={bands.some((b) => b.label === preset.label && b.source === 'preset')}
            onClick={() => togglePreset(preset.label)}
          />
        ))}
      </div>

      {customBands.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {customBands.map((band) => (
            <Chip
              key={band.id}
              label={band.label}
              selected
              onRemove={() => removeBand(band.id)}
            />
          ))}
        </div>
      )}

      {showCustomForm ? (
        <div className="mt-4 glass-subtle rounded-2xl p-4 animate-fade-in">
          <input
            autoFocus
            value={customLabel}
            onChange={(e) => setCustomLabel(e.target.value)}
            placeholder="Nazwa, np. 'Guma czerwona'"
            className="input-underline text-[14px]"
          />
          <div className="flex gap-3 mt-3">
            <input
              type="number"
              inputMode="numeric"
              value={customMin}
              onChange={(e) => setCustomMin(e.target.value)}
              placeholder="Min kg"
              className="input-underline flex-1 text-[14px]"
            />
            <input
              type="number"
              inputMode="numeric"
              value={customMax}
              onChange={(e) => setCustomMax(e.target.value)}
              placeholder="Max kg"
              className="input-underline flex-1 text-[14px]"
            />
          </div>
          <div className="flex gap-2 mt-4">
            <Button variant="ghost" size="sm" onClick={() => setShowCustomForm(false)}>
              Anuluj
            </Button>
            <Button size="sm" disabled={!customLabel.trim()} onClick={addCustomBand}>
              Dodaj
            </Button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setShowCustomForm(true)}
          className="mt-4 w-full flex items-center justify-center gap-1.5 h-11 rounded-full border border-dashed border-[color-mix(in_srgb,var(--color-muted)_35%,transparent)] text-theme-muted text-[13px] font-medium transition-colors hover:border-white/25 hover:text-theme"
        >
          <Plus size={15} />
          Dodaj własną
        </button>
      )}

      <div className="mt-8">
        <Button
          fullWidth
          size="lg"
          disabled={bands.length === 0}
          onClick={() => navigate('/onboarding/availability')}
        >
          Dalej
        </Button>
      </div>
    </OnboardingLayout>
  );
}
