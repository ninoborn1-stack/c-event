'use client';

import Link from 'next/link';
import { useState } from 'react';
import { formatEuro, summarizeCart } from '@c-event/core';
import { catalog, ui } from '@c-event/content';
import { useRider } from '@/lib/rider-store';
import { useSite } from '@/lib/site-context';
import { ItemCard } from './ItemCard';

export function Configurator() {
  const { settings } = useSite();
  const showPrices = settings.showPrices;
  const [cat, setCat] = useState<string>('alle');
  const cart = useRider();
  const summary = summarizeCart(cart, catalog);
  const items = cat === 'alle' ? catalog.items : catalog.items.filter((i) => i.category === cat);

  return (
    <div className="conf">
      <div className="conf__main">
        <div className="chips" role="tablist" aria-label="Kategorien">
          {[{ id: 'alle', label: 'Alles' }, ...catalog.categories].map((c) => {
            const n = c.id === 'alle' ? catalog.items.length : catalog.items.filter((i) => i.category === c.id).length;
            return (
              <button key={c.id} type="button" role="tab" aria-selected={cat === c.id} className={`chip${cat === c.id ? ' is-on' : ''}`} onClick={() => setCat(c.id)}>
                {c.label}
                <sup>{n}</sup>
              </button>
            );
          })}
        </div>
        <div className="items items--conf" key={cat}>
          {items.map((i) => (
            <ItemCard key={i.id} item={i} />
          ))}
        </div>
      </div>
      <aside className="conf__side" aria-label={ui.rider.label}>
        <div className="conf__ticket">
          <span className="micro">Admit one · {ui.rider.label}</span>
          <strong className="conf__count">{summary.count}</strong>
          <span>Positionen im Rider</span>
          {showPrices && summary.lines.length > 0 && (
            <dl>
              <div>
                <dt>{ui.rider.estimate}</dt>
                <dd>{formatEuro(summary.subtotalCents)}</dd>
              </div>
              {summary.depositCents > 0 && (
                <div>
                  <dt>{ui.rider.deposit}</dt>
                  <dd>{formatEuro(summary.depositCents)}</dd>
                </div>
              )}
              {summary.hasOnRequest && <p>{ui.rider.plusOnRequest}</p>}
            </dl>
          )}
          {summary.lines.length > 0 ? (
            <>
              <button type="button" className="link-btn" onClick={() => window.dispatchEvent(new Event('rider:open'))}>
                Rider ansehen & Mengen anpassen
              </button>
              <Link href="/anfrage?kategorie=konfigurator" className="btn btn--gold btn--full" data-label="Booking">
                <span className="btn__text">{ui.rider.send}</span>
                <span className="btn__arrow">→</span>
              </Link>
            </>
          ) : (
            <p className="muted">{ui.rider.empty}</p>
          )}
          <small className="muted">Unverbindlich. Kein Checkout, keine Zahlung. Das Angebot macht Celia persönlich.</small>
        </div>
      </aside>
    </div>
  );
}
