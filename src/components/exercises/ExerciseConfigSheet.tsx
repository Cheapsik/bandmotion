import { BottomSheet } from '../ui/BottomSheet';
import type { PlanExerciseConfig } from '../../utils/workoutConfig';
import { BAND_LEVEL_LABELS, REST_OPTIONS } from '../../utils/workoutConfig';
import type { BandLevel } from '../../types';
import { Minus, Plus } from 'lucide-react';

interface ExerciseConfigSheetProps {
  open: boolean;
  config: PlanExerciseConfig | null;
  onClose: () => void;
  onSave: (config: PlanExerciseConfig) => void;
}

const BAND_LEVELS: BandLevel[] = ['light', 'medium', 'heavy'];

export function ExerciseConfigSheet({ open, config, onClose, onSave }: ExerciseConfigSheetProps) {
  if (!config) return null;

  const update = (patch: Partial<PlanExerciseConfig>) => {
    onSave({ ...config, ...patch });
  };

  const adjustSets = (delta: number) => {
    update({ sets: Math.max(1, Math.min(10, config.sets + delta)) });
  };

  return (
    <BottomSheet title={config.name} open={open} onClose={onClose}>
      <div className="flex flex-col gap-5 pb-2">
        {/* Serie */}
        <div>
          <label className="text-[11px] text-white/35 uppercase tracking-wide">Serie</label>
          <div className="flex items-center gap-4 mt-2">
            <button
              type="button"
              onClick={() => adjustSets(-1)}
              disabled={config.sets <= 1}
              className="btn-icon w-10 h-10 disabled:opacity-30"
            >
              <Minus size={16} strokeWidth={1.5} />
            </button>
            <span className="text-[28px] font-light text-white tabular-nums w-8 text-center">
              {config.sets}
            </span>
            <button
              type="button"
              onClick={() => adjustSets(1)}
              disabled={config.sets >= 10}
              className="btn-icon w-10 h-10 disabled:opacity-30"
            >
              <Plus size={16} strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* Powtórzenia */}
        <div>
          <label className="text-[11px] text-white/35 uppercase tracking-wide">Powtórzenia</label>
          <input
            type="text"
            value={config.reps}
            onChange={(e) => update({ reps: e.target.value })}
            placeholder="np. 10–12"
            className="w-full h-11 mt-1.5 px-4 rounded-2xl bg-white/[0.06] border border-white/10 text-[14px] text-white placeholder:text-white/25 outline-none focus:border-white/20"
          />
        </div>

        {/* Odpoczynek */}
        <div>
          <label className="text-[11px] text-white/35 uppercase tracking-wide">Odpoczynek</label>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {REST_OPTIONS.map((secs) => (
              <button
                key={secs}
                type="button"
                onClick={() => update({ restSecs: secs })}
                className={`btn-pill ${config.restSecs === secs ? 'btn-pill--active' : ''}`}
              >
                {secs >= 60 ? `${secs / 60} min` : `${secs} s`}
              </button>
            ))}
          </div>
        </div>

        {/* Tempo */}
        <div>
          <label className="text-[11px] text-white/35 uppercase tracking-wide">Tempo</label>
          <input
            type="text"
            value={config.tempo}
            onChange={(e) => update({ tempo: e.target.value })}
            placeholder="np. 2-1-2"
            className="w-full h-11 mt-1.5 px-4 rounded-2xl bg-white/[0.06] border border-white/10 text-[14px] text-white font-mono placeholder:text-white/25 outline-none focus:border-white/20"
          />
        </div>

        {/* Guma */}
        <div>
          <label className="text-[11px] text-white/35 uppercase tracking-wide">Poziom gumy</label>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {BAND_LEVELS.map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => update({ bandLevel: level })}
                className={`btn-pill ${config.bandLevel === level ? 'btn-pill--active' : ''}`}
              >
                {BAND_LEVEL_LABELS[level]}
              </button>
            ))}
          </div>
        </div>

        <button type="button" onClick={onClose} className="btn-cta btn-cta--full mt-1">
          Gotowe
        </button>
      </div>
    </BottomSheet>
  );
}
