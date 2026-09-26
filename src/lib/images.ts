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

/**
 * Logos are shown whole on their own background colour instead of being cropped.
 * `radius` clips baked-in corners (boop.png is an app icon with opaque black corners).
 */
const logos: Record<string, { bg: string; radius: string }> = {
  'boop.png': { bg: '#fdf6ec', radius: '22%' },
  '2minwin.jpg': { bg: '#c30006', radius: '0' },
};

export function coverPresentation(file: string) {
  const logo = logos[file];
  return logo
    ? { fit: 'contain' as const, bg: logo.bg, radius: logo.radius }
    : { fit: 'cover' as const, bg: undefined, radius: undefined };
}
