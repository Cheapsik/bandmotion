interface HeroGaugeProps {
  value: number;
  max?: number;
  label: string;
  className?: string;
}

export function HeroGauge({ value, max = 100, label, className = '' }: HeroGaugeProps) {
  const pct = Math.min(Math.max(value / max, 0), 1);
  const size = 240;
  const viewH = 168;
  const stroke = 2;
  const radius = 88;
  const cx = size / 2;
  const cy = 108;
  const startAngle = Math.PI * 1.15;
  const endAngle = Math.PI * 1.85;
  const angle = startAngle + (endAngle - startAngle) * pct;

  const trackPath = describeArc(cx, cy, radius, startAngle, endAngle);
  const valuePath = describeArc(cx, cy, radius, startAngle, angle);
  const dotX = cx + radius * Math.cos(angle);
  const dotY = cy + radius * Math.sin(angle);

  const ticks = Array.from({ length: 24 }, (_, i) => {
    const a = startAngle + ((endAngle - startAngle) * i) / 23;
    const inner = radius - 6;
    const outer = radius + 2;
    return {
      x1: cx + inner * Math.cos(a),
      y1: cy + inner * Math.sin(a),
      x2: cx + outer * Math.cos(a),
      y2: cy + outer * Math.sin(a),
    };
  });

  return (
    <div className={`relative mx-auto w-full max-w-[min(260px,78vw)] ${className}`}>
      <svg
        viewBox={`0 0 ${size} ${viewH}`}
        className="w-full h-auto block overflow-visible"
        aria-hidden="true"
      >
        {ticks.map((t, i) => (
          <line
            key={i}
            x1={t.x1}
            y1={t.y1}
            x2={t.x2}
            y2={t.y2}
            stroke="rgba(255,255,255,0.15)"
            strokeWidth={1}
          />
        ))}
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
          stroke="rgba(255,255,255,0.9)"
          strokeWidth={stroke}
          strokeLinecap="round"
          style={{ filter: 'drop-shadow(0 0 6px rgba(255,255,255,0.5))' }}
        />
        <circle
          cx={dotX}
          cy={dotY}
          r={5}
          fill="white"
          style={{ filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.9))' }}
        />
      </svg>
      <div
        className="absolute left-0 right-0 flex flex-col items-center pointer-events-none"
        style={{ top: '38%' }}
      >
        <div className="font-body text-[clamp(2.75rem,11vw,4rem)] font-light text-white tabular-nums leading-none tracking-tight">
          {Math.round(value)}
        </div>
        <div className="text-[11px] text-white/45 mt-1.5 tracking-[0.12em] uppercase">{label}</div>
      </div>
    </div>
  );
}

function polarToCartesian(cx: number, cy: number, r: number, angle: number) {
  return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
}

function describeArc(cx: number, cy: number, r: number, start: number, end: number) {
  const startPt = polarToCartesian(cx, cy, r, start);
  const endPt = polarToCartesian(cx, cy, r, end);
  const largeArc = end - start > Math.PI ? 1 : 0;
  return `M ${startPt.x} ${startPt.y} A ${r} ${r} 0 ${largeArc} 1 ${endPt.x} ${endPt.y}`;
}
