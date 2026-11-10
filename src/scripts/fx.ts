// Page-wide motion on GSAP: reveals (3D character flips, line masks, media wipes, counters), card
// tilt + glare, magnetic buttons, a HUD reticle that trails the pointer, and the hero's scroll scene.
// Progressive: without JS or with reduced motion everything is simply visible (html.fx is only set
// when motion is allowed; see Base.astro). Each reveal carries its sound (sfx.ts).

import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { play, type Sound } from './sfx';
import { desktop, finePointer, motionOK, scene } from './scene';

gsap.registerPlugin(SplitText);

const root = document.documentElement;
const motion = motionOK();

/* ---------- Reveal primitives ---------- */

function countUp(el: HTMLElement, delay: number) {
  // Animate every number inside the text ("130k → 30k", "15 → 50+") from zero, keeping the rest.
  const text = el.textContent ?? '';
  const parts = text.split(/(\d+(?:\.\d+)?)/);
  const nums = parts.map((p) => (/^\d/.test(p) ? { v: 0, to: Number(p) } : null));
  const render = () => {
    el.textContent = parts.map((p, i) => (nums[i] ? String(Math.round(nums[i]!.v)) : p)).join('');
  };
  render();
  nums.forEach((n) => n && gsap.to(n, { v: n.to, duration: 1.6, ease: 'expo.out', delay, onUpdate: render }));
}

export function reveal(el: HTMLElement, delay = 0, kind = el.dataset.reveal ?? el.dataset.hero ?? '') {
  el.classList.add('is-in');
  if (kind === 'chars') {
    const split = SplitText.create(el, { type: 'chars,words', charsClass: 'rl-char' });
    gsap.set(el, { opacity: 1 });
    return gsap.from(split.chars, {
      rotationX: -100,
      yPercent: 40,
      opacity: 0,
      transformPerspective: 600,
      transformOrigin: '50% 100% -30px',
      duration: 1.2,
      ease: 'expo.out',
      stagger: 0.035,
      delay,
      onComplete: () => split.revert(),
    });
  }
  if (kind === 'lines') {
    const split = SplitText.create(el, { type: 'lines', mask: 'lines', linesClass: 'rl-line' });
    gsap.set(el, { opacity: 1 });
    return gsap.fromTo(
      split.lines,
      { yPercent: 110, rotationZ: 2 },
      { yPercent: 0, rotationZ: 0, duration: 1.1, ease: 'expo.out', stagger: 0.08, delay, onComplete: () => split.revert() },
    );
  }
  if (kind === 'media') {
    gsap.fromTo(el.querySelectorAll('img'), { scale: 1.25 }, { scale: 1, duration: 1.6, ease: 'expo.out', delay, clearProps: 'scale' });
    return gsap.fromTo(
      el,
      { opacity: 1, clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0 100%)' },
      { clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)', duration: 1.2, ease: 'expo.inOut', delay, clearProps: 'clipPath' },
    );
  }
  if (kind === 'count') {
    gsap.set(el, { opacity: 1 });
    countUp(el, delay);
    return;
  }
  if (kind === 'pop') {
    return gsap.fromTo(
      el,
      { opacity: 0, y: 40, rotationX: 18, scale: 0.94, transformPerspective: 900, transformOrigin: '50% 0%' },
      { opacity: 1, y: 0, rotationX: 0, scale: 1, duration: 1, ease: 'expo.out', delay, clearProps: 'transform' },
    );
  }
  return gsap.fromTo(el, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out', delay, clearProps: 'transform' });
}

/* ---------- Reveal sounds, timed to each group's entrance ---------- */

const GROUP_SOUNDS: [selector: string, sound: Sound, offset: number][] = [
  ['.xp-row', 'revealDot', 0.25],
  ['.pcard-wrap, .discipline, .other, .cf, .p-point', 'revealTile', 0.05],
  ['.sec-head, .skill-row, .p-sec', 'revealText', 0],
];

let budget = 0;
function groupSound(group: Element, i: number, delay: number) {
  if (document.hidden || root.classList.contains('booting')) return;
  const voice = GROUP_SOUNDS.find(([sel]) => group.matches(sel));
  if (!voice || budget >= 6) return;
  budget++;
  setTimeout(() => (budget = Math.max(0, budget - 1)), 600);
  gsap.delayedCall(delay + voice[2], () => play(voice[1], i));
}

/* ---------- Scroll reveals (IntersectionObserver: works for both the window and the CRT tube) ---------- */

function initReveals() {
  const groups = [...document.querySelectorAll<HTMLElement>('[data-reveal-group]')];
  const inGroup = (el: Element) => groups.some((g) => g !== el && g.contains(el));
  const loose = [...document.querySelectorAll<HTMLElement>('[data-reveal]')].filter((el) => !inGroup(el));

  const io = new IntersectionObserver(
    (entries) => {
      entries
        .filter((e) => e.isIntersecting)
        .forEach((e, j) => {
          const target = e.target as HTMLElement;
          io.unobserve(target);
          const base = Math.min(j, 5) * 0.09;
          if (target.hasAttribute('data-reveal-group')) {
            target.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el, k) => reveal(el, base + k * 0.07));
            groupSound(target, j, base);
          } else reveal(target, base);
        });
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.04 },
  );
  [...groups.filter((g) => !inGroup(g)), ...loose].forEach((el) => io.observe(el));
}

function playHeroIntro() {
  const items = [...document.querySelectorAll<HTMLElement>('[data-hero]')];
  let t = 0.05;
  items.forEach((el) => {
    const kind = el.dataset.hero ?? '';
    reveal(el, t, kind);
    t += kind === 'chars' ? 0.25 : 0.08;
  });
  document.dispatchEvent(new Event('hero:in'));
}

/* ---------- Tilt + glare ---------- */

function initTilt() {
  document.querySelectorAll<HTMLElement>('[data-tilt]').forEach((el) => {
    const max = Number(el.dataset.tilt) || 8;
    let frame = 0;
    el.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse') return;
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

/* ---------- Magnetic buttons ---------- */

function initMagnetic() {
  document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => {
    const x = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' });
    const y = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' });
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      x((e.clientX - r.left - r.width / 2) * 0.3);
      y((e.clientY - r.top - r.height / 2) * 0.4);
    });
    el.addEventListener('pointerleave', () => {
      x(0);
      y(0);
    });
  });
}

/* ---------- HUD reticle: trails the pointer, opens up and labels what's under it ---------- */

function initReticle() {
  const ret = document.createElement('div');
  ret.className = 'reticle';
  ret.setAttribute('aria-hidden', 'true');
  ret.innerHTML = '<span class="reticle-ring"></span><span class="reticle-label"></span>';
  document.body.append(ret);
  const label = ret.querySelector<HTMLElement>('.reticle-label')!;
  const xTo = gsap.quickTo(ret, 'x', { duration: 0.35, ease: 'power3.out' });
  const yTo = gsap.quickTo(ret, 'y', { duration: 0.35, ease: 'power3.out' });
  let shown = false;

  addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse' || root.classList.contains('crt')) return;
    if (!shown) {
      gsap.set(ret, { x: e.clientX, y: e.clientY });
      shown = true;
      ret.classList.add('on');
    }
    xTo(e.clientX);
    yTo(e.clientY);
    const t = (e.target as Element).closest<HTMLElement>('[data-cursor], a, button, summary');
    const text = t?.closest<HTMLElement>('[data-cursor]')?.dataset.cursor ?? '';
    ret.classList.toggle('hot', !!t);
    ret.classList.toggle('labelled', !!text);
    if (label.textContent !== text) label.textContent = text;
  });
  document.addEventListener('pointerleave', () => {
    ret.classList.remove('on');
    shown = false;
  });
  document.addEventListener('crt:change', () => ret.classList.toggle('on', !root.classList.contains('crt') && shown));
}

/* ---------- Hero scroll scene: the portrait recedes in 3D, the name drifts apart ---------- */

scene(() => {
  if (!motion || !desktop()) return;
  const hero = document.querySelector<HTMLElement>('.hero');
  if (!hero) return;
  const tl = gsap.timeline({ scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.8 } });
  tl.to('.hero-photo', { rotationX: 22, rotationY: -14, z: -260, opacity: 0.2, transformPerspective: 1100, ease: 'none' }, 0)
    .to('.hero-name .hn-1', { xPercent: -14, ease: 'none' }, 0)
    .to('.hero-name .hn-2', { xPercent: 10, ease: 'none' }, 0)
    .to('.hero-copy', { y: -60, opacity: 0, ease: 'none' }, 0);
});

/* ---------- Boot ---------- */

const header = document.querySelector('.site-header');
const tube = document.querySelector<HTMLElement>('.screen');
const onScroll = () => header?.classList.toggle('is-scrolled', Math.max(scrollY, tube?.scrollTop ?? 0) > 8);
addEventListener('scroll', onScroll, { passive: true });
tube?.addEventListener('scroll', onScroll, { passive: true });
onScroll();

if (!motion || !('IntersectionObserver' in window)) {
  root.classList.remove('fx');
} else {
  root.classList.add('fx-ready');
  if (finePointer()) {
    initTilt();
    initMagnetic();
    initReticle();
  }
  document.fonts.ready.then(() => {
    initReveals();
    if (root.classList.contains('booting')) document.addEventListener('boot:done', playHeroIntro, { once: true });
    else playHeroIntro();
  });
}
