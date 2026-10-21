import { NextResponse } from 'next/server';
import { val } from '@c-event/core';
import { getServices } from '@/server/services';

/** GET /api/catalog → Kategorien, Artikel, Pakete (Platzhalter-Markierungen entfernt). */
export async function GET() {
  const c = await getServices().catalog.getCatalog();
  return NextResponse.json({
    categories: c.categories,
    items: c.items.map((i) => ({ ...i, short: val(i.short), price: val(i.price), stock: val(i.stock), depositCents: i.depositCents === undefined ? null : val(i.depositCents) })),
    packages: c.packages.map((p) => ({ ...p, price: val(p.price) })),
  });
}
