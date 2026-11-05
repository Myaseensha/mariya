import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ContinueButton } from '../components/ContinueButton';
import { FloatingHearts } from '../components/FloatingHearts';
import { GoldDust } from '../components/GoldDust';
import { SparkBurst } from '../components/SparkBurst';
import { PHOTOS } from '../data/content';
import { useSparkBurst } from '../hooks/useSparkBurst';

export function YellowPerson({ onContinue }: { onContinue: () => void }) {
  const [touched, setTouched] = useState(false);
  const { bursts, burstFromEvent } = useSparkBurst();

  return (
    <section className="yellow chapter-stage">
      <GoldDust count={20} />
      <SparkBurst bursts={bursts} />
      <motion.button
        type="button"
        className="yellow-hero"
        aria-label="Tap the sunflower photo for a soft surprise"
        initial={{ opacity: 0, scale: 1.08 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.25, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => {
          burstFromEvent(e);
          setTouched(true);
        }}
      >
        <motion.img
          src={PHOTOS.sunflower}
          alt="Mariya smiling in a sunflower field"
          animate={touched ? { scale: 1.04 } : { scale: 1 }}
          transition={{ duration: 1.1 }}
        />
        <FloatingHearts count={touched ? 16 : 10} tone="gold" />
        <AnimatePresence>
          {touched && (
            <motion.div
              className="photo-whisper"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              This is the photo that taught me your color.
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      <div className="yellow-copy">
        <motion.div
          initial={{ opacity: 0, x: 28 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.28, duration: 0.75 }}
        >
          <motion.p
            className="yellow-tag"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 3.2, repeat: Infinity }}
          >
            ✦ his yellow person
          </motion.p>
          <p className="eyebrow">Chapter II</p>
          <h1 className="display glow-text">You are the warmest color I know.</h1>
          <p>
            Not a metaphor I borrowed — a truth I learned looking at you. Sunflower bright. Soft mint
            around the edges. The kind of light that makes everything else make sense.
          </p>
          <ContinueButton onClick={onContinue} label="There’s more waiting" />
        </motion.div>
      </div>
    </section>
  );
}
