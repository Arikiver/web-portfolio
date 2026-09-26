// CRT mode easter egg (↑↑↓↓←→←→BA, or swipe ↑↑↓↓←→←→ + tap tap on touch screens).
// The page is rendered through an SVG filter: a barrel-distortion displacement map (fisheye glass),
// separate displacement scales per colour channel (radial chromatic aberration) and phosphor bloom.
// A 2D canvas on top draws rolling scanlines, a refresh band, flicker and static.

import { BARREL, syncInput } from './crt-input';
import { play } from './sfx';

const root = document.documentElement;
const screen = document.querySelector<HTMLElement>('.screen')!;
const lines = document.querySelector<HTMLCanvasElement>('.crt-lines')!;
const mapImages = [...document.querySelectorAll('.crt-defs feImage')];
const displacements = [...document.querySelectorAll<SVGFEDisplacementMapElement>('#crt-lens feDisplacementMap')];
const liteDisplacement = document.querySelector('#crt-lens-lite feDisplacementMap');
const bloom = document.querySelector('#crt-lens feGaussianBlur');
const bloomMix = document.querySelector('#crt-lens feComposite');
const exitBtn = document.querySelector<HTMLButtonElement>('.crt-exit')!;
const hud = document.querySelector<HTMLElement>('.konami-hud')!;
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

const CA = [1.035, 1, 0.965]; // R, G, B displacement scale multipliers

/* ---------- Lens map ---------- */

function buildLens() {
  const w = innerWidth;
  const h = innerHeight;
  const maxOff = (Math.max(w, h) / 2) * BARREL * 2; // offset at a corner (u = ±1, r² = 2)
  const scale = maxOff * 2 * 1.04;
  const N = 256;
  const c = document.createElement('canvas');
  c.width = c.height = N;
  const ctx = c.getContext('2d')!;
  const img = ctx.createImageData(N, N);
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      const ux = ((x + 0.5) / N) * 2 - 1;
      const uy = ((y + 0.5) / N) * 2 - 1;
      const r2 = ux * ux + uy * uy;
      // Sample further out the further we are from the centre: content bulges towards the viewer.
      const dx = (w / 2) * ux * BARREL * r2;
      const dy = (h / 2) * uy * BARREL * r2;
      const i = (y * N + x) * 4;
      img.data[i] = Math.round((0.5 + dx / scale) * 255);
      img.data[i + 1] = Math.round((0.5 + dy / scale) * 255);
      img.data[i + 2] = 128;
      img.data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  const href = c.toDataURL();
  mapImages.forEach((m) => {
    m.setAttribute('href', href);
    m.setAttribute('width', String(w));
    m.setAttribute('height', String(h));
  });
  displacements.forEach((d, i) => d.setAttribute('scale', String(scale * CA[i])));
  liteDisplacement?.setAttribute('scale', String(scale));
}

/* ---------- Adaptive quality ----------
 * 0: full lens (radial chromatic aberration + bloom), 1: no bloom, 2: single-pass lite lens,
 * 3: no lens (scanlines and glass only).
 * Measured from real frame times after switching on, remembered for the session. */

let quality = 0;
const readQuality = () => {
  try {
    return Number(sessionStorage.getItem('crt-q')) || 0;
  } catch {
    return 0;
  }
};

function setQuality(q: number) {
  quality = q;
  bloom?.setAttribute('stdDeviation', q >= 1 ? '0' : '2.5');
  bloomMix?.setAttribute('k3', q >= 1 ? '0' : '0.4');
  root.classList.toggle('crt-lite', q === 2);
  root.classList.toggle('crt-flat', q >= 3);
  syncInput(); // no lens at level 3, so no input correction either
  try {
    sessionStorage.setItem('crt-q', String(q));
  } catch {
    /* ignore */
  }
}

let probe: number[] = [];
function measure(dt: number) {
  if (quality >= 3 || root.classList.contains('crt-booting')) return;
  probe.push(dt);
  const total = probe.reduce((a, b) => a + b, 0);
  if (probe.length < 45 && (total < 1 || probe.length < 4)) return; // ~1 s or 45 frames
  const avg = total / probe.length;
  probe = [];
  if (avg > (quality < 2 ? 1 / 40 : 1 / 24)) setQuality(quality + 1); // too slow: step down, re-measure
}

/* ---------- Scanline overlay ---------- */

let raf = 0;
let burst = 0;
let offset = 0;
let last = 0;
const lctx = lines.getContext('2d')!;
const wobble = (i: number, t: number) => Math.sin(i * 0.37 + t * 0.9) * 0.5 + Math.sin(i * 0.113 - t * 0.37) * 0.5;

function sizeLines() {
  lines.width = innerWidth;
  lines.height = innerHeight;
}

function drawLines(now: number) {
  raf = requestAnimationFrame(drawLines);
  const dt = Math.min((now - (last || now)) / 1000, 0.1);
  last = now;
  if (dt > 0) measure(dt);
  const t = now / 1000;
  const { width: w, height: h } = lines;
  lctx.clearRect(0, 0, w, h);

  // Scanlines crawl downwards; thickness and shade drift per line and over time.
  offset = (offset + dt * 14) % 4;
  lctx.fillStyle = '#000';
  let i = 0;
  for (let y = offset - 4; y < h; y += 4, i++) {
    const n = wobble(i, t);
    lctx.globalAlpha = 0.24 + 0.1 * n;
    lctx.fillRect(0, y, w, 1.6 + 0.7 * n);
  }

  // Slow refresh band rolling down the tube.
  const bandY = ((t * 90) % (h + 300)) - 150;
  const band = lctx.createLinearGradient(0, bandY - 120, 0, bandY + 120);
  band.addColorStop(0, 'rgba(255,255,255,0)');
  band.addColorStop(0.5, 'rgba(255,240,220,0.06)');
  band.addColorStop(1, 'rgba(255,255,255,0)');
  lctx.globalAlpha = 1;
  lctx.fillStyle = band;
  lctx.fillRect(0, bandY - 120, w, 240);

  // Flicker.
  lctx.fillStyle = '#000';
  lctx.globalAlpha = 0.03 + Math.random() * 0.04;
  lctx.fillRect(0, 0, w, h);

  // Static: a sprinkle normally, a storm while powering on.
  burst = Math.max(0, burst - dt * 1.4);
  const specks = 40 + burst * 2600;
  lctx.fillStyle = '#fff';
  for (let s = 0; s < specks; s++) {
    lctx.globalAlpha = Math.random() * (0.08 + burst * 0.5);
    lctx.fillRect(Math.random() * w, Math.random() * h, 1 + Math.random() * 2, 1);
  }
  lctx.globalAlpha = 1;
}

/* ---------- On / off ---------- */

const store = (on: boolean) => {
  try {
    sessionStorage.setItem('crt', on ? '1' : '0');
  } catch {
    /* ignore */
  }
};

function enter(animate: boolean) {
  const y = scrollY;
  buildLens();
  sizeLines();
  setQuality(readQuality());
  probe = [];
  root.classList.add('crt');
  syncInput();
  screen.scrollTop = y;
  screen.tabIndex = -1; // lets arrow keys / PageDown scroll the tube
  screen.focus({ preventScroll: true });
  exitBtn.hidden = false;
  store(true);
  last = 0;
  raf = requestAnimationFrame(drawLines);
  if (reduced) requestAnimationFrame(() => cancelAnimationFrame(raf)); // one static frame
  if (animate && !reduced) {
    burst = 1;
    root.classList.add('crt-booting');
    setTimeout(() => root.classList.remove('crt-booting'), 1100);
  }
  play('crtOn');
}

function exit() {
  play('crtOff');
  store(false);
  const finish = () => {
    const y = screen.scrollTop;
    root.classList.remove('crt', 'crt-shutdown');
    syncInput();
    screen.removeAttribute('tabindex');
    cancelAnimationFrame(raf);
    exitBtn.hidden = true;
    scrollTo({ top: y, behavior: 'instant' });
    root.classList.add('crt-returning');
    setTimeout(() => root.classList.remove('crt-returning'), 700);
  };
  if (reduced) return finish();
  root.classList.add('crt-shutdown');
  syncInput();
  setTimeout(finish, 520);
}

const toggle = () => (root.classList.contains('crt') ? exit() : enter(true));

exitBtn.addEventListener('click', exit);
addEventListener('resize', () => {
  if (!root.classList.contains('crt')) return;
  buildLens();
  sizeLines();
});

try {
  if (sessionStorage.getItem('crt') === '1') enter(false);
} catch {
  /* ignore */
}

/* ---------- Cheat code input + progress HUD ---------- */

type Input = 'up' | 'down' | 'left' | 'right' | 'b' | 'a';
const CODE: Input[] = ['up', 'up', 'down', 'down', 'left', 'right', 'left', 'right', 'b', 'a'];
const slots = [...hud.querySelectorAll<HTMLElement>('span')];
let step = 0;
let hideTimer = 0;

function renderHud(state: 'progress' | 'done' | 'fail') {
  slots.forEach((s, i) => s.classList.toggle('lit', i < step || state === 'done'));
  hud.dataset.state = state;
  // Only show once it can't be an accident: two correct inputs in a row.
  hud.classList.toggle('show', step >= 2 || state === 'done');
  clearTimeout(hideTimer);
  hideTimer = window.setTimeout(() => hud.classList.remove('show'), state === 'done' ? 1400 : 2500);
}

function input(i: Input) {
  if (CODE[step] === i) {
    step++;
    if (step >= 2) play('key', step);
    if (step === CODE.length) {
      renderHud('done');
      step = 0;
      play('success');
      setTimeout(toggle, 250);
      return;
    }
    renderHud('progress');
  } else {
    const was = step;
    step = i === CODE[0] ? 1 : 0;
    if (was >= 2) renderHud('fail');
  }
}

const KEYS: Record<string, Input> = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
  b: 'b',
  B: 'b',
  a: 'a',
  A: 'a',
};

addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && root.classList.contains('crt') && !document.querySelector('dialog[open]')) return exit();
  const target = e.target as HTMLElement;
  if (target.closest('input, textarea, [contenteditable]')) return;
  const i = KEYS[e.key];
  if (i) input(i);
  else if (e.key.length === 1) step = 0;
});

// Touch: swipes for the arrows, taps for B and A.
let touch: { x: number; y: number; t: number } | null = null;
addEventListener(
  'touchstart',
  (e) => {
    const p = e.changedTouches[0];
    touch = { x: p.clientX, y: p.clientY, t: performance.now() };
  },
  { passive: true },
);
addEventListener(
  'touchend',
  (e) => {
    if (!touch) return;
    const p = e.changedTouches[0];
    const dx = p.clientX - touch.x;
    const dy = p.clientY - touch.y;
    const dt = performance.now() - touch.t;
    touch = null;
    if (dt > 700) return;
    const ax = Math.abs(dx);
    const ay = Math.abs(dy);
    if (ax < 12 && ay < 12) {
      if (step >= 8) input(CODE[step]); // a tap stands in for B, then A
      return;
    }
    if (Math.max(ax, ay) < 40) return;
    input(ax > ay ? (dx > 0 ? 'right' : 'left') : dy > 0 ? 'down' : 'up');
  },
  { passive: true },
);

/* ---------- Hint for the curious ---------- */

console.log(
  '%c▶ PLAYER 1 %c\nOld consoles, old habits: ↑ ↑ ↓ ↓ ← → ← → B A',
  'background:#f5a524;color:#16110a;font:700 12px monospace;padding:4px 8px;border-radius:3px',
  'color:#a0a0ad;font:12px monospace',
);
