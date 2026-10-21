'use client';

import Link from 'next/link';
import { addDays, toIsoDate } from '@c-event/core';
import { useAvailability } from './useAvailability';

const WD = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];

/** Die nächsten Wochen als Laufband. Freier Tag → Anfrage mit Datum. */
export function DateStrip({ days: count = 35 }: { days?: number }) {
  const today = new Date();
  const from = toIsoDate(addDays(today, 1));
  const to = toIsoDate(addDays(today, count));
  const { days, error } = useAvailability(from, to);
  if (error) return <p className="muted">Kalender gerade nicht erreichbar.</p>;
  return (
    <div className="datestrip" data-lenis-prevent>
      <ol>
        {(days ?? Array.from({ length: count }, (_, i) => ({ date: toIsoDate(addDays(today, i + 1)), status: 'loading' as const }))).map((d) => {
          const dt = new Date(`${d.date}T12:00:00`);
          const label = `${WD[dt.getDay()]} ${dt.getDate()}.${dt.getMonth() + 1}.`;
          const inner = (
            <>
              <small>{WD[dt.getDay()]}</small>
              <b>{dt.getDate()}</b>
              <small>{dt.toLocaleDateString('de-DE', { month: 'short' })}</small>
            </>
          );
          return (
            <li key={d.date} className={`day day--${d.status}`}>
              {d.status === 'free' ? (
                <Link href={`/anfrage?datum=${d.date}`} aria-label={`${label} frei – anfragen`} data-label={label}>
                  {inner}
                </Link>
              ) : (
                <span aria-label={`${label} ${d.status === 'booked' ? 'belegt' : ''}`}>{inner}</span>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
