'use client';

import { ui } from '@c-event/content';
import { rider, useRider } from '@/lib/rider-store';

export function AddToRider({
  kind,
  id,
  qty = 1,
  className,
}: {
  kind: 'item' | 'package';
  id: string;
  qty?: number;
  className?: string;
}) {
  const cart = useRider();
  const inCart = cart.find((l) => l.kind === kind && l.id === id);
  return (
    <button
      type="button"
      className={`add${inCart ? ' is-in' : ''} ${className ?? ''}`}
      onClick={() => rider.add({ kind, id, qty })}
    >
      <span>{inCart ? `${ui.rider.added} · ${inCart.qty}` : ui.rider.add}</span>
      <b aria-hidden="true">+</b>
    </button>
  );
}
