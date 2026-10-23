import { describe, expect, it } from 'vitest';
import {
  addToCart,
  buildAvailability,
  collectPlaceholders,
  inquiryInputSchema,
  looksLikeSpam,
  ph,
  priceMode,
  removeFromCart,
  setNote,
  setQty,
  summarizeCart,
  val,
  type Catalog,
} from './index';

const catalog: Catalog = {
  categories: [{ id: 'bar', label: 'Bar' }],
  items: [
    {
      id: 'bar',
      name: 'Mobile Bar',
      category: 'bar',
      services: ['bar-catering'],
      short: 'x',
      price: { amountCents: 45000, unit: 'pro Abend' },
      depositCents: 20000,
      stock: 2,
      media: 'm',
    },
    {
      id: 'deko',
      name: 'Deko',
      category: 'bar',
      services: ['dekoration'],
      short: 'x',
      price: ph({ amountCents: null, unit: 'pauschal' }, 'Preis fehlt'),
      stock: 10,
      media: 'm',
    },
  ],
  packages: [
    { id: 'S', name: 'Paket S', tagline: '', guests: '', items: [], price: { amountCents: 100000, unit: 'ab' }, media: 'm', services: [] },
  ],
};

describe('Warenkorb', () => {
  it('addiert Mengen und respektiert den Bestand', () => {
    let c = addToCart([], { kind: 'item', id: 'bar', qty: 1 }, catalog);
    c = addToCart(c, { kind: 'item', id: 'bar', qty: 5 }, catalog);
    expect(c).toEqual([{ kind: 'item', id: 'bar', qty: 2 }]);
  });
  it('setzt und entfernt Positionen', () => {
    let c = addToCart([], { kind: 'item', id: 'deko', qty: 1 });
    c = setQty(c, 'item', 'deko', 4, catalog);
    expect(c[0]?.qty).toBe(4);
    expect(setQty(c, 'item', 'deko', 0)).toEqual([]);
    expect(removeFromCart(c, 'item', 'deko')).toEqual([]);
  });
  it('bepreist inkl. Kaution und „auf Anfrage“', () => {
    const s = summarizeCart(
      [
        { kind: 'item', id: 'bar', qty: 2 },
        { kind: 'item', id: 'deko', qty: 1 },
        { kind: 'package', id: 'S', qty: 1 },
        { kind: 'item', id: 'gibtsnicht', qty: 1 },
      ],
      catalog,
    );
    expect(s.lines).toHaveLength(3);
    expect(s.subtotalCents).toBe(190000);
    expect(s.depositCents).toBe(40000);
    expect(s.hasOnRequest).toBe(true);
  });
});

describe('Preis-Modi & Notizen', () => {
  it('erkennt fest / ab / auf Anfrage', () => {
    expect(priceMode({ amountCents: 100, unit: 'x' })).toBe('fixed');
    expect(priceMode({ amountCents: 100, unit: 'x', mode: 'from' })).toBe('from');
    expect(priceMode({ amountCents: null, unit: 'x', mode: 'from' })).toBe('request');
  });
  it('speichert Notizen pro Position und gibt sie in der Zusammenfassung weiter', () => {
    let c = addToCart([], { kind: 'item', id: 'bar', qty: 1 }, catalog);
    c = setNote(c, 'item', 'bar', 'Bar in Weiß');
    expect(summarizeCart(c, catalog).lines[0]?.note).toBe('Bar in Weiß');
    expect(setNote(c, 'item', 'bar', '')[0]?.note).toBeUndefined();
  });
});

describe('Anfrage-Schema', () => {
  const base = { category: 'bar-catering', name: 'Max Muster', email: 'max@example.com', privacy: true };
  it('akzeptiert eine minimale Anfrage', () => {
    const r = inquiryInputSchema.safeParse(base);
    expect(r.success).toBe(true);
  });
  it('normalisiert leere Felder und Zahlen aus Strings', () => {
    const r = inquiryInputSchema.parse({ ...base, guests: '120', company: '', date: '', budget: '' });
    expect(r.guests).toBe(120);
    expect(r.company).toBeUndefined();
    expect(r.date).toBeUndefined();
  });
  it('lehnt fehlende Zustimmung, falsche Kategorie und E-Mail ab', () => {
    expect(inquiryInputSchema.safeParse({ ...base, privacy: false }).success).toBe(false);
    expect(inquiryInputSchema.safeParse({ ...base, category: 'quatsch' }).success).toBe(false);
    expect(inquiryInputSchema.safeParse({ ...base, email: 'nope' }).success).toBe(false);
  });
  it('erkennt Spam über Honeypot und Ausfüllzeit', () => {
    expect(looksLikeSpam({ website: 'x' })).toBe(true);
    expect(looksLikeSpam({ startedAt: 1000 }, 2000)).toBe(true);
    expect(looksLikeSpam({ startedAt: 1000 }, 10000)).toBe(false);
  });
});

describe('Platzhalter', () => {
  it('sammelt verschachtelte Platzhalter mit Pfad', () => {
    const list = collectPlaceholders({ a: { b: ph('x', 'fehlt', 'Texte') }, c: [1, ph(2, 'zahl', 'Pakete')] });
    // sortiert nach Priorität, dann Gruppe (Pakete vor Texte)
    expect(list.map((p) => p.path)).toEqual(['c[1]', 'a.b']);
    expect(list.every((p) => p.priority === 'P1')).toBe(true);
    expect(ph('x', 'Impressum', 'Rechtliches').priority).toBe('P2');
    expect(ph('x', 'Empfänger', 'Kontakt & Social', 'P1').priority).toBe('P1');
    expect(val(ph('wert', 'n'))).toBe('wert');
  });
});

describe('Verfügbarkeit', () => {
  it('markiert belegt, frei und vergangen', () => {
    const days = buildAvailability('2026-01-01', '2026-01-03', new Set(['2026-01-03']), new Date(2026, 0, 2));
    expect(days.map((d) => d.status)).toEqual(['past', 'free', 'booked']);
  });
});
