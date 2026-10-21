import { SERVICE_SLUGS, val } from '@c-event/core';
import { describe, expect, it } from 'vitest';
import { catalog, gallery, getMedia, listPlaceholders, media, services } from './index';

describe('Inhalte', () => {
  it('hat für jede Leistung genau eine Seite', () => {
    expect(services.map((s) => s.slug).sort()).toEqual([...SERVICE_SLUGS].sort());
  });
  it('verweist nur auf existierende Medien', () => {
    const ids = new Set(Object.keys(media));
    for (const s of services) for (const m of [s.hero, ...s.gallery]) expect(ids.has(m), m).toBe(true);
    for (const i of catalog.items) expect(ids.has(i.media), i.media).toBe(true);
    for (const g of gallery.items) expect(ids.has(g.media), g.media).toBe(true);
    expect(getMedia('gibtsnicht').src).toBeTruthy();
  });
  it('Pakete enthalten nur existierende Artikel', () => {
    const ids = new Set(catalog.items.map((i) => i.id));
    for (const p of catalog.packages) for (const i of p.items) expect(ids.has(i.itemId), i.itemId).toBe(true);
  });
  it('jede Leistung hat 3–5 FAQ und 3–5 Punkte', () => {
    for (const s of services) {
      expect(val(s.faq).length).toBeGreaterThanOrEqual(3);
      expect(val(s.faq).length).toBeLessThanOrEqual(5);
      expect(val(s.points).length).toBeGreaterThanOrEqual(3);
    }
  });
  it('sammelt Platzhalter automatisch', () => {
    const list = listPlaceholders();
    expect(list.length).toBeGreaterThan(20);
    expect(list.some((p) => p.group === 'Rechtliches')).toBe(true);
  });
});
