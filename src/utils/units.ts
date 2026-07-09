import type { Band, LengthUnit, WeightUnit } from '../types';

export function formatWeight(kg: number, unit: WeightUnit): string {
  if (unit === 'lb') return `${Math.round(kg * 2.20462)} lb`;
  return `${kg} kg`;
}

export function parseWeightInput(value: number, unit: WeightUnit): number {
  if (unit === 'lb') return Math.round((value / 2.20462) * 10) / 10;
  return value;
}

export function displayWeight(kg: number, unit: WeightUnit): number {
  if (unit === 'lb') return Math.round(kg * 2.20462);
  return kg;
}

export function weightPickerRange(unit: WeightUnit): { min: number; max: number } {
  if (unit === 'lb') return { min: 77, max: 441 };
  return { min: 35, max: 200 };
}

export function formatLength(cm: number, unit: LengthUnit): string {
  if (unit === 'inch') return `${Math.round(cm / 2.54)} in`;
  return `${cm} cm`;
}

export function displayLength(cm: number, unit: LengthUnit): number {
  if (unit === 'inch') return Math.round(cm / 2.54);
  return cm;
}

export function parseLengthInput(value: number, unit: LengthUnit): number {
  if (unit === 'inch') return Math.round(value * 2.54);
  return value;
}

export function lengthPickerRange(unit: LengthUnit): { min: number; max: number } {
  if (unit === 'inch') return { min: 47, max: 87 };
  return { min: 120, max: 220 };
}

export function weightInputLabel(unit: WeightUnit): string {
  return unit === 'lb' ? 'Waga (lb)' : 'Waga (kg)';
}

export function weightUnitLabel(unit: WeightUnit): string {
  return unit === 'lb' ? 'lb' : 'kg';
}

export function lengthInputLabel(unit: LengthUnit): string {
  return unit === 'inch' ? 'Obwód (in)' : 'Obwód (cm)';
}

export function lengthUnitLabel(unit: LengthUnit): string {
  return unit === 'inch' ? 'in' : 'cm';
}

export function circumferenceFieldLabel(part: string, unit: LengthUnit): string {
  const suffix = unit === 'inch' ? 'in, opcjonalnie' : 'cm, opcjonalnie';
  return `${part} (${suffix})`;
}

export function formatBandsLabel(bands: Band[]): string {
  if (bands.length === 0) return 'Brak';
  if (bands.length <= 2) return bands.map((b) => b.label).join(', ');
  return `${bands.length} gumy · ${bands.slice(0, 2).map((b) => b.label).join(', ')}…`;
}
