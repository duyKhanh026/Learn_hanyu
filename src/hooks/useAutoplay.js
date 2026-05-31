import { useState, useEffect, useCallback } from 'react';

export function useAutoplay({ enabled, interval, onTick }) {
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!enabled || !playing) return;

    const id = setInterval(onTick, interval * 1000);
    return () => clearInterval(id);
  }, [enabled, playing, interval, onTick]);

  const toggle = useCallback(() => setPlaying((p) => !p), []);
  const stop = useCallback(() => setPlaying(false), []);

  return { playing, toggle, stop };
}
