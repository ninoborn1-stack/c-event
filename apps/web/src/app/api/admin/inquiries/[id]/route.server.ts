import { NextResponse } from 'next/server';
import { INQUIRY_STATUSES, type InquiryStatus } from '@c-event/core';
import { requireAdmin } from '@/server/admin-auth';
import { getServices } from '@/server/services';

/** PATCH /api/admin/inquiries/:id { status?, adminNotes? } */
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireAdmin(req);
  if (user instanceof NextResponse) return user;
  const { id } = await params;
  const body = (await req.json().catch(() => ({}))) as { status?: unknown; adminNotes?: unknown };
  const patch: { status?: InquiryStatus; adminNotes?: string } = {};
  if (typeof body.status === 'string') {
    if (!(INQUIRY_STATUSES as readonly string[]).includes(body.status)) return NextResponse.json({ error: 'Status ungültig' }, { status: 400 });
    patch.status = body.status as InquiryStatus;
  }
  if (typeof body.adminNotes === 'string') patch.adminNotes = body.adminNotes;
  const inquiry = await getServices().inquiries.update(id, patch);
  return inquiry ? NextResponse.json({ inquiry }) : NextResponse.json({ error: 'Nicht gefunden' }, { status: 404 });
}
