'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { formatEuro, summarizeCart } from '@c-event/core';
import { CART_PATH, catalog, getMedia, productHref, shop, ui } from '@c-event/content';
import { val } from '@c-event/core';
import { cart, useCart } from '@/lib/cart-store';
import { asset } from '@/lib/env';
import { useSite } from '@/lib/site-context';
import { priceLabel } from '@/components/shop/PriceTag';
import { TicketLink } from '@/components/ui/Ticket';

/**
 * Der Warenkorb als Event-Ticket: Kopf (Admit one), Positionen mit Menge/Notiz/Entfernen,
 * Abriss-Kante, Zusammenfassung und Ticket-CTA. Wird im Drawer und auf /warenkorb genutzt.
 */
export function CartTicket({ variant }: { variant: 'drawer' | 'page' }) {
  const lines = useCart();
  const { settings } = useSite();
  const s = summarizeCart(lines, catalog);
  const [openNote, setOpenNote] = useState<string | null>(null);
  const label = val(shop.cartLabel);

  return (
    <div className={`ticket ticket--${variant}`}>
      <header className="ticket__head">
        <span className="ticket__admit">{ui.cart.admit}</span>
        <strong className="ticket__title">{label}</strong>
        <span className="ticket__count">
          {s.count} {ui.cart.positions}
        </span>
      </header>

      {s.lines.length === 0 ? (
        <div className="ticket__empty">
          <p>{ui.cart.empty}</p>
          <TicketLink href={shop.path} label={val(shop.label)}>
            {val(shop.label)}
          </TicketLink>
        </div>
      ) : (
        <>
          <ul className="ticket__lines">
            {s.lines.map((l) => {
              const key = `${l.kind}-${l.id}`;
              const m = getMedia(l.media);
              return (
                <li key={key} className="tline">
                  <Link href={productHref(l.id)} className="tline__img" tabIndex={-1} aria-hidden="true">
                    <Image src={asset(m.poster ?? m.src)} alt="" fill sizes="96px" />
                  </Link>
                  <div className="tline__body">
                    <Link href={productHref(l.id)} className="tline__name">
                      {l.name}
                    </Link>
                    <span className="tline__price">
                      {priceLabel({ amountCents: l.unitCents, unit: l.unit, mode: l.mode }, settings.showPrices)}
                    </span>
                    <div className="tline__row">
                      <div className="qty" role="group" aria-label={`Menge ${l.name}`}>
                        <button type="button" onClick={() => cart.set(l.kind, l.id, l.qty - 1)} aria-label="weniger">
                          −
                        </button>
                        <input
                          aria-label="Menge"
                          inputMode="numeric"
                          value={l.qty}
                          onChange={(e) => cart.set(l.kind, l.id, Number(e.target.value.replace(/\D/g, '')) || 1)}
                        />
                        <button type="button" onClick={() => cart.set(l.kind, l.id, l.qty + 1)} aria-label="mehr">
                          +
                        </button>
                      </div>
                      <button type="button" className="tline__link" onClick={() => setOpenNote(openNote === key ? null : key)} aria-expanded={openNote === key}>
                        {ui.cart.note}
                        {l.note ? ' ✓' : ''}
                      </button>
                      <button type="button" className="tline__link" onClick={() => cart.remove(l.kind, l.id)}>
                        {ui.cart.remove}
                      </button>
                    </div>
                    {(openNote === key || (variant === 'page' && l.note)) && (
                      <textarea
                        className="tline__note"
                        rows={2}
                        maxLength={300}
                        placeholder={ui.cart.notePlaceholder}
                        defaultValue={l.note ?? ''}
                        aria-label={`${ui.cart.note} zu ${l.name}`}
                        onBlur={(e) => cart.note(l.kind, l.id, e.target.value)}
                      />
                    )}
                  </div>
                  {settings.showPrices && l.totalCents !== null && <b className="tline__total">{formatEuro(l.totalCents)}</b>}
                </li>
              );
            })}
          </ul>
          <div className="ticket__tear" aria-hidden="true" />
          <footer className="ticket__foot">
            <span className="ticket__admit">{ui.cart.summary}</span>
            {settings.showPrices && (
              <dl className="ticket__sum">
                <div>
                  <dt>{ui.cart.estimate}</dt>
                  <dd>{formatEuro(s.subtotalCents)}</dd>
                </div>
                {s.depositCents > 0 && (
                  <div>
                    <dt>{ui.cart.deposit}</dt>
                    <dd>{formatEuro(s.depositCents)}</dd>
                  </div>
                )}
                {s.hasOnRequest && <p>{ui.cart.plusOnRequest}</p>}
              </dl>
            )}
            <TicketLink href="/anfrage?kategorie=konfigurator" label="Anfrage" size="lg" full>
              {ui.cart.send}
            </TicketLink>
            <div className="ticket__links">
              {variant === 'drawer' && <Link href={CART_PATH}>{ui.cart.toPage}</Link>}
              <button type="button" onClick={() => cart.clear()}>
                {ui.cart.clear}
              </button>
            </div>
            <small className="muted">{ui.cart.noPayment}</small>
          </footer>
        </>
      )}
    </div>
  );
}
