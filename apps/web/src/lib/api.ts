'use client';

import {
  renderReplyMail,
  submitInquiry,
  type AdminUser,
  type DayAvailability,
  type Inquiry,
  type InquiryStatus,
  type PlaceholderEntry,
  type ReviewSummary,
  type SentMail,
  type SiteSettings,
  type SocialFeed,
} from '@c-event/core';
import type { DemoServices } from '@c-event/services-demo/browser';
import { IS_DEMO, IS_STATIC } from './env';
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

export interface AdminData {
  inquiries: Inquiry[];
  mails: SentMail[];
  feed: SocialFeed;
  reviews: ReviewSummary;
  booked: string[];
  settings: SiteSettings;
  placeholders: PlaceholderEntry[];
  isDemo: boolean;
}

export type SubmitResponse = { ok: true; id: string } | { ok: false; errors: Record<string, string> };

/** Meldet anderen Komponenten (z. B. SiteProvider), dass sich Demo-Einstellungen geändert haben. */
export const SETTINGS_EVENT = 'cev:settings';
const TOKEN_KEY = 'cev-admin-token';

const json = async <T>(r: Response): Promise<T> => {
  if (!r.ok) throw new Error(String(r.status));
  return (await r.json()) as T;
};
const send = (url: string, method: string, body?: unknown) =>
  fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: body === undefined ? undefined : JSON.stringify(body), cache: 'no-store' });

/** Statischer Modus: Token im Browser prüfen; Server-Modus: Cookie (httpOnly) prüft der Server. */
async function staticGuard(): Promise<DemoServices> {
  const s = await local();
  let token = '';
  try {
    token = localStorage.getItem(TOKEN_KEY) ?? '';
  } catch {
    /* egal */
  }
  if (!(await s.auth.verify(token))) throw new Error('401');
  return s;
}

export const api = {
  async submitInquiry(payload: unknown): Promise<SubmitResponse> {
    if (IS_STATIC) {
      const res = await submitInquiry(payload, await local(), mailContext());
      return res.ok ? { ok: true, id: res.inquiry.id } : { ok: false, errors: res.errors };
    }
    const r = await send('/api/inquiries', 'POST', payload);
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
    return (await json<{ days: DayAvailability[] }>(await fetch(`/api/availability?from=${from}&to=${to}`))).days;
  },

  async settings(): Promise<SiteSettings> {
    return (await local()).settings.get();
  },

  // ---------- Admin ----------
  admin: {
    async login(email: string, password: string): Promise<AdminUser | null> {
      if (IS_STATIC) {
        const s = await (await local()).auth.login(email, password);
        if (!s) return null;
        try {
          localStorage.setItem(TOKEN_KEY, s.token);
        } catch {
          /* egal */
        }
        return s.user;
      }
      const r = await send('/api/admin/login', 'POST', { email, password });
      return r.ok ? ((await r.json()) as { user: AdminUser }).user : null;
    },
    async me(): Promise<AdminUser | null> {
      if (IS_STATIC) {
        let token = '';
        try {
          token = localStorage.getItem(TOKEN_KEY) ?? '';
        } catch {
          /* egal */
        }
        return (await local()).auth.verify(token);
      }
      const r = await fetch('/api/admin/me', { cache: 'no-store' });
      return r.ok ? ((await r.json()) as { user: AdminUser }).user : null;
    },
    async logout(): Promise<void> {
      if (IS_STATIC) {
        let token = '';
        try {
          token = localStorage.getItem(TOKEN_KEY) ?? '';
          localStorage.removeItem(TOKEN_KEY);
        } catch {
          /* egal */
        }
        await (await local()).auth.logout(token);
        return;
      }
      await send('/api/admin/logout', 'POST');
    },
    async data(): Promise<AdminData> {
      if (IS_STATIC) {
        const s = await staticGuard();
        const { listPlaceholders } = await import('@c-event/content');
        const [inquiries, mails, feed, reviews, booked, settings] = await Promise.all([
          s.inquiries.list(),
          s.mail.list(),
          s.social.getFeed(12),
          s.reviews.getSummary(),
          s.demo.listBooked(),
          s.settings.get(),
        ]);
        return { inquiries, mails, feed, reviews, booked, settings, placeholders: listPlaceholders(), isDemo: IS_DEMO };
      }
      return json<AdminData>(await fetch('/api/admin/data', { cache: 'no-store' }));
    },
    async updateInquiry(id: string, patch: { status?: InquiryStatus; adminNotes?: string }): Promise<void> {
      if (IS_STATIC) {
        await (await staticGuard()).inquiries.update(id, patch);
        return;
      }
      await json(await send(`/api/admin/inquiries/${encodeURIComponent(id)}`, 'PATCH', patch));
    },
    async reply(id: string, subject: string, body: string): Promise<void> {
      if (IS_STATIC) {
        const s = await staticGuard();
        const inq = await s.inquiries.get(id);
        if (!inq) throw new Error('404');
        const ctx = mailContext();
        await s.mail.send({ kind: 'agentur-antwort', to: inq.email, from: ctx.fromAddress, replyTo: ctx.agencyEmail, inquiryId: id, ...renderReplyMail(inq, ctx, subject, body) });
        if (inq.status === 'neu' || inq.status === 'in-bearbeitung') await s.inquiries.update(id, { status: 'angebot-raus' });
        return;
      }
      await json(await send(`/api/admin/inquiries/${encodeURIComponent(id)}/reply`, 'POST', { subject, body }));
    },
    /** Nur Demo: Kalender umschalten, Einstellungen, Reset */
    async demo(action: 'toggle-day' | 'settings' | 'reset', body: Record<string, unknown> = {}): Promise<void> {
      if (IS_STATIC) {
        const s = await staticGuard();
        if (action === 'toggle-day' && typeof body.date === 'string') await s.demo.toggleDay(body.date);
        if (action === 'settings') await s.demo.setSettings(body as Partial<SiteSettings>);
        if (action === 'reset') await s.demo.reset();
      } else {
        await json(await send(`/api/demo/${action}`, 'POST', body));
      }
      if (action !== 'toggle-day') window.dispatchEvent(new Event(SETTINGS_EVENT));
    },
  },
};
