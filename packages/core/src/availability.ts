import type { DayAvailability } from './domain';

export function toIsoDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function parseIsoDate(s: string): Date {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y ?? 1970, (m ?? 1) - 1, d ?? 1);
}

export function addDays(d: Date, n: number): Date {
  const c = new Date(d);
  c.setDate(c.getDate() + n);
  return c;
}

/**
 * Baut die öffentliche Belegt/Frei-Ansicht. Es werden bewusst keine Details
 * (Kunde, Uhrzeit, Ort) weitergegeben, nur der Status pro Tag.
 */
export function buildAvailability(from: string, to: string, booked: Set<string>, today = new Date()): DayAvailability[] {
  const out: DayAvailability[] = [];
  const todayIso = toIsoDate(today);
  let cur = parseIsoDate(from);
  const end = parseIsoDate(to);
  let guard = 0;
  while (cur <= end && guard++ < 400) {
    const iso = toIsoDate(cur);
    out.push({ date: iso, status: iso < todayIso ? 'past' : booked.has(iso) ? 'booked' : 'free' });
    cur = addDays(cur, 1);
  }
  return out;
}

export function isValidIsoDate(s: unknown): s is string {
  return typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(parseIsoDate(s).getTime());
}
