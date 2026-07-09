import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Heart,
  Clock,
  RotateCcw,
  Zap,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Lightbulb,
  BookOpen,
} from 'lucide-react';
import { getExerciseById, MUSCLE_GROUP_LABELS } from '../data/exercises';

const LEVEL_MAP = { beginner: 'Początkujący', intermediate: 'Średni', advanced: 'Zaawansowany' };
const TYPE_MAP: Record<string, string> = {
  push: 'Pchanie',
  pull: 'Ciąganie',
  hinge: 'Zawiasowy',
  squat: 'Przysiad',
  carry: 'Noszenie',
  core: 'Core',
  mobility: 'Mobilność',
};
const BAND_MAP: Record<string, string> = {
  light: 'Lekka',
  medium: 'Średnia',
  heavy: 'Ciężka',
  any: 'Dowolna',
};
export function ExerciseDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);

  const exercise = id ? getExerciseById(id) : undefined;

  if (!exercise) {
    return (
      <div className="app-shell items-center justify-center">
        <div className="app-bg" />
        <p className="relative z-10 text-white/50 text-sm">Nie znaleziono ćwiczenia</p>
      </div>
    );
  }

  return (
    <div className="app-shell overflow-y-auto">
      <div className="app-bg" />

      {/* Ambient blobs */}
      <div className="workout-live-ambient">
        <div className="workout-live-blob workout-live-blob--warm" />
        <div className="workout-live-blob workout-live-blob--cool" />
      </div>

      <div className="relative z-10 flex flex-col min-h-full pb-10">
        {/* Top bar */}
        <div className="flex items-center justify-between px-5 pt-safe-top py-4">
          <button type="button" onClick={() => navigate(-1)} className="btn-icon">
            <ArrowLeft size={18} strokeWidth={1.5} />
          </button>
          <button
            type="button"
            onClick={() => setIsFavorite((f) => !f)}
            className="btn-icon"
            aria-label={isFavorite ? 'Usuń z ulubionych' : 'Dodaj do ulubionych'}
          >
            <Heart
              size={18}
              strokeWidth={1.5}
              className={isFavorite ? 'fill-rose-400 text-rose-400' : 'text-white/60'}
            />
          </button>
        </div>

        {/* Hero */}
        <div className="px-5 mt-2 mb-6">
          <h1 className="font-body text-[32px] font-light text-white tracking-tight leading-tight">
            {exercise.name}
          </h1>
          {exercise.secondaryMuscles.length > 0 && (
            <p className="text-[13px] text-white/35 mt-1.5">
              Pomocnicze:{' '}
              {exercise.secondaryMuscles.map((m) => MUSCLE_GROUP_LABELS[m]).join(', ')}
            </p>
          )}
        </div>

        {/* Metadata grid */}
        <div className="px-5 mb-6">
          <div className="grid grid-cols-3 gap-2">
            <MetaCell label="Serie" value={String(exercise.defaultSets)} />
            <MetaCell label="Powtórzenia" value={exercise.defaultReps} />
            <MetaCell
              label="Odpoczynek"
              value={
                exercise.defaultRestSecs >= 60
                  ? `${Math.round(exercise.defaultRestSecs / 60)} min`
                  : `${exercise.defaultRestSecs} s`
              }
            />
            <MetaCell label="Tempo" value={exercise.tempo} mono />
            <MetaCell label="Poziom" value={LEVEL_MAP[exercise.level]} />
            <MetaCell label="Typ" value={TYPE_MAP[exercise.type] ?? exercise.type} />
          </div>

          {/* Band level row */}
          <div className="mt-2 dashboard-mini-card rounded-2xl px-4 py-3 flex items-center gap-3">
            <Zap size={14} strokeWidth={1.5} className="text-amber-400/70 shrink-0" />
            <div>
              <div className="text-[11px] text-white/35 uppercase tracking-wide">Guma</div>
              <div className="text-[13px] text-white/80 font-medium">{BAND_MAP[exercise.bandLevel]}</div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="px-5 mb-3">
          <button
            type="button"
            onClick={() => setShowInstructions((v) => !v)}
            className="w-full flex items-center justify-between py-3 text-left"
          >
            <div className="flex items-center gap-2.5">
              <BookOpen size={15} strokeWidth={1.5} className="text-white/40" />
              <span className="text-[13px] font-medium text-white/70">Instrukcja</span>
            </div>
            {showInstructions ? (
              <ChevronUp size={15} strokeWidth={1.5} className="text-white/30" />
            ) : (
              <ChevronDown size={15} strokeWidth={1.5} className="text-white/30" />
            )}
          </button>
          {showInstructions && (
            <p className="text-[14px] text-white/60 leading-relaxed pb-2 border-t border-white/[0.06] pt-3">
              {exercise.instructions}
            </p>
          )}
        </div>

        {/* Tips */}
        {exercise.tips.length > 0 && (
          <div className="px-5 mb-3">
            <div className="flex items-center gap-2.5 mb-3">
              <Lightbulb size={15} strokeWidth={1.5} className="text-amber-400/60" />
              <span className="text-[13px] font-medium text-white/70">Wskazówki</span>
            </div>
            <ul className="space-y-2">
              {exercise.tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400/40 mt-1.5 shrink-0" />
                  <span className="text-[13px] text-white/55 leading-snug">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Common mistakes */}
        {exercise.commonMistakes.length > 0 && (
          <div className="px-5 mb-6">
            <div className="flex items-center gap-2.5 mb-3">
              <AlertCircle size={15} strokeWidth={1.5} className="text-rose-400/60" />
              <span className="text-[13px] font-medium text-white/70">Częste błędy</span>
            </div>
            <ul className="space-y-2">
              {exercise.commonMistakes.map((m, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400/40 mt-1.5 shrink-0" />
                  <span className="text-[13px] text-white/55 leading-snug">{m}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* CTA */}
        <div className="px-5 mt-auto pt-6">
          <button
            type="button"
            onClick={() => navigate('/workout/live', { state: { singleExercise: exercise.id } })}
            className="btn-cta btn-cta--full gap-3"
          >
            <RotateCcw size={16} strokeWidth={1.5} />
            Ćwicz teraz
          </button>
          <div className="flex items-center gap-2 mt-3 justify-center">
            <Clock size={12} strokeWidth={1.5} className="text-white/25" />
            <span className="text-[12px] text-white/30 tabular-nums">
              {exercise.defaultSets} serie · {exercise.defaultRestSecs}s odpoczynek
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetaCell({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="dashboard-mini-card rounded-2xl px-3 py-2.5 flex flex-col gap-0.5">
      <div className="text-[10px] text-white/30 uppercase tracking-wide">{label}</div>
      <div className={`text-[15px] text-white/85 font-medium ${mono ? 'font-mono' : ''}`}>
        {value}
      </div>
    </div>
  );
}
