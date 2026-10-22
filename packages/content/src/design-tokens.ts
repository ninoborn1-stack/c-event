/**
 * Design-Tokens: EINE Quelle für Web (als CSS-Variablen) und spätere App.
 * Basis aus dem Briefing-Deck (Dunkel, Champagner, Creme), ergänzt um ein Signal-Rot für Live-Momente.
 */
export const tokens = {
  color: {
    ink: '#0c0a08',
    night: '#16130f',
    smoke: '#26211b',
    ash: '#4a4238',
    mute: '#9b8f7e',
    cream: '#f3eee5',
    paper: '#fbf8f3',
    gold: '#d4a25a',
    goldHot: '#f2c36b',
    signal: '#ff4a26',
    free: '#7fd18b',
  },
  font: {
    display: "var(--ff-display), 'Arial Narrow', sans-serif",
    serif: "var(--ff-serif), Georgia, serif",
    sans: 'var(--ff-sans), system-ui, sans-serif',
    pixel: 'var(--ff-pixel), ui-monospace, monospace',
  },
  space: { gutter: 'clamp(16px, 4vw, 64px)', section: 'clamp(96px, 16vw, 220px)' },
  ease: { out: 'cubic-bezier(.16,1,.3,1)', inOut: 'cubic-bezier(.76,0,.24,1)' },
  radius: { none: '0px', pill: '999px' },
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
