'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { addDays, formatEuro, toIsoDate, type Inquiry, type PlaceholderEntry, type SentMail, type SiteSettings } from '@c-event/core';
import { brand, labelFns } from '@c-event/content';
import { MonthGrid } from '@/components/calendar/MonthCalendar';

interface State {
  mails: SentMail[];
  inquiries: Inquiry[];
  booked: string[];
  settings: SiteSettings;
  placeholders: PlaceholderEntry[];
}

const TABS = [
  { id: 'start', label: 'Übersicht' },
  { id: 'postfach', label: 'Postfach' },
  { id: 'anfragen', label: 'Anfragen' },
  { id: 'kalender', label: 'Kalender' },
  { id: 'einstellungen', label: 'Einstellungen' },
  { id: 'platzhalter', label: 'Platzhalter' },
] as const;
type Tab = (typeof TABS)[number]['id'];

export function Cockpit({ slogans }: { slogans: string[] }) {
  const router = useRouter();
  const [state, setState] = useState<State | null>(null);
  const [tab, setTab] = useState<Tab>('start');
  const [mailId, setMailId] = useState<string | null>(null);
  const [month, setMonth] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const [toast, setToast] = useState('');

  const load = useCallback(
    () =>
      fetch('/api/demo/state', { cache: 'no-store' })
        .then((r) => r.json() as Promise<State>)
        .then(setState),
    [],
  );

  useEffect(() => {
    const fromHash = () => {
      const h = location.hash.slice(1) as Tab;
      if (TABS.some((t) => t.id === h)) setTab(h);
    };
    fromHash();
    window.addEventListener('hashchange', fromHash);
    void load();
    const t = setInterval(() => void load(), 5000);
    return () => {
      clearInterval(t);
      window.removeEventListener('hashchange', fromHash);
    };
  }, [load]);

  const post = async (action: string, body: unknown, msg: string) => {
    await fetch(`/api/demo/${action}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    await load();
    router.refresh();
    setToast(msg);
    setTimeout(() => setToast(''), 2200);
  };

  const go = (t: Tab) => {
    setTab(t);
    history.replaceState(null, '', `#${t}`);
  };

  if (!state) return <p className="cockpit__loading">Cockpit lädt …</p>;
  const mail = state.mails.find((m) => m.id === mailId) ?? state.mails[0];
  const booked = new Set(state.booked);
  const today = toIsoDate(new Date());
  const groups = state.placeholders.reduce<Record<string, PlaceholderEntry[]>>((acc, p) => {
    (acc[p.group] ??= []).push(p);
    return acc;
  }, {});

  return (
    <div className="cockpit">
      <nav className="cockpit__tabs" aria-label="Cockpit">
        {TABS.map((t) => (
          <button key={t.id} type="button" className={tab === t.id ? 'is-on' : ''} onClick={() => go(t.id)}>
            {t.label}
            {t.id === 'postfach' && <sup>{state.mails.length}</sup>}
            {t.id === 'anfragen' && <sup>{state.inquiries.length}</sup>}
            {t.id === 'platzhalter' && <sup>{state.placeholders.length}</sup>}
          </button>
        ))}
      </nav>

      {tab === 'start' && (
        <div className="cockpit__panel">
          <div className="kpis">
            <div>
              <b>{state.inquiries.length}</b>
              <span>Anfragen</span>
            </div>
            <div>
              <b>{state.mails.length}</b>
              <span>Mails im Postfach</span>
            </div>
            <div>
              <b>{state.booked.filter((d) => d >= today).length}</b>
              <span>belegte Tage</span>
            </div>
            <div>
              <b>{state.placeholders.length}</b>
              <span>offene Platzhalter</span>
            </div>
          </div>
          <h2>Hauptflow testen</h2>
          <ol className="flow">
            <li>
              <Link href="/leistungen/bar-catering">Leistung ansehen</Link> (z. B. Bar-Catering)
            </li>
            <li>
              Artikel oder Paket „In den Rider“ legen, oder im <Link href="/konfigurator">Konfigurator</Link>
            </li>
            <li>„Anfrage senden“ → Kategorie ist vorausgewählt, freien Tag im Kalender klicken</li>
            <li>Formular abschicken → Danke-Seite mit Zusammenfassung</li>
            <li>
              Hier im <button type="button" className="link-btn" onClick={() => go('postfach')}>Postfach</button> erscheinen beide Mails, unter{' '}
              <button type="button" className="link-btn" onClick={() => go('anfragen')}>Anfragen</button> die Anfrage
            </li>
          </ol>
          <div className="cockpit__row">
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => {
                try {
                  sessionStorage.removeItem('cev-intro-seen');
                } catch {
                  /* egal */
                }
                router.push('/');
              }}
            >
              <span className="btn__text">Intro erneut abspielen</span>
            </button>
            <button
              type="button"
              className="btn btn--signal"
              onClick={() => {
                if (confirm('Alle Demo-Daten (Anfragen, Mails, Kalender, Einstellungen) zurücksetzen?')) {
                  try {
                    localStorage.removeItem('cev-rider');
                  } catch {
                    /* egal */
                  }
                  void post('reset', {}, 'Demo-Daten zurückgesetzt');
                }
              }}
            >
              <span className="btn__text">Demo-Daten zurücksetzen</span>
            </button>
          </div>
        </div>
      )}

      {tab === 'postfach' && (
        <div className="cockpit__panel mailbox">
          {state.mails.length === 0 ? (
            <p className="muted">Noch keine Mails. Schick eine Anfrage über das Formular, dann landen hier die Bestätigung an den Kunden und die Benachrichtigung an {brand.name}.</p>
          ) : (
            <>
              <ul className="mailbox__list">
                {state.mails.map((m) => (
                  <li key={m.id}>
                    <button type="button" className={mail?.id === m.id ? 'is-on' : ''} onClick={() => setMailId(m.id)}>
                      <span className={`tag tag--${m.kind}`}>{m.kind === 'kunde-bestaetigung' ? 'An Kunde' : 'An Agentur'}</span>
                      <strong>{m.subject}</strong>
                      <small>
                        an {m.to} · {new Date(m.sentAt).toLocaleString('de-DE')}
                      </small>
                    </button>
                  </li>
                ))}
              </ul>
              {mail && (
                <div className="mailbox__view">
                  <dl>
                    <div>
                      <dt>Von</dt>
                      <dd>{mail.from}</dd>
                    </div>
                    <div>
                      <dt>An</dt>
                      <dd>{mail.to}</dd>
                    </div>
                    {mail.replyTo && (
                      <div>
                        <dt>Antwort an</dt>
                        <dd>{mail.replyTo}</dd>
                      </div>
                    )}
                    <div>
                      <dt>Betreff</dt>
                      <dd>{mail.subject}</dd>
                    </div>
                    <div>
                      <dt>Versand</dt>
                      <dd>Demo-Postfach (nicht verschickt)</dd>
                    </div>
                  </dl>
                  <iframe title={mail.subject} srcDoc={mail.html} sandbox="" />
                </div>
              )}
            </>
          )}
        </div>
      )}

      {tab === 'anfragen' && (
        <div className="cockpit__panel">
          {state.inquiries.length === 0 ? (
            <p className="muted">Noch keine Anfragen.</p>
          ) : (
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Eingang</th>
                    <th>Kategorie</th>
                    <th>Name</th>
                    <th>Datum</th>
                    <th>Gäste</th>
                    <th>Rider</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {state.inquiries.map((i) => (
                    <tr key={i.id}>
                      <td>{new Date(i.createdAt).toLocaleString('de-DE')}</td>
                      <td>{labelFns.category(i.category)}</td>
                      <td>
                        <strong>{i.name}</strong>
                        <br />
                        <a href={`mailto:${i.email}`}>{i.email}</a>
                        {i.company && (
                          <>
                            <br />
                            {i.company}
                          </>
                        )}
                      </td>
                      <td>{i.date ?? (i.dateFlexible ? 'flexibel' : '–')}</td>
                      <td>{i.guests ?? '–'}</td>
                      <td>
                        {i.cart.length ? (
                          <>
                            {i.cart.length} Pos. · {formatEuro(i.cartSubtotalCents)}
                            {i.cartHasOnRequest ? ' +' : ''}
                          </>
                        ) : (
                          '–'
                        )}
                      </td>
                      <td>
                        <span className="tag">{i.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {tab === 'kalender' && (
        <div className="cockpit__panel cockpit__cal">
          <p className="muted">
            Klick auf einen Tag belegt ihn bzw. gibt ihn frei. Öffentlich sichtbar ist nur Belegt/Frei. Live kommt das aus Celias Kalender (Tool noch offen).
          </p>
          <MonthGrid
            month={month}
            statusOf={(iso) => (iso < today ? 'past' : booked.has(iso) ? 'booked' : 'free')}
            onSelect={(iso) => void post('toggle-day', { date: iso }, `${iso} umgeschaltet`)}
            selectable={(s) => s !== 'past'}
            onMonth={(d) => setMonth(new Date(month.getFullYear(), month.getMonth() + d, 1))}
          />
          <p className="muted small">
            Nächste belegte Tage:{' '}
            {state.booked
              .filter((d) => d >= today && d <= toIsoDate(addDays(new Date(), 60)))
              .slice(0, 12)
              .join(', ') || '–'}
          </p>
        </div>
      )}

      {tab === 'einstellungen' && (
        <div className="cockpit__panel settings">
          <fieldset>
            <legend>Slogan-Variante (Hero)</legend>
            {slogans.map((s, i) => (
              <label key={i} className={`radio${state.settings.sloganVariant === i ? ' is-on' : ''}`}>
                <input
                  type="radio"
                  name="slogan"
                  checked={state.settings.sloganVariant === i}
                  onChange={() => void post('settings', { sloganVariant: i }, `Slogan ${i + 1} aktiv`)}
                />
                <b>{i + 1}</b> {s}
              </label>
            ))}
          </fieldset>
          <fieldset>
            <legend>Feature-Flags</legend>
            {(
              [
                ['showPrices', 'Preise im Konfigurator anzeigen', 'Aus = überall „auf Anfrage“'],
                ['bunkerWestCode', 'Bunker-West-Willkommens-Code zeigen', 'ca. 10 %, noch mit Albi abstimmen'],
                ['showPlaceholders', 'Platzhalter auf der Seite markieren', 'gestrichelter Rahmen + Badge'],
              ] as const
            ).map(([k, label, hint]) => (
              <label key={k} className="toggle">
                <input type="checkbox" checked={state.settings[k]} onChange={(e) => void post('settings', { [k]: e.target.checked }, `${label}: ${e.target.checked ? 'an' : 'aus'}`)} />
                <span className="toggle__ui" aria-hidden="true" />
                <span>
                  {label}
                  <small>{hint}</small>
                </span>
              </label>
            ))}
          </fieldset>
        </div>
      )}

      {tab === 'platzhalter' && (
        <div className="cockpit__panel">
          <p className="muted">
            Automatisch aus den Inhalten gesammelt (alles, was mit <code>ph()</code> markiert ist). Dieselbe Liste steht in <code>docs/PLATZHALTER.md</code>.
          </p>
          {Object.entries(groups).map(([g, list]) => (
            <details key={g} className="phgroup" open={g !== 'Medien'}>
              <summary>
                {g} <sup>{list.length}</sup>
              </summary>
              <ul>
                {list.map((p) => (
                  <li key={p.path}>
                    <strong>{p.note}</strong>
                    <code>{p.path}</code>
                    <small>Aktuell: {p.preview}</small>
                  </li>
                ))}
              </ul>
            </details>
          ))}
        </div>
      )}

      {toast && (
        <div className="toast" role="status">
          {toast}
        </div>
      )}
    </div>
  );
}
