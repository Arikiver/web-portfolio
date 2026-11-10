// Registry for scroll-linked GSAP scenes. In CRT mode the page scrolls inside .screen instead of the
// window, so every ScrollTrigger has to be rebuilt against that scroller when the mode flips. Scenes
// register a setup function; each runs inside its own gsap.context so it can be reverted cleanly.

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const root = document.documentElement;

export const motionOK = () => !matchMedia('(prefers-reduced-motion: reduce)').matches;
export const desktop = () => matchMedia('(min-width: 900px) and (min-height: 560px)').matches;
export const finePointer = () => matchMedia('(hover: hover) and (pointer: fine)').matches;

export const scroller = (): HTMLElement | Window =>
  root.classList.contains('crt') ? (document.querySelector<HTMLElement>('.screen') ?? window) : window;

// A setup may return a cleanup function; gsap.context calls it on revert.
type Setup = (scroller: HTMLElement | Window) => void | (() => void);
const setups: Setup[] = [];
let contexts: gsap.Context[] = [];
let ready = false;

function runAll() {
  contexts.forEach((c) => c.revert());
  const s = scroller();
  ScrollTrigger.defaults({ scroller: s });
  contexts = setups.map((setup) => gsap.context(() => setup(s)));
  ScrollTrigger.refresh();
}

/** Register a scroll scene. It runs once fonts are ready, and again whenever the scroller or layout changes. */
export function scene(setup: Setup) {
  setups.push(setup);
  if (ready) {
    const s = scroller();
    contexts.push(gsap.context(() => setup(s)));
    ScrollTrigger.refresh();
  }
}

document.fonts.ready.then(() => {
  ready = true;
  runAll();
});

document.addEventListener('crt:change', runAll);
matchMedia('(min-width: 900px) and (min-height: 560px)').addEventListener('change', runAll);
