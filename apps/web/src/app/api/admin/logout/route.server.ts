import { NextResponse } from 'next/server';
import { getServices } from '@/server/services';
import { clearCookie, tokenFrom } from '@/server/admin-auth';

export async function POST(req: Request) {
  const token = tokenFrom(req);
  if (token) await getServices().auth.logout(token);
  const res = NextResponse.json({ ok: true });
  res.headers.set('Set-Cookie', clearCookie());
  return res;
}
