export interface BandPreset {
  label: string;
  minResistanceKg?: number;
  maxResistanceKg?: number;
}

export const BAND_PRESETS: BandPreset[] = [
  { label: '2-6 kg', minResistanceKg: 2, maxResistanceKg: 6 },
  { label: '6-10 kg', minResistanceKg: 6, maxResistanceKg: 10 },
  { label: '10-15 kg', minResistanceKg: 10, maxResistanceKg: 15 },
  { label: '15-25 kg', minResistanceKg: 15, maxResistanceKg: 25 },
  { label: '25-40 kg', minResistanceKg: 25, maxResistanceKg: 40 },
];
