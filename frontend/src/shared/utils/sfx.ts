/**
 * Small synthesized sound effects (no audio files): a gavel, camera shutters, a phone buzz, and
 * crowd noise. They play only when the player has turned sound on.
 */
let ctx: AudioContext | null = null;

function audio(): AudioContext | null {
  try {
    if (localStorage.getItem('palasyo-sound') !== 'on') return null;
  } catch {
    return null;
  }
  const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return null;
  ctx ??= new AC();
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

function noise(c: AudioContext, seconds: number) {
  const buf = c.createBuffer(1, Math.ceil(c.sampleRate * seconds), c.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  const src = c.createBufferSource();
  src.buffer = buf;
  return src;
}

function env(c: AudioContext, at: number, peak: number, decay: number) {
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, at);
  g.gain.exponentialRampToValueAtTime(peak, at + 0.005);
  g.gain.exponentialRampToValueAtTime(0.0001, at + decay);
  g.connect(c.destination);
  return g;
}

/** Two knocks of a wooden gavel. */
export function gavel() {
  const c = audio();
  if (!c) return;
  for (const t of [0, 0.22]) {
    const at = c.currentTime + t;
    const o = c.createOscillator();
    o.type = 'triangle';
    o.frequency.setValueAtTime(180, at);
    o.frequency.exponentialRampToValueAtTime(70, at + 0.12);
    o.connect(env(c, at, 0.5, 0.18));
    o.start(at);
    o.stop(at + 0.2);
    const n = noise(c, 0.05);
    const f = c.createBiquadFilter();
    f.type = 'bandpass';
    f.frequency.value = 1200;
    n.connect(f).connect(env(c, at, 0.25, 0.05));
    n.start(at);
  }
}

/** A volley of camera shutters. */
export function cameras() {
  const c = audio();
  if (!c) return;
  for (let i = 0; i < 6; i++) {
    const at = c.currentTime + i * 0.11 + Math.random() * 0.06;
    const n = noise(c, 0.04);
    const f = c.createBiquadFilter();
    f.type = 'highpass';
    f.frequency.value = 2500;
    n.connect(f).connect(env(c, at, 0.18, 0.035));
    n.start(at);
  }
}

/** A phone vibrating twice. */
export function buzz() {
  const c = audio();
  if (!c) return;
  for (const t of [0, 0.35]) {
    const at = c.currentTime + t;
    const o = c.createOscillator();
    o.type = 'square';
    o.frequency.value = 140;
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, at);
    g.gain.linearRampToValueAtTime(0.06, at + 0.02);
    g.gain.setValueAtTime(0.06, at + 0.22);
    g.gain.linearRampToValueAtTime(0.0001, at + 0.25);
    o.connect(g).connect(c.destination);
    o.start(at);
    o.stop(at + 0.26);
  }
}

/** A swell of crowd noise, for protests and rallies. */
export function crowd() {
  const c = audio();
  if (!c) return;
  const at = c.currentTime;
  const n = noise(c, 3);
  const f = c.createBiquadFilter();
  f.type = 'bandpass';
  f.frequency.value = 700;
  f.Q.value = 0.6;
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, at);
  g.gain.linearRampToValueAtTime(0.12, at + 1);
  g.gain.linearRampToValueAtTime(0.0001, at + 3);
  n.connect(f).connect(g).connect(c.destination);
  n.start(at);
}
