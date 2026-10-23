'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  formatEuro,
  HERO_TRANSITIONS,
  INQUIRY_STATUSES,
  replyTemplate,
  toIsoDate,
  type AdminUser,
  type Inquiry,
  type InquiryStatus,
  type PlaceholderEntry,
} from '@c-event/core';
import { adminUi as T, brand, labelFns } from '@c-event/content';
import { DEMO_ADMIN } from '@c-event/services-demo/browser';
import { MonthGrid } from '@/components/calendar/MonthCalendar';
import { Media } from '@/components/Media';
import { TicketButton } from '@/components/ui/Ticket';
import { api, type AdminData } from '@/lib/api';
import { mailContext } from '@/lib/mail-context';

const TABS = ['anfragen', 'mails', 'posts', 'rezensionen', 'kalender', 'demo'] as const;
type Tab = (typeof TABS)[number];

/** Admin-Dashboard: Login, Anfragen (Status, Detail, Antwort), Mails, Posts, Rezensionen, Kalender, Demo-Werkzeuge. */
export function AdminApp({ slogans }: { slogans: string[] }) {
  const [user, setUser] = useState<AdminUser | null | undefined>(undefined);
  useEffect(() => {
    api.admin.me().then(setUser, () => setUser(null));
  }, []);
  if (user === undefined) return <p className="admin__loading">…</p>;
  if (!user) return <Login onDone={setUser} />;
  return <Dashboard user={user} slogans={slogans} onLogout={() => setUser(null)} />;
}

function Login({ onDone }: { onDone: (u: AdminUser) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const u = await api.admin.login(email, password);
    if (u) onDone(u);
    else setError(true);
  };
  return (
    <form className="admin-login" onSubmit={submit}>
      <h2 className="h-m">{T.login.title}</h2>
      <label className="field">
        <span className="field__label">{T.login.email}</span>
        <input name="email" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </label>
      <label className="field">
        <span className="field__label">{T.login.password}</span>
        <input name="password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </label>
      {error && (
        <p className="field__err" role="alert">
          {T.login.error}
        </p>
      )}
      <TicketButton type="submit" full>
        {T.login.submit}
      </TicketButton>
      <p className="admin-login__hint">
        {T.login.demoHint}: <code>{DEMO_ADMIN.email}</code> / <code>{DEMO_ADMIN.password}</code>
      </p>
    </form>
  );
}

function Dashboard({ user, slogans, onLogout }: { user: AdminUser; slogans: string[]; onLogout: () => void }) {
  const router = useRouter();
  const [data, setData] = useState<AdminData | null>(null);
  const [tab, setTab] = useState<Tab>('anfragen');
  const [toast, setToast] = useState('');

  const load = useCallback(() => api.admin.data().then(setData, () => onLogout()), [onLogout]);
  useEffect(() => {
    const fromHash = () => {
      const h = location.hash.slice(1) as Tab;
      if ((TABS as readonly string[]).includes(h)) setTab(h);
    };
    fromHash();
    window.addEventListener('hashchange', fromHash);
    void load();
    const t = setInterval(() => void load(), 8000);
    return () => {
      clearInterval(t);
      window.removeEventListener('hashchange', fromHash);
    };
  }, [load]);

  const notify = (m: string) => {
    setToast(m);
    setTimeout(() => setToast(''), 2400);
  };
  const go = (t: Tab) => {
    setTab(t);
    history.replaceState(null, '', `#${t}`);
  };
  const demo = async (action: 'toggle-day' | 'settings' | 'reset', body: Record<string, unknown>, msg: string) => {
    await api.admin.demo(action, body);
    await load();
    router.refresh();
    notify(msg);
  };

  if (!data) return <p className="admin__loading">…</p>;
  const tabs = TABS.filter((t) => t !== 'demo' || data.isDemo);
  const newCount = data.inquiries.filter((i) => i.status === 'neu').length;

  return (
    <div className="admin">
      <div className="admin__bar">
        <nav className="admin__tabs" aria-label="Admin">
          {tabs.map((t) => (
            <button key={t} type="button" className={tab === t ? 'is-on' : ''} onClick={() => go(t)}>
              {T.tabs[t]}
              {t === 'anfragen' && newCount > 0 && <sup>{newCount}</sup>}
              {t === 'mails' && <sup>{data.mails.length}</sup>}
            </button>
          ))}
        </nav>
        <div className="admin__user">
          <span>{user.name}</span>
          <button
            type="button"
            className="text-link"
            onClick={async () => {
              await api.admin.logout();
              onLogout();
            }}
          >
            {T.logout}
          </button>
        </div>
      </div>

      {tab === 'anfragen' && <Inquiries list={data.inquiries} reload={load} notify={notify} />}
      {tab === 'mails' && <Mails mails={data.mails} />}
      {tab === 'posts' && <Posts data={data} />}
      {tab === 'rezensionen' && <ReviewsTab data={data} />}
      {tab === 'kalender' && <CalendarTab booked={data.booked} onToggle={(d) => demo('toggle-day', { date: d }, d)} />}
      {tab === 'demo' && data.isDemo && <DemoTab data={data} slogans={slogans} run={demo} />}

      {toast && (
        <div className="toast" role="status">
          {toast}
        </div>
      )}
    </div>
  );
}

function StatusPill({ s }: { s: InquiryStatus }) {
  return <span className={`status status--${s}`}>{T.status[s]}</span>;
}

function Inquiries({ list, reload, notify }: { list: Inquiry[]; reload: () => Promise<void>; notify: (m: string) => void }) {
  const [filter, setFilter] = useState<InquiryStatus | 'alle'>('alle');
  const [openId, setOpenId] = useState<string | null>(null);
  const shown = filter === 'alle' ? list : list.filter((i) => i.status === filter);
  const open = list.find((i) => i.id === openId);
  if (open) return <InquiryDetail inq={open} back={() => setOpenId(null)} reload={reload} notify={notify} />;
  return (
    <div className="admin__panel">
      <div className="chips">
        {(['alle', ...INQUIRY_STATUSES] as const).map((s) => (
          <button key={s} type="button" className={`chip${filter === s ? ' is-on' : ''}`} onClick={() => setFilter(s)}>
            {s === 'alle' ? T.inquiries.all : T.status[s]}
            <sup>{s === 'alle' ? list.length : list.filter((i) => i.status === s).length}</sup>
          </button>
        ))}
      </div>
      {shown.length === 0 ? (
        <p className="muted">{T.inquiries.empty}</p>
      ) : (
        <ul className="inq-list">
          {shown.map((i) => (
            <li key={i.id}>
              <button type="button" onClick={() => setOpenId(i.id)} className="inq-row">
                <StatusPill s={i.status} />
                <strong>{i.name}</strong>
                <span>{labelFns.category(i.category)}</span>
                <span>{i.date ?? (i.dateFlexible ? 'flexibel' : '–')}</span>
                <span>{i.guests ? `${i.guests} Gäste` : ''}</span>
                <span className="muted">{new Date(i.createdAt).toLocaleString('de-DE', { dateStyle: 'short', timeStyle: 'short' })}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function InquiryDetail({ inq, back, reload, notify }: { inq: Inquiry; back: () => void; reload: () => Promise<void>; notify: (m: string) => void }) {
  const ctx = useMemo(() => mailContext(), []);
  const tpl = useMemo(() => replyTemplate(inq, ctx), [inq, ctx]);
  const [notes, setNotes] = useState(inq.adminNotes ?? '');
  const [subject, setSubject] = useState(tpl.subject);
  const [body, setBody] = useState(tpl.body);
  const setStatus = async (s: InquiryStatus) => {
    await api.admin.updateInquiry(inq.id, { status: s });
    await reload();
    notify(T.status[s]);
  };
  return (
    <div className="admin__panel inq-detail">
      <button type="button" className="text-link" onClick={back}>
        {T.inquiries.back}
      </button>
      <header className="inq-detail__head">
        <h2 className="h-m">{inq.name}</h2>
        <span className="muted">
          {labelFns.category(inq.category)} · Nr. {inq.id}
        </span>
        <div className="chips">
          {INQUIRY_STATUSES.map((s) => (
            <button key={s} type="button" className={`chip${inq.status === s ? ' is-on' : ''}`} onClick={() => void setStatus(s)} aria-pressed={inq.status === s}>
              {T.status[s]}
            </button>
          ))}
        </div>
      </header>
      <div className="inq-detail__grid">
        <section>
          <h3 className="eyebrow">{T.inquiries.contact}</h3>
          <dl className="facts">
            <div>
              <dt>E-Mail</dt>
              <dd>
                <a href={`mailto:${inq.email}`}>{inq.email}</a>
              </dd>
            </div>
            <div>
              <dt>Telefon</dt>
              <dd>{inq.phone ? <a href={`tel:${inq.phone.replace(/\s/g, '')}`}>{inq.phone}</a> : '–'}</dd>
            </div>
            <div>
              <dt>Firma</dt>
              <dd>{inq.company ?? '–'}</dd>
            </div>
          </dl>
          <h3 className="eyebrow">{T.inquiries.event}</h3>
          <dl className="facts">
            <div>
              <dt>Datum</dt>
              <dd>{inq.date ?? (inq.dateFlexible ? 'flexibel' : '–')}</dd>
            </div>
            <div>
              <dt>Ort</dt>
              <dd>{inq.location ?? '–'}</dd>
            </div>
            <div>
              <dt>Gäste</dt>
              <dd>{inq.guests ?? '–'}</dd>
            </div>
            <div>
              <dt>Anlass</dt>
              <dd>{labelFns.occasion(inq.occasion)}</dd>
            </div>
            <div>
              <dt>Budget</dt>
              <dd>{labelFns.budget(inq.budget)}</dd>
            </div>
          </dl>
          {inq.message && (
            <>
              <h3 className="eyebrow">{T.inquiries.message}</h3>
              <p className="inq-detail__msg">{inq.message}</p>
            </>
          )}
        </section>
        <section>
          <h3 className="eyebrow">{T.inquiries.cart}</h3>
          {inq.cart.length === 0 ? (
            <p className="muted">–</p>
          ) : (
            <ul className="inq-cart">
              {inq.cart.map((l, i) => (
                <li key={i}>
                  <span>
                    {l.qty}× {l.name}
                    {l.note && <small>Notiz: {l.note}</small>}
                  </span>
                  <b>{l.totalCents === null ? 'auf Anfrage' : formatEuro(l.totalCents)}</b>
                </li>
              ))}
              <li className="inq-cart__sum">
                <span>Richtwert{inq.cartHasOnRequest ? ' (+ auf Anfrage)' : ''}</span>
                <b>{formatEuro(inq.cartSubtotalCents)}</b>
              </li>
            </ul>
          )}
          <label className="field">
            <span className="field__label">{T.inquiries.notes}</span>
            <textarea rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} />
            <span className="field__hint">{T.inquiries.notesHint}</span>
          </label>
          <TicketButton
            tone="outline"
            size="sm"
            onClick={async () => {
              await api.admin.updateInquiry(inq.id, { adminNotes: notes });
              await reload();
              notify(T.inquiries.saveNotes);
            }}
          >
            {T.inquiries.saveNotes}
          </TicketButton>
        </section>
      </div>
      <section className="inq-reply">
        <h3 className="eyebrow">{T.inquiries.reply}</h3>
        <label className="field">
          <span className="field__label">{T.inquiries.subject}</span>
          <input value={subject} onChange={(e) => setSubject(e.target.value)} />
        </label>
        <label className="field">
          <span className="field__label">{T.inquiries.body}</span>
          <textarea rows={10} value={body} onChange={(e) => setBody(e.target.value)} />
        </label>
        <TicketButton
          onClick={async () => {
            await api.admin.reply(inq.id, subject, body);
            await reload();
            notify(T.inquiries.sent);
          }}
        >
          {T.inquiries.send}
        </TicketButton>
      </section>
    </div>
  );
}

function Mails({ mails }: { mails: AdminData['mails'] }) {
  const [id, setId] = useState<string | null>(null);
  const mail = mails.find((m) => m.id === id) ?? mails[0];
  if (!mails.length) return <p className="admin__panel muted">{T.mails.empty}</p>;
  return (
    <div className="admin__panel mailbox">
      <ul className="mailbox__list">
        {mails.map((m) => (
          <li key={m.id}>
            <button type="button" className={mail?.id === m.id ? 'is-on' : ''} onClick={() => setId(m.id)}>
              <span className={`tag tag--${m.kind}`}>{m.kind === 'kunde-bestaetigung' ? 'An Kunde' : m.kind === 'agentur-antwort' ? 'Antwort' : 'An Agentur'}</span>
              <strong>{m.subject}</strong>
              <small>
                {T.mails.to} {m.to} · {new Date(m.sentAt).toLocaleString('de-DE')}
              </small>
            </button>
          </li>
        ))}
      </ul>
      {mail && (
        <div className="mailbox__view">
          <dl className="facts">
            <div>
              <dt>{T.mails.from}</dt>
              <dd>{mail.from}</dd>
            </div>
            <div>
              <dt>{T.mails.to}</dt>
              <dd>{mail.to}</dd>
            </div>
            {mail.replyTo && (
              <div>
                <dt>{T.mails.replyTo}</dt>
                <dd>{mail.replyTo}</dd>
              </div>
            )}
            <div>
              <dt>{T.mails.transport}</dt>
              <dd>{mail.transport === 'demo-postfach' ? T.mails.demoTransport : mail.transport}</dd>
            </div>
          </dl>
          <iframe title={mail.subject} srcDoc={mail.html} sandbox="" />
        </div>
      )}
    </div>
  );
}

function Posts({ data }: { data: AdminData }) {
  const f = data.feed;
  return (
    <div className="admin__panel">
      <p className="muted">
        @{f.handle} · {f.source === 'demo' ? 'Demo-Daten' : 'Instagram Graph API'} · {T.posts.planned}
      </p>
      <ul className="admin-posts">
        {f.posts.map((p) => (
          <li key={p.id}>
            <div className="admin-posts__img">{f.source === 'demo' ? <Media id={p.image} sizes="200px" /> : null}</div>
            <p>{p.caption}</p>
            <small className="muted">
              {new Date(p.postedAt).toLocaleDateString('de-DE')} · {p.kind} ·{' '}
              <a href={p.permalink} target="_blank" rel="noopener noreferrer">
                {T.posts.open}
              </a>
            </small>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ReviewsTab({ data }: { data: AdminData }) {
  const r = data.reviews;
  return (
    <div className="admin__panel">
      <p className="muted">
        {T.reviews.source}: {r.source} · ⌀ {r.rating.toLocaleString('de-DE')} · {r.count} · {r.notice}
      </p>
      <ul className="admin-reviews">
        {r.reviews.map((x) => (
          <li key={x.id}>
            <strong>
              {'★'.repeat(x.rating)}
              {'☆'.repeat(5 - x.rating)} {x.author}
            </strong>
            <p>{x.text}</p>
            <small className="muted">{x.when}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}

function CalendarTab({ booked, onToggle }: { booked: string[]; onToggle: (d: string) => void }) {
  const [month, setMonth] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const set = new Set(booked);
  const today = toIsoDate(new Date());
  return (
    <div className="admin__panel admin-cal">
      <p className="muted">{T.calendar.hint}</p>
      <MonthGrid
        month={month}
        statusOf={(iso) => (iso < today ? 'past' : set.has(iso) ? 'booked' : 'free')}
        onSelect={onToggle}
        selectable={(s) => s !== 'past'}
        onMonth={(d) => setMonth(new Date(month.getFullYear(), month.getMonth() + d, 1))}
      />
    </div>
  );
}

function DemoTab({ data, slogans, run }: { data: AdminData; slogans: string[]; run: (a: 'toggle-day' | 'settings' | 'reset', b: Record<string, unknown>, m: string) => Promise<void> }) {
  const router = useRouter();
  const byPrio = data.placeholders.reduce<Record<string, Record<string, PlaceholderEntry[]>>>((acc, p) => {
    ((acc[p.priority] ??= {})[p.group] ??= []).push(p);
    return acc;
  }, {});
  return (
    <div className="admin__panel settings">
      <p className="muted">{T.demo.hint}</p>
      <p>{T.demo.flow}</p>
      <fieldset>
        <legend>{T.demo.transition}</legend>
        {HERO_TRANSITIONS.map((t) => (
          <label key={t} className={`radio${data.settings.heroTransition === t ? ' is-on' : ''}`}>
            <input type="radio" name="transition" checked={data.settings.heroTransition === t} onChange={() => void run('settings', { heroTransition: t }, T.demo.transitions[t])} />
            <b>{HERO_TRANSITIONS.indexOf(t) + 1}</b> {T.demo.transitions[t]}
          </label>
        ))}
      </fieldset>
      <fieldset>
        <legend>{T.demo.slogan}</legend>
        {slogans.map((s, i) => (
          <label key={i} className={`radio${data.settings.sloganVariant === i ? ' is-on' : ''}`}>
            <input type="radio" name="slogan" checked={data.settings.sloganVariant === i} onChange={() => void run('settings', { sloganVariant: i }, s)} />
            <b>{i + 1}</b> {s}
          </label>
        ))}
      </fieldset>
      <fieldset>
        <legend>{T.demo.flags}</legend>
        {(Object.keys(T.demo.flagLabels) as (keyof typeof T.demo.flagLabels)[]).map((k) => (
          <label key={k} className="toggle">
            <input type="checkbox" checked={data.settings[k]} onChange={(e) => void run('settings', { [k]: e.target.checked }, `${T.demo.flagLabels[k][0]}: ${e.target.checked ? 'an' : 'aus'}`)} />
            <span className="toggle__ui" aria-hidden="true" />
            <span>
              {T.demo.flagLabels[k][0]}
              <small>{T.demo.flagLabels[k][1]}</small>
            </span>
          </label>
        ))}
      </fieldset>
      <div className="admin__row">
        <TicketButton
          tone="outline"
          onClick={() => {
            try {
              sessionStorage.removeItem('cev-intro-seen');
            } catch {
              /* egal */
            }
            router.push('/');
          }}
        >
          {T.demo.replayIntro}
        </TicketButton>
        <TicketButton
          onClick={() => {
            if (confirm(T.demo.resetConfirm)) {
              try {
                localStorage.removeItem('cev-rider');
              } catch {
                /* egal */
              }
              void run('reset', {}, T.demo.reset);
            }
          }}
        >
          {T.demo.reset}
        </TicketButton>
      </div>
      <h3 className="h-m">{T.demo.placeholders}</h3>
      <p className="muted">{T.demo.placeholdersHint}</p>
      {(['P1', 'P2'] as const).map((prio) => (
        <section key={prio} className="phprio">
          <h4 className={`phprio__title phprio__title--${prio}`}>
            {prio} · {Object.values(byPrio[prio] ?? {}).flat().length}
          </h4>
          {Object.entries(byPrio[prio] ?? {}).map(([g, list]) => (
            <details key={g} className="phgroup" open={g !== 'Medien'}>
              <summary>
                {g} <sup>{list.length}</sup>
              </summary>
              <ul>
                {list.map((p) => (
                  <li key={p.path}>
                    <strong>{p.note}</strong>
                    <code>{p.path}</code>
                    <small>Vorschlag: {p.preview}</small>
                  </li>
                ))}
              </ul>
            </details>
          ))}
        </section>
      ))}
      <p className="muted small">{brand.name}</p>
    </div>
  );
}
