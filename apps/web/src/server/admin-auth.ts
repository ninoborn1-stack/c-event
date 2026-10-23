import { NextResponse } from 'next/server';
import type { AdminUser } from '@c-event/core';
import { getServices } from './services';

export const ADMIN_COOKIE = 'cev_admin';

function tokenFrom(req: Request): string {
  const raw = req.headers.get('cookie') ?? '';
  const m = raw.split(/;\s*/).find((c) => c.startsWith(`${ADMIN_COOKIE}=`));
  return m ? decodeURIComponent(m.slice(ADMIN_COOKIE.length + 1)) : '';
}

/** Prüft die Admin-Sitzung (Cookie). Gibt den User oder eine 401-Antwort zurück. */
export async function requireAdmin(req: Request): Promise<AdminUser | NextResponse> {
  const token = tokenFrom(req);
  const user = token ? await getServices().auth.verify(token) : null;
  return user ?? NextResponse.json({ error: 'Nicht angemeldet' }, { status: 401 });
}

export function sessionCookie(token: string, expiresAt: string, req: Request) {
  const secure = new URL(req.url).protocol === 'https:';
  return `${ADMIN_COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Expires=${new Date(expiresAt).toUTCString()}${secure ? '; Secure' : ''}`;
}

export function clearCookie() {
  return `${ADMIN_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}

export { tokenFrom };
