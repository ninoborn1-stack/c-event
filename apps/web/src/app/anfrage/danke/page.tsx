import Link from 'next/link';
import { notFound } from 'next/navigation';
import { formatEuro } from '@c-event/core';
import { inquiryPage, labelFns } from '@c-event/content';
import { Btn } from '@/components/Btn';
import { Split } from '@/components/Split';
import { IS_DEMO } from '@/lib/env';
import { getServices } from '@/server/services';

export const metadata = { title: 'Danke', robots: { index: false } };

export default async function ThanksPage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const { id } = await searchParams;
  const inq = id ? await getServices().inquiries.get(id) : null;
  if (!inq) notFound();
  const rows: [string, string][] = [
    ['Kategorie', labelFns.category(inq.category)],
    ['Datum', inq.date ? new Date(`${inq.date}T12:00:00`).toLocaleDateString('de-DE', { dateStyle: 'full' }) : inq.dateFlexible ? 'flexibel' : 'noch offen'],
    ['Ort', inq.location ?? '–'],
    ['Gäste', inq.guests ? String(inq.guests) : '–'],
    ['Anlass', labelFns.occasion(inq.occasion)],
    ['Budget', labelFns.budget(inq.budget)],
  ];
  return (
    <section className="thanks">
      <div className="thanks__stamp" aria-hidden="true">
        Admit
        <br />
        one
      </div>
      <span className="micro">Anfrage-Nr. {inq.id}</span>
      <Split as="h1" className="page-head__title" text={inquiryPage.thanks.h1} />
      <p className="page-head__lead">{inquiryPage.thanks.lead}</p>
      <div className="thanks__ticket">
        <dl>
          {rows.map(([k, val]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{val}</dd>
            </div>
          ))}
        </dl>
        {inq.cart.length > 0 && (
          <ul>
            {inq.cart.map((l, i) => (
              <li key={i}>
                <span>
                  {l.qty}× {l.name}
                </span>
                <b>{l.totalCents === null ? 'auf Anfrage' : formatEuro(l.totalCents)}</b>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="thanks__ctas">
        <Btn href="/" variant="gold" label="Main Stage">
          Zur Startseite
        </Btn>
        {IS_DEMO && (
          <Link href="/demo#postfach" className="btn btn--ghost" data-label="Cockpit">
            <span className="btn__text">Demo: Mails im Postfach ansehen</span>
            <span className="btn__arrow">→</span>
          </Link>
        )}
      </div>
    </section>
  );
}
