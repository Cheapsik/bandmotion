import { useEffect, useState } from 'react';
import { Button } from '../ui/Button';
import { BottomSheet } from '../ui/BottomSheet';
import type { LengthUnit, WeightUnit } from '../../types';
import {
  circumferenceFieldLabel,
  parseLengthInput,
  parseWeightInput,
  weightInputLabel,
} from '../../utils/units';

interface MeasurementSheetProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: {
    weightKg: number;
    waistCm?: number;
    hipsCm?: number;
    armCm?: number;
  }) => void;
  weightUnit: WeightUnit;
  lengthUnit: LengthUnit;
}

export function MeasurementSheet({
  open,
  onClose,
  onSave,
  weightUnit,
  lengthUnit,
}: MeasurementSheetProps) {
  const [weight, setWeight] = useState('');
  const [waist, setWaist] = useState('');
  const [hips, setHips] = useState('');
  const [arm, setArm] = useState('');

  useEffect(() => {
    if (!open) {
      setWeight('');
      setWaist('');
      setHips('');
      setArm('');
    }
  }, [open]);

  const handleSave = () => {
    const w = Number(weight);
    if (!w || w <= 0) return;

    onSave({
      weightKg: parseWeightInput(w, weightUnit),
      waistCm: waist ? parseLengthInput(Number(waist), lengthUnit) : undefined,
      hipsCm: hips ? parseLengthInput(Number(hips), lengthUnit) : undefined,
      armCm: arm ? parseLengthInput(Number(arm), lengthUnit) : undefined,
    });

    onClose();
  };

  return (
    <BottomSheet title="Dodaj pomiar" open={open} onClose={onClose}>
      <div className="space-y-4">
        <div>
          <label className="text-[11px] text-theme-muted tracking-wide">
            {weightInputLabel(weightUnit)}
          </label>
          <input
            type="number"
            inputMode="decimal"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="input-underline mt-1"
            placeholder="np. 72"
          />
        </div>
        <div>
          <label className="text-[11px] text-theme-muted tracking-wide">
            {circumferenceFieldLabel('Talia', lengthUnit)}
          </label>
          <input
            type="number"
            inputMode="decimal"
            value={waist}
            onChange={(e) => setWaist(e.target.value)}
            className="input-underline mt-1"
          />
        </div>
        <div>
          <label className="text-[11px] text-theme-muted tracking-wide">
            {circumferenceFieldLabel('Biodra', lengthUnit)}
          </label>
          <input
            type="number"
            inputMode="decimal"
            value={hips}
            onChange={(e) => setHips(e.target.value)}
            className="input-underline mt-1"
          />
        </div>
        <div>
          <label className="text-[11px] text-theme-muted tracking-wide">
            {circumferenceFieldLabel('Ramię', lengthUnit)}
          </label>
          <input
            type="number"
            inputMode="decimal"
            value={arm}
            onChange={(e) => setArm(e.target.value)}
            className="input-underline mt-1"
          />
        </div>
        <Button fullWidth size="lg" disabled={!weight} onClick={handleSave}>
          Zapisz
        </Button>
      </div>
    </BottomSheet>
  );
}
