/** Merkt sich pro Tab, von welcher Leistungsseite (oder aus dem Event-Match) jemand in den Shop kam. */
const KEY = 'cev-from';

export function rememberOrigin(from: string | null) {
  if (!from) return;
  try {
    sessionStorage.setItem(KEY, from);
  } catch {
    /* privater Modus: egal */
  }
}

export function readOrigin(): string | null {
  try {
    return sessionStorage.getItem(KEY);
  } catch {
    return null;
  }
}
