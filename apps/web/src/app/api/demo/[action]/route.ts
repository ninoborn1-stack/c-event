import { NextResponse } from 'next/server';
import { isValidIsoDate, type SiteSettings } from '@c-event/core';
import { listPlaceholders } from '@c-event/content';
import { IS_DEMO } from '@/lib/env';
import { getServices } from '@/server/services';

/** Nur im Demo-Modus: Daten fürs Cockpit und Steuer-Aktionen. */
function demo() {
  const s = getServices();
  if (!IS_DEMO || !s.demo) return null;
  return s;
}

export async function GET(_req: Request, { params }: { params: Promise<{ action: string }> }) {
  const s = demo();
  if (!s) return new NextResponse('Not found', { status: 404 });
  const { action } = await params;
  if (action !== 'state') return new NextResponse('Not found', { status: 404 });
  const [mails, inquiries, booked, settings] = await Promise.all([s.mail.list(), s.inquiries.list(), s.demo!.listBooked(), s.settings.get()]);
  return NextResponse.json({ mails, inquiries, booked, settings, placeholders: listPlaceholders() }, { headers: { 'Cache-Control': 'no-store' } });
}

export async function POST(req: Request, { params }: { params: Promise<{ action: string }> }) {
  const s = demo();
  if (!s) return new NextResponse('Not found', { status: 404 });
  const { action } = await params;
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  switch (action) {
    case 'toggle-day': {
      if (!isValidIsoDate(body.date)) return NextResponse.json({ error: 'date fehlt' }, { status: 400 });
      return NextResponse.json({ booked: await s.demo!.toggleDay(body.date) });
    }
    case 'settings': {
      const patch: Partial<SiteSettings> = {};
      if (typeof body.sloganVariant === 'number') patch.sloganVariant = Math.max(0, Math.min(2, Math.round(body.sloganVariant)));
      for (const k of ['showPrices', 'bunkerWestCode', 'showPlaceholders'] as const) if (typeof body[k] === 'boolean') patch[k] = body[k];
      return NextResponse.json({ settings: await s.demo!.setSettings(patch) });
    }
    case 'reset':
      await s.demo!.reset();
      return NextResponse.json({ ok: true });
    default:
      return new NextResponse('Not found', { status: 404 });
  }
}
