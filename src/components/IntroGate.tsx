import { motion } from 'framer-motion';
import { GoldDust } from './GoldDust';

/**
 * Browsers only allow sound after the visitor taps once.
 * This golden opening screen turns that first tap into the moment the song begins.
 */
export function IntroGate({ onOpen }: { onOpen: () => void }) {
  return (
    <motion.div
      className="intro-gate"
      role="dialog"
      aria-label="Open the birthday surprise"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.06, filter: 'blur(12px)' }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      onClick={onOpen}
    >
      <GoldDust count={40} />
      <div className="intro-inner">
        <motion.div
          className="intro-flower"
          aria-hidden
          animate={{ rotate: [0, 8, -8, 0], scale: [1, 1.08, 1] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        >
          🌻
        </motion.div>
        <motion.p
          className="eyebrow"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          November 6 · a surprise for
        </motion.p>
        <motion.h1
          className="display glow-text"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.7 }}
        >
          Mariya
        </motion.h1>
        <motion.button
          type="button"
          className="cta intro-cta"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={(e) => {
            e.stopPropagation();
            onOpen();
          }}
          autoFocus
        >
          🎂 Tap to open your surprise
        </motion.button>
        <motion.p
          className="intro-hint"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          🔊 turn your sound on — there’s a song for you
        </motion.p>
      </div>
    </motion.div>
  );
}
