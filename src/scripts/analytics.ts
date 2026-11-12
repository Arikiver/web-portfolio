// Loads the visitor analytics configured in src/data/analytics.ts and reports what people do on
// the site: résumé downloads, email and outbound clicks, lab items opened, filters used, videos
// played, CRT mode, and which sections they reached. Nothing loads while no ID is set, on
// localhost, or in a browser the owner marked with ?me=1.
//
// Per-application links: share the site as …/web-portfolio/?ref=company-name and every session
// that starts from it is tagged ref=company-name (a Clarity filter; a referrer in GoatCounter).

import { analytics } from '../data/analytics';

type Fn = (...args: unknown[]) => void;
type Win = Window & {
  clarity?: Fn & { q?: unknown[][] };
  goatcounter?: { count?: (o: { path: string; title?: string; event?: boolean }) => void };
};
const w = window as Win;

const OWNER_KEY = 'analytics-owner';
const params = new URLSearchParams(location.search);

function ownerFlag() {
  try {
    if (params.get('me') === '1') localStorage.setItem(OWNER_KEY, '1');
    if (params.get('me') === '0') localStorage.removeItem(OWNER_KEY);
    return localStorage.getItem(OWNER_KEY) === '1';
  } catch {
    return false;
  }
}

const local = ['localhost', '127.0.0.1', ''].includes(location.hostname);
const enabled = (analytics.clarity || analytics.goatcounter) && !local && !ownerFlag();

if (enabled) start();

function start() {
  /* ---------- Loaders ---------- */
  if (analytics.clarity) {
    // Microsoft's standard tag: queue calls until the script arrives.
    w.clarity =
      w.clarity ||
      function (...args: unknown[]) {
        (w.clarity!.q = w.clarity!.q || []).push(args);
      };
    const s = document.createElement('script');
    s.async = true;
    s.src = `https://www.clarity.ms/tag/${encodeURIComponent(analytics.clarity)}`;
    document.head.append(s);
  }

  let gcQueue: { path: string; title?: string; event: true }[] | null = null;
  if (analytics.goatcounter) {
    gcQueue = [];
    const s = document.createElement('script');
    s.async = true;
    s.src = 'https://gc.zgo.at/count.js';
    s.dataset.goatcounter = `https://${analytics.goatcounter}.goatcounter.com/count`;
    s.onload = () => {
      gcQueue?.forEach((e) => w.goatcounter?.count?.(e));
      gcQueue = null;
    };
    document.head.append(s);
  }

  /* ---------- Reporting ---------- */
  const slug = (s: string) =>
    s
      .toLowerCase()
      .replace(/[^a-z0-9.]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 60);

  /** One event to both services; `quiet` events (section reach) go to Clarity only. */
  function track(name: string, label?: string, quiet = false) {
    const ev = label ? `${name}:${slug(label)}` : name;
    w.clarity?.('event', ev);
    if (quiet || !analytics.goatcounter) return;
    const e = { path: ev, title: label ?? name, event: true as const };
    if (gcQueue) gcQueue.push(e);
    else w.goatcounter?.count?.(e);
  }

  // Where this visit came from, kept for the whole session so later pages carry it too.
  let ref = params.get('ref') ?? params.get('utm_source');
  try {
    if (ref) sessionStorage.setItem('visit-ref', ref);
    else ref = sessionStorage.getItem('visit-ref');
  } catch {}
  if (ref) w.clarity?.('set', 'ref', slug(ref));
  const page = location.pathname.match(/\/work\/([^/]+)/)?.[1];
  w.clarity?.('set', 'page', page ?? 'home');

  /* ---------- Clicks ---------- */
  document.addEventListener(
    'click',
    (e) => {
      const t = e.target as Element;
      const a = t.closest<HTMLAnchorElement>('a[href]');
      const labCard = t.closest<HTMLElement>('.lab-card');
      const filter = t.closest<HTMLButtonElement>('.filter');
      const facade = t.closest<HTMLElement>('.facade');

      if (labCard) return track('lab-open', labCard.querySelector('h3')?.textContent ?? '');
      if (filter) return track(filter.closest('#lab') ? 'lab-filter' : 'archive-filter', filter.dataset.f);
      if (facade) return track('video-play', facade.closest('[data-embed-title]')?.getAttribute('data-embed-title') ?? page ?? '');
      if (!a) return;
      if (a.hasAttribute('download')) return track('resume-download', page ?? 'home');
      if (a.protocol === 'mailto:') return track('email-click');
      if (a.origin !== location.origin) {
        const host = a.hostname.replace(/^www\./, '');
        const text = a.textContent?.trim() ?? '';
        return track('outbound', host.includes(slug(text)) ? host : `${host} ${text}`);
      }
    },
    { capture: true },
  );

  /* ---------- CRT mode (the Konami code easter egg) ---------- */
  const root = document.documentElement;
  let crt = root.classList.contains('crt');
  new MutationObserver(() => {
    const on = root.classList.contains('crt');
    if (on && !crt) track('crt-mode');
    crt = on;
  }).observe(root, { attributes: true, attributeFilter: ['class'] });

  /* ---------- How far people read: each section once, when it reaches the top 60% of the screen ---------- */
  const seen = new IntersectionObserver(
    (entries) =>
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        seen.unobserve(en.target);
        track('reached', en.target.id, true);
      }),
    { rootMargin: '0px 0px -40% 0px' },
  );
  document.querySelectorAll('main section[id]').forEach((s) => seen.observe(s));
}
