import { AnimatePresence, motion } from 'framer-motion';
import { useMemo } from 'react';
import { createPortal } from 'react-dom';

const CHARS = ['♥', '✦', '❀', '✧', '♡'];

type Burst = { id: number; x: number; y: number };

/** Short romantic particle bloom at a point — intentional, not clutter. */
export function SparkBurst({ bursts }: { bursts: Burst[] }) {
  // Portal to <body>: page transitions apply filter/transform, which would break position: fixed
  return createPortal(
    <div className="spark-layer" aria-hidden>
      <AnimatePresence>
        {bursts.map((b) => (
          <BurstKey key={b.id} x={b.x} y={b.y} />
        ))}
      </AnimatePresence>
    </div>,
    document.body,
  );
}

function BurstKey({ x, y }: { x: number; y: number }) {
  const sparks = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => {
        const angle = (i / 10) * Math.PI * 2;
        return {
          id: i,
          char: CHARS[i % CHARS.length],
          dx: Math.cos(angle) * (48 + (i % 3) * 18),
          dy: Math.sin(angle) * (48 + (i % 3) * 18),
          color: i % 2 === 0 ? 'var(--sunflower)' : 'var(--magenta-soft)',
        };
      }),
    [],
  );

  return (
    <motion.div
      className="spark-burst"
      style={{ left: x, top: y }}
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.9 }}
    >
      {sparks.map((s) => (
        <motion.span
          key={s.id}
          style={{ color: s.color }}
          initial={{ x: 0, y: 0, scale: 0.4, opacity: 1 }}
          animate={{ x: s.dx, y: s.dy, scale: 1.1, opacity: 0 }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        >
          {s.char}
        </motion.span>
      ))}
    </motion.div>
  );
}

export type { Burst };
