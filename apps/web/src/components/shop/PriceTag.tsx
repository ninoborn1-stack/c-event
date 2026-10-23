'use client';

import { formatEuro, priceMode, type Price } from '@c-event/core';
import { ui } from '@c-event/content';
import { useSite } from '@/lib/site-context';

/** Preis-Text je Modus (fest / ab / auf Anfrage), global ausblendbar per Flag „Preise anzeigen“. */
export function priceLabel(p: Price, showPrices: boolean): string {
  const mode = priceMode(p);
  if (!showPrices || mode === 'request' || p.amountCents === null) return ui.cart.onRequest;
  return mode === 'from' ? `${ui.cart.from} ${formatEuro(p.amountCents)}` : `${formatEuro(p.amountCents)} ${p.unit}`;
}

export function PriceTag({ price, as: Tag = 'strong' }: { price: Price; as?: 'strong' | 'small' | 'span' }) {
  const { settings } = useSite();
  return <Tag className="price">{priceLabel(price, settings.showPrices)}</Tag>;
}

export function DepositTag({ cents, note }: { cents: number; note?: string }) {
  const { settings } = useSite();
  if (!settings.showPrices || cents <= 0) return null;
  return (
    <small className={note ? 'ph' : ''} data-ph-note={note}>
      {ui.cart.deposit} {formatEuro(cents)}
    </small>
  );
}
