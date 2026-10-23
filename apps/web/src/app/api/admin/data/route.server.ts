import { NextResponse } from 'next/server';
import { listPlaceholders } from '@c-event/content';
import { IS_DEMO } from '@/lib/env';
import { requireAdmin } from '@/server/admin-auth';
import { getServices } from '@/server/services';

/** GET /api/admin/data – alles fürs Dashboard in einem Rutsch (Anfragen, Mails, Posts, Rezensionen, Kalender). */
export async function GET(req: Request) {
  const user = await requireAdmin(req);
  if (user instanceof NextResponse) return user;
  const s = getServices();
  const [inquiries, mails, feed, reviews, settings, booked] = await Promise.all([
    s.inquiries.list(),
    s.mail.list(),
    s.social.getFeed(12),
    s.reviews.getSummary(),
    s.settings.get(),
    s.demo ? s.demo.listBooked() : Promise.resolve([] as string[]),
  ]);
  return NextResponse.json(
    { inquiries, mails, feed, reviews, booked, settings, placeholders: IS_DEMO ? listPlaceholders() : [], isDemo: IS_DEMO },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}
