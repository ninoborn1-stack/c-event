import { z } from 'zod';
import { priceMode, type Catalog, type CatalogItem, type CatalogPackage, type PriceMode } from './domain';
import { val } from './placeholder';

/** Der Anfrage-Warenkorb („Rider“): nur Referenzen und Mengen, Preise kommen immer aus dem Katalog. */
export const cartLineSchema = z.object({
  kind: z.enum(['item', 'package']),
  id: z.string().min(1).max(80),
  qty: z.number().int().min(1).max(999),
  /** Notiz pro Position, z. B. „Bar bitte in Weiß“ */
  note: z.string().trim().max(300).optional(),
});
export const cartSchema = z.array(cartLineSchema).max(60);

export type CartLine = z.infer<typeof cartLineSchema>;
export type Cart = CartLine[];

export function addToCart(cart: Cart, line: CartLine, catalog?: Catalog): Cart {
  const existing = cart.find((l) => l.kind === line.kind && l.id === line.id);
  const max = catalog ? maxQty(catalog, line) : 999;
  if (existing) {
    return cart.map((l) => (l === existing ? { ...l, qty: Math.min(max, l.qty + line.qty) } : l));
  }
  return [...cart, { ...line, qty: Math.min(max, line.qty) }];
}

export function setQty(cart: Cart, kind: CartLine['kind'], id: string, qty: number, catalog?: Catalog): Cart {
  if (qty <= 0) return removeFromCart(cart, kind, id);
  const max = catalog ? maxQty(catalog, { kind, id, qty }) : 999;
  return cart.map((l) => (l.kind === kind && l.id === id ? { ...l, qty: Math.min(max, Math.round(qty)) } : l));
}

export function setNote(cart: Cart, kind: CartLine['kind'], id: string, note: string): Cart {
  const n = note.slice(0, 300);
  return cart.map((l) => (l.kind === kind && l.id === id ? { ...l, note: n || undefined } : l));
}

export function removeFromCart(cart: Cart, kind: CartLine['kind'], id: string): Cart {
  return cart.filter((l) => !(l.kind === kind && l.id === id));
}

function maxQty(catalog: Catalog, line: CartLine): number {
  if (line.kind === 'package') return 5;
  const item = catalog.items.find((i) => i.id === line.id);
  return item ? Math.max(1, val(item.stock)) : 999;
}

export interface PricedLine {
  kind: CartLine['kind'];
  id: string;
  name: string;
  qty: number;
  unit: string;
  unitCents: number | null;
  totalCents: number | null;
  depositCents: number;
  media: string;
  mode: PriceMode;
  note?: string;
}

export interface CartSummary {
  lines: PricedLine[];
  /** Summe aller Positionen mit Preis. */
  subtotalCents: number;
  depositCents: number;
  /** Mindestens eine Position ist „auf Anfrage“. */
  hasOnRequest: boolean;
  count: number;
}

/** Bepreist den Warenkorb anhand des Katalogs. Unbekannte IDs werden ignoriert. */
export function summarizeCart(cart: Cart, catalog: Catalog): CartSummary {
  const lines: PricedLine[] = [];
  for (const line of cart) {
    const entry: CatalogItem | CatalogPackage | undefined =
      line.kind === 'item'
        ? catalog.items.find((i) => i.id === line.id)
        : catalog.packages.find((p) => p.id === line.id);
    if (!entry) continue;
    const price = val(entry.price);
    const deposit = 'depositCents' in entry && entry.depositCents !== undefined ? val(entry.depositCents) : 0;
    lines.push({
      kind: line.kind,
      id: line.id,
      name: entry.name,
      qty: line.qty,
      unit: price.unit,
      unitCents: price.amountCents,
      totalCents: price.amountCents === null ? null : price.amountCents * line.qty,
      depositCents: deposit * line.qty,
      media: entry.media,
      mode: priceMode(price),
      note: line.note,
    });
  }
  return {
    lines,
    subtotalCents: lines.reduce((s, l) => s + (l.totalCents ?? 0), 0),
    depositCents: lines.reduce((s, l) => s + l.depositCents, 0),
    hasOnRequest: lines.some((l) => l.totalCents === null),
    count: lines.reduce((s, l) => s + l.qty, 0),
  };
}

export function formatEuro(cents: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: cents % 100 === 0 ? 0 : 2,
  }).format(cents / 100);
}
