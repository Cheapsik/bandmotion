import { useEffect, useRef, useState } from 'react';

interface ScrollPickerProps {
  min: number;
  max: number;
  value: number;
  unit?: string;
  onChange: (value: number) => void;
}

const ITEM_HEIGHT = 40;
const VISIBLE_ROWS = 5;
const PADDING = (ITEM_HEIGHT * (VISIBLE_ROWS - 1)) / 2;

export function ScrollPicker({ min, max, value, unit, onChange }: ScrollPickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const values = Array.from({ length: max - min + 1 }, (_, i) => min + i);
  const scrollTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isReady, setIsReady] = useState(false);

  const scrollToValue = (target: number, behavior: ScrollBehavior = 'auto') => {
    const el = containerRef.current;
    if (!el) return;
    const index = Math.min(Math.max(target - min, 0), values.length - 1);
    el.scrollTo({ top: index * ITEM_HEIGHT, behavior });
  };

  useEffect(() => {
    scrollToValue(value);
    requestAnimationFrame(() => setIsReady(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isReady) return;
    scrollToValue(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, min, max]);

  const handleScroll = () => {
    const el = containerRef.current;
    if (!el) return;
    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    scrollTimeout.current = setTimeout(() => {
      const index = Math.round(el.scrollTop / ITEM_HEIGHT);
      const clamped = Math.min(Math.max(index, 0), values.length - 1);
      const newValue = min + clamped;
      if (newValue !== value) onChange(newValue);
      el.scrollTo({ top: clamped * ITEM_HEIGHT, behavior: 'smooth' });
    }, 90);
  };

  return (
    <div className="relative" style={{ height: ITEM_HEIGHT * VISIBLE_ROWS }}>
      <div
        className="absolute left-0 right-0 top-1/2 -translate-y-1/2 border-y border-white/15 pointer-events-none z-10"
        style={{ height: ITEM_HEIGHT }}
      />

      <div className="absolute top-0 left-0 right-0 h-14 picker-fade-top pointer-events-none z-20" />
      <div className="absolute bottom-0 left-0 right-0 h-14 picker-fade-bottom pointer-events-none z-20" />

      <div
        ref={containerRef}
        onScroll={handleScroll}
        className={`h-full overflow-y-scroll no-scrollbar snap-y snap-mandatory ${isReady ? '' : 'invisible'}`}
        style={{ scrollSnapType: 'y mandatory' }}
      >
        <div style={{ height: PADDING }} />
        {values.map((v) => (
          <div
            key={v}
            className="flex items-center justify-center snap-center"
            style={{ height: ITEM_HEIGHT }}
          >
            <span
              className={`font-body tabular-nums transition-all duration-150 ${
                v === value
                  ? 'text-[19px] font-medium text-theme'
                  : 'text-[15px] text-theme-muted'
              }`}
            >
              {v}
              {unit && v === value && (
                <span className="text-xs text-theme-muted ml-1 font-normal">{unit}</span>
              )}
            </span>
          </div>
        ))}
        <div style={{ height: PADDING }} />
      </div>
    </div>
  );
}
