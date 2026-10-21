export const DATA_MODE: 'demo' | 'live' = process.env.DATA_MODE === 'live' ? 'live' : 'demo';
export const IS_DEMO = DATA_MODE === 'demo';
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');
/** Statische Vorschau (GitHub Pages): kein Server, Demo-Services laufen im Browser. */
export const IS_STATIC = process.env.NEXT_PUBLIC_STATIC_DEMO === '1';
/** Unterpfad, z. B. „/c-event“ auf GitHub Pages. Leer bei normalem Hosting. */
export const BASE_PATH = (process.env.NEXT_PUBLIC_BASE_PATH || '').replace(/\/$/, '');

/** Pfad zu einer Datei aus /public, inkl. basePath (next/link macht das selbst, <img>/<video>/<a> nicht). */
export function asset(p: string): string {
  return p.startsWith('/') ? `${BASE_PATH}${p}` : p;
}
