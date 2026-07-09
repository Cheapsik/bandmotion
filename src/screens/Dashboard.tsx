import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, ArrowRight, Clock, Play } from 'lucide-react';
import { DashboardHeroTabs } from '../components/dashboard/DashboardHeroTabs';
import { DashboardMiniCard } from '../components/dashboard/DashboardMiniCard';
import { DashboardTopBar } from '../components/dashboard/DashboardTopBar';
import { DashboardWeekStrip } from '../components/dashboard/DashboardWeekStrip';
import { DashboardWorkoutRow } from '../components/dashboard/DashboardWorkoutRow';
import { HeroGauge } from '../components/dashboard/HeroGauge';
import { SUGGESTED_WORKOUT } from '../data/mockDashboard';
import { useAppStore } from '../store/appStore';
import { isSameWeek, toWeekDayIndex } from '../utils/week';
import type { TrainingDays } from '../types';

const HERO_TABS = [
  { id: 'today', label: 'Dziś' },
  { id: 'week', label: 'Tydzień' },
  { id: 'plan', label: 'Plan' },
];

function weeklyTargetFromProfile(days: TrainingDays | undefined): number {
  if (days === '2-3') return 3;
  if (days === '4-5') return 4;
  if (days === 'daily') return 5;
  return 4;
}

function heroCopy(count: number, target: number) {
  if (count >= target) return { label: 'tydzień', headline: 'Cel osiągnięty' };
  if (count === 0) return { label: 'tydzień', headline: 'Zacznij od dziś' };
  return { label: 'tydzień', headline: `${count} z ${target} dni` };
}

export function Dashboard() {
  const navigate = useNavigate();
  const workoutSessions = useAppStore((s) => s.workoutSessions);
  const profile = useAppStore((s) => s.profile);
  const [activeTab, setActiveTab] = useState('today');

  const workout = SUGGESTED_WORKOUT;
  const weeklyTarget = weeklyTargetFromProfile(profile?.trainingDaysPerWeek);

  const weeklyCount = useMemo(() => {
    const indices = new Set<number>();
    for (const session of workoutSessions) {
      const date = new Date(session.date);
      if (isSameWeek(date)) indices.add(toWeekDayIndex(date));
    }
    return indices.size;
  }, [workoutSessions]);

  const readinessScore = Math.min(100, Math.round((weeklyCount / weeklyTarget) * 100));
  const { label: heroLabel, headline: heroHeadline } = heroCopy(weeklyCount, weeklyTarget);

  const goToWorkout = () => navigate(`/workout/${workout.id}`);
  const goToLive = () => navigate('/workout/live', { state: { workoutId: workout.id } });
  const goToLibrary = () => navigate('/exercises');

  const goalSubtitle =
    weeklyCount >= weeklyTarget
      ? 'Cel osiągnięty'
      : weeklyCount > 0
        ? 'Robisz postępy'
        : 'Zacznij od dziś';

  const showWorkoutDetails = activeTab === 'today';
  const showWeekFocus = activeTab === 'week';
  const showPlanFocus = activeTab === 'plan';

  return (
    <div className="dashboard">
      <section className="dashboard-hero" aria-label="Podsumowanie">
        <div className="dashboard-hero-bg" aria-hidden="true">
          <div className="dashboard-hero-blob dashboard-hero-blob--warm" />
          <div className="dashboard-hero-blob dashboard-hero-blob--cool" />
        </div>

        <div className="dashboard-hero-content">
          <DashboardTopBar />
          <DashboardHeroTabs
            tabs={HERO_TABS}
            activeId={activeTab}
            onChange={setActiveTab}
          />

          <div className="dashboard-hero-gauge">
            <HeroGauge value={readinessScore} label={heroLabel} />
            <p className="dashboard-hero-headline">{heroHeadline}</p>
          </div>
        </div>
      </section>

      <section className="dashboard-panel" aria-label="Szczegóły">
        <div className="dashboard-panel-scroll">
          <div className="dashboard-stack">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="text-[15px] font-medium text-white">
                  {showWeekFocus
                    ? 'Aktywność tygodnia'
                    : showPlanFocus
                      ? 'Plany treningowe'
                      : 'Cel tygodniowy'}
                </div>
                <div className="text-[13px] text-white/45 mt-0.5">
                  {showPlanFocus ? 'Wybierz gotowy plan na gumy' : goalSubtitle}
                </div>
              </div>
              {!showPlanFocus && (
                <div className="text-[clamp(1.5rem,6vw,1.75rem)] font-light text-white tabular-nums shrink-0">
                  {readinessScore}%
                </div>
              )}
            </div>

            {showWorkoutDetails && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <button type="button" onClick={goToWorkout} className="text-left min-w-0">
                    <DashboardMiniCard
                      icon={<Clock size={16} strokeWidth={1.2} />}
                      value={`${workout.durationMinutes} min`}
                    />
                  </button>
                  <button type="button" onClick={goToWorkout} className="text-left min-w-0">
                    <DashboardMiniCard
                      icon={<Activity size={16} strokeWidth={1.2} />}
                      value={`${workout.exerciseCount} ćw.`}
                    />
                  </button>
                </div>

                <DashboardWorkoutRow
                  name={workout.name}
                  category={workout.category}
                  categoryLabel={workout.categoryLabel}
                  onClick={goToWorkout}
                />
              </>
            )}

            {showWeekFocus && (
              <p className="text-[13px] text-white/50">
                {weeklyCount} z {weeklyTarget} zaplanowanych dni z treningiem w tym tygodniu.
              </p>
            )}

            {showPlanFocus && (
              <button
                type="button"
                onClick={goToLibrary}
                className="w-full dashboard-mini-card rounded-2xl px-4 py-4 flex items-center justify-between gap-3 text-left active:scale-[0.99] transition-transform"
              >
                <div>
                  <div className="text-[15px] font-medium text-white">Przeglądaj treningi</div>
                  <div className="text-[12px] text-white/45 mt-0.5">
                    Full body, góra, dół, core
                  </div>
                </div>
                <ArrowRight size={16} strokeWidth={1.2} className="text-white/40 shrink-0" />
              </button>
            )}

            {!showPlanFocus && (
              <DashboardWeekStrip emphasized={showWeekFocus} />
            )}
          </div>
        </div>

        <div className="dashboard-panel-footer">
          <button type="button" onClick={goToLive} className="dashboard-start-btn">
            <Play size={16} fill="currentColor" className="ml-0.5" strokeWidth={0} />
            Rozpocznij trening
          </button>
        </div>
      </section>
    </div>
  );
}
