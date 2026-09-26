// @ts-check
import { defineConfig } from 'astro/config';
import { copyFile, readFile, readdir, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const RESUME = 'Aaradhya_Bhatiya_Resume_GameDev.pdf';
const BASE = '/web-portfolio';

/**
 * Serves the résumé from the repo root without keeping a second copy in public/:
 * copied into dist/ at build time, served by middleware in dev.
 * @returns {import('astro').AstroIntegration}
 */
function resume() {
  const source = fileURLToPath(new URL(`./${RESUME}`, import.meta.url));
  return {
    name: 'resume-pdf',
    hooks: {
      'astro:server:setup': ({ server }) => {
        server.middlewares.use(async (req, res, next) => {
          if (req.url !== `${BASE}/${RESUME}`) return next();
          res.setHeader('Content-Type', 'application/pdf');
          res.end(await readFile(source));
        });
      },
      'astro:build:done': async ({ dir }) => {
        await copyFile(source, new URL(RESUME, dir));
      },
    },
  };
}

/**
 * Every file in images/ is importable, so Vite emits all originals even when only resized
 * copies are used. Drop the image files in _astro/ that no page, stylesheet or script references.
 * @returns {import('astro').AstroIntegration}
 */
function pruneUnusedImages() {
  return {
    name: 'prune-unused-images',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const files = await readdir(dir, { recursive: true });
        const texts = await Promise.all(
          files.filter((f) => /\.(html|css|js)$/.test(f)).map((f) => readFile(new URL(f, dir), 'utf8')),
        );
        const haystack = texts.join('\n');
        const assets = new URL('_astro/', dir);
        let removed = 0;
        for (const f of await readdir(assets)) {
          if (!/\.(png|jpe?g|gif|webp|avif)$/i.test(f)) continue;
          if (haystack.includes(f) || haystack.includes(encodeURI(f))) continue;
          await rm(new URL(f, assets));
          removed++;
        }
        logger.info(`Removed ${removed} unreferenced image file(s).`);
      },
    },
  };
}

export default defineConfig({
  site: 'https://arikiver.github.io',
  base: BASE,
  output: 'static',
  integrations: [resume(), pruneUnusedImages()],
});
