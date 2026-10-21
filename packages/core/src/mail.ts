import { formatEuro } from './cart';
import type { Inquiry } from './inquiry';

export interface MailContext {
  brandName: string;
  agencyEmail: string;
  agencyPhone: string;
  fromAddress: string;
  siteUrl: string;
  labels: {
    category: (id: string) => string;
    occasion: (id: string | undefined) => string;
    budget: (id: string | undefined) => string;
  };
}

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function formatDate(iso: string | undefined, flexible: boolean): string {
  if (!iso) return flexible ? 'flexibel' : 'noch offen';
  const [y, m, d] = iso.split('-');
  return `${d}.${m}.${y}${flexible ? ' (flexibel)' : ''}`;
}

function rows(inq: Inquiry, ctx: MailContext): [string, string][] {
  return [
    ['Kategorie', ctx.labels.category(inq.category)],
    ['Name', inq.name],
    ['Firma', inq.company ?? '–'],
    ['E-Mail', inq.email],
    ['Telefon', inq.phone ?? '–'],
    ['Anlass', ctx.labels.occasion(inq.occasion)],
    ['Datum', formatDate(inq.date, inq.dateFlexible)],
    ['Ort', inq.location ?? '–'],
    ['Gäste', inq.guests ? String(inq.guests) : '–'],
    ['Budget', ctx.labels.budget(inq.budget)],
  ];
}

function cartTable(inq: Inquiry): string {
  if (!inq.cart.length) return '';
  const lines = inq.cart
    .map(
      (l) =>
        `<tr><td style="padding:8px 0;border-bottom:1px solid #e4dccd">${l.qty}× ${esc(l.name)}</td><td style="padding:8px 0;border-bottom:1px solid #e4dccd;text-align:right;white-space:nowrap">${
          l.totalCents === null ? 'auf Anfrage' : formatEuro(l.totalCents)
        }</td></tr>`,
    )
    .join('');
  const total = `<tr><td style="padding:10px 0;font-weight:700">Richtwert${inq.cartHasOnRequest ? ' (zzgl. Positionen auf Anfrage)' : ''}</td><td style="padding:10px 0;text-align:right;font-weight:700">${formatEuro(inq.cartSubtotalCents)}</td></tr>`;
  return `<h3 style="font:700 13px/1.2 Arial,sans-serif;letter-spacing:.14em;text-transform:uppercase;margin:28px 0 8px">Dein Rider</h3><table width="100%" style="border-collapse:collapse;font:15px/1.4 Arial,sans-serif">${lines}${total}</table>`;
}

function shell(ctx: MailContext, title: string, body: string): string {
  return `<!doctype html><html lang="de"><body style="margin:0;background:#efe9df;padding:24px 0">
<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#fbf8f3">
<tr><td style="background:#100e0b;padding:28px 32px;color:#f3eee5;font:900 28px/1 Arial,sans-serif;letter-spacing:-.02em;text-transform:uppercase">${esc(ctx.brandName)}<span style="color:#e8b45c">.</span></td></tr>
<tr><td style="padding:32px;color:#16130f;font:16px/1.55 Arial,sans-serif">
<h1 style="font:800 30px/1.05 Arial,sans-serif;letter-spacing:-.02em;margin:0 0 18px">${title}</h1>
${body}
</td></tr>
<tr><td style="padding:20px 32px;background:#16130f;color:#b9ad9a;font:12px/1.5 Arial,sans-serif">${esc(ctx.brandName)} · ${esc(ctx.agencyEmail)} · ${esc(ctx.agencyPhone)}<br>${esc(ctx.siteUrl)}</td></tr>
</table></td></tr></table></body></html>`;
}

function rowsTable(inq: Inquiry, ctx: MailContext): string {
  return `<table width="100%" style="border-collapse:collapse;font:15px/1.4 Arial,sans-serif">${rows(inq, ctx)
    .map(
      ([k, v]) =>
        `<tr><td style="padding:7px 12px 7px 0;color:#7a6f60;width:120px;vertical-align:top;border-bottom:1px solid #e4dccd">${k}</td><td style="padding:7px 0;border-bottom:1px solid #e4dccd">${esc(v)}</td></tr>`,
    )
    .join('')}</table>`;
}

export function renderCustomerConfirmation(inq: Inquiry, ctx: MailContext) {
  const first = inq.name.split(' ')[0] ?? inq.name;
  const subject = `Deine Anfrage ist da – ${ctx.brandName}`;
  const html = shell(
    ctx,
    `Danke, ${esc(first)}. Wir sind dran.`,
    `<p style="margin:0 0 16px">Deine Anfrage ist bei uns angekommen. Wir schauen sie uns persönlich an und melden uns mit einem <strong>individuellen Angebot</strong>, in der Regel innerhalb von 48 Stunden.</p>
<p style="margin:0 0 24px">Preise im Rider sind Richtwerte. Verbindlich ist erst unser Angebot.</p>
${rowsTable(inq, ctx)}
${inq.message ? `<h3 style="font:700 13px/1.2 Arial,sans-serif;letter-spacing:.14em;text-transform:uppercase;margin:28px 0 8px">Deine Nachricht</h3><p style="margin:0;white-space:pre-wrap">${esc(inq.message)}</p>` : ''}
${cartTable(inq)}
<p style="margin:28px 0 0">Bis gleich,<br><strong>Celia &amp; Team</strong></p>
<p style="margin:16px 0 0;color:#7a6f60;font-size:13px">Anfrage-Nr. ${esc(inq.id)}</p>`,
  );
  const text = `Danke, ${first}. Deine Anfrage ist da.\n\nWir melden uns persönlich mit einem Angebot.\n\n${rows(inq, ctx)
    .map(([k, v]) => `${k}: ${v}`)
    .join('\n')}\n\nAnfrage-Nr. ${inq.id}`;
  return { subject, html, text };
}

export function renderAgencyNotification(inq: Inquiry, ctx: MailContext) {
  const subject = `Neue Anfrage: ${ctx.labels.category(inq.category)} · ${inq.name}${inq.date ? ` · ${formatDate(inq.date, false)}` : ''}`;
  const replyHref = `mailto:${encodeURIComponent(inq.email)}?subject=${encodeURIComponent(`Dein Angebot von ${ctx.brandName}`)}`;
  const html = shell(
    ctx,
    `Neue Anfrage · ${esc(ctx.labels.category(inq.category))}`,
    `<p style="margin:0 0 20px"><a href="${replyHref}" style="display:inline-block;background:#16130f;color:#f3eee5;padding:14px 22px;text-decoration:none;font-weight:700;letter-spacing:.08em;text-transform:uppercase;font-size:13px">Direkt antworten →</a></p>
${rowsTable(inq, ctx)}
${inq.message ? `<h3 style="font:700 13px/1.2 Arial,sans-serif;letter-spacing:.14em;text-transform:uppercase;margin:28px 0 8px">Nachricht</h3><p style="margin:0;white-space:pre-wrap">${esc(inq.message)}</p>` : ''}
${cartTable(inq)}
<p style="margin:24px 0 0;color:#7a6f60;font-size:13px">Eingang ${new Date(inq.createdAt).toLocaleString('de-DE')} · Nr. ${esc(inq.id)} · Datenschutz bestätigt ${new Date(inq.consentAt).toLocaleString('de-DE')}</p>`,
  );
  const text = `Neue Anfrage\n\n${rows(inq, ctx)
    .map(([k, v]) => `${k}: ${v}`)
    .join('\n')}\n\n${inq.message ?? ''}`;
  return { subject, html, text };
}
