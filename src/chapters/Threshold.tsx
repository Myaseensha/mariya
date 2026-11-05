import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ContinueButton } from '../components/ContinueButton';
import { FloatingHearts } from '../components/FloatingHearts';
import { GoldDust } from '../components/GoldDust';
import { SparkBurst } from '../components/SparkBurst';
import { useSparkBurst } from '../hooks/useSparkBurst';

export function Threshold({ onContinue }: { onContinue: () => void }) {
  const [open, setOpen] = useState(false);
  const { bursts, burstFromEvent } = useSparkBurst();

  return (
    <section className="threshold chapter-stage">
      <FloatingHearts count={open ? 18 : 12} />
      <GoldDust count={24} />
      <SparkBurst bursts={bursts} />
      <div className="threshold-inner">
        <motion.p className="eyebrow" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          Chapter III · Surprise
        </motion.p>
        <motion.h1
          className="display"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
        >
          A letter with your name on it
        </motion.h1>
        <motion.p
          key={open ? 'open' : 'closed'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {open ? 'Read it. Then keep going.' : 'Tap the seal. Don’t peek too fast.'}
        </motion.p>

        <motion.button
          type="button"
          className={`envelope ${open ? 'is-open' : ''}`}
          onClick={(e) => {
            if (!open) burstFromEvent(e);
            setOpen(true);
          }}
          aria-label={open ? 'Opened birthday letter' : 'Open the sealed letter'}
          whileHover={{ scale: open ? 1 : 1.03, rotate: open ? 0 : [-0.4, 0.4, 0] }}
          whileTap={{ scale: 0.99 }}
          animate={open ? { y: -6 } : { y: [0, -4, 0] }}
          transition={
            open
              ? { duration: 0.5 }
              : { duration: 3.6, repeat: Infinity, ease: 'easeInOut' }
          }
        >
          <div className="envelope-body">
            <div className="envelope-letter">
              <strong>For Mariya</strong>
              <span>
                Before the photos and the fireworks — just this: turning 21 looks breathtaking on
                you. I’m so proud I get to love you through it.
              </span>
            </div>
            <div className="envelope-flap" />
            <motion.div
              className="seal"
              animate={!open ? { scale: [1, 1.08, 1] } : { scale: 0.6, opacity: 0 }}
              transition={!open ? { duration: 1.8, repeat: Infinity } : { duration: 0.4 }}
            >
              21
            </motion.div>
          </div>
        </motion.button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 14, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.15, duration: 0.5 }}
            >
              <ContinueButton onClick={onContinue} label="Walk into the memories" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
