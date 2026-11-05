import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { createPortal } from 'react-dom';
import { ContinueButton } from '../components/ContinueButton';
import { FloatingHearts } from '../components/FloatingHearts';
import { SparkBurst } from '../components/SparkBurst';
import { SECRETS } from '../data/content';
import { useSparkBurst } from '../hooks/useSparkBurst';
import { playChime, playFanfare, playPuff } from '../lib/chime';

type SecretId = (typeof SECRETS)[number]['id'];
type Point = { clientX: number; clientY: number };

const HOLD_MS = 900;
const NAME = ['M', 'A', 'R', 'I', 'Y', 'A'];

const centerOf = (el: Element): Point => {
  const r = el.getBoundingClientRect();
  return { clientX: r.left + r.width / 2, clientY: r.top + r.height / 2 };
};

export function Secrets({ onContinue }: { onContinue: () => void }) {
  const [found, setFound] = useState<SecretId[]>([]);
  const [lit, setLit] = useState([true, true, true, true, true]);
  const [holdPct, setHoldPct] = useState(0);
  const [toast, setToast] = useState<SecretId | null>(null);
  const [hint, setHint] = useState<SecretId | null>(null);
  const holdStart = useRef<number | null>(null);
  const holdRaf = useRef<number | null>(null);
  const nameRef = useRef<HTMLButtonElement>(null);
  const hintTimer = useRef<number | null>(null);
  const { bursts, burstAt } = useSparkBurst();

  const allFound = found.length === SECRETS.length;
  const isFound = (id: SecretId) => found.includes(id);

  const unlock = (id: SecretId, point?: Point) => {
    if (found.includes(id)) return;
    const next = [...found, id];
    setFound(next);
    setToast(id);
    setHint(null);
    if (point) {
      burstAt(point.clientX, point.clientY);
      window.setTimeout(() => burstAt(point.clientX + 24, point.clientY - 18), 120);
    }
    if (next.length === SECRETS.length) playFanfare();
    else playChime(next.length);
  };

  // reveal toast fades by itself
  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(t);
  }, [toast]);

  useEffect(
    () => () => {
      if (holdRaf.current) cancelAnimationFrame(holdRaf.current);
      if (hintTimer.current) window.clearTimeout(hintTimer.current);
    },
    [],
  );

  const showHint = () => {
    const next = SECRETS.find((s) => !found.includes(s.id));
    if (!next) return;
    setHint(next.id);
    if (hintTimer.current) window.clearTimeout(hintTimer.current);
    hintTimer.current = window.setTimeout(() => setHint(null), 2400);
  };

  // ——— candles ———
  const snuff = (index: number, point: Point) => {
    if (!lit[index]) return;
    const next = [...lit];
    next[index] = false;
    setLit(next);
    playPuff();
    if (next.filter((x) => !x).length >= 4) unlock('21', point);
  };

  // ——— hold the name ———
  const stopHold = () => {
    holdStart.current = null;
    if (holdRaf.current) cancelAnimationFrame(holdRaf.current);
    holdRaf.current = null;
    if (!found.includes('name')) setHoldPct(0);
  };

  // rAF timestamp drives the hold timer (first frame marks the start)
  const tickHold = (now: number) => {
    if (holdStart.current === null) return;
    if (holdStart.current < 0) holdStart.current = now;
    const pct = Math.min((now - holdStart.current) / HOLD_MS, 1);
    setHoldPct(pct);
    if (pct >= 1) {
      holdStart.current = null;
      holdRaf.current = null;
      if (nameRef.current) unlock('name', centerOf(nameRef.current));
      return;
    }
    holdRaf.current = requestAnimationFrame(tickHold);
  };

  const startHold = () => {
    if (found.includes('name')) return;
    holdStart.current = -1;
    holdRaf.current = requestAnimationFrame(tickHold);
  };

  const confetti = useMemo(
    () =>
      Array.from({ length: 44 }, (_, i) => ({
        id: i,
        left: `${(i * 23 + 7) % 100}%`,
        delay: `${(i % 11) * 0.12}s`,
        duration: `${3.2 + (i % 5) * 0.4}s`,
        color: ['#f0b429', '#ffd36b', '#fff1c1', '#d4920a', '#e8d48b'][i % 5],
      })),
    [],
  );

  const itemClass = (id: SecretId, extra: string) =>
    `hunt-item ${extra} ${isFound(id) ? 'is-found' : ''} ${hint === id ? 'is-hint' : ''}`;

  const toastSecret = SECRETS.find((s) => s.id === toast);

  return (
    <section className="secrets chapter-stage">
      <FloatingHearts count={allFound ? 18 : 8} tone="gold" />
      <SparkBurst bursts={bursts} />

      {allFound && (
        <div className="confetti" aria-hidden>
          {confetti.map((c) => (
            <i
              key={c.id}
              style={{
                left: c.left,
                animationDelay: c.delay,
                animationDuration: c.duration,
                background: c.color,
              }}
            />
          ))}
        </div>
      )}

      <div className="secrets-head">
        <p className="eyebrow">Chapter VI · Treasure hunt</p>
        <motion.h1 className="display" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          Find what I hid for you
        </motion.h1>
        <p>Five little secrets are hiding in this garden. Tap, hold &amp; blow — every find unlocks a message.</p>
      </div>

      {/* progress sunflower: one petal lights up per secret */}
      <div className="hunt-progress" aria-label={`${found.length} of ${SECRETS.length} secrets found`}>
        <motion.div
          className="hunt-flower"
          animate={allFound ? { rotate: [0, 360] } : { rotate: 0 }}
          transition={allFound ? { duration: 6, repeat: Infinity, ease: 'linear' } : {}}
        >
          {SECRETS.map((_, i) => (
            <span
              key={i}
              className={`petal-slot ${i < found.length ? 'is-lit' : ''}`}
              style={{ transform: `rotate(${i * 72}deg)` }}
            />
          ))}
          <motion.span
            className="core"
            key={found.length}
            initial={{ scale: 1.4 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 12 }}
          >
            {found.length}/{SECRETS.length}
          </motion.span>
        </motion.div>
      </div>

      <motion.div
        className="secret-board"
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className={itemClass('petal', 'area-petal')}>
          <motion.button
            type="button"
            className="hunt-btn petal-btn"
            onClick={(e) => unlock('petal', centerOf(e.currentTarget))}
            aria-label="Softest petal"
            whileHover={{ scale: 1.15, rotate: -10 }}
            whileTap={{ scale: 0.85 }}
          >
            ❀
          </motion.button>
          {isFound('petal') && <span className="hunt-check">✓</span>}
        </div>

        <div className={itemClass('sun', 'area-sun')}>
          <motion.button
            type="button"
            className="hunt-btn sun-btn"
            onClick={(e) => unlock('sun', centerOf(e.currentTarget))}
            aria-label="Tiny sleeping sunflower"
            animate={isFound('sun') ? { rotate: [0, -14, 14, 0], scale: [1, 1.25, 1] } : {}}
            transition={{ duration: 0.8 }}
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.88 }}
          >
            🌻
          </motion.button>
          {!isFound('sun') && <span className="hunt-zzz" aria-hidden>z z</span>}
          {isFound('sun') && <span className="hunt-check">✓</span>}
        </div>

        <div className={itemClass('gold', 'area-gold')}>
          <motion.button
            type="button"
            className="hunt-btn gold-btn"
            onClick={(e) => unlock('gold', centerOf(e.currentTarget))}
            aria-label="Hidden gold heart"
            whileHover={{ scale: 1.2, opacity: 1 }}
            whileTap={{ scale: 0.85 }}
          >
            ♥
          </motion.button>
          {isFound('gold') && <span className="hunt-check">✓</span>}
        </div>

        <div className={itemClass('name', 'area-name')}>
          <button
            ref={nameRef}
            type="button"
            className="name-btn"
            aria-label="Hold the letters of her name"
            onPointerDown={startHold}
            onPointerUp={stopHold}
            onPointerLeave={stopHold}
            onPointerCancel={stopHold}
            onContextMenu={(e) => e.preventDefault()}
            onClick={(e) => {
              if (e.detail === 0) unlock('name', centerOf(e.currentTarget));
            }}
          >
            {NAME.map((ch, i) => (
              <span
                key={i}
                className={holdPct >= (i + 1) / NAME.length || isFound('name') ? 'is-lit' : ''}
              >
                {ch}
              </span>
            ))}
          </button>
          <div className="hold-bar" aria-hidden>
            <i style={{ width: `${(isFound('name') ? 1 : holdPct) * 100}%` }} />
          </div>
          <span className="hunt-label">{isFound('name') ? 'held with love' : 'press & hold'}</span>
          {isFound('name') && <span className="hunt-check">✓</span>}
        </div>

        <div className={itemClass('21', 'area-cake')}>
          <div className="mini-cake" role="group" aria-label="Birthday candles">
            <div className="candles">
              {lit.map((on, i) => (
                <motion.span
                  key={i}
                  role="button"
                  tabIndex={0}
                  className={on ? '' : 'is-out'}
                  onClick={(e) => snuff(i, centerOf(e.currentTarget))}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      snuff(i, centerOf(e.currentTarget));
                    }
                  }}
                  aria-label={`Candle ${i + 1}${on ? '' : ' (blown out)'}`}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.9 }}
                />
              ))}
            </div>
            <div className="cake-base">
              <span>21</span>
            </div>
          </div>
          <span className="hunt-label">
            {isFound('21') ? 'wish made ✨' : `blow out the candles · ${lit.filter((x) => !x).length}/4`}
          </span>
          {isFound('21') && <span className="hunt-check">✓</span>}
        </div>
      </motion.div>

      {!allFound && (
        <div className="hint-row">
          <motion.button
            type="button"
            className="hint-btn"
            onClick={showHint}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
          >
            💡 Need a hint?
          </motion.button>
        </div>
      )}

      <ul className="quest-list">
        {SECRETS.map((secret) => {
          const done = isFound(secret.id);
          return (
            <motion.li key={secret.id} className={done ? 'is-found' : ''} layout>
              <span className="quest-check">{done ? '✓' : ''}</span>
              <div>
                <div className="quest-clue">{secret.clue}</div>
                <AnimatePresence>
                  {done && (
                    <motion.div
                      className="quest-reveal"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                    >
                      {secret.reveal}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.li>
          );
        })}
      </ul>

      <AnimatePresence>
        {allFound && (
          <motion.div
            className="secrets-complete"
            initial={{ opacity: 0, y: 14, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 14 }}
          >
            <span className="complete-emoji" aria-hidden>🏆</span>
            <p className="display">You found every secret!</p>
            <p>Every soft thing I hid was for you. The finale is waiting.</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="secrets-actions">
        {allFound ? (
          <div className="cta-pulse">
            <ContinueButton onClick={onContinue} label="Enter the finale 🎉" />
          </div>
        ) : (
          <ContinueButton ghost onClick={onContinue} label="Skip to the finale" />
        )}
      </div>

      {createPortal(
      <AnimatePresence>
        {toastSecret && (
          <motion.div
            key={toastSecret.id}
            className="secret-toast"
            role="status"
            onClick={() => setToast(null)}
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          >
            <p className="toast-eyebrow">✨ Secret {found.length} of {SECRETS.length} found</p>
            <p className="toast-text">{toastSecret.reveal}</p>
          </motion.div>
        )}
      </AnimatePresence>,
      document.body,
      )}
    </section>
  );
}
