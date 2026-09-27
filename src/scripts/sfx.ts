// Synthesized sound kit (Web Audio, no audio files). Always on. Browsers keep audio locked until the
// visitor's first click, tap or key press, so nothing plays before that (the boot screen asks for a
// key press first for exactly this reason; see BootSequence.astro).

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let noiseBuf: AudioBuffer | null = null;

function ensure() {
  if (!ctx) {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.5;
    master.connect(ctx.destination);
    noiseBuf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const data = noiseBuf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    ctx.addEventListener('statechange', syncHum);
  }
  return ctx;
}

/** True once the browser lets us make sound. */
export const running = () => ctx?.state === 'running';

/** Try to start audio; resolves true if it's running. Call from inside a user gesture. */
export async function unlockAudio(): Promise<boolean> {
  const c = ensure();
  if (!c) return false;
  if (c.state !== 'running') {
    try {
      await Promise.race([c.resume(), new Promise((r) => setTimeout(r, 150))]);
    } catch {
      /* ignore */
    }
  }
  return running();
}

// Try right away (allowed after clicking through from another page on this site), and again on the
// first gesture anywhere.
void unlockAudio();
const unlockOnce = () => void unlockAudio();
['pointerdown', 'keydown', 'touchend'].forEach((t) => addEventListener(t, unlockOnce, { capture: true, passive: true }));

function tone(type: OscillatorType, from: number, to: number, dur: number, gain: number, at = 0, attack = 0.004) {
  const c = ctx!;
  const t = c.currentTime + at;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(from, t);
  osc.frequency.exponentialRampToValueAtTime(Math.max(to, 1), t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(gain, t + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(g).connect(master!);
  osc.start(t);
  osc.stop(t + dur + 0.02);
}

function noise(dur: number, gain: number, filter: BiquadFilterType, fFrom: number, fTo: number, at = 0, q = 1) {
  const c = ctx!;
  const t = c.currentTime + at;
  const src = c.createBufferSource();
  src.buffer = noiseBuf;
  src.loop = true;
  const f = c.createBiquadFilter();
  f.type = filter;
  f.Q.value = q;
  f.frequency.setValueAtTime(fFrom, t);
  f.frequency.exponentialRampToValueAtTime(fTo, t + dur);
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(gain, t + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  src.connect(f).connect(g).connect(master!);
  src.start(t, Math.random() * 0.5);
  src.stop(t + dur + 0.05);
}

/**
 * Struck metal: inharmonic partials at the mode ratios of a free metal bar, higher modes decaying
 * faster, a detuned twin on the fundamental for shimmer, and a tiny bright transient for the "sh".
 */
function metal(base: number, gain: number, at = 0, decay = 0.6) {
  noise(0.018, gain * 1.1, 'highpass', 6500, 9000, at);
  const partials: [ratio: number, level: number, life: number][] = [
    [1, 1, 1],
    [2.756, 0.45, 0.55],
    [5.404, 0.22, 0.32],
    [8.933, 0.1, 0.2],
  ];
  for (const [ratio, level, life] of partials) tone('sine', base * ratio, base * ratio, decay * life, gain * level, at, 0.002);
  tone('sine', base * 1.004, base * 1.004, decay * 0.9, gain * 0.5, at, 0.002); // shimmer (beats against the fundamental)
}

// Pentatonic (C major) from C5 up, used for chips, cheat-code notes and jingles.
const SCALE = [523.25, 587.33, 659.25, 783.99, 880, 1046.5, 1174.66, 1318.51, 1567.98, 1760, 2093];

const SOUNDS = {
  /* ---- hovers: each kind of element has its own voice ---- */
  navHover: () => {
    tone('triangle', 2600, 2350, 0.025, 0.02);
    noise(0.012, 0.012, 'highpass', 6000, 8000);
  },
  linkHover: () => tone('sine', 1800, 2100, 0.03, 0.018),
  btnHover: () => {
    tone('sine', 880, 880, 0.035, 0.02);
    tone('sine', 1320, 1320, 0.05, 0.018, 0.03);
  },
  btnPrimaryHover: () => {
    tone('square', 660, 990, 0.05, 0.014);
    tone('sine', 1980, 1980, 0.12, 0.008, 0.02);
  },
  // Metallic "shing" for project tiles, tuned per tile so sweeping the grid plays a chime.
  cardHover: (i = 0) => {
    const f = SCALE[[0, 2, 4, 1][i % 4]]; // C5 E5 G5 D5 across the four featured tiles
    metal(f, 0.014, 0, 0.7);
    metal(f * 2, 0.005, 0.035, 0.45); // quick octave ring-out: the "-ing"
    tone('sine', 196, 196, 0.22, 0.02, 0, 0.02); // soft body under it, as before
  },
  cardSmallHover: (i = 0) => {
    const f = SCALE[[4, 5, 7, 8][i % 4]]; // A5 C6 E6 G6: higher, lighter tiles
    metal(f, 0.009, 0, 0.45);
  },
  glassHover: () => {
    tone('sine', 2637, 2637, 0.28, 0.011);
    tone('sine', 3951, 3951, 0.16, 0.005, 0.01);
  },
  chipHover: (i = 0) => tone('triangle', SCALE[i % 8] / 2, SCALE[i % 8] / 2, 0.12, 0.028),
  shutterHover: () => {
    noise(0.014, 0.05, 'highpass', 5000, 7000);
    noise(0.014, 0.04, 'highpass', 5000, 7000, 0.045);
  },
  videoHover: () => {
    tone('sine', 110, 165, 0.25, 0.045, 0, 0.03);
    noise(0.2, 0.018, 'lowpass', 300, 700);
  },
  pageHover: () => noise(0.16, 0.028, 'bandpass', 1500, 3600, 0, 1.2),
  backHover: () => noise(0.16, 0.028, 'bandpass', 3600, 1500, 0, 1.2),
  coinHover: () => {
    tone('square', 988, 988, 0.06, 0.02);
    tone('square', 1319, 1319, 0.2, 0.02, 0.06);
  },
  insertHover: () => {
    tone('square', 494, 494, 0.05, 0.018);
    tone('square', 659, 659, 0.12, 0.018, 0.05);
  },

  /* ---- scroll-in reveals (timed to each element's entrance; i = position in the stagger) ---- */
  revealTile: (i = 0) => {
    const f = SCALE[i % 6] / 4; // soft bubble pop, rising through the stagger
    tone('sine', f * 0.7, f * 1.6, 0.09, 0.03, 0, 0.006);
    tone('triangle', f * 3, f * 3.2, 0.05, 0.006, 0.01);
  },
  revealText: () => noise(0.12, 0.012, 'bandpass', 700, 1800, 0, 1.2),
  revealDot: (i = 0) => {
    const f = SCALE[(i * 2) % SCALE.length];
    tone('sine', f, f, 0.12, 0.022);
    tone('sine', f * 2, f * 2, 0.06, 0.006, 0.015);
  },

  /* ---- clicks ---- */
  click: () => {
    tone('square', 520, 260, 0.07, 0.03);
    noise(0.03, 0.04, 'highpass', 3000, 6000);
  },
  select: () => {
    tone('square', 523, 523, 0.05, 0.028);
    tone('square', 784, 784, 0.1, 0.028, 0.05);
    noise(0.02, 0.03, 'highpass', 4000, 6000);
  },
  itemGet: () => {
    [4, 5, 7, 8, 10].forEach((n, i) => tone('triangle', SCALE[n], SCALE[n], 0.09, 0.03, i * 0.045));
    tone('sine', 4186, 4186, 0.3, 0.006, 0.22);
  },
  play: () => {
    tone('sawtooth', 60, 220, 0.35, 0.03, 0, 0.02);
    noise(0.03, 0.05, 'highpass', 2000, 4000);
  },
  shutter: () => {
    noise(0.02, 0.07, 'highpass', 3000, 6000);
    noise(0.05, 0.05, 'bandpass', 1200, 600, 0.03, 2);
  },
  menuOpen: () => tone('triangle', 400, 900, 0.12, 0.03),
  menuClose: () => tone('triangle', 900, 400, 0.12, 0.03),
  toggle: () => {
    tone('square', 660, 660, 0.06, 0.03);
    tone('square', 990, 990, 0.08, 0.03, 0.07);
  },
  typeTick: () => noise(0.008, 0.018, 'bandpass', 2500 + Math.random() * 2500, 4000, 0, 3),

  /* ---- lightbox ---- */
  open: () => {
    noise(0.28, 0.08, 'bandpass', 400, 2600, 0, 2);
    tone('sine', 300, 600, 0.2, 0.03);
  },
  close: () => noise(0.22, 0.06, 'bandpass', 2400, 350, 0, 2),
  step: () => tone('triangle', 900, 1100, 0.05, 0.04),

  /* ---- cheat code + CRT ---- */
  key: (i = 0) => tone('square', SCALE[i % SCALE.length], SCALE[i % SCALE.length], 0.09, 0.035),
  success: () => {
    [0, 2, 4, 5, 7].forEach((n, i) => tone('square', SCALE[n], SCALE[n], 0.12, 0.04, i * 0.07));
    tone('square', SCALE[9], SCALE[9], 0.35, 0.04, 0.38);
  },
  crtOn: () => {
    tone('sine', 90, 45, 0.45, 0.25); // relay thump
    noise(0.5, 0.12, 'lowpass', 6000, 800); // degauss crackle
    tone('sine', 11800, 11800, 1.6, 0.012, 0.1, 0.3); // flyback whine
    tone('sawtooth', 50, 50, 1.2, 0.02, 0.05, 0.2); // mains hum
  },
  crtOff: () => {
    tone('sine', 1400, 40, 0.4, 0.08);
    noise(0.18, 0.08, 'highpass', 4000, 1500);
  },

  /* ---- boot sequence ---- */
  bootPress: () => {
    noise(0.03, 0.1, 'highpass', 2500, 5000); // switch
    tone('sine', 70, 38, 0.4, 0.28, 0.02); // power relay thump
    noise(0.35, 0.05, 'lowpass', 5000, 600, 0.03); // capacitor crackle
  },
  bootTitle: () => {
    [0, 4, 7].forEach((n, i) => tone('triangle', SCALE[n], SCALE[n], 0.16, 0.035, i * 0.07));
    tone('sine', 9000, 9000, 0.5, 0.004, 0.05, 0.1); // faint whine
  },
  bootOk: () => {
    tone('sine', 1568, 1568, 0.05, 0.028);
    tone('sine', 2093, 2093, 0.08, 0.024, 0.045);
  },
  bootWarn: () => {
    tone('square', 220, 220, 0.07, 0.025);
    tone('square', 185, 185, 0.1, 0.025, 0.09);
  },
  bootCount: (i = 0) => tone('triangle', 1200 + i * 60, 1200 + i * 60, 0.03, 0.018),
  bootReady: () => {
    [0, 2, 4].forEach((n) => tone('triangle', SCALE[n + 3], SCALE[n + 3], 0.5, 0.025, 0, 0.01)); // chord
    [0, 4, 7, 10].forEach((n, i) => tone('square', SCALE[n], SCALE[n], 0.09, 0.022, 0.02 + i * 0.06)); // run
  },
  bootOpen: () => {
    noise(0.5, 0.07, 'bandpass', 300, 4200, 0, 0.8); // screen opens
    tone('sine', 62, 40, 0.7, 0.2, 0.05, 0.02); // boom
    tone('sine', 3136, 4186, 0.4, 0.006, 0.1, 0.05); // shimmer
  },
} satisfies Record<string, (i?: number) => void>;

export type Sound = keyof typeof SOUNDS;

export function play(sound: Sound, i = 0) {
  // Never schedule while suspended: queued sounds would all fire at once on unlock.
  if (!running()) return;
  SOUNDS[sound](i);
}

/** Continuous rising tone for loading bars. `set` takes 0..1. */
export function startCharge() {
  if (!running()) return { set: (_p: number) => {}, stop: () => {} };
  const c = ctx!;
  const osc = c.createOscillator();
  osc.type = 'sawtooth';
  const lp = c.createBiquadFilter();
  lp.type = 'lowpass';
  lp.Q.value = 6;
  const g = c.createGain();
  g.gain.setValueAtTime(0, c.currentTime);
  g.gain.linearRampToValueAtTime(0.012, c.currentTime + 0.1);
  osc.connect(lp).connect(g).connect(master!);
  const set = (p: number) => {
    const t = c.currentTime;
    osc.frequency.setTargetAtTime(90 + p * 330, t, 0.05);
    lp.frequency.setTargetAtTime(350 + p * 2600, t, 0.05);
  };
  set(0);
  osc.start();
  return {
    set,
    stop: () => {
      const t = c.currentTime;
      g.gain.setTargetAtTime(0, t, 0.03);
      osc.stop(t + 0.2);
    },
  };
}

/** A sustained whirr for tilting tiles: a detuned motor hum with a fluttering edge, plus airy wind.
 * `update(tilt, speed)` takes 0..1 values: tilt drives pitch and brightness, pointer speed drives
 * the wind. `size` scales loudness (smaller tiles are quieter). */
export function tiltVoice(size = 1) {
  if (!running()) return null;
  const c = ctx!;
  const t0 = c.currentTime;
  const out = c.createGain();
  out.gain.setValueAtTime(0, t0);
  out.gain.linearRampToValueAtTime(size, t0 + 0.18);
  out.connect(master!);
  const nodes: AudioScheduledSourceNode[] = [];

  // Motor hum: two slightly detuned sines beat against each other.
  const hum = c.createGain();
  hum.gain.value = 0.014;
  hum.connect(out);
  const humA = c.createOscillator();
  const humB = c.createOscillator();
  humA.frequency.value = 72;
  humB.frequency.value = 72.9;
  humA.connect(hum);
  humB.connect(hum);

  // Whirr: a filtered saw an octave up, amplitude-fluttered like a fan blade.
  const whirrFilter = c.createBiquadFilter();
  whirrFilter.type = 'lowpass';
  whirrFilter.frequency.value = 260;
  const whirr = c.createGain();
  whirr.gain.value = 0.006;
  const saw = c.createOscillator();
  saw.type = 'sawtooth';
  saw.frequency.value = 144;
  saw.connect(whirrFilter).connect(whirr).connect(out);
  const flutter = c.createOscillator();
  flutter.frequency.value = 13;
  const flutterDepth = c.createGain();
  flutterDepth.gain.value = 0.004;
  flutter.connect(flutterDepth).connect(whirr.gain);

  // Wind: band-passed noise that swells with pointer speed.
  const wind = c.createBufferSource();
  wind.buffer = noiseBuf;
  wind.loop = true;
  const band = c.createBiquadFilter();
  band.type = 'bandpass';
  band.Q.value = 1.1;
  band.frequency.value = 600;
  const air = c.createGain();
  air.gain.value = 0.003;
  wind.connect(band).connect(air).connect(out);

  [humA, humB, saw, flutter].forEach((o) => o.start());
  wind.start(t0, Math.random());
  nodes.push(humA, humB, saw, flutter, wind);

  let stopped = false;
  return {
    update(tilt: number, speed: number) {
      if (stopped) return;
      const t = c.currentTime;
      const base = 66 + tilt * 30;
      humA.frequency.setTargetAtTime(base, t, 0.08);
      humB.frequency.setTargetAtTime(base * 1.012, t, 0.08);
      saw.frequency.setTargetAtTime(base * 2, t, 0.08);
      whirrFilter.frequency.setTargetAtTime(220 + tilt * 520, t, 0.08);
      flutter.frequency.setTargetAtTime(11 + speed * 14, t, 0.1);
      hum.gain.setTargetAtTime(0.012 + tilt * 0.016, t, 0.1);
      band.frequency.setTargetAtTime(500 + tilt * 1600 + speed * 1500, t, 0.06);
      air.gain.setTargetAtTime(0.003 + speed * 0.03, t, 0.05);
    },
    stop() {
      if (stopped) return;
      stopped = true;
      const t = c.currentTime;
      out.gain.cancelScheduledValues(t);
      out.gain.setValueAtTime(out.gain.value, t);
      out.gain.linearRampToValueAtTime(0, t + 0.25);
      nodes.forEach((n) => n.stop(t + 0.3));
      setTimeout(() => out.disconnect(), 400);
    },
  };
}

/* ---------- CRT ambience ----------
 * A quiet looping bed while CRT mode is on: mains hum, a faint flyback whine, hiss that breathes,
 * and the odd crackle. */

let humWanted = false;
let hum: { out: GainNode; stop: () => void } | null = null;

export function setCrtHum(on: boolean) {
  humWanted = on;
  syncHum();
}

function syncHum() {
  const want = humWanted && running() && !document.hidden;
  if (want && !hum && ensure()) hum = startHum();
  else if (!want && hum) {
    const h = hum;
    hum = null;
    const t = ctx!.currentTime;
    h.out.gain.cancelScheduledValues(t);
    h.out.gain.setValueAtTime(h.out.gain.value, t);
    h.out.gain.linearRampToValueAtTime(0, t + 0.25);
    setTimeout(h.stop, 350);
  }
}

document.addEventListener('visibilitychange', syncHum);

function startHum() {
  const c = ctx!;
  const t = c.currentTime;
  const out = c.createGain();
  out.gain.setValueAtTime(0, t);
  out.gain.linearRampToValueAtTime(1, t + 1.5);
  out.connect(master!);
  const nodes: AudioScheduledSourceNode[] = [];

  const osc = (type: OscillatorType, freq: number, gain: number, through?: AudioNode) => {
    const o = c.createOscillator();
    o.type = type;
    o.frequency.value = freq;
    const g = c.createGain();
    g.gain.value = gain;
    o.connect(g).connect(through ?? out);
    o.start();
    nodes.push(o);
    return o;
  };

  // Mains hum: buzzy fundamental, softened, plus its second harmonic.
  const humFilter = c.createBiquadFilter();
  humFilter.type = 'lowpass';
  humFilter.frequency.value = 320;
  humFilter.connect(out);
  osc('sawtooth', 50, 0.02, humFilter);
  osc('sine', 100, 0.008);

  // Flyback whine with a slow wobble.
  const whine = osc('sine', 11500, 0.0022);
  const lfo = c.createOscillator();
  lfo.frequency.value = 0.3;
  const lfoDepth = c.createGain();
  lfoDepth.gain.value = 18; // ±18 Hz
  lfo.connect(lfoDepth).connect(whine.frequency);
  lfo.start();
  nodes.push(lfo);

  // Hiss: band-passed noise whose level slowly swells and fades.
  const hiss = c.createBufferSource();
  hiss.buffer = noiseBuf;
  hiss.loop = true;
  const band = c.createBiquadFilter();
  band.type = 'bandpass';
  band.frequency.value = 4200;
  band.Q.value = 0.6;
  const hissGain = c.createGain();
  hissGain.gain.value = 0.009;
  hiss.connect(band).connect(hissGain).connect(out);
  hiss.start(t, Math.random());
  nodes.push(hiss);
  const breathe = c.createOscillator();
  breathe.frequency.value = 0.13;
  const breatheDepth = c.createGain();
  breatheDepth.gain.value = 0.004;
  breathe.connect(breatheDepth).connect(hissGain.gain);
  breathe.start();
  nodes.push(breathe);

  // Occasional crackle.
  let timer = 0;
  const crackle = () => {
    if (!hum) return;
    noise(0.02 + Math.random() * 0.04, 0.01 + Math.random() * 0.025, 'highpass', 2500, 5000);
    timer = window.setTimeout(crackle, 400 + Math.random() * 2600);
  };
  timer = window.setTimeout(crackle, 1500);

  return {
    out,
    stop: () => {
      clearTimeout(timer);
      nodes.forEach((n) => n.stop());
      out.disconnect();
    },
  };
}

/* ---------- Routing: which sound for which element ----------
 * Walk up from the element under the pointer; the first (innermost) match decides the voice. */

type Route = [selector: string, sound: Sound];

const HOVER: Route[] = [
  ['li.chip', 'chipHover'],
  ['.thumb', 'shutterHover'],
  ['.facade', 'videoHover'],
  // The card's full-size link overlay sits under the pointer, so match it before plain links.
  ['.project-card-large, .project-card-large .stretched', 'cardHover'],
  ['.project-card-small, .project-card-small .stretched', 'cardSmallHover'],
  ['.pager-link', 'pageHover'],
  ['.back', 'backHover'],
  ['.brand', 'coinHover'],
  ['.insert-coin', 'insertHover'],
  ['.btn-primary', 'btnPrimaryHover'],
  ['.btn, .crt-exit, .fx-toggle, summary, button', 'btnHover'],
  ['.nav-desktop a, .nav-mobile a, .footer-links a', 'navHover'],
  ['.focus, .skill-group, .other', 'glassHover'],
  ['a[href]', 'linkHover'],
];

const CLICK: Route[] = [
  ['a[download]', 'itemGet'],
  ['.thumb', 'shutter'],
  ['.facade', 'play'],
  ['.card-link .stretched, .pager-link, .related a, .back', 'select'],
  ['.fx-toggle', 'toggle'],
  ['a[href], button, summary', 'click'],
];

function route(from: Element | null, routes: Route[]): [Element, Sound] | null {
  for (let el = from; el; el = el.parentElement) {
    for (const [sel, sound] of routes) if (el.matches(sel)) return [el, sound];
  }
  return null;
}

let lastHover: Element | null = null;
let lastHoverAt = 0;
document.addEventListener('pointerover', (e) => {
  if ((e as PointerEvent).pointerType !== 'mouse') return;
  const hit = route(e.target as Element, HOVER);
  const el = hit?.[0] ?? null;
  // Moving outward (from a chip back onto its card) or staying put is silent.
  const fresh = el && el !== lastHover && !el.contains(lastHover);
  lastHover = el;
  if (!fresh || !hit) return;
  const now = performance.now();
  if (now - lastHoverAt < 45) return; // no machine-gunning when sweeping across a grid
  lastHoverAt = now;
  const tuned = hit[1] === 'chipHover' || hit[1] === 'cardHover' || hit[1] === 'cardSmallHover';
  const tile = el.closest('.project-card') ?? el;
  const index = tuned ? [...tile.parentElement!.children].indexOf(tile) : 0;
  play(hit[1], index);
});

document.addEventListener('click', (e) => {
  const target = e.target as Element;
  if (target.closest('[data-sfx-silent]')) return;
  const summary = target.closest('summary');
  if (summary?.parentElement instanceof HTMLDetailsElement) {
    return play(summary.parentElement.open ? 'menuClose' : 'menuOpen');
  }
  const hit = route(target, CLICK);
  if (hit) play(hit[1]);
});
