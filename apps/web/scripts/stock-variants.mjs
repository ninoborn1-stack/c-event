// Erzeugt verkleinerte WebP-Varianten der Stockfotos für die statische Vorschau (GitHub Pages hat keinen Bild-Optimierer).
// public/stock/<name>.jpg → public/stock/_w/<breite>/<name>.webp. Bereits vorhandene, aktuelle Varianten werden übersprungen.
import { mkdir, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const WIDTHS = [480, 960, 1600, 2200];
const dir = path.join(import.meta.dirname, '..', 'public', 'stock');
const files = (await readdir(dir)).filter((f) => f.endsWith('.jpg'));

let made = 0;
await Promise.all(
  WIDTHS.map((w) => mkdir(path.join(dir, '_w', String(w)), { recursive: true })),
);
for (const f of files) {
  const src = path.join(dir, f);
  const srcTime = (await stat(src)).mtimeMs;
  await Promise.all(
    WIDTHS.map(async (w) => {
      const out = path.join(dir, '_w', String(w), f.replace(/\.jpg$/, '.webp'));
      const existing = await stat(out).catch(() => null);
      if (existing && existing.mtimeMs >= srcTime) return;
      await sharp(src).resize({ width: w, withoutEnlargement: true }).webp({ quality: 72 }).toFile(out);
      made++;
    }),
  );
}
console.log(`Stock-Varianten: ${files.length} Bilder, ${made} Dateien neu erzeugt.`);
