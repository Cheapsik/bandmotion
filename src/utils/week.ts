export function getMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function isSameWeek(date: Date, reference: Date = new Date()): boolean {
  return getMonday(date).getTime() === getMonday(reference).getTime();
}

export function toWeekDayIndex(date: Date): number {
  const day = date.getDay();
  return day === 0 ? 6 : day - 1;
}
