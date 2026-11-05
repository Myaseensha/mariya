/** Tiny celebratory sound effects (Web Audio, no files). Follows the site's mute button. */
let ctx: AudioContext | null = null;
let muted = false;

export function setSfxMuted(value: boolean) {
  muted = value;
}

function getCtx() {
  if (ctx) return ctx;
  const Ctx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctx) return null;
  ctx = new Ctx();
  return ctx;
}

function note(c: AudioContext, freq: number, at: number, dur: number, vol: number) {
  const osc = c.createOscillator();
  const env = c.createGain();
  osc.type = 'triangle';
  osc.frequency.value = freq;
  env.gain.setValueAtTime(0.0001, at);
  env.gain.exponentialRampToValueAtTime(vol, at + 0.012);
  env.gain.exponentialRampToValueAtTime(0.0001, at + dur);
  osc.connect(env);
  env.connect(c.destination);
  osc.start(at);
  osc.stop(at + dur + 0.05);
}

function play(fn: (c: AudioContext, t: number) => void) {
  if (muted) return;
  const c = getCtx();
  if (!c) return;
  if (c.state === 'suspended') void c.resume();
  fn(c, c.currentTime + 0.02);
}

/** Rising sparkle — each new find sounds a little higher. */
export function playChime(step: number) {
  const scale = [523.25, 587.33, 659.25, 783.99, 880];
  const f = scale[Math.max(0, Math.min(step - 1, scale.length - 1))];
  play((c, t) => {
    note(c, f, t, 0.35, 0.12);
    note(c, f * 1.5, t + 0.08, 0.45, 0.08);
    note(c, f * 2, t + 0.16, 0.5, 0.05);
  });
}

/** Little "puff" for blowing out a candle. */
export function playPuff() {
  play((c, t) => note(c, 330, t, 0.18, 0.05));
}

/** All-found fanfare. */
export function playFanfare() {
  play((c, t) => {
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => note(c, f, t + i * 0.12, 0.6, 0.1));
    [523.25, 659.25, 783.99].forEach((f) => note(c, f, t + 0.55, 1.4, 0.06));
  });
}
