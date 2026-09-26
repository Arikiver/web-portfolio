// Page-wide motion: scroll reveals, eyebrow text decode, card tilt + spotlight, header state and a
// small easter egg. Everything is progressive: without JS (or with reduced motion) content is static.

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
  document.querySelectorAll<HTMLElement>('[data-decode]').forEach((el) => setTimeout(() => decode(el), 250));
  root.classList.add('fx-ready');
}

/* ---------- Eyebrow decode (text scrambles into place) ---------- */

const GLYPHS = '█▓▒░<>/\\_#*+=ABCDEFGHJKLMNPRSTUVWXYZ0123456789';

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
  const tick = (now: number) => {
    const p = Math.min(1, (now - start) / duration);
    const solved = Math.floor(p * text.length);
    let out = text.slice(0, solved);
    for (let i = solved; i < text.length; i++) {
      out += text[i] === ' ' ? ' ' : GLYPHS[(Math.random() * GLYPHS.length) | 0];
    }
    vis.textContent = out;
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
const onScroll = () => header?.classList.toggle('is-scrolled', scrollY > 8);
addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ---------- ↑↑↓↓←→←→BA: CRT mode ---------- */

const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let step = 0;
addEventListener('keydown', (e) => {
  step = e.key.toLowerCase() === KONAMI[step].toLowerCase() ? step + 1 : e.key === KONAMI[0] ? 1 : 0;
  if (step < KONAMI.length) return;
  step = 0;
  const on = root.classList.toggle('crt');
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('role', 'status');
  toast.textContent = on ? 'CRT mode: ON' : 'CRT mode: OFF';
  document.body.append(toast);
  setTimeout(() => toast.remove(), 2200);
});
