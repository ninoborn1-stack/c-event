import { NextResponse } from 'next/server';
import { HERO_TRANSITIONS, isValidIsoDate, type HeroTransition, type SiteSettings } from '@c-event/core';
import { IS_DEMO } from '@/lib/env';
import { getServices } from '@/server/services';
import { requireAdmin } from '@/server/admin-auth';

/** Nur im Demo-Modus: Daten fürs Cockpit und Steuer-Aktionen. */
function demo() {
  const s = getServices();
  if (!IS_DEMO || !s.demo) return null;
  return s;
}

export async function POST(req: Request, { params }: { params: Promise<{ action: string }> }) {
  const s = demo();
  if (!s) return new NextResponse('Not found', { status: 404 });
  // Zurücksetzen darf auch der E2E-Test ohne Login; alles andere nur angemeldet
  const { action: act } = await params;
  if (act !== 'reset') {
    const user = await requireAdmin(req);
    if (user instanceof NextResponse) return user;
  }
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
      if (typeof body.heroTransition === 'string' && (HERO_TRANSITIONS as readonly string[]).includes(body.heroTransition)) patch.heroTransition = body.heroTransition as HeroTransition;
      return NextResponse.json({ settings: await s.demo!.setSettings(patch) });
    }
    case 'reset':
      await s.demo!.reset();
      return NextResponse.json({ ok: true });
    default:
      return new NextResponse('Not found', { status: 404 });
  }
}
