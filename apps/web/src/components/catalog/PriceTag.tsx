'use client';

import { formatEuro, type Price } from '@c-event/core';
import { ui } from '@c-event/content';
import { useSite } from '@/lib/site-context';

export function priceLabel(p: Price, showPrices: boolean): string {
  if (!showPrices) return p.unit === 'ab' ? ui.rider.onRequest : p.unit;
  if (p.amountCents === null) return ui.rider.onRequest;
  return p.unit === 'ab' ? `ab ${formatEuro(p.amountCents)}` : `${formatEuro(p.amountCents)} ${p.unit}`;
}

/** Preis oder „auf Anfrage“ – reagiert auf den Schalter „Preise anzeigen“ im Cockpit. */
export function PriceTag({ price, as: Tag = 'strong' }: { price: Price; as?: 'strong' | 'small' }) {
  const { settings } = useSite();
  return <Tag>{priceLabel(price, settings.showPrices)}</Tag>;
}

export function DepositTag({ cents, note }: { cents: number; note?: string }) {
  const { settings } = useSite();
  if (!settings.showPrices || cents <= 0) return null;
  return (
    <small className={note ? 'ph' : ''} data-ph-note={note}>
      {ui.rider.deposit} {formatEuro(cents)}
    </small>
  );
}
