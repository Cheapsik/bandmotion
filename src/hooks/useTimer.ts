import { useCallback, useEffect, useRef, useState } from 'react';

export function useTimer(active: boolean) {
  const [seconds, setSeconds] = useState(0);
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(paused);
  pausedRef.current = paused;

  useEffect(() => {
    if (!active || paused) return;

    const id = window.setInterval(() => {
      if (!pausedRef.current) {
        setSeconds((s) => s + 1);
      }
    }, 1000);

    return () => window.clearInterval(id);
  }, [active, paused]);

  const reset = useCallback(() => setSeconds(0), []);
  const togglePause = useCallback(() => setPaused((p) => !p), []);

  return { seconds, paused, reset, togglePause, setPaused };
}
