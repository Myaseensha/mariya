import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ContinueButton } from '../components/ContinueButton';
import { GoldDust } from '../components/GoldDust';
import { FloatingHearts } from '../components/FloatingHearts';
import { SparkBurst } from '../components/SparkBurst';
import { useSparkBurst } from '../hooks/useSparkBurst';

export function Opening({ onContinue }: { onContinue: () => void }) {
  const [awakened, setAwakened] = useState(false);
  const { bursts, burstFromEvent } = useSparkBurst();

  return (
    <section className="opening chapter-stage">
      <div className="opening-veil" />
      <GoldDust count={48} />
      {awakened && <FloatingHearts count={12} tone="gold" />}
      <SparkBurst bursts={bursts} />

      <div className="opening-content">
        <motion.button
          type="button"
          className={`portal-ring ${awakened ? 'is-awake' : ''}`}
          aria-label="Touch the sunflower portal"
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{
            scale: 1,
            opacity: 1,
            boxShadow: awakened
              ? '0 0 0 14px rgba(240,180,41,0.08), 0 0 80px rgba(240,180,41,0.35), inset 0 0 50px rgba(255, 201, 74,0.22)'
              : '0 0 0 12px rgba(240,180,41,0.05), 0 0 60px rgba(240,180,41,0.2), inset 0 0 40px rgba(255, 201, 74,0.15)',
          }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={(e) => {
            burstFromEvent(e);
            setAwakened(true);
          }}
        >
          <motion.span
            className="portal-core"
            aria-hidden
            animate={{ rotate: awakened ? [0, -8, 8, 0] : 0, scale: awakened ? [1, 1.12, 1] : 1 }}
            transition={{ duration: 1.2, repeat: awakened ? Infinity : 0, repeatDelay: 2.4 }}
          >
            🌻
          </motion.span>
        </motion.button>

        <motion.p
          className="eyebrow"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          A private door · Nov 6
        </motion.p>

        <motion.h1
          className="display glow-text"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.8 }}
        >
          Mariya
        </motion.h1>

        <AnimatePresence mode="wait">
          <motion.p
            key={awakened ? 'awake' : 'sleep'}
            className="whisper"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45 }}
          >
            {awakened ? (
              <>
                The door noticed you.
                <br />
                Come in — the gold is warm tonight.
              </>
            ) : (
              <>
                Something golden has been waiting for you.
                <br />
                Touch the sunflower — then step through.
              </>
            )}
          </motion.p>
        </AnimatePresence>

        <ContinueButton
          onClick={onContinue}
          label={awakened ? 'Step through the door' : 'Open the door'}
        />
      </div>
    </section>
  );
}
