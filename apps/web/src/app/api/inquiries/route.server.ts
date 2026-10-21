import { NextResponse } from 'next/server';
import { submitInquiry } from '@c-event/core';
import { getServices, mailContext } from '@/server/services';

/**
 * POST /api/inquiries – das zentrale Formular. Validiert mit demselben Zod-Schema wie der Client,
 * speichert die Anfrage und verschickt (Demo: legt ab) Bestätigung an Kunden + Benachrichtigung an Celia.
 */
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, errors: { _: 'Ungültige Anfrage.' } }, { status: 400 });
  }
  const res = await submitInquiry(body, getServices(), mailContext());
  if (!res.ok) return NextResponse.json({ ok: false, errors: res.errors }, { status: res.status });
  return NextResponse.json({ ok: true, id: res.inquiry.id }, { status: 201 });
}
