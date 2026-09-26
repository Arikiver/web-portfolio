const base = import.meta.env.BASE_URL.replace(/\/$/, '');

/** Prefixes a site-internal path with the configured base (e.g. /web-portfolio). */
export function url(path = '/'): string {
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}
