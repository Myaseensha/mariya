import { useCallback, useState } from 'react';
import type { Burst } from '../components/SparkBurst';

export function useSparkBurst() {
  const [bursts, setBursts] = useState<Burst[]>([]);

  const burstAt = useCallback((x: number, y: number) => {
    const id = Date.now() + Math.random();
    setBursts((prev) => [...prev, { id, x, y }]);
    window.setTimeout(() => {
      setBursts((prev) => prev.filter((b) => b.id !== id));
    }, 950);
  }, []);

  const burstFromEvent = useCallback(
    (e: { clientX: number; clientY: number }) => {
      burstAt(e.clientX, e.clientY);
    },
    [burstAt],
  );

  return { bursts, burstAt, burstFromEvent };
}
