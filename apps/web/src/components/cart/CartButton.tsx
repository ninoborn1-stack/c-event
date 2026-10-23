'use client';

import { useEffect, useState } from 'react';
import { summarizeCart, val } from '@c-event/core';
import { catalog, shop } from '@c-event/content';
import { cart, useCart } from '@/lib/cart-store';

/** Warenkorb-Button in der Navbar: kleines Ticket mit Zähler, wackelt kurz beim Hinzufügen. */
export function CartButton() {
  const lines = useCart();
  const count = summarizeCart(lines, catalog).lines.length;
  const [bump, setBump] = useState(0);
  useEffect(() => {
    const on = () => setBump((b) => b + 1);
    window.addEventListener('cart:added', on);
    return () => window.removeEventListener('cart:added', on);
  }, []);
  const label = val(shop.cartLabel);
  return (
    <button
      key={bump}
      type="button"
      className={`cart-btn${count ? ' has-items' : ''}${bump ? ' is-bump' : ''}`}
      onClick={() => cart.open()}
      aria-label={`${label} öffnen, ${count} Positionen`}
    >
      <span className="cart-btn__main">{label}</span>
      <span className="cart-btn__stub" data-count={count}>
        {count}
      </span>
    </button>
  );
}
