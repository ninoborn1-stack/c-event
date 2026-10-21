'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { formatEuro, summarizeCart } from '@c-event/core';
import { catalog, getMedia, ui } from '@c-event/content';
import { rider, useRider } from '@/lib/rider-store';
import { useSite } from '@/lib/site-context';
import { getLenis } from '@/lib/motion';
import { asset } from '@/lib/env';

/** Seitliche Rider-Ansicht, erreichbar von überall. Öffnet sich per Event „rider:open“. */
export function RiderDrawer() {
  const cart = useRider();
  const { settings } = useSite();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [pulse, setPulse] = useState(0);
  const summary = summarizeCart(cart, catalog);

  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    const onOpen = () => setOpen(true);
    const onAdded = () => setPulse((p) => p + 1);
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('rider:open', onOpen);
    window.addEventListener('rider:added', onAdded);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('rider:open', onOpen);
      window.removeEventListener('rider:added', onAdded);
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  useEffect(() => {
    const l = getLenis();
    if (open) l?.stop();
    else l?.start();
  }, [open]);

  return (
    <>
      {cart.length > 0 && pathname !== '/anfrage' && (
        <button key={pulse} type="button" className="rider-fab" onClick={() => setOpen(true)} aria-label={`${ui.rider.label} öffnen`}>
          <span className="rider-fab__ticket">
            <small>{ui.rider.label}</small>
            <b>{summary.count}</b>
          </span>
        </button>
      )}
      <div className={`drawer${open ? ' is-open' : ''}`} aria-hidden={!open}>
        <button type="button" className="drawer__scrim" tabIndex={-1} aria-label={ui.nav.close} onClick={() => setOpen(false)} />
        <aside className="drawer__panel" role="dialog" aria-label={ui.rider.label} data-lenis-prevent>
          <header className="drawer__head">
            <span className="micro">Admit one · {ui.rider.label}</span>
            <button type="button" className="drawer__close" onClick={() => setOpen(false)}>
              {ui.nav.close} ×
            </button>
          </header>
          {summary.lines.length === 0 ? (
            <div className="drawer__empty">
              <p>{ui.rider.empty}</p>
              <Link href="/konfigurator" className="btn btn--gold" data-label="Konfigurator">
                <span className="btn__text">Zum Konfigurator</span>
                <span className="btn__arrow">→</span>
              </Link>
            </div>
          ) : (
            <>
              <ul className="drawer__lines">
                {summary.lines.map((l) => (
                  <li key={`${l.kind}-${l.id}`}>
                    <div className="drawer__thumb">
                      <Image src={asset(getMedia(l.media).poster ?? getMedia(l.media).src)} alt="" fill sizes="80px" />
                    </div>
                    <div>
                      <strong>{l.name}</strong>
                      <small>
                        {settings.showPrices
                          ? l.unitCents === null
                            ? ui.rider.onRequest
                            : `${formatEuro(l.unitCents)} ${l.unit}`
                          : l.unit}
                      </small>
                      <div className="qty">
                        <button type="button" onClick={() => rider.set(l.kind, l.id, l.qty - 1)} aria-label="weniger">
                          −
                        </button>
                        <input
                          aria-label="Menge"
                          inputMode="numeric"
                          value={l.qty}
                          onChange={(e) => rider.set(l.kind, l.id, Number(e.target.value.replace(/\D/g, '')) || 1)}
                        />
                        <button type="button" onClick={() => rider.set(l.kind, l.id, l.qty + 1)} aria-label="mehr">
                          +
                        </button>
                      </div>
                    </div>
                    <button type="button" className="drawer__remove" onClick={() => rider.remove(l.kind, l.id)} aria-label={`${l.name} entfernen`}>
                      ×
                    </button>
                  </li>
                ))}
              </ul>
              <footer className="drawer__foot">
                {settings.showPrices && (
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
                <Link href="/anfrage?kategorie=konfigurator" className="btn btn--gold btn--full" data-label="Booking">
                  <span className="btn__text">{ui.rider.send}</span>
                  <span className="btn__arrow">→</span>
                </Link>
                <button type="button" className="link-btn" onClick={() => rider.clear()}>
                  {ui.rider.clear}
                </button>
              </footer>
            </>
          )}
        </aside>
      </div>
    </>
  );
}
