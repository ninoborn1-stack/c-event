import { NextResponse } from 'next/server';
import { getServices } from '@/server/services';

/** GET /api/inquiries/:id – für die Danke-Seite. Die ID ist zufällig und nicht erratbar. */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const inquiry = await getServices().inquiries.get(id);
  if (!inquiry) return NextResponse.json({ error: 'Nicht gefunden' }, { status: 404 });
  return NextResponse.json({ inquiry }, { headers: { 'Cache-Control': 'no-store' } });
}
