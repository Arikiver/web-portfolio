// Page-wide motion: scroll reveals, eyebrow text decode, card tilt + spotlight, header state and a
// few hints for the CRT easter egg (see crt.ts). Everything is progressive: without JS (or with
// reduced motion) content is static.

import { play } from './sfx';

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
          el.style.setProperty('--reveal-delay', `${Math.min(i, 6) * 70}ms`);
          el.classList.add('is-in');
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
  document.querySelectorAll<HTMLElement>('[data-tilt]').forEach((el) => {
    const max = Number(el.dataset.tilt) || 6;
    let frame = 0;
    el.addEventListener('pointermove', (e) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        const y = (e.clientY - r.top) / r.height;
        el.style.setProperty('--rx', `${(0.5 - y) * max}deg`);
        el.style.setProperty('--ry', `${(x - 0.5) * max}deg`);
        el.style.setProperty('--mx', `${x * 100}%`);
        el.style.setProperty('--my', `${y * 100}%`);
        el.classList.add('is-tilting');
      });
    });
    el.addEventListener('pointerleave', () => {
      cancelAnimationFrame(frame);
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
