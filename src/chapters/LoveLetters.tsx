import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ContinueButton } from '../components/ContinueButton';
import { FloatingHearts } from '../components/FloatingHearts';
import { SparkBurst } from '../components/SparkBurst';
import { LETTERS, LETTER_PS } from '../data/content';
import { useSparkBurst } from '../hooks/useSparkBurst';

export function LoveLetters({ onContinue }: { onContinue: () => void }) {
  const [open, setOpen] = useState<string>(LETTERS[0].id);
  const [read, setRead] = useState<string[]>([LETTERS[0].id]);
  const { bursts, burstFromEvent } = useSparkBurst();

  const allRead = useMemo(() => LETTERS.every((l) => read.includes(l.id)), [read]);

  return (
    <section className="letters chapter-stage">
      <FloatingHearts count={10} />
      <SparkBurst bursts={bursts} />
      <div className="letters-head">
        <p className="eyebrow">Chapter V</p>
        <motion.h1
          className="display"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Words I keep for you
        </motion.h1>
        <p>Three letters. Unfold whichever one pulls you first.</p>
      </div>

      <div className="letter-stack">
        {LETTERS.map((letter, i) => {
          const isOpen = open === letter.id;
          return (
            <motion.button
              type="button"
              key={letter.id}
              className={`letter ${isOpen ? 'is-open' : ''}`}
              onClick={(e) => {
                setOpen(letter.id);
                setRead((prev) => (prev.includes(letter.id) ? prev : [...prev, letter.id]));
                if (!read.includes(letter.id)) burstFromEvent(e);
              }}
              initial={{ opacity: 0, y: 22, rotate: i % 2 === 0 ? -0.6 : 0.6 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              transition={{ delay: i * 0.1, duration: 0.55 }}
              whileHover={{ y: -4, borderColor: 'rgba(240,180,41,0.55)' }}
              layout
            >
              <h3>{letter.title}</h3>
              <AnimatePresence mode="wait">
                {isOpen ? (
                  <motion.p
                    key="body"
                    className="body"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    {letter.body}
                  </motion.p>
                ) : (
                  <motion.p key="preview" className="preview">
                    Tap to open · letter {i + 1} of {LETTERS.length}
                    {read.includes(letter.id) ? ' · opened ♥' : ''}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {allRead && (
          <motion.aside
            className="letter-ps"
            initial={{ opacity: 0, y: 12, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0 }}
          >
            <p className="eyebrow">bonus page</p>
            <p>{LETTER_PS}</p>
          </motion.aside>
        )}
      </AnimatePresence>

      <div className="letters-actions">
        <ContinueButton onClick={onContinue} label="Hunt the secrets" />
      </div>
    </section>
  );
}
