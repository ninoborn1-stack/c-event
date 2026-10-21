import { NextResponse } from 'next/server';
import { addDays, isValidIsoDate, parseIsoDate, toIsoDate } from '@c-event/core';
import { getServices } from '@/server/services';

/** GET /api/availability?from=YYYY-MM-DD&to=YYYY-MM-DD → { days: [{ date, status }] } – nur Belegt/Frei. */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const today = new Date();
  const from = url.searchParams.get('from');
  const to = url.searchParams.get('to');
  const f = isValidIsoDate(from) ? from : toIsoDate(today);
  const t = isValidIsoDate(to) ? to : toIsoDate(addDays(today, 90));
  if (parseIsoDate(t).getTime() - parseIsoDate(f).getTime() > 400 * 864e5 || t < f) {
    return NextResponse.json({ error: 'Zeitraum ungültig (max. 400 Tage)' }, { status: 400 });
  }
  const days = await getServices().availability.getRange(f, t);
  return NextResponse.json({ days }, { headers: { 'Cache-Control': 'no-store' } });
}
