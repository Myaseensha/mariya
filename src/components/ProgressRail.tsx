import { CHAPTERS, type ChapterId } from '../data/content';

export function ProgressRail({ current }: { current: ChapterId }) {
  const index = CHAPTERS.findIndex((c) => c.id === current);

  return (
    <div className="progress-rail" aria-hidden>
      {CHAPTERS.map((chapter, i) => (
        <span
          key={chapter.id}
          className={i < index ? 'is-done' : i === index ? 'is-active' : ''}
          title={chapter.label}
        >
          <i />
        </span>
      ))}
    </div>
  );
}
