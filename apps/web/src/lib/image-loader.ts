'use client';

/**
 * Bild-Loader für die statische Vorschau: Statt eines Bild-Servers gibt es vorab erzeugte WebP-Varianten
 * (scripts/stock-variants.mjs). Gewählt wird die kleinste Variante, die mindestens so breit ist wie angefragt.
 */
const WIDTHS = [480, 960, 1600, 2200];

export default function stockLoader({ src, width }: { src: string; width: number; quality?: number }): string {
  const m = src.match(/^(.*\/stock)\/([^/]+)\.jpg$/);
  if (!m) return src;
  const w = WIDTHS.find((x) => x >= width) ?? WIDTHS[WIDTHS.length - 1]!;
  return `${m[1]}/_w/${w}/${m[2]}.webp`;
}
