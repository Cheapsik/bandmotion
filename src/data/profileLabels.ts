export const GOAL_LABELS: Record<string, string> = {
  weight_loss: 'Spadek wagi',
  strength: 'Siła i masa',
  endurance: 'Kondycja',
  mobility: 'Mobilność i rehabilitacja',
};

export const EXPERIENCE_LABELS: Record<string, string> = {
  beginner: 'Początkujący',
  intermediate: 'Średniozaawansowany',
  advanced: 'Zaawansowany',
};

export const DAYS_LABELS: Record<string, string> = {
  '2-3': '2-3 dni / tydzień',
  '4-5': '4-5 dni / tydzień',
  daily: 'Codziennie',
};

export const DURATION_LABELS: Record<string, string> = {
  '10-15': '10-15 min / sesja',
  '20-30': '20-30 min / sesja',
  '30plus': '30+ min / sesja',
};

export const WORKOUT_TYPE_LABELS: Record<string, string> = {
  full_body: 'Full Body',
  category_based: 'Trening częściowy',
  single_exercise: 'Pojedyncze ćwiczenie',
};

const MONTH_NAMES = [
  'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec',
  'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień',
];

export function formatMonthYear(year: number, month: number): string {
  return `${MONTH_NAMES[month]} ${year}`;
}
