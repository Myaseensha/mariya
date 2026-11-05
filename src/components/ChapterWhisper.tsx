import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';

/** Brief between-chapter micro-surprise — one line, then dissolves. */
export function ChapterWhisper({
  text,
  onDone,
}: {
  text: string;
  onDone: () => void;
}) {
  // Fire onDone exactly once: either on tap or after the linger timer.
  const doneRef = useRef(false);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  const finish = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    onDoneRef.current();
  };

  useEffect(() => {
    const t = window.setTimeout(finish, 650 + 2200);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      className="chapter-whisper"
      role="dialog"
      aria-live="polite"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45 }}
      onClick={finish}
    >
      <motion.div
        className="chapter-whisper-card"
        initial={{ opacity: 0, scale: 0.92, filter: 'blur(8px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="eyebrow">a soft pause</p>
        <p className="display whisper-line">{text}</p>
        <span className="whisper-hint">tap to keep going</span>
      </motion.div>
    </motion.div>
  );
}
