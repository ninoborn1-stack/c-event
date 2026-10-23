import { NextResponse } from 'next/server';
import { requireAdmin } from '@/server/admin-auth';

export async function GET(req: Request) {
  const user = await requireAdmin(req);
  if (user instanceof NextResponse) return user;
  return NextResponse.json({ user }, { headers: { 'Cache-Control': 'no-store' } });
}
