import { useEffect } from 'react';

export function useBodyScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;

    const { style } = document.body;
    const prevOverflow = style.overflow;
    style.overflow = 'hidden';

    return () => {
      style.overflow = prevOverflow;
    };
  }, [locked]);
}
