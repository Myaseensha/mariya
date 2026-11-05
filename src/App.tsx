import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import { ProgressRail } from './components/ProgressRail';
import { ChapterWhisper } from './components/ChapterWhisper';
import { SparkBurst } from './components/SparkBurst';
import { IntroGate } from './components/IntroGate';
import { Opening } from './chapters/Opening';
import { YellowPerson } from './chapters/YellowPerson';
import { Threshold } from './chapters/Threshold';
import { Memories } from './chapters/Memories';
import { LoveLetters } from './chapters/LoveLetters';
import { Secrets } from './chapters/Secrets';
import { Finale } from './chapters/Finale';
import { CHAPTERS, CHAPTER_WHISPERS, type ChapterId } from './data/content';
import { useBirthdaySong } from './hooks/useBirthdaySong';
import { useSparkBurst } from './hooks/useSparkBurst';
import './chapters/chapters.css';

const ORDER = CHAPTERS.map((c) => c.id);

const pageVariants = {
  initial: { opacity: 0, y: 28, scale: 0.985, filter: 'blur(10px)' },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 1.02,
    filter: 'blur(8px)',
    transition: { duration: 0.45, ease: [0.4, 0, 1, 1] as const },
  },
};

export default function App() {
  const [chapter, setChapter] = useState<ChapterId>('opening');
  const [whisper, setWhisper] = useState<string | null>(null);
  const [pendingChapter, setPendingChapter] = useState<ChapterId | null>(null);
  const { muted, toggle, playing } = useBirthdaySong();
  const [gateOpen, setGateOpen] = useState(true);
  // If the browser allowed autoplay, the song is already on — skip the tap screen
  const showGate = gateOpen && !playing;
  const { bursts, burstFromEvent } = useSparkBurst();

  const go = useCallback((next: ChapterId) => {
    setChapter(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const finishWhisper = useCallback(() => {
    if (pendingChapter) go(pendingChapter);
    setWhisper(null);
    setPendingChapter(null);
  }, [go, pendingChapter]);

  const next = useCallback(() => {
    const i = ORDER.indexOf(chapter);
    const following = ORDER[Math.min(i + 1, ORDER.length - 1)];
    if (following === chapter) return;

    const line = CHAPTER_WHISPERS[following];
    if (line && following !== 'opening') {
      setWhisper(line);
      setPendingChapter(following);
      return;
    }
    go(following);
  }, [chapter, go]);

  useEffect(() => {
    document.title =
      chapter === 'finale'
        ? 'Happy 21st, Mariya 🌻'
        : `For Mariya · ${CHAPTERS.find((c) => c.id === chapter)?.label ?? ''}`;
  }, [chapter]);

  return (
    <div
      className="app-shell grain"
      onDoubleClick={(e) => {
        // Soft global surprise: double-tap anywhere for a heart bloom
        if ((e.target as HTMLElement).closest('button, a, input')) return;
        burstFromEvent(e);
      }}
    >
      <AnimatePresence>
        {showGate && <IntroGate key="gate" onOpen={() => setGateOpen(false)} />}
      </AnimatePresence>

      <ProgressRail current={chapter} />
      <SparkBurst bursts={bursts} />

      <AnimatePresence mode="wait">
        {whisper ? (
          <ChapterWhisper key="whisper" text={whisper} onDone={finishWhisper} />
        ) : (
          <motion.div
            key={chapter}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {chapter === 'opening' && <Opening onContinue={next} />}
            {chapter === 'yellow' && <YellowPerson onContinue={next} />}
            {chapter === 'threshold' && <Threshold onContinue={next} />}
            {chapter === 'memories' && <Memories onContinue={next} />}
            {chapter === 'letters' && <LoveLetters onContinue={next} />}
            {chapter === 'secrets' && <Secrets onContinue={next} />}
            {chapter === 'finale' && <Finale onReplay={() => go('opening')} />}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        className="mute-btn"
        onClick={toggle}
        aria-label={muted ? 'Play the birthday song' : 'Mute the birthday song'}
        title={muted ? 'Sound on' : 'Mute'}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
      >
        {muted ? '♪' : '♫'}
      </motion.button>
    </div>
  );
}
