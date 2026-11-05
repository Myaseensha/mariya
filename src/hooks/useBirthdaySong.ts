import { useCallback, useEffect, useRef, useState } from 'react';
import { setSfxMuted } from '../lib/chime';

/**
 * "Happy Birthday" (public-domain melody) as a soft music-box tune via Web Audio.
 * Browsers block sound until the first user gesture, so we try to start on load
 * and otherwise start on the very first tap / click / key press anywhere.
 */

// [frequency Hz, beats] — 3/4 time, key of C
const G4 = 392, A4 = 440, B4 = 493.88, C5 = 523.25, D5 = 587.33, E5 = 659.25, F5 = 698.46, G5 = 783.99;
const MELODY: [number, number][] = [
  [G4, 0.75], [G4, 0.25], [A4, 1], [G4, 1], [C5, 1], [B4, 2],
  [G4, 0.75], [G4, 0.25], [A4, 1], [G4, 1], [D5, 1], [C5, 2],
  [G4, 0.75], [G4, 0.25], [G5, 1], [E5, 1], [C5, 1], [B4, 1], [A4, 2],
  [F5, 0.75], [F5, 0.25], [E5, 1], [C5, 1], [D5, 1], [C5, 3],
];
const BEAT = 0.5; // seconds per beat
const LOOP_GAP = 4; // seconds of quiet between repeats
const VOLUME = 0.16;

export function useBirthdaySong() {
  const [muted, setMuted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const oscsRef = useRef<OscillatorNode[]>([]);
  const loopTimer = useRef<number | null>(null);

  const getCtx = () => {
    if (ctxRef.current) return ctxRef.current;
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return null;
    const ctx = new Ctx();
    const master = ctx.createGain();
    master.gain.value = VOLUME;
    master.connect(ctx.destination);
    ctxRef.current = ctx;
    masterRef.current = master;
    return ctx;
  };

  const stop = useCallback(() => {
    if (loopTimer.current !== null) window.clearTimeout(loopTimer.current);
    loopTimer.current = null;
    const ctx = ctxRef.current;
    oscsRef.current.forEach((o) => {
      try {
        o.stop(ctx ? ctx.currentTime + 0.05 : 0);
      } catch {
        /* not started / already stopped */
      }
    });
    oscsRef.current = [];
  }, []);

  const playOnce = useCallback(function playLoop() {
    const ctx = ctxRef.current;
    const master = masterRef.current;
    if (!ctx || !master) return;
    let t = ctx.currentTime + 0.15;

    MELODY.forEach(([freq, beats]) => {
      const dur = beats * BEAT;
      const ring = Math.max(dur * 1.6, 0.9);
      // music-box voice: sine fundamental + quiet octave shimmer
      [
        { f: freq, g: 1, type: 'sine' as OscillatorType },
        { f: freq * 2, g: 0.22, type: 'triangle' as OscillatorType },
      ].forEach(({ f, g, type }) => {
        const osc = ctx.createOscillator();
        const env = ctx.createGain();
        osc.type = type;
        osc.frequency.value = f;
        env.gain.setValueAtTime(0.0001, t);
        env.gain.exponentialRampToValueAtTime(g, t + 0.015);
        env.gain.exponentialRampToValueAtTime(0.0001, t + ring);
        osc.connect(env);
        env.connect(master);
        osc.start(t);
        osc.stop(t + ring + 0.05);
        oscsRef.current.push(osc);
        osc.onended = () => {
          oscsRef.current = oscsRef.current.filter((o) => o !== osc);
        };
      });
      t += dur;
    });

    const total = MELODY.reduce((s, [, b]) => s + b, 0) * BEAT;
    loopTimer.current = window.setTimeout(playLoop, (total + LOOP_GAP) * 1000);
  }, []);

  const start = useCallback(async () => {
    const ctx = getCtx();
    if (!ctx) return false;
    if (ctx.state !== 'running') {
      try {
        await ctx.resume();
      } catch {
        /* blocked until a gesture */
      }
    }
    if (ctx.state !== 'running') return false;
    if (loopTimer.current !== null) return true; // already playing — don't double-start
    stop();
    playOnce();
    setPlaying(true);
    return true;
  }, [playOnce, stop]);

  useEffect(() => {
    setSfxMuted(muted);
    if (muted) {
      stop();
      return;
    }

    let cancelled = false;
    const events = ['pointerdown', 'keydown', 'touchstart'] as const;
    const onGesture = () => {
      remove();
      if (!cancelled) void start();
    };
    const remove = () => events.forEach((e) => window.removeEventListener(e, onGesture));

    // Listen for the first tap right away, and also try autoplay on the next tick
    events.forEach((e) => window.addEventListener(e, onGesture));
    const tryNow = window.setTimeout(() => {
      void start().then((ok) => {
        if (ok) remove();
      });
    }, 0);

    return () => {
      cancelled = true;
      window.clearTimeout(tryNow);
      remove();
      stop();
    };
  }, [muted, start, stop]);

  const toggle = useCallback(() => setMuted((m) => !m), []);

  return { muted, toggle, playing: playing && !muted };
}
