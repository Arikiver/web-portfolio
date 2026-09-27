// Page-wide motion: scroll reveals, eyebrow text decode, card tilt + spotlight, header state and a
// few hints for the CRT easter egg (see crt.ts). Everything is progressive: without JS (or with
// reduced motion) content is static.

import { play, tiltVoice, type Sound } from './sfx';

const root = document.documentElement;
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Scroll reveal ---------- */

const REVEAL = [
  '.section-head',
  '.sub-title',
  '.project-card',
  '.focus',
  '.timeline > li',
  '.skill-group',
  '.other',
  '.about > *',
  '.contact',
  '.block',
  '.side-card',
  '.note',
  '.gallery li',
  '.pager-link',
].join(',');

if (reduced || !('IntersectionObserver' in window)) {
  root.classList.remove('fx');
} else {
  const io = new IntersectionObserver(
    (entries) => {
      // Stagger siblings that enter together.
      entries
        .filter((e) => e.isIntersecting)
        .forEach((e, i) => {
          const el = e.target as HTMLElement;
          const delay = Math.min(i, 6) * 70;
          el.style.setProperty('--reveal-delay', `${delay}ms`);
          el.classList.add('is-in');
          revealSound(el, i, delay);
          el.querySelectorAll<HTMLElement>('.eyebrow').forEach(decode);
          io.unobserve(el);
        });
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
  );
  document.querySelectorAll(REVEAL).forEach((el) => io.observe(el));
  // Hero labels decode once the page is on screen (after the boot screen, if one is showing).
  const decodeHero = () =>
    document.querySelectorAll<HTMLElement>('[data-decode]').forEach((el) => setTimeout(() => decode(el), 250));
  if (root.classList.contains('booting')) document.addEventListener('boot:done', decodeHero, { once: true });
  else decodeHero();
  root.classList.add('fx-ready');
}

/* ---------- Reveal sounds, timed to each element's own entrance ---------- */

// Voices per element type. Timeline dots land on their pulse (CSS: dot-pulse starts +200 ms).
const REVEAL_SOUNDS: [selector: string, sound: Sound, offset: number][] = [
  ['.timeline > li', 'revealDot', 200],
  ['.project-card, .focus, .skill-group, .other, .contact, .side-card, .gallery li, .pager-link', 'revealTile', 30],
  ['.section-head, .sub-title, .block, .about > *, .note', 'revealText', 0],
];

let revealBudget = 0; // cap per burst so a jump down the page doesn't turn into a drum roll
function revealSound(el: Element, i: number, delay: number) {
  if (document.hidden || root.classList.contains('booting')) return;
  const voice = REVEAL_SOUNDS.find(([sel]) => el.matches(sel));
  if (!voice || revealBudget >= 6) return;
  revealBudget++;
  setTimeout(() => (revealBudget = Math.max(0, revealBudget - 1)), 600);
  setTimeout(() => play(voice[1], i), delay + voice[2]);
}

/* ---------- Eyebrow decode (text scrambles into place) ---------- */

// Arrows, B and A turn up more often than chance would suggest.
const GLYPHS = '█▓▒░<>/_#*+=↑↑↓↓←→←→BABABAKLMNPRSTUVWXYZ0123456789';

function decode(el: HTMLElement) {
  if (el.dataset.decoded) return;
  el.dataset.decoded = '1';
  const text = el.textContent ?? '';
  // Screen readers get the real text; the animated copy is decorative.
  const sr = document.createElement('span');
  sr.className = 'sr-only';
  sr.textContent = text;
  const vis = document.createElement('span');
  vis.setAttribute('aria-hidden', 'true');
  el.replaceChildren(sr, vis);
  const start = performance.now();
  const duration = 650;
  let frames = 0;
  const tick = (now: number) => {
    const p = Math.min(1, (now - start) / duration);
    const solved = Math.floor(p * text.length);
    let out = text.slice(0, solved);
    for (let i = solved; i < text.length; i++) {
      out += text[i] === ' ' ? ' ' : GLYPHS[(Math.random() * GLYPHS.length) | 0];
    }
    vis.textContent = out;
    if (++frames % 4 === 0 && p < 1) play('typeTick'); // soft teletype clicks while it decodes
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

/* ---------- Tilt + spotlight on cards (fine pointers only) ---------- */

if (!reduced && matchMedia('(hover: hover) and (pointer: fine)').matches) {
  // Tiles that also get a sustained whirr while tilting, and how loud (bigger = louder).
  const WHIRR: [selector: string, size: number][] = [
    ['.project-card-large, .hero-photo, .head-art', 1],
    ['.project-card-small', 0.6],
  ];

  document.querySelectorAll<HTMLElement>('[data-tilt]').forEach((el) => {
    const max = Number(el.dataset.tilt) || 6;
    const size = WHIRR.find(([sel]) => el.matches(sel))?.[1] ?? 0;
    let frame = 0;
    let voice: ReturnType<typeof tiltVoice> = null;
    let tilt = 0;
    let speed = 0;
    let last: { x: number; y: number; t: number } | null = null;
    let loop = 0;

    // While hovered, feed the voice every frame; pointer speed decays when the mouse rests.
    const drive = () => {
      speed *= 0.9;
      voice?.update(tilt, speed);
      loop = requestAnimationFrame(drive);
    };

    el.addEventListener('pointermove', (e) => {
      if (size && !voice) {
        voice = tiltVoice(size);
        if (voice) loop = requestAnimationFrame(drive);
      }
      const now = performance.now();
      if (last) {
        const v = Math.hypot(e.clientX - last.x, e.clientY - last.y) / Math.max(now - last.t, 8); // px/ms
        speed = Math.max(speed, Math.min(1, v / 1.6));
      }
      last = { x: e.clientX, y: e.clientY, t: now };
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        const y = (e.clientY - r.top) / r.height;
        tilt = Math.min(1, Math.hypot(x - 0.5, y - 0.5) * 2);
        el.style.setProperty('--rx', `${(0.5 - y) * max}deg`);
        el.style.setProperty('--ry', `${(x - 0.5) * max}deg`);
        el.style.setProperty('--mx', `${x * 100}%`);
        el.style.setProperty('--my', `${y * 100}%`);
        el.classList.add('is-tilting');
      });
    });
    el.addEventListener('pointerleave', () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(loop);
      voice?.stop();
      voice = null;
      last = null;
      speed = 0;
      el.classList.remove('is-tilting');
      el.style.removeProperty('--rx');
      el.style.removeProperty('--ry');
    });
  });
}

/* ---------- Header state ---------- */

const header = document.querySelector('.site-header');
const tube = document.querySelector<HTMLElement>('.screen');
// In CRT mode the page scrolls inside .screen instead of the window.
const onScroll = () => header?.classList.toggle('is-scrolled', Math.max(scrollY, tube?.scrollTop ?? 0) > 8);
addEventListener('scroll', onScroll, { passive: true });
tube?.addEventListener('scroll', onScroll, { passive: true });
onScroll();
