import { formatDuration } from '../../data/workouts';

interface CompleteViewProps {
  durationSeconds: number;
  exercisesCompleted: number;
  onSave: () => void;
  isSaving: boolean;
}

export function CompleteView({ durationSeconds, exercisesCompleted, onSave, isSaving }: CompleteViewProps) {
  return (
    <div className="relative z-10 flex-1 flex flex-col min-h-0">
      <div className="workout-live-ambient" aria-hidden="true">
        <div className="workout-live-blob workout-live-blob--warm" />
        <div className="workout-live-blob workout-live-blob--cool" />
      </div>

      <div
        className="relative z-10 flex-1 flex flex-col items-center justify-center px-8 text-center"
        style={{ paddingTop: 'max(2rem, env(safe-area-inset-top))' }}
      >
        <p className="text-[11px] text-white/35 tracking-[0.18em] uppercase mb-5">Gotowe</p>

        <h2
          className="font-body font-light text-white tracking-tight leading-[1.1] mb-12"
          style={{ fontSize: 'clamp(2rem, 8vw, 2.5rem)' }}
        >
          Trening ukończony
        </h2>

        <div className="flex items-end justify-center gap-10">
          <div>
            <div
              className="font-body font-light text-white tabular-nums leading-none"
              style={{ fontSize: 'clamp(2.5rem, 11vw, 3.25rem)' }}
            >
              {formatDuration(durationSeconds)}
            </div>
            <p className="text-[10px] text-white/35 tracking-[0.14em] uppercase mt-3">Czas</p>
          </div>

          <div className="w-px h-12 bg-white/12 mb-1" aria-hidden="true" />

          <div>
            <div
              className="font-body font-light text-white tabular-nums leading-none"
              style={{ fontSize: 'clamp(2.5rem, 11vw, 3.25rem)' }}
            >
              {exercisesCompleted}
            </div>
            <p className="text-[10px] text-white/35 tracking-[0.14em] uppercase mt-3">Ćwiczenia</p>
          </div>
        </div>
      </div>

      <div
        className="relative z-10 px-5"
        style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}
      >
        <button
          type="button"
          onClick={onSave}
          disabled={isSaving}
          className="btn-cta btn-cta--full disabled:opacity-50"
        >
          {isSaving ? 'Zapisywanie…' : 'Zapisz i wróć'}
        </button>
      </div>
    </div>
  );
}
