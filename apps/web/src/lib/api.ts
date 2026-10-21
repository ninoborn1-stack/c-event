'use client';

import { submitInquiry, type DayAvailability, type Inquiry, type PlaceholderEntry, type SentMail, type SiteSettings } from '@c-event/core';
import type { DemoServices } from '@c-event/services-demo/browser';
import { IS_STATIC } from './env';
import { mailContext } from './mail-context';

/**
 * Client-Zugriff auf die Daten. Normal: HTTP-Endpunkte unter /api (dieselben, die eine App nutzt).
 * Statische Vorschau (GitHub Pages): dieselben Demo-Services direkt im Browser.
 */
let browser: Promise<DemoServices> | null = null;
function local(): Promise<DemoServices> {
  browser ??= import('@c-event/services-demo/browser').then((m) => m.createBrowserDemoServices());
  return browser;
}

export interface DemoState {
  mails: SentMail[];
  inquiries: Inquiry[];
  booked: string[];
  settings: SiteSettings;
  placeholders: PlaceholderEntry[];
}

export type SubmitResponse = { ok: true; id: string } | { ok: false; errors: Record<string, string> };

/** Meldet anderen Komponenten (z. B. SiteProvider), dass sich Demo-Einstellungen geändert haben. */
export const SETTINGS_EVENT = 'cev:settings';

export const api = {
  async submitInquiry(payload: unknown): Promise<SubmitResponse> {
    if (IS_STATIC) {
      const res = await submitInquiry(payload, await local(), mailContext());
      return res.ok ? { ok: true, id: res.inquiry.id } : { ok: false, errors: res.errors };
    }
    const r = await fetch('/api/inquiries', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    const data = (await r.json()) as { ok: boolean; id?: string; errors?: Record<string, string> };
    return r.ok && data.ok && data.id ? { ok: true, id: data.id } : { ok: false, errors: data.errors ?? { _: 'Anfrage fehlgeschlagen.' } };
  },

  async getInquiry(id: string): Promise<Inquiry | null> {
    if (IS_STATIC) return (await local()).inquiries.get(id);
    const r = await fetch(`/api/inquiries/${encodeURIComponent(id)}`, { cache: 'no-store' });
    return r.ok ? ((await r.json()) as { inquiry: Inquiry }).inquiry : null;
  },

  async availability(from: string, to: string): Promise<DayAvailability[]> {
    if (IS_STATIC) return (await local()).availability.getRange(from, to);
    const r = await fetch(`/api/availability?from=${from}&to=${to}`);
    if (!r.ok) throw new Error(String(r.status));
    return ((await r.json()) as { days: DayAvailability[] }).days;
  },

  async settings(): Promise<SiteSettings> {
    return (await local()).settings.get();
  },

  async demoState(): Promise<DemoState> {
    if (IS_STATIC) {
      const s = await local();
      const { listPlaceholders } = await import('@c-event/content');
      const [mails, inquiries, booked, settings] = await Promise.all([s.mail.list(), s.inquiries.list(), s.demo.listBooked(), s.settings.get()]);
      return { mails, inquiries, booked, settings, placeholders: listPlaceholders() };
    }
    const r = await fetch('/api/demo/state', { cache: 'no-store' });
    return (await r.json()) as DemoState;
  },

  async demoAction(action: 'toggle-day' | 'settings' | 'reset', body: Record<string, unknown> = {}): Promise<void> {
    if (IS_STATIC) {
      const s = await local();
      if (action === 'toggle-day' && typeof body.date === 'string') await s.demo.toggleDay(body.date);
      if (action === 'settings') await s.demo.setSettings(body as Partial<SiteSettings>);
      if (action === 'reset') await s.demo.reset();
    } else {
      await fetch(`/api/demo/${action}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    }
    if (action !== 'toggle-day') window.dispatchEvent(new Event(SETTINGS_EVENT));
  },
};
