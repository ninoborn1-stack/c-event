import Link from 'next/link';
import { home, services, shopHref } from '@c-event/content';
import { Media } from '@/components/Media';
import { TicketLink } from '@/components/ui/Ticket';

/**
 * Leistungen als Bildstreifen nebeneinander. Desktop: der aktive Streifen ist breit und zeigt Text + Ticket,
 * die anderen nur Nummer und Titel; Hover oder Fokus klappt einen Streifen auf. Handy: untereinander, alle offen.
 */
export function ServiceStrips() {
  return (
    <div className="strips">
      {services.map((sv, i) => (
        <article key={sv.slug} className="strip">
          <div className="strip__img">
            <Media id={sv.hero} sizes="(min-width: 900px) 40vw, 100vw" />
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
