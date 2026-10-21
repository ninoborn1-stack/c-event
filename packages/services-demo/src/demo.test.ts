import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { submitInquiry, toIsoDate, addDays } from '@c-event/core';
import { labelFns } from '@c-event/content';
import { describe, expect, it } from 'vitest';
import { createDemoServices, seedBookedDays } from './index';

const ctx = {
  brandName: 'C-Event Agency',
  agencyEmail: 'hallo@c-event.de',
  agencyPhone: '+49',
  fromAddress: 'noreply@c-event.de',
  siteUrl: 'http://localhost:3000',
  recipient: 'anfragen@c-event.de',
  labels: labelFns,
};

describe('Anfrage-Ablauf mit Demo-Services', () => {
  it('speichert die Anfrage und legt zwei Mails ins Postfach', async () => {
    const services = createDemoServices({ dir: mkdtempSync(path.join(tmpdir(), 'cevent-')) });
    const res = await submitInquiry(
      {
        category: 'bar-catering',
        name: 'Erika Beispiel',
        email: 'erika@example.com',
        guests: '80',
        privacy: true,
        cart: [{ kind: 'item', id: 'mobile-bar', qty: 1 }],
        startedAt: Date.now() - 10000,
      },
      services,
      ctx,
    );
    expect(res.ok).toBe(true);
    if (!res.ok) return;
    expect(res.inquiry.cart[0]?.name).toContain('Mobile Bar');
    expect(res.inquiry.cartSubtotalCents).toBe(45000);
    const mails = await services.mail.list();
    expect(mails.map((m) => m.kind).sort()).toEqual(['agentur-anfrage', 'kunde-bestaetigung']);
    expect(mails.find((m) => m.kind === 'kunde-bestaetigung')?.to).toBe('erika@example.com');
    expect(await services.inquiries.get(res.inquiry.id)).not.toBeNull();
  });

  it('lehnt ungültige Daten und Spam ab, ohne etwas zu speichern', async () => {
    const services = createDemoServices({ dir: mkdtempSync(path.join(tmpdir(), 'cevent-')) });
    const bad = await submitInquiry({ category: 'bar-catering', name: 'X', email: 'x' }, services, ctx);
    expect(bad.ok).toBe(false);
    if (!bad.ok) expect(Object.keys(bad.errors)).toEqual(expect.arrayContaining(['name', 'email', 'privacy']));
    const spam = await submitInquiry(
      { category: 'allgemein', name: 'Bot Bot', email: 'b@b.de', privacy: true, website: 'http://spam' },
      services,
      ctx,
    );
    expect(spam.ok).toBe(false);
    expect(await services.inquiries.list()).toHaveLength(0);
  });

  it('Kalender: Tage belegen und freigeben', async () => {
    const services = createDemoServices({ dir: mkdtempSync(path.join(tmpdir(), 'cevent-')) });
    const day = toIsoDate(addDays(new Date(), 3));
    const before = (await services.availability.getRange(day, day))[0]?.status;
    await services.demo.toggleDay(day);
    const after = (await services.availability.getRange(day, day))[0]?.status;
    expect(before).not.toBe(after);
    expect(seedBookedDays().length).toBeGreaterThan(5);
  });
});
