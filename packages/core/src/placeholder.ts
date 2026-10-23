/**
 * Platzhalter-System: Jeder Wert, der noch von Celia kommen muss, wird mit `ph()` markiert.
 * Die UI zeigt Platzhalter im Demo-Modus sichtbar an, `collectPlaceholders()` sammelt sie
 * automatisch für das Demo-Cockpit und docs/PLATZHALTER.md.
 */
export interface Placeholder<T> {
  readonly __placeholder: true;
  readonly value: T;
  /** Was fehlt bzw. was Celia liefern muss. */
  readonly note: string;
  /** Grobe Zuordnung für die Liste im Cockpit. */
  readonly group: PlaceholderGroup;
  /** P1 = vor dem Bau nötig, P2 = nach und nach (für den Livegang nur Domain + Impressum zwingend). */
  readonly priority: Priority;
}

export type Priority = 'P1' | 'P2';

export type PlaceholderGroup =
  | 'Marke & Logo'
  | 'Texte'
  | 'Equipment & Preise'
  | 'Pakete'
  | 'Referenzen'
  | 'Team'
  | 'Rechtliches'
  | 'Kontakt & Social'
  | 'Einsatzgebiet'
  | 'Partner'
  | 'Medien'
  | 'Shop'
  | 'Technik & Konten'
  | 'Organisation';

/** Standard-Priorität je Gruppe (Briefing 2); einzelne Platzhalter können abweichen. */
const DEFAULT_PRIORITY: Record<PlaceholderGroup, Priority> = {
  'Marke & Logo': 'P1',
  Texte: 'P1',
  'Equipment & Preise': 'P1',
  Pakete: 'P1',
  Team: 'P1',
  Medien: 'P1',
  Shop: 'P1',
  Referenzen: 'P2',
  Rechtliches: 'P2',
  'Kontakt & Social': 'P2',
  Einsatzgebiet: 'P2',
  Partner: 'P2',
  'Technik & Konten': 'P2',
  Organisation: 'P2',
};

/** Ein Wert, der fertig sein kann oder noch ein Platzhalter ist. */
export type Maybe<T> = T | Placeholder<T>;

export function ph<T>(value: T, note: string, group: PlaceholderGroup = 'Texte', priority?: Priority): Placeholder<T> {
  return { __placeholder: true, value, note, group, priority: priority ?? DEFAULT_PRIORITY[group] };
}

export function isPlaceholder<T>(v: Maybe<T> | unknown): v is Placeholder<T> {
  return typeof v === 'object' && v !== null && (v as { __placeholder?: unknown }).__placeholder === true;
}

/** Holt den eigentlichen Wert, egal ob Platzhalter oder fertig. */
export function val<T>(v: Maybe<T>): T {
  return isPlaceholder<T>(v) ? v.value : v;
}

export interface PlaceholderEntry {
  path: string;
  note: string;
  group: PlaceholderGroup;
  priority: Priority;
  preview: string;
}

/** Läuft rekursiv durch beliebige Inhalte und sammelt alle Platzhalter mit Pfad. */
export function collectPlaceholders(root: unknown, rootPath = ''): PlaceholderEntry[] {
  const out: PlaceholderEntry[] = [];
  const seen = new WeakSet<object>();
  const walk = (node: unknown, path: string) => {
    if (typeof node !== 'object' || node === null) return;
    if (seen.has(node)) return;
    seen.add(node);
    if (isPlaceholder(node)) {
      out.push({ path, note: node.note, group: node.group, priority: node.priority, preview: previewOf(node.value) });
      return;
    }
    if (Array.isArray(node)) {
      node.forEach((child, i) => walk(child, `${path}[${i}]`));
      return;
    }
    for (const [key, child] of Object.entries(node)) {
      walk(child, path ? `${path}.${key}` : key);
    }
  };
  walk(root, rootPath);
  // Sortiert: erst P1, dann P2, jeweils nach Gruppe
  return out.sort((a, b) => a.priority.localeCompare(b.priority) || a.group.localeCompare(b.group, 'de'));
}

function previewOf(v: unknown): string {
  if (typeof v === 'string') return v.length > 80 ? `${v.slice(0, 77)}…` : v;
  if (typeof v === 'number' || typeof v === 'boolean') return String(v);
  if (v === null || v === undefined) return '–';
  try {
    const s = JSON.stringify(v);
    return s.length > 80 ? `${s.slice(0, 77)}…` : s;
  } catch {
    return '[Objekt]';
  }
}
