import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FloatingHearts } from '../components/FloatingHearts';
import { GoldDust } from '../components/GoldDust';
import { SparkBurst } from '../components/SparkBurst';
import { FINALE_CAKE_WISH, FINALE_WISHES, PHOTOS } from '../data/content';
import { useSparkBurst } from '../hooks/useSparkBurst';

export function Finale({ onReplay }: { onReplay: () => void }) {
  const [cakeWish, setCakeWish] = useState(false);
  const [portraitFlip, setPortraitFlip] = useState(false);
  const { bursts, burstFromEvent } = useSparkBurst();

  const confetti = useMemo(
    () =>
      Array.from({ length: 52 }, (_, i) => ({
        id: i,
        left: `${(i * 11 + 5) % 100}%`,
        delay: `${(i % 12) * 0.22}s`,
        duration: `${4.2 + (i % 6) * 0.4}s`,
        color: ['#f0b429', '#ffd36b', '#fff1c1', '#d4920a', '#e8d48b'][i % 5],
        width: `${6 + (i % 5)}px`,
        height: `${10 + (i % 4)}px`,
      })),
    [],
  );

  return (
    <section className="finale chapter-stage">
      <div className="finale-glow" />
      <GoldDust count={32} />
      <FloatingHearts count={cakeWish ? 24 : 18} />
      <SparkBurst bursts={bursts} />
      <div className="confetti" aria-hidden>
        {confetti.map((c) => (
          <i
            key={c.id}
            style={{
              left: c.left,
              animationDelay: c.delay,
              animationDuration: c.duration,
              background: c.color,
              width: c.width,
              height: c.height,
            }}
          />
        ))}
      </div>

      <div className="finale-inner">
        <motion.button
          type="button"
          className="cake"
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 180, damping: 12 }}
          whileHover={{ scale: 1.08, rotate: [-3, 3, 0] }}
          whileTap={{ scale: 0.92 }}
          aria-label="Tap the cake for a birthday wish"
          onClick={(e) => {
            burstFromEvent(e);
            setCakeWish(true);
          }}
        >
          🎂
        </motion.button>

        <AnimatePresence>
          {cakeWish && (
            <motion.p
              className="cake-wish"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {FINALE_CAKE_WISH}
            </motion.p>
          )}
        </AnimatePresence>

        <motion.button
          type="button"
          className="finale-portrait"
          initial={{ opacity: 0, y: 20, rotate: -6 }}
          animate={{ opacity: 1, y: 0, rotate: portraitFlip ? 2 : -2 }}
          transition={{ delay: 0.15, duration: 0.7 }}
          whileHover={{ scale: 1.03 }}
          onClick={() => setPortraitFlip((v) => !v)}
          aria-label="Tap to flip the birthday portrait"
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={portraitFlip ? 'cream' : 'sun'}
              src={portraitFlip ? PHOTOS.creamNavy : PHOTOS.sunflower}
              alt={portraitFlip ? 'Mariya in cream light' : 'Mariya smiling in a sunflower field'}
              initial={{ opacity: 0, scale: 1.06 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.45 }}
            />
          </AnimatePresence>
        </motion.button>

        <motion.p
          className="eyebrow"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          November 6 · Forever chapter
        </motion.p>

        <motion.h1
          className="display glow-text"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
        >
          Happy{' '}
          <motion.span
            className="age-pop"
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.75, type: 'spring', stiffness: 220, damping: 12 }}
          >
            21
          </motion.span>
          st, Mariya
        </motion.h1>

        <motion.p
          className="subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
        >
          My yellow person. My favorite light.
        </motion.p>

        <motion.p
          className="lead"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          If this website could hug you, it would. Since it can’t — let these wishes stand in,
          from Yaseen, with everything.
        </motion.p>

        <ul className="wish-list">
          {FINALE_WISHES.map((wish, i) => (
            <motion.li
              key={wish}
              initial={{ opacity: 0, x: -16, filter: 'blur(4px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              transition={{ delay: 0.85 + i * 0.14 }}
              whileHover={{ x: 4, borderColor: 'rgba(240,180,41,0.4)' }}
            >
              {wish}
            </motion.li>
          ))}
        </ul>

        <div className="finale-actions">
          <motion.button
            type="button"
            className="cta"
            onClick={onReplay}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Walk through again
          </motion.button>
        </div>
        <p className="replay-note">Made with too much love · for Mariya, from Yaseen</p>
      </div>
    </section>
  );
}
