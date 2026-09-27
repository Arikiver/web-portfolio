// Input correction for the CRT lens.
//
// The lens is an feDisplacementMap: the pixel shown at viewport point P is sampled from the page at
// P + d(P), where d is the barrel offset below. The browser still hit-tests the undistorted layout,
// so while the lens is on we intercept real mouse/pointer events inside it (capture phase, before
// anyone else sees them), and re-dispatch them with corrected coordinates to whatever is actually
// drawn under the cursor. Because d maps screen → page directly, no inversion is needed.
//
// CSS :hover can't be driven from script, so while remapping every `:hover` selector is rewritten
// to `.crt-hover`, and that class follows the corrected pointer (on the target and its ancestors,
// like the real thing). The cursor style is mirrored too.

export const BARREL = 0.075; // lens strength, shared with the displacement map in crt.ts

/** Page point displayed at viewport point (x, y). */
export function lensMap(x: number, y: number) {
  const w = innerWidth;
  const h = innerHeight;
  const ux = (x / w) * 2 - 1;
  const uy = (y / h) * 2 - 1;
  const r2 = ux * ux + uy * uy;
  return { x: x + (w / 2) * ux * BARREL * r2, y: y + (h / 2) * uy * BARREL * r2 };
}

const root = document.documentElement;
const frame = document.querySelector<HTMLElement>('.crt-frame')!;
const screen = document.querySelector<HTMLElement>('.screen')!;

let active = false;

/* ---------- :hover → .crt-hover ---------- */

const rewritten: { rule: CSSStyleRule; original: string }[] = [];

function eachStyleRule(rules: CSSRuleList, fn: (r: CSSStyleRule) => void) {
  for (const r of Array.from(rules)) {
    if (r instanceof CSSStyleRule) fn(r);
    if ('cssRules' in r && (r as CSSGroupingRule).cssRules) eachStyleRule((r as CSSGroupingRule).cssRules, fn);
  }
}

function rewriteHover(on: boolean) {
  if (on) {
    for (const sheet of Array.from(document.styleSheets)) {
      let rules: CSSRuleList;
      try {
        rules = sheet.cssRules;
      } catch {
        continue; // cross-origin sheet
      }
      eachStyleRule(rules, (rule) => {
        if (!rule.selectorText.includes(':hover')) return;
        rewritten.push({ rule, original: rule.selectorText });
        rule.selectorText = rule.selectorText.replace(/:hover/g, '.crt-hover');
      });
    }
  } else {
    rewritten.forEach(({ rule, original }) => (rule.selectorText = original));
    rewritten.length = 0;
  }
}

/* ---------- Hover chain + synthetic events ---------- */

let chain: Element[] = []; // mapped target and its ancestors, innermost first
let current: Element | null = null;

const ancestors = (el: Element | null) => {
  const out: Element[] = [];
  for (let n = el; n; n = n.parentElement) out.push(n);
  return out;
};

function forward(e: MouseEvent, type: string, target: Element, x: number, y: number, extra: MouseEventInit = {}) {
  const bubbles = !/^(pointer|mouse)(enter|leave)$/.test(type);
  const init: PointerEventInit = {
    bubbles,
    cancelable: bubbles,
    composed: true,
    view: window,
    clientX: x,
    clientY: y,
    screenX: e.screenX + (x - e.clientX),
    screenY: e.screenY + (y - e.clientY),
    button: e.button,
    buttons: e.buttons,
    detail: e.detail,
    ctrlKey: e.ctrlKey,
    shiftKey: e.shiftKey,
    altKey: e.altKey,
    metaKey: e.metaKey,
    ...extra,
  };
  const ev =
    e instanceof PointerEvent && type.startsWith('pointer')
      ? new PointerEvent(type, {
          ...init,
          pointerId: e.pointerId,
          pointerType: e.pointerType,
          isPrimary: e.isPrimary,
          width: e.width,
          height: e.height,
          pressure: e.pressure,
        })
      : new MouseEvent(type, init);
  return target.dispatchEvent(ev);
}

/** Topmost element inside the lens at a page point (ignores unfiltered overlays like the exit button). */
function pick(x: number, y: number): Element {
  for (const el of document.elementsFromPoint(x, y)) if (frame.contains(el) && el !== frame) return el;
  return screen;
}

function setHover(target: Element | null, e: MouseEvent, x: number, y: number) {
  if (target === current) return;
  const next = ancestors(target);
  const leaving = chain.filter((el) => !next.includes(el));
  const entering = next.filter((el) => !chain.includes(el));
  if (current) {
    forward(e, 'pointerout', current, x, y, { relatedTarget: target });
    forward(e, 'mouseout', current, x, y, { relatedTarget: target });
  }
  leaving.forEach((el) => {
    el.classList.remove('crt-hover');
    forward(e, 'pointerleave', el, x, y, { relatedTarget: target });
    forward(e, 'mouseleave', el, x, y, { relatedTarget: target });
  });
  if (target) {
    forward(e, 'pointerover', target, x, y, { relatedTarget: current });
    forward(e, 'mouseover', target, x, y, { relatedTarget: current });
  }
  entering.reverse().forEach((el) => {
    el.classList.add('crt-hover');
    forward(e, 'pointerenter', el, x, y, { relatedTarget: current });
    forward(e, 'mouseenter', el, x, y, { relatedTarget: current });
  });
  chain = next;
  current = target;
  screen.style.cursor = cursorFor(target);
}

// Real cursors are pinned to `inherit` in CRT (they'd follow the wrong element), so pick it here.
function cursorFor(el: Element | null) {
  if (!el) return '';
  if (el.closest('.thumb')) return 'zoom-in';
  if (el.closest('a[href], button:not(:disabled), summary, label, .card-link .stretched')) return 'pointer';
  if (el.closest('input, textarea, [contenteditable]')) return 'text';
  return 'default';
}

function clearHover() {
  chain.forEach((el) => el.classList.remove('crt-hover'));
  chain = [];
  current = null;
  screen.style.cursor = '';
}

/* ---------- Interception ---------- */

const busy = () => root.classList.contains('crt-booting') || root.classList.contains('crt-shutdown');

/** Should this real event be remapped? Only trusted pointer input landing inside the lens. */
function inLens(e: MouseEvent) {
  if (!active || !e.isTrusted || busy()) return false;
  const t = e.target as Element | null;
  if (!t || !frame.contains(t) || t.closest('dialog')) return false; // dialogs render above the lens
  return true;
}

const HOVER = ['pointerover', 'pointerout', 'pointerenter', 'pointerleave', 'mouseover', 'mouseout', 'mouseenter', 'mouseleave'];
const PRESS = ['pointerdown', 'pointerup', 'mousedown', 'mouseup', 'click', 'dblclick', 'auxclick', 'contextmenu'];

function onMove(e: PointerEvent | MouseEvent) {
  if (!inLens(e)) {
    if (active && e.isTrusted && !busy()) clearHover(); // left the lens (e.g. onto the exit button)
    return;
  }
  e.stopImmediatePropagation();
  if (e instanceof PointerEvent && e.pointerType !== 'mouse') return; // touch/pen: no hover
  const p = lensMap(e.clientX, e.clientY);
  const target = pick(p.x, p.y);
  if (e.type === 'pointermove') setHover(target, e, p.x, p.y);
  forward(e, e.type, target, p.x, p.y);
}

function onHoverEvent(e: MouseEvent) {
  if (inLens(e)) e.stopImmediatePropagation(); // real enter/leave/over/out describe the wrong element
}

function onPress(e: MouseEvent) {
  if (!inLens(e)) return;
  // Keyboard-activated clicks have no pointer position; leave them alone. (Not `detail === 0` alone:
  // taps can report that too. Keyboard clicks have no pointerType; taps say "touch".)
  if (e.type === 'click' && e.detail === 0 && !(e instanceof PointerEvent && e.pointerType)) return;
  e.stopImmediatePropagation();
  e.preventDefault(); // no activation, focus or text selection on the element that's really under the cursor
  const p = lensMap(e.clientX, e.clientY);
  const target = pick(p.x, p.y);
  if (e.type === 'pointerdown') {
    // preventDefault on pointerdown suppresses the mousedown that would normally move focus.
    const focusable = target.closest<HTMLElement>('a[href], button, summary, [tabindex], input, select, textarea');
    focusable?.focus({ preventScroll: true });
  }
  forward(e, e.type, target, p.x, p.y);
}

addEventListener('pointermove', onMove, true);
addEventListener('mousemove', onMove, true);
HOVER.forEach((t) => addEventListener(t, onHoverEvent as EventListener, true));
PRESS.forEach((t) => addEventListener(t, onPress as EventListener, true));

/** Turn remapping on while the displacement lens is actually applied. */
export function syncInput() {
  const want =
    root.classList.contains('crt') && !root.classList.contains('crt-flat') && !root.classList.contains('crt-shutdown');
  if (want === active) return;
  active = want;
  rewriteHover(want);
  if (!want) clearHover();
  root.classList.toggle('crt-remap', want);
}
