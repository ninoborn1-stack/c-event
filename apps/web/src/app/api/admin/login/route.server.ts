import { NextResponse } from 'next/server';
import { getServices } from '@/server/services';
import { sessionCookie } from '@/server/admin-auth';

/** POST /api/admin/login { email, password } → setzt das Sitzungs-Cookie */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { email?: unknown; password?: unknown };
  if (typeof body.email !== 'string' || typeof body.password !== 'string') return NextResponse.json({ error: 'E-Mail und Passwort fehlen' }, { status: 400 });
  const session = await getServices().auth.login(body.email, body.password);
  if (!session) return NextResponse.json({ error: 'Zugangsdaten stimmen nicht' }, { status: 401 });
  const res = NextResponse.json({ user: session.user });
  res.headers.set('Set-Cookie', sessionCookie(session.token, session.expiresAt, req));
  return res;
}
