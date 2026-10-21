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
    const { POST } = await import('./inquiries/route');
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
    const { GET } = await import('./demo/[action]/route');
    const state = (await (await GET(new Request('http://localhost/api/demo/state'), { params: Promise.resolve({ action: 'state' }) })).json()) as {
      inquiries: { id: string; cart: unknown[] }[];
      mails: { kind: string }[];
    };
    expect(state.inquiries[0]?.id).toBe(data.id);
    expect(state.inquiries[0]?.cart).toHaveLength(1);
    expect(state.mails.map((m) => m.kind).sort()).toEqual(['agentur-anfrage', 'kunde-bestaetigung']);
  });

  it('liefert Feldfehler mit Status 422', async () => {
    const { POST } = await import('./inquiries/route');
    const res = await POST(post({ category: 'catering', name: '', email: 'kaputt' }));
    expect(res.status).toBe(422);
    const data = (await res.json()) as { errors: Record<string, string> };
    expect(Object.keys(data.errors)).toEqual(expect.arrayContaining(['name', 'email', 'privacy']));
  });

  it('lehnt kaputtes JSON ab', async () => {
    const { POST } = await import('./inquiries/route');
    const res = await POST(new Request('http://localhost/api/inquiries', { method: 'POST', body: '{nope' }));
    expect(res.status).toBe(400);
  });

  it('Verfügbarkeit gibt nur Datum und Status zurück', async () => {
    const { GET } = await import('./availability/route');
    const res = await GET(new Request('http://localhost/api/availability?from=2030-01-01&to=2030-01-31'));
    const data = (await res.json()) as { days: Record<string, unknown>[] };
    expect(data.days).toHaveLength(31);
    expect(Object.keys(data.days[0]!).sort()).toEqual(['date', 'status']);
  });
});
