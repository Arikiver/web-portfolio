// Motion, built on GSAP. Short and purposeful: headings reveal line by line through masks, media
// wipes in, text fades up a few pixels; the hero plays its entrance after the boot screen; one
// scroll-linked 3D moment as the hero portrait recedes. Each reveal carries its sound (sfx.ts).
// Progressive: without JS or with reduced motion everything is simply visible (html.fx is only
// set when motion is allowed; see Base.astro).

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { play, type Sound } from './sfx';

gsap.registerPlugin(ScrollTrigger, SplitText);

const root = document.documentElement;
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const EASE = 'power3.out'; // ≈ cubic-bezier(.2,.8,.2,1)

/* ---------- Primitives ---------- */

/** Reveal one element according to its data-reveal / data-hero kind. Returns the tween. */
function reveal(el: HTMLElement, delay = 0, kind = el.dataset.reveal ?? el.dataset.hero ?? '') {
  el.classList.add('is-in');
  if (kind === 'lines') {
    const split = SplitText.create(el, { type: 'lines', mask: 'lines', linesClass: 'rl-line' });
    gsap.set(el, { opacity: 1 });
    return gsap.fromTo(
      split.lines,
      { yPercent: 105 },
      {
        yPercent: 0,
        duration: 1,
        ease: 'power4.out',
        stagger: 0.09,
        delay,
        // Put the text back together once it's in, so it reflows naturally on resize.
        onComplete: () => split.revert(),
      },
    );
  }
  if (kind === 'media') {
    const inner = el.querySelectorAll('img, .gen-art');
    gsap.fromTo(inner, { scale: 1.14 }, { scale: 1, duration: 1.4, ease: EASE, delay, clearProps: 'scale' });
    return gsap.fromTo(
      el,
      { opacity: 1, clipPath: 'inset(100% 0% 0% 0%)' },
      { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.1, ease: 'power3.inOut', delay, clearProps: 'clipPath' },
    );
  }
  return gsap.fromTo(el, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.75, ease: EASE, delay, clearProps: 'transform' });
}

/* ---------- Reveal sounds, timed to each row's own entrance ---------- */

const ROW_SOUNDS: [selector: string, sound: Sound, offset: number][] = [
  ['.xp-row', 'revealDot', 0.25],
  ['.feature, .index-row, .discipline, .other', 'revealTile', 0.05],
  ['.section-head, .skill-row, .p-row', 'revealText', 0],
];

let budget = 0; // cap per burst so a jump down the page doesn't turn into a drum roll
function rowSound(row: Element, i: number, delay: number) {
  if (document.hidden || root.classList.contains('booting')) return;
  const voice = ROW_SOUNDS.find(([sel]) => row.matches(sel));
  if (!voice || budget >= 6) return;
  budget++;
  setTimeout(() => (budget = Math.max(0, budget - 1)), 600);
  gsap.delayedCall(delay + voice[2], () => {
    // Experience pips light up exactly on their blip.
    if (row.matches('.xp-row')) row.classList.add('is-lit');
    play(voice[1], i);
  });
}

/* ---------- Scroll reveals ---------- */

function initReveals() {
  const rows = [...document.querySelectorAll<HTMLElement>('[data-reveal-row], .section-head')];
  const inRow = (el: Element) => rows.some((r) => r !== el && r.contains(el));
  const orphans = [...document.querySelectorAll<HTMLElement>('[data-reveal]')].filter((el) => !inRow(el));

  const io = new IntersectionObserver(
    (entries) => {
      entries
        .filter((e) => e.isIntersecting)
        .forEach((e, j) => {
          const target = e.target as HTMLElement;
          io.unobserve(target);
          const base = Math.min(j, 5) * 0.08; // things arriving together stagger slightly
          if (target.matches('[data-reveal-row], .section-head')) {
            target.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el, k) => reveal(el, base + k * 0.07));
            rowSound(target, j, base);
          } else reveal(target, base);
        });
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.05 },
  );
  [...rows.filter((r) => !inRow(r)), ...orphans].forEach((el) => io.observe(el));
}

/* ---------- Hero entrance ---------- */

function playHeroIntro() {
  const items = [...document.querySelectorAll<HTMLElement>('[data-hero]')];
  items.forEach((el, i) => {
    const kind = el.dataset.hero ?? '';
    reveal(el, 0.1 + i * (kind === 'lines' ? 0.12 : 0.09), kind);
  });
}

/* ---------- One scroll moment: the hero portrait tips back and recedes ---------- */

let heroScroll: gsap.core.Timeline | null = null;

function initHeroScroll() {
  const hero = document.querySelector<HTMLElement>('.hero');
  const photo = hero?.querySelector<HTMLElement>('.hero-photo');
  const copy = hero?.querySelector<HTMLElement>('.hero-copy');
  if (!hero || !photo || !copy || !matchMedia('(min-width: 900px)').matches) return;
  heroScroll = gsap
    .timeline({ scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.6 } })
    .to(photo, { rotateX: 14, rotateY: -8, scale: 0.88, yPercent: -6, opacity: 0.35, transformPerspective: 900, transformOrigin: '50% 100%', ease: 'none' }, 0)
    .to(copy, { yPercent: -10, opacity: 0.3, ease: 'none' }, 0);
}

function killHeroScroll() {
  heroScroll?.scrollTrigger?.kill();
  heroScroll?.progress(0).kill();
  heroScroll = null;
  gsap.set('.hero-photo, .hero-copy', { clearProps: 'transform,opacity' });
}

/* ---------- Boot ---------- */

if (reduced || !('IntersectionObserver' in window)) {
  root.classList.remove('fx');
} else {
  root.classList.add('fx-ready');
  // Line splitting needs final font metrics.
  document.fonts.ready.then(() => {
    initReveals();
    if (root.classList.contains('booting')) document.addEventListener('boot:done', playHeroIntro, { once: true });
    else playHeroIntro();
    if (!root.classList.contains('crt')) initHeroScroll();
  });
  // In CRT mode the page scrolls inside the tube, not the window: park the scroll moment there.
  document.addEventListener('crt:change', () => {
    if (root.classList.contains('crt')) killHeroScroll();
    else if (!heroScroll) {
      initHeroScroll();
      ScrollTrigger.refresh();
    }
  });
}
