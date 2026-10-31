'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';
import { home, services, shopHref } from '@c-event/content';
import { Media } from '@/components/Media';
import { TicketLink } from '@/components/ui/Ticket';

/**
 * Leistungen als Bildstreifen nebeneinander. Desktop: der aktive Streifen ist breit und zeigt Text + Ticket,
 * die anderen nur Nummer und Titel; echte Mausbewegung oder Fokus klappt einen Streifen auf (nicht das Scrollen),
 * und er bleibt offen, bis ein anderer dran ist. Handy: untereinander, alle offen.
 */
export function ServiceStrips() {
  const [active, setActive] = useState(0);
  const timer = useRef(0);
  const pick = (i: number) => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setActive(i), 90);
  };
  return (
    <div className="strips" onPointerLeave={() => window.clearTimeout(timer.current)}>
      {services.map((sv, i) => (
        <article
          key={sv.slug}
          className={`strip${active === i ? ' is-active' : ''}`}
          onPointerMove={(e) => e.pointerType === 'mouse' && (e.movementX || e.movementY) && active !== i && pick(i)}
          onFocus={() => setActive(i)}
        >
          <div className="strip__img">
            <Media id={sv.hero} sizes="(min-width: 900px) 60vw, 100vw" />
          </div>
          <span className="strip__no mono">{String(i + 1).padStart(2, '0')}</span>
          <h3 className="strip__name">
            <Link href={`/leistungen/${sv.slug}`} data-label={sv.name}>
              {sv.name}
            </Link>
          </h3>
          <div className="strip__body">
            <p>{sv.line}</p>
            <div className="strip__ctas">
              <TicketLink href={shopHref(sv.shopCategory, sv.slug)} label={sv.name} size="sm">
                {home.services.toShop}
              </TicketLink>
              <Link href={`/leistungen/${sv.slug}`} className="text-link" data-label={sv.name}>
                {home.services.more} →
              </Link>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
