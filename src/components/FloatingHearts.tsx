import { useMemo } from 'react';

const HEARTS = ['♥', '♡', '❀', '✦'];

export function FloatingHearts({ count = 14, tone = 'pink' }: { count?: number; tone?: 'pink' | 'gold' }) {
  const items = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: `${(i * 17 + 7) % 100}%`,
        delay: `${(i % 10) * 0.55}s`,
        duration: `${9 + (i % 7)}s`,
        size: `${0.75 + (i % 5) * 0.22}rem`,
        char: HEARTS[i % HEARTS.length],
        color: tone === 'gold' ? 'var(--gold-soft)' : i % 2 === 0 ? 'var(--pink)' : 'var(--magenta-soft)',
      })),
    [count, tone],
  );

  return (
    <div className="floating-hearts" aria-hidden>
      {items.map((h) => (
        <span
          key={h.id}
          style={{
            left: h.left,
            animationDelay: h.delay,
            animationDuration: h.duration,
            fontSize: h.size,
            color: h.color,
          }}
        >
          {h.char}
        </span>
      ))}
    </div>
  );
}
