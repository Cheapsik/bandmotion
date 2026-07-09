import { useCallback, useEffect, useState } from 'react';

export function useCountdown(initialSeconds: number, active: boolean) {
  const [remaining, setRemaining] = useState(initialSeconds);

  useEffect(() => {
    if (active) setRemaining(initialSeconds);
  }, [active, initialSeconds]);

  useEffect(() => {
    if (!active || remaining <= 0) return;

    const id = window.setInterval(() => {
      setRemaining((r) => Math.max(0, r - 1));
    }, 1000);

    return () => window.clearInterval(id);
  }, [active, remaining]);

  const skip = useCallback(() => setRemaining(0), []);

  return { remaining, isDone: remaining <= 0, skip };
}
