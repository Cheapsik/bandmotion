interface CircularGaugeProps {
  value: number;
  max?: number;
  label: string;
  sublabel?: string;
}

export function CircularGauge({ value, max = 100, label, sublabel }: CircularGaugeProps) {
  const pct = Math.min(Math.max(value / max, 0), 1);
  const size = 200;
  const stroke = 3;
  const radius = (size - stroke * 2) / 2 - 8;
  const cx = size / 2;
  const cy = size / 2 + 12;
  const startAngle = Math.PI;
  const endAngle = 2 * Math.PI;
  const angle = startAngle + (endAngle - startAngle) * pct;

  const trackPath = describeArc(cx, cy, radius, startAngle, endAngle);
  const valuePath = describeArc(cx, cy, radius, startAngle, angle);
  const dotX = cx + radius * Math.cos(angle);
  const dotY = cy + radius * Math.sin(angle);

  return (
    <div className="glass-subtle rounded-3xl p-5 border border-theme text-center">
      <div className="text-[11px] text-theme-muted tracking-[0.12em] uppercase mb-1">{label}</div>
      <div className="relative mx-auto" style={{ width: size, height: size * 0.62 }}>
        <svg
          viewBox={`0 0 ${size} ${size * 0.72}`}
          className="w-full h-auto"
          aria-hidden="true"
        >
          <path
            d={trackPath}
            fill="none"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <path
            d={valuePath}
            fill="none"
            stroke="rgba(255,255,255,0.85)"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <circle
            cx={dotX}
            cy={dotY}
            r={5}
            fill="white"
            style={{ filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.8))' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-1">
          <div className="font-body text-[52px] font-light text-theme tabular-nums leading-none">
            {Math.round(value)}
          </div>
          {sublabel && (
            <div className="text-[11px] text-theme-muted mt-1 tracking-wide">{sublabel}</div>
          )}
        </div>
      </div>
    </div>
  );
}

function polarToCartesian(cx: number, cy: number, r: number, angle: number) {
  return {
    x: cx + r * Math.cos(angle),
    y: cy + r * Math.sin(angle),
  };
}

function describeArc(cx: number, cy: number, r: number, start: number, end: number) {
  const startPt = polarToCartesian(cx, cy, r, start);
  const endPt = polarToCartesian(cx, cy, r, end);
  const largeArc = end - start > Math.PI ? 1 : 0;
  return `M ${startPt.x} ${startPt.y} A ${r} ${r} 0 ${largeArc} 1 ${endPt.x} ${endPt.y}`;
}
