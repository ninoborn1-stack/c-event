'use client';

import { ui } from '@c-event/content';
import { cart, useCart } from '@/lib/cart-store';

/** „Zum Event hinzufügen“ – kleiner Ticket-Button, zeigt die Menge, sobald drin. */
export function AddToCart({ kind, id, qty = 1, size = 'sm' }: { kind: 'item' | 'package'; id: string; qty?: number; size?: 'sm' | 'md' }) {
  const lines = useCart();
  const inCart = lines.find((l) => l.kind === kind && l.id === id);
  return (
    <button
      type="button"
      className={`tk tk--${inCart ? 'cream' : 'red'} tk--${size} add-to-cart`}
      onClick={() => cart.add({ kind, id, qty })}
      aria-label={inCart ? `${ui.cart.added}: ${inCart.qty} – eins mehr` : ui.cart.add}
    >
      <span className="tk__main">{inCart ? `${ui.cart.added} · ${inCart.qty}` : ui.cart.add}</span>
      <span className="tk__stub" aria-hidden="true">
        +
      </span>
    </button>
  );
}
