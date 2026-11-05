import { useMemo } from 'react';

export function GoldDust({ count = 28 }: { count?: number }) {
  const dots = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: `${(i * 13 + 3) % 100}%`,
        top: `${(i * 19 + 11) % 100}%`,
        delay: `${(i % 12) * 0.4}s`,
        duration: `${5 + (i % 6)}s`,
        size: `${2 + (i % 4)}px`,
      })),
    [count],
  );

  return (
    <div className="gold-dust" aria-hidden>
      {dots.map((d) => (
        <i
          key={d.id}
          style={{
            left: d.left,
            top: d.top,
            width: d.size,
            height: d.size,
            animationDelay: d.delay,
            animationDuration: d.duration,
          }}
        />
      ))}
    </div>
  );
}
