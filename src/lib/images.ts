import type { ImageMetadata } from 'astro';

// Lazy glob: only images the content actually references end up in the build.
const files = import.meta.glob<{ default: ImageMetadata }>('/images/*.{png,jpg,jpeg,gif}');

/** Loads a curated asset from /images by file name (as used in portfolio.ts). */
export async function image(file: string): Promise<ImageMetadata> {
  const load = files[`/images/${file}`];
  if (!load) throw new Error(`Missing image: images/${file}`);
  return (await load()).default;
}

export const isGif = (file: string) => file.toLowerCase().endsWith('.gif');

/** Logos are shown whole on their own background colour instead of being cropped. */
const logoBackgrounds: Record<string, string> = {
  'boop.png': '#fdf6ec',
  '2minwin.jpg': '#c30006',
};

export function coverPresentation(file: string) {
  const bg = logoBackgrounds[file];
  return bg ? { fit: 'contain' as const, bg } : { fit: 'cover' as const, bg: undefined };
}
