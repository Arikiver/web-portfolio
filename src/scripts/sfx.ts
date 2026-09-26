// Tiny synthesized sound kit (Web Audio, no files). Off by default; the header toggle enables it and
// the choice is remembered. Browsers only allow audio after a user gesture, which the toggle is.

type Sound =
  | 'hover'
  | 'click'
  | 'open'
  | 'close'
  | 'step'
  | 'key'
  | 'success'
  | 'crtOn'
  | 'crtOff'
  | 'toggle';

const STORE = 'sfx';
let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let noiseBuf: AudioBuffer | null = null;

const read = () => {
  try {
    return localStorage.getItem(STORE) === 'on';
  } catch {
    return false;
  }
};

let enabled = read();

export const sfxEnabled = () => enabled;

export function setSfx(on: boolean) {
  enabled = on;
  try {
    localStorage.setItem(STORE, on ? 'on' : 'off');
  } catch {
    /* storage unavailable: session-only */
  }
  if (on) ensure();
  document.documentElement.classList.toggle('sfx-on', on);
  syncHum();
}

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
  }
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

function tone(
  type: OscillatorType,
  from: number,
  to: number,
  dur: number,
  gain: number,
  at = 0,
  attack = 0.004,
) {
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

// Pentatonic steps for the cheat-code progress notes.
const SCALE = [523.25, 587.33, 659.25, 783.99, 880, 1046.5, 1174.66, 1318.51, 1567.98, 1760];

export function play(sound: Sound, step = 0) {
  if (!enabled || !ensure()) return;
  switch (sound) {
    case 'hover':
      tone('sine', 1900, 2300, 0.035, 0.025);
      break;
    case 'click':
      tone('square', 520, 260, 0.07, 0.03);
      noise(0.03, 0.04, 'highpass', 3000, 6000);
      break;
    case 'open':
      noise(0.28, 0.08, 'bandpass', 400, 2600, 0, 2);
      tone('sine', 300, 600, 0.2, 0.03);
      break;
    case 'close':
      noise(0.22, 0.06, 'bandpass', 2400, 350, 0, 2);
      break;
    case 'step':
      tone('triangle', 900, 1100, 0.05, 0.04);
      break;
    case 'key':
      tone('square', SCALE[step % SCALE.length], SCALE[step % SCALE.length], 0.09, 0.035);
      break;
    case 'success':
      [0, 2, 4, 5, 7].forEach((n, i) => tone('square', SCALE[n], SCALE[n], 0.12, 0.04, i * 0.07));
      tone('square', SCALE[9], SCALE[9], 0.35, 0.04, 0.38);
      break;
    case 'crtOn':
      tone('sine', 90, 45, 0.45, 0.25); // relay thump
      noise(0.5, 0.12, 'lowpass', 6000, 800); // degauss crackle
      tone('sine', 11800, 11800, 1.6, 0.012, 0.1, 0.3); // flyback whine
      tone('sawtooth', 50, 50, 1.2, 0.02, 0.05, 0.2); // mains hum
      break;
    case 'crtOff':
      tone('sine', 1400, 40, 0.4, 0.08);
      noise(0.18, 0.08, 'highpass', 4000, 1500);
      break;
    case 'toggle':
      tone('square', 660, 660, 0.06, 0.03);
      tone('square', 990, 990, 0.08, 0.03, 0.07);
      break;
  }
}

/* ---------- CRT ambience ----------
 * A quiet looping bed while CRT mode is on: mains hum, a faint flyback whine, hiss that breathes,
 * and the odd crackle. Runs only when both CRT mode and SFX are on. */

let humWanted = false;
let hum: { out: GainNode; stop: () => void } | null = null;

export function setCrtHum(on: boolean) {
  humWanted = on;
  syncHum();
}

function syncHum() {
  const want = humWanted && enabled && !document.hidden;
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

/* Global hover/click sounds for interactive elements. */
const INTERACTIVE = 'a, button, summary, .card-link';
let lastHover: Element | null = null;
document.addEventListener('pointerover', (e) => {
  if ((e as PointerEvent).pointerType !== 'mouse') return;
  const el = (e.target as Element).closest(INTERACTIVE);
  if (el && el !== lastHover && !el.contains(lastHover) && !lastHover?.contains(el)) play('hover');
  lastHover = el;
});
document.addEventListener('click', (e) => {
  const el = (e.target as Element).closest('a, button, summary');
  if (el && !el.closest('[data-sfx-silent]')) play('click');
});

document.documentElement.classList.toggle('sfx-on', enabled);
