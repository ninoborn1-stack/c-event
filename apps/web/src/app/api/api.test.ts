import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';

beforeAll(() => {
  process.env.DATA_MODE = 'demo';
  process.env.DEMO_DATA_DIR = mkdtempSync(path.join(tmpdir(), 'cevent-api-'));
});

const post = (body: unknown) =>
  new Request('http://localhost/api/inquiries', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });

describe('Anfrage-API', () => {
  it('nimmt eine gültige Anfrage an und legt zwei Mails ab', async () => {
    const { POST } = await import('./inquiries/route.server');
    const res = await POST(
      post({
        category: 'event-organisation',
        name: 'Max Muster',
        email: 'max@example.com',
        date: '2030-12-12',
        guests: 90,
        privacy: true,
        cart: [{ kind: 'package', id: 'paket-m', qty: 1 }],
        startedAt: Date.now() - 20000,
      }),
    );
    expect(res.status).toBe(201);
    const data = (await res.json()) as { ok: boolean; id: string };
    expect(data.ok).toBe(true);
    // Admin: ohne Login 401, mit Demo-Login die Daten
    const { GET } = await import('./admin/data/route.server');
    expect((await GET(new Request('http://localhost/api/admin/data'))).status).toBe(401);
    const { POST: login } = await import('./admin/login/route.server');
    const lr = await login(new Request('http://localhost/api/admin/login', { method: 'POST', body: JSON.stringify({ email: 'demo@cn-event.de', password: 'demo' }) }));
    expect(lr.status).toBe(200);
    const cookie = lr.headers.get('set-cookie')!.split(';')[0]!;
    const state = (await (await GET(new Request('http://localhost/api/admin/data', { headers: { cookie } }))).json()) as {
      inquiries: { id: string; cart: unknown[] }[];
      mails: { kind: string }[];
    };
    expect(state.inquiries[0]?.id).toBe(data.id);
    expect(state.inquiries[0]?.cart).toHaveLength(1);
    expect(state.mails.map((m) => m.kind).sort()).toEqual(['agentur-anfrage', 'kunde-bestaetigung']);
  });

  it('Admin: Status ändern und Antwort senden', async () => {
    const { POST: login } = await import('./admin/login/route.server');
    const lr = await login(new Request('http://localhost/api/admin/login', { method: 'POST', body: JSON.stringify({ email: 'demo@cn-event.de', password: 'demo' }) }));
    const cookie = lr.headers.get('set-cookie')!.split(';')[0]!;
    const { GET } = await import('./admin/data/route.server');
    const state = (await (await GET(new Request('http://x', { headers: { cookie } }))).json()) as { inquiries: { id: string }[] };
    const id = state.inquiries[0]!.id;
    const { PATCH } = await import('./admin/inquiries/[id]/route.server');
    const pr = await PATCH(new Request('http://x', { method: 'PATCH', headers: { cookie }, body: JSON.stringify({ status: 'gebucht', adminNotes: 'Anzahlung erhalten' }) }), { params: Promise.resolve({ id }) });
    expect(((await pr.json()) as { inquiry: { status: string } }).inquiry.status).toBe('gebucht');
    const bad = await PATCH(new Request('http://x', { method: 'PATCH', headers: { cookie }, body: JSON.stringify({ status: 'quatsch' }) }), { params: Promise.resolve({ id }) });
    expect(bad.status).toBe(400);
    const { POST: reply } = await import('./admin/inquiries/[id]/reply/route.server');
    const rr = await reply(new Request('http://x', { method: 'POST', headers: { cookie }, body: JSON.stringify({ subject: 'Dein Angebot', body: 'Hallo!' }) }), { params: Promise.resolve({ id }) });
    expect(rr.status).toBe(200);
  });

  it('liefert Feldfehler mit Status 422', async () => {
    const { POST } = await import('./inquiries/route.server');
    const res = await POST(post({ category: 'catering', name: '', email: 'kaputt' }));
    expect(res.status).toBe(422);
    const data = (await res.json()) as { errors: Record<string, string> };
    expect(Object.keys(data.errors)).toEqual(expect.arrayContaining(['name', 'email', 'privacy']));
  });

  it('lehnt kaputtes JSON ab', async () => {
    const { POST } = await import('./inquiries/route.server');
    const res = await POST(new Request('http://localhost/api/inquiries', { method: 'POST', body: '{nope' }));
    expect(res.status).toBe(400);
  });

  it('Verfügbarkeit gibt nur Datum und Status zurück', async () => {
    const { GET } = await import('./availability/route.server');
    const res = await GET(new Request('http://localhost/api/availability?from=2030-01-01&to=2030-01-31'));
    const data = (await res.json()) as { days: Record<string, unknown>[] };
    expect(data.days).toHaveLength(31);
    expect(Object.keys(data.days[0]!).sort()).toEqual(['date', 'status']);
  });
});
