import { useState } from 'react';
import { ProfileField } from '../components/profile/ProfileField';
import {
  ProfileEditSheet,
  type ProfileEditSection,
} from '../components/profile/ProfileEditSheet';
import {
  DAYS_LABELS,
  DURATION_LABELS,
  EXPERIENCE_LABELS,
  GOAL_LABELS,
} from '../data/profileLabels';
import { APP_NAME, APP_VERSION } from '../constants/app';
import { useAppStore } from '../store/appStore';
import { formatLength, formatWeight, formatBandsLabel } from '../utils/units';
import type { AppSettings } from '../types';

function SettingRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between dashboard-mini-card rounded-2xl px-4 h-14">
      <span className="text-[14px] text-white">{label}</span>
      {children}
    </div>
  );
}

function UnitToggle<T extends string>({
  options,
  value,
  onChange,
}: {
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex gap-0.5 p-0.5 rounded-full bg-white/5 border border-white/8">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={`h-7 px-3 rounded-full text-[12px] font-medium transition-all duration-200 ${
            opt === value ? 'btn-pill--active' : 'text-white/45'
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

export function Profile() {
  const profile = useAppStore((s) => s.profile);
  const settings = useAppStore((s) => s.settings);
  const updateProfile = useAppStore((s) => s.updateProfile);
  const setSettings = useAppStore((s) => s.setSettings);

  const [editSection, setEditSection] = useState<ProfileEditSection>(null);

  if (!profile) {
    return (
      <div className="pb-4 animate-fade-in">
        <p className="text-[14px] text-white/50">Brak profilu</p>
      </div>
    );
  }

  const bandsLabel = formatBandsLabel(profile.bands);
  const bodyLabel = `${profile.age} lat · ${formatLength(profile.heightCm, settings.lengthUnit)} · ${formatWeight(profile.weightKg, settings.weightUnit)}`;
  const availabilityLabel = `${DAYS_LABELS[profile.trainingDaysPerWeek]} · ${DURATION_LABELS[profile.sessionDurationMinutes]}`;

  const updateSetting = <K extends keyof AppSettings>(key: K, val: AppSettings[K]) => {
    setSettings({ ...settings, [key]: val });
  };

  return (
    <div className="pb-8 animate-fade-in">
      <header className="mb-6">
        <h1 className="font-body text-[28px] font-light text-white tracking-tight">Profil</h1>
      </header>

      <section className="mb-3">
        <p className="text-[11px] text-white/40 tracking-[0.1em] uppercase px-1 mb-2">Dane</p>
        <div className="flex flex-col gap-2">
          <ProfileField label="Cel" value={GOAL_LABELS[profile.goal]} onEdit={() => setEditSection('goal')} />
          <ProfileField label="Poziom" value={EXPERIENCE_LABELS[profile.experienceLevel]} onEdit={() => setEditSection('experience')} />
          <ProfileField label="Parametry ciała" value={bodyLabel} onEdit={() => setEditSection('body')} />
          <ProfileField label="Gumy oporowe" value={bandsLabel} onEdit={() => setEditSection('bands')} />
          <ProfileField label="Dostępność" value={availabilityLabel} onEdit={() => setEditSection('availability')} />
        </div>
      </section>

      <section>
        <p className="text-[11px] text-white/40 tracking-[0.1em] uppercase px-1 mb-2 mt-6">Ustawienia</p>
        <div className="flex flex-col gap-2">
          <SettingRow label="Jednostki wagi">
            <UnitToggle
              options={['kg', 'lb'] as const}
              value={settings.weightUnit}
              onChange={(v) => updateSetting('weightUnit', v)}
            />
          </SettingRow>
          <SettingRow label="Jednostki długości">
            <UnitToggle
              options={['cm', 'inch'] as const}
              value={settings.lengthUnit}
              onChange={(v) => updateSetting('lengthUnit', v)}
            />
          </SettingRow>
        </div>
      </section>

      <ProfileEditSheet
        section={editSection}
        profile={profile}
        weightUnit={settings.weightUnit}
        lengthUnit={settings.lengthUnit}
        onClose={() => setEditSection(null)}
        onSave={(partial) => updateProfile(partial)}
      />

      <footer className="mt-12 pt-4 text-center">
        <p className="text-[12px] text-white/25 tracking-wide">{APP_NAME}</p>
        <p className="text-[11px] text-white/20 mt-0.5 tabular-nums">v{APP_VERSION}</p>
      </footer>
    </div>
  );
}
