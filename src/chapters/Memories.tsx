import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ContinueButton } from '../components/ContinueButton';
import { FloatingHearts } from '../components/FloatingHearts';
import { SparkBurst } from '../components/SparkBurst';
import { MEMORIES, MEMORY_EASTER } from '../data/content';
import { useSparkBurst } from '../hooks/useSparkBurst';

export function Memories({ onContinue }: { onContinue: () => void }) {
  const [openId, setOpenId] = useState<number | null>(0);
  const [easter, setEaster] = useState(false);
  const [taps, setTaps] = useState(0);
  const { bursts, burstFromEvent } = useSparkBurst();

  const onCardClick = (index: number, e: React.MouseEvent) => {
    setOpenId(index);
    // Triple-tap the sunflower memory (index 0) for pressed-flower surprise
    if (index === 0) {
      const next = taps + 1;
      setTaps(next);
      if (next >= 3 && !easter) {
        burstFromEvent(e);
        setEaster(true);
      }
    } else {
      setTaps(0);
    }
  };

  return (
    <section className="memories chapter-stage">
      <FloatingHearts count={8} tone="gold" />
      <SparkBurst bursts={bursts} />
      <div className="memories-head">
        <p className="eyebrow">Chapter IV</p>
        <motion.h1
          className="display"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Frames of you
        </motion.h1>
        <p>Tap a photo. Let each one open like a kept secret.</p>
      </div>

      <div className="memory-grid">
        {MEMORIES.map((memory, index) => (
          <motion.button
            type="button"
            key={memory.src}
            className={`memory-card ${openId === index ? 'is-open' : ''}`}
            onClick={(e) => onCardClick(index, e)}
            initial={{ opacity: 0, y: 36, clipPath: 'inset(12% 12% 12% 12% round 18px)' }}
            whileInView={{ opacity: 1, y: 0, clipPath: 'inset(0% 0% 0% 0% round 18px)' }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: index * 0.07, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -6, transition: { duration: 0.25 } }}
            whileTap={{ scale: 0.985 }}
          >
            <motion.img
              src={memory.src}
              alt={memory.title}
              loading="lazy"
              whileHover={{ scale: 1.08 }}
              transition={{ duration: 0.8 }}
            />
            <div className="shade" />
            <div className="memory-meta">
              <h3>{memory.title}</h3>
              <p>{memory.caption}</p>
            </div>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {easter && (
          <motion.aside
            className="memory-easter"
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            layout
          >
            <p className="eyebrow">hidden press</p>
            <h3 className="display">{MEMORY_EASTER.title}</h3>
            <p>{MEMORY_EASTER.body}</p>
          </motion.aside>
        )}
      </AnimatePresence>

      <div className="memories-actions">
        <ContinueButton onClick={onContinue} label="Read the love letters" />
      </div>
    </section>
  );
}
