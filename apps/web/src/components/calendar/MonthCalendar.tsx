'use client';

import { useState } from 'react';
import { addDays, toIsoDate, type DayStatus } from '@c-event/core';
import { useAvailability } from './useAvailability';

const WD = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

function monthGrid(first: Date): Date[] {
  const start = addDays(first, -((first.getDay() + 6) % 7));
  return Array.from({ length: 42 }, (_, i) => addDays(start, i));
}

/** Monatsansicht. Darstellung only – Daten kommen über `statusOf`. */
export function MonthGrid({
  month,
  statusOf,
  selected,
  onSelect,
  selectable,
  onMonth,
}: {
  month: Date;
  statusOf: (iso: string) => DayStatus | 'loading';
  selected?: string;
  onSelect: (iso: string) => void;
  selectable: (status: DayStatus | 'loading') => boolean;
  onMonth: (delta: number) => void;
}) {
  const days = monthGrid(month);
  const title = month.toLocaleDateString('de-DE', { month: 'long', year: 'numeric' });
  const thisMonth = new Date();
  const canPrev = month.getFullYear() > thisMonth.getFullYear() || month.getMonth() > thisMonth.getMonth();
  return (
    <div className="cal">
      <div className="cal__head">
        <button type="button" onClick={() => onMonth(-1)} disabled={!canPrev} aria-label="Vorheriger Monat">
          ←
        </button>
        <strong aria-live="polite">{title}</strong>
        <button type="button" onClick={() => onMonth(1)} aria-label="Nächster Monat">
          →
        </button>
      </div>
      <div className="cal__grid" role="grid">
        {WD.map((w) => (
          <span key={w} className="cal__wd" role="columnheader">
            {w}
          </span>
        ))}
        {days.map((d) => {
          const iso = toIsoDate(d);
          const inMonth = d.getMonth() === month.getMonth();
          const st = statusOf(iso);
          const can = inMonth && selectable(st);
          return (
            <button
              key={iso}
              type="button"
              role="gridcell"
              className={`cal__day cal__day--${st}${inMonth ? '' : ' is-out'}${selected === iso ? ' is-sel' : ''}`}
              disabled={!can}
              aria-pressed={selected === iso}
              aria-label={`${d.toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' })}: ${st === 'booked' ? 'belegt' : st === 'free' ? 'frei' : st === 'past' ? 'vergangen' : ''}`}
              onClick={() => onSelect(iso)}
            >
              {d.getDate()}
            </button>
          );
        })}
      </div>
      <div className="cal__legend micro">
        <span className="lg lg--free">Frei</span>
        <span className="lg lg--booked">Belegt</span>
      </div>
    </div>
  );
}

/** Öffentlicher Kalender fürs Formular: nur freie Tage sind klickbar. */
export function PickCalendar({ value, onChange }: { value?: string; onChange: (iso: string) => void }) {
  const init = value ? new Date(`${value}T12:00:00`) : new Date();
  const [month, setMonth] = useState(new Date(init.getFullYear(), init.getMonth(), 1));
  const from = toIsoDate(addDays(month, -7));
  const to = toIsoDate(addDays(month, 42));
  const { days, error } = useAvailability(from, to);
  const map = new Map(days?.map((d) => [d.date, d.status]));
  if (error) return <p className="muted">Kalender gerade nicht erreichbar – trag das Datum einfach unten ein.</p>;
  return (
    <MonthGrid
      month={month}
      statusOf={(iso) => (days ? (map.get(iso) ?? 'free') : 'loading')}
      selected={value}
      onSelect={onChange}
      selectable={(s) => s === 'free'}
      onMonth={(d) => setMonth(new Date(month.getFullYear(), month.getMonth() + d, 1))}
    />
  );
}
