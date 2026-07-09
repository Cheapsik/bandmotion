import type { BodyMeasurement, WeightUnit } from '../../types';
import { formatWeight } from '../../utils/units';

interface WeightChartProps {
  measurements: BodyMeasurement[];
  weightUnit: WeightUnit;
}

export function WeightChart({ measurements, weightUnit }: WeightChartProps) {
  if (measurements.length < 2) {
    return (
      <div className="dashboard-mini-card rounded-3xl p-5 text-center">
        <p className="text-[13px] text-white/40">
          Dodaj co najmniej dwa pomiary, żeby zobaczyć wykres
        </p>
      </div>
    );
  }

  const width = 320;
  const height = 160;
  const pad = { top: 16, right: 12, bottom: 20, left: 12 };
  const chartW = width - pad.left - pad.right;
  const chartH = height - pad.top - pad.bottom;

  const weights = measurements.map((m) => m.weightKg);
  const minW = Math.min(...weights);
  const maxW = Math.max(...weights);
  const range = maxW - minW || 1;
  const barGap = chartW / measurements.length;

  const points = measurements.map((m, i) => {
    const x = pad.left + barGap * i + barGap / 2;
    const y = pad.top + chartH - ((m.weightKg - minW) / range) * chartH;
    return { x, y, h: pad.top + chartH - y };
  });

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const last = measurements[measurements.length - 1];

  return (
    <div className="dashboard-mini-card rounded-3xl p-4">
      <div className="flex items-baseline justify-between mb-4">
        <span className="text-[11px] text-white/40 tracking-[0.1em] uppercase">Waga</span>
        <span className="text-[22px] font-light text-white tabular-nums">
          {formatWeight(last.weightKg, weightUnit)}
        </span>
      </div>

      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto" aria-hidden="true">
        {points.map((p, i) => (
          <rect
            key={`bar-${i}`}
            x={p.x - 1.5}
            y={p.y}
            width={3}
            height={p.h}
            rx={1.5}
            fill="rgba(255,255,255,0.18)"
          />
        ))}
        <path
          d={pathD}
          fill="none"
          stroke="rgba(255,255,255,0.85)"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {points.map((p, i) => (
          <circle key={`dot-${i}`} cx={p.x} cy={p.y} r={2.5} fill="white" />
        ))}
      </svg>
    </div>
  );
}
