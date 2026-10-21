'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { formatEuro, type Inquiry } from '@c-event/core';
import { inquiryPage, labelFns } from '@c-event/content';
import { Btn } from '@/components/Btn';
import { api } from '@/lib/api';

export function ThanksView({ isDemo }: { isDemo: boolean }) {
  const id = useSearchParams().get('id');
  const [inq, setInq] = useState<Inquiry | null | undefined>(undefined);

  useEffect(() => {
    let alive = true;
    (id ? api.getInquiry(id) : Promise.resolve(null)).then(
      (r) => alive && setInq(r),
      () => alive && setInq(null),
    );
    return () => {
      alive = false;
    };
  }, [id]);

  if (inq === undefined) return <p className="muted">Lädt …</p>;
  if (inq === null)
    return (
      <>
        <h1 className="page-head__title">Anfrage nicht gefunden.</h1>
        <Btn href="/anfrage" variant="gold" label="Booking">
          Zum Formular
        </Btn>
      </>
    );

  const rows: [string, string][] = [
    ['Kategorie', labelFns.category(inq.category)],
    ['Datum', inq.date ? new Date(`${inq.date}T12:00:00`).toLocaleDateString('de-DE', { dateStyle: 'full' }) : inq.dateFlexible ? 'flexibel' : 'noch offen'],
    ['Ort', inq.location ?? '–'],
    ['Gäste', inq.guests ? String(inq.guests) : '–'],
    ['Anlass', labelFns.occasion(inq.occasion)],
    ['Budget', labelFns.budget(inq.budget)],
  ];
  return (
    <>
      <span className="micro">Anfrage-Nr. {inq.id}</span>
      <h1 className="page-head__title">{inquiryPage.thanks.h1}</h1>
      <p className="page-head__lead">{inquiryPage.thanks.lead}</p>
      <div className="thanks__ticket">
        <dl>
          {rows.map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
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
        {isDemo && (
          <Link href="/demo#postfach" className="btn btn--ghost" data-label="Cockpit">
            <span className="btn__text">Demo: Mails im Postfach ansehen</span>
            <span className="btn__arrow">→</span>
          </Link>
        )}
      </div>
    </>
  );
}
