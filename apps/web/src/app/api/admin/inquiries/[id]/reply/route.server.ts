import { NextResponse } from 'next/server';
import { renderReplyMail } from '@c-event/core';
import { requireAdmin } from '@/server/admin-auth';
import { getServices, mailContext } from '@/server/services';

/** POST /api/admin/inquiries/:id/reply { subject, body } – Antwort an den Kunden (Demo: ins Postfach) */
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireAdmin(req);
  if (user instanceof NextResponse) return user;
  const { id } = await params;
  const b = (await req.json().catch(() => ({}))) as { subject?: unknown; body?: unknown };
  if (typeof b.subject !== 'string' || typeof b.body !== 'string' || !b.subject.trim() || !b.body.trim()) {
    return NextResponse.json({ error: 'Betreff und Text fehlen' }, { status: 400 });
  }
  const s = getServices();
  const inq = await s.inquiries.get(id);
  if (!inq) return NextResponse.json({ error: 'Nicht gefunden' }, { status: 404 });
  const ctx = mailContext();
  const mail = await s.mail.send({
    kind: 'agentur-antwort',
    to: inq.email,
    from: ctx.fromAddress,
    replyTo: ctx.agencyEmail,
    inquiryId: id,
    ...renderReplyMail(inq, ctx, b.subject.slice(0, 200), b.body.slice(0, 8000)),
  });
  if (inq.status === 'neu' || inq.status === 'in-bearbeitung') await s.inquiries.update(id, { status: 'angebot-raus' });
  return NextResponse.json({ mail });
}
