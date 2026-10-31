/**
 * Design-Tokens: EINE Quelle für Web (als CSS-Variablen) und spätere App.
 * Farben nach dem Design-Konzept (Plakat-Look) – bis Celias CI kommt.
 * Kontraste (WCAG AA): ink auf beige 14.1:1 · ash auf beige 7.9:1 · red auf beige 3.6:1 (nur große Schrift) · cream auf ink 16.6:1 · mute auf ink 8.2:1 · cream auf red 4.7:1 · red auf ink 3.9:1 (nur große Schrift) · amberText auf cream 6.9:1
 */
export const tokens = {
  color: {
    /** Plakat-Look aus dem Design-Konzept: warmes Schwarz, Bordeaux-Rot, Knochenweiß */
    ink: '#0f0808',
    night: '#170f0f',
    smoke: '#221616',
    ash: '#4a3a38',
    mute: '#b6a7a0',
    /** „Bone“: Text auf Dunkel und helle Flächen */
    cream: '#f4eee4',
    paper: '#faf5ef',
    /** Beige: helle Abschnitte im Wechsel mit den dunklen (Hell-Dunkel-Rhythmus) */
    beige: '#e8dcc6',
    beigeDeep: '#dccdb2',
    /** Einziger bunter Akzent: Buttons, Akzentwörter, rote Flächen */
    red: '#d4212d',
    redDeep: '#a5141f',
    /** Leuchtrot: Hover, kleine Quadrate, letzter Buchstabe */
    signal: '#f92725',
    /** Champagner, sparsam */
    amber: '#e9cca6',
    amberHot: '#f4e2c8',
    /** Champagner-Ton für Text auf hellem Grund */
    amberText: '#6e4f2c',
    /** Haarlinien */
    line: 'rgba(244, 238, 228, 0.12)',
    lineDark: 'rgba(15, 8, 8, 0.14)',
    free: '#7fd18b',
  },
  font: {
    /** Die blockige Headline-Schrift aus dem Hero („Ideen auf die Bühne“) – einzige Headline-Schrift */
    display: "var(--ff-display), 'Arial Narrow', sans-serif",
    sans: 'var(--ff-sans), system-ui, sans-serif',
    /** Meta, Labels, Eyebrows (Mono, Versalien) */
    mono: 'var(--ff-mono), ui-monospace, monospace',
    pixel: 'var(--ff-pixel), ui-monospace, monospace',
  },
  space: { gutter: 'max(16px, 4vw)', section: 'clamp(80px, 9vw, 128px)' },
  ease: { out: 'cubic-bezier(.16,1,.3,1)', inOut: 'cubic-bezier(.76,0,.24,1)' },
  /** Ticket-Stil für CTAs und Warenkorb (Markenzeichen, bleibt): hier drehen, wenn Celias CI kommt */
  ticket: {
    radius: '4px',
    notch: '8px',
    perforation: '2px dashed rgba(244, 238, 228, 0.4)',
    bg: '#d4212d',
    fg: '#f4eee4',
    bgAlt: '#f4eee4',
    fgAlt: '#0f0808',
    shadow: '0 14px 30px -16px rgba(0, 0, 0, 0.8)',
  },
  /** Plakat: fast eckig */
  radius: { card: '3px', pill: '3px', small: '3px' },
} as const;

/** Rendert die Tokens als CSS-Variablen (für <style> im Root-Layout). */
export function tokensToCss(): string {
  const vars: string[] = [];
  for (const [group, entries] of Object.entries(tokens)) {
    for (const [k, v] of Object.entries(entries)) {
      vars.push(`--${group}-${k.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)}:${v}`);
    }
  }
  return `:root{${vars.join(';')}}`;
}
