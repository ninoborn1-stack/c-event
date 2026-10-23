/**
 * Design-Tokens: EINE Quelle für Web (als CSS-Variablen) und spätere App.
 * Farbvorschlag aus Celias Instagram-Bildsprache (dunkel, tiefes Rot, Bernstein, Kerzenlicht) – bis ihre CI kommt.
 * Kontraste (WCAG AA): cream auf ink 15.9:1 · mute auf ink 7.0:1 · cream auf red 6.6:1 · amberText auf cream 5.6:1 · amber auf ink 8.6:1
 */
export const tokens = {
  color: {
    ink: '#15110f',
    night: '#1d1815',
    smoke: '#2b2420',
    ash: '#4d433c',
    mute: '#a89a8a',
    cream: '#f2ece3',
    paper: '#faf6f0',
    /** Akzent für Tickets und CTAs */
    red: '#9e2b25',
    redDeep: '#7a1f1a',
    /** Highlights, Eyebrows */
    amber: '#d9a04e',
    amberHot: '#e8b86a',
    /** Bernstein für Text auf hellem Grund */
    amberText: '#8a5a1c',
    free: '#7fd18b',
  },
  font: {
    /** Die blockige Headline-Schrift aus dem Hero („Ideen auf die Bühne“) – einzige Headline-Schrift */
    display: "var(--ff-display), 'Arial Narrow', sans-serif",
    sans: 'var(--ff-sans), system-ui, sans-serif',
    pixel: 'var(--ff-pixel), ui-monospace, monospace',
  },
  space: { gutter: 'clamp(16px, 4vw, 64px)', section: 'clamp(80px, 12vw, 180px)' },
  ease: { out: 'cubic-bezier(.16,1,.3,1)', inOut: 'cubic-bezier(.76,0,.24,1)' },
  /** Ticket-Stil für CTAs und Warenkorb: hier drehen, wenn Celias Feedback („ein bisschen weiblich“) kommt */
  ticket: {
    radius: '14px',
    notch: '9px',
    perforation: '2px dashed rgba(242, 236, 227, 0.35)',
    bg: '#9e2b25',
    fg: '#f2ece3',
    bgAlt: '#f2ece3',
    fgAlt: '#15110f',
    shadow: '0 14px 30px -16px rgba(0, 0, 0, 0.7)',
  },
  radius: { card: '16px', pill: '999px', small: '8px' },
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
