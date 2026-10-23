'use client';

import { useSyncExternalStore } from 'react';
import { addToCart, cartSchema, removeFromCart, setNote, setQty, type Cart, type CartLine } from '@c-event/core';
import { catalog } from '@c-event/content';

/** Der Warenkorb lebt lokal im Browser und übersteht Seitenwechsel. Logik kommt aus @c-event/core. */
const KEY = 'cev-rider';
const EMPTY: Cart = [];
let cache: Cart | null = null;
const listeners = new Set<() => void>();

function load(): Cart {
  if (cache) return cache;
  try {
    const parsed = cartSchema.safeParse(JSON.parse(localStorage.getItem(KEY) ?? '[]'));
    cache = parsed.success ? parsed.data : [];
  } catch {
    cache = [];
  }
  return cache;
}

function save(next: Cart) {
  cache = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* privater Modus o. ä.: Warenkorb gilt dann nur für diese Seite */
  }
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      cache = null;
      l();
    }
  };
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(l);
    window.removeEventListener('storage', onStorage);
  };
}

export const cart = {
  add: (line: CartLine) => {
    save(addToCart(load(), line, catalog));
    window.dispatchEvent(new CustomEvent('cart:added', { detail: line }));
  },
  set: (kind: CartLine['kind'], id: string, qty: number) => save(setQty(load(), kind, id, qty, catalog)),
  note: (kind: CartLine['kind'], id: string, note: string) => save(setNote(load(), kind, id, note)),
  remove: (kind: CartLine['kind'], id: string) => save(removeFromCart(load(), kind, id)),
  clear: () => save([]),
  get: load,
  open: () => window.dispatchEvent(new Event('cart:open')),
};

export function useCart(): Cart {
  return useSyncExternalStore(subscribe, load, () => EMPTY);
}
