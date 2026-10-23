'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import {
  BUDGET_RANGES,
  INQUIRY_CATEGORIES,
  OCCASIONS,
  fieldErrors,
  formatEuro,
  inquiryInputSchema,
  summarizeCart,
  isInquiryCategory,
  isValidIsoDate,
  type Occasion,
  val,
} from '@c-event/core';
import { budgetLabels, catalog, categoryLabels, occasionLabels, shop, ui } from '@c-event/content';
import { TicketButton } from '@/components/ui/Ticket';
import { PickCalendar } from '@/components/calendar/MonthCalendar';
import { api } from '@/lib/api';
import { cart as cartStore, useCart } from '@/lib/cart-store';
import { useSite } from '@/lib/site-context';

type Values = Record<string, string | boolean>;

/** Das EINE Formular für alle Anfragen. Validiert live mit demselben Schema wie die API. */
export function InquiryForm() {
  const router = useRouter();
  // Vorauswahl aus der URL: ?kategorie=…&datum=…&anlass=… (clientseitig, damit die Seite statisch bleiben kann)
  const sp = useSearchParams();
  const kat = sp.get('kategorie');
  const datum = sp.get('datum');
  const anlass = sp.get('anlass') ?? '';
  const initialCategory = isInquiryCategory(kat) ? kat : undefined;
  const initialDate = isValidIsoDate(datum) ? datum : undefined;
  const initialOccasion = (OCCASIONS as readonly string[]).includes(anlass) ? (anlass as Occasion) : undefined;
  const cart = useCart();
  const { settings } = useSite();
  const summary = summarizeCart(cart, catalog);
  const [startedAt] = useState(() => Date.now());
  const [v, setV] = useState<Values>({
    category: initialCategory ?? (cart.length ? 'konfigurator' : 'allgemein'),
    name: '',
    company: '',
    email: '',
    phone: '',
    occasion: initialOccasion ?? '',
    date: initialDate ?? '',
    dateFlexible: false,
    location: '',
    guests: '',
    budget: '',
    message: '',
    privacy: false,
    website: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [sending, setSending] = useState(false);
  const [serverError, setServerError] = useState('');

  const payload = () => ({ ...v, cart, startedAt });
  const validate = (next: Values) => {
    const r = inquiryInputSchema.safeParse({ ...next, cart, startedAt: 0 });
    return r.success ? {} : fieldErrors(r.error);
  };
  const set = (k: string, val: string | boolean) => {
    const next = { ...v, [k]: val };
    setV(next);
    if (touched[k] || errors[k]) setErrors(validate(next));
  };
  const blur = (k: string) => {
    setTouched((t) => ({ ...t, [k]: true }));
    setErrors(validate(v));
  };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setServerError('');
    const errs = validate(v);
    setErrors(errs);
    setTouched(Object.fromEntries(Object.keys(v).map((k) => [k, true])));
    if (Object.keys(errs).length) {
      document.querySelector<HTMLElement>(`[name="${Object.keys(errs)[0]}"]`)?.focus();
      return;
    }
    setSending(true);
    try {
      const data = await api.submitInquiry(payload());
      if (!data.ok) {
        setErrors(data.errors);
        setServerError(data.errors._ ?? 'Bitte prüfe die markierten Felder.');
        setSending(false);
        return;
      }
      cartStore.clear();
      router.push(`/anfrage/danke?id=${encodeURIComponent(data.id)}`);
    } catch {
      setServerError('Verbindung fehlgeschlagen. Bitte versuch es noch einmal.');
      setSending(false);
    }
  }

  const err = (k: string) => (touched[k] || errors[k]) && errors[k];
  const field = (k: string, label: string, input: React.ReactNode, hint?: string, wide?: boolean) => (
    <label className={`field${err(k) ? ' has-err' : ''}${wide ? ' field--wide' : ''}`}>
      <span className="field__label">{label}</span>
      {input}
      {err(k) ? (
        <span className="field__err" role="alert">
          {errors[k]}
        </span>
      ) : hint ? (
        <span className="field__hint">{hint}</span>
      ) : null}
    </label>
  );
  const text = (k: string, extra: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <input name={k} value={String(v[k] ?? '')} onChange={(e) => set(k, e.target.value)} onBlur={() => blur(k)} aria-invalid={!!err(k)} {...extra} />
  );

  return (
    <form className="form" onSubmit={submit} noValidate>
      <fieldset className="form__block">
        <legend>
          <em>01</em> Worum geht’s?
        </legend>
        <div className="cats" role="radiogroup" aria-label="Kategorie">
          {INQUIRY_CATEGORIES.map((c) => (
            <label key={c} className={`cat${v.category === c ? ' is-on' : ''}`}>
              <input type="radio" name="category" value={c} checked={v.category === c} onChange={() => set('category', c)} />
              {categoryLabels[c]}
            </label>
          ))}
        </div>
        {err('category') && <span className="field__err">{errors.category}</span>}
      </fieldset>

      {summary.lines.length > 0 && (
        <fieldset className="form__block form__rider">
          <legend>
            <em>02</em> {val(shop.cartLabel)}
          </legend>
          <ul>
            {summary.lines.map((l) => (
              <li key={`${l.kind}-${l.id}`}>
                <span>
                  {l.qty}× {l.name}
                </span>
                {settings.showPrices && <b>{l.totalCents === null ? ui.cart.onRequest : formatEuro(l.totalCents)}</b>}
              </li>
            ))}
          </ul>
          <div className="form__rider-foot">
            {settings.showPrices && (
              <span>
                {ui.cart.estimate}: <b>{formatEuro(summary.subtotalCents)}</b>
                {summary.hasOnRequest ? ` · ${ui.cart.plusOnRequest}` : ''}
              </span>
            )}
            <button type="button" className="link-btn" onClick={() => cartStore.open()}>
              Bearbeiten
            </button>
          </div>
        </fieldset>
      )}

      <fieldset className="form__block">
        <legend>
          <em>{summary.lines.length ? '03' : '02'}</em> Wann & wo?
        </legend>
        <div className="form__when">
          <PickCalendar value={String(v.date || '') || undefined} onChange={(d) => set('date', d)} />
          <div className="form__grid">
            {field('date', 'Datum', text('date', { type: 'date', min: new Date().toISOString().slice(0, 10) }), 'Oder im Kalender einen freien Tag anklicken.')}
            <label className="check">
              <input type="checkbox" checked={!!v.dateFlexible} onChange={(e) => set('dateFlexible', e.target.checked)} />
              <span>Datum ist flexibel</span>
            </label>
            {field('location', 'Ort / Location', text('location', { placeholder: 'z. B. Berlin-Kreuzberg oder „noch offen“' }))}
            {field('guests', 'Gäste (ca.)', text('guests', { inputMode: 'numeric', placeholder: '120' }))}
            {field(
              'occasion',
              'Anlass',
              <select name="occasion" value={String(v.occasion)} onChange={(e) => set('occasion', e.target.value)} onBlur={() => blur('occasion')}>
                <option value="">Bitte wählen</option>
                {OCCASIONS.map((o) => (
                  <option key={o} value={o}>
                    {occasionLabels[o]}
                  </option>
                ))}
              </select>,
            )}
            {field(
              'budget',
              'Budget-Rahmen',
              <select name="budget" value={String(v.budget)} onChange={(e) => set('budget', e.target.value)} onBlur={() => blur('budget')}>
                <option value="">Bitte wählen</option>
                {BUDGET_RANGES.map((b) => (
                  <option key={b} value={b}>
                    {budgetLabels[b]}
                  </option>
                ))}
              </select>,
            )}
          </div>
        </div>
      </fieldset>

      <fieldset className="form__block">
        <legend>
          <em>{summary.lines.length ? '04' : '03'}</em> Wer bist du?
        </legend>
        <div className="form__grid">
          {field('name', 'Name *', text('name', { autoComplete: 'name', required: true }))}
          {field('company', 'Firma (optional)', text('company', { autoComplete: 'organization' }))}
          {field('email', 'E-Mail *', text('email', { type: 'email', autoComplete: 'email', required: true }))}
          {field('phone', 'Telefon', text('phone', { type: 'tel', autoComplete: 'tel' }), 'Für Rückfragen, am schnellsten per Anruf oder WhatsApp.')}
          {field(
            'message',
            'Erzähl uns von deiner Idee',
            <textarea name="message" rows={5} value={String(v.message)} onChange={(e) => set('message', e.target.value)} onBlur={() => blur('message')} placeholder="Was soll passieren? Was darf auf keinen Fall fehlen?" />,
            undefined,
            true,
          )}
        </div>
        {/* Honeypot: für Menschen unsichtbar */}
        <div className="hp" aria-hidden="true">
          <label>
            Website <input name="website" tabIndex={-1} autoComplete="off" value={String(v.website)} onChange={(e) => set('website', e.target.value)} />
          </label>
        </div>
      </fieldset>

      <div className="form__send">
        <label className={`check${err('privacy') ? ' has-err' : ''}`}>
          <input type="checkbox" name="privacy" checked={!!v.privacy} onChange={(e) => set('privacy', e.target.checked)} />
          <span>
            Ich habe die <Link href="/datenschutz">Datenschutzerklärung</Link> gelesen und bin einverstanden, dass meine Angaben zur Bearbeitung der Anfrage gespeichert werden. *
          </span>
        </label>
        {err('privacy') && <span className="field__err">{errors.privacy}</span>}
        {serverError && (
          <p className="form__server-err" role="alert">
            {serverError}
          </p>
        )}
        <TicketButton type="submit" size="lg" disabled={sending}>
          {sending ? 'Wird gesendet …' : ui.cart.send}
        </TicketButton>
        <p className="muted small">Unverbindlich. Du bekommst sofort eine Bestätigung, das Angebot kommt persönlich.</p>
      </div>
    </form>
  );
}
