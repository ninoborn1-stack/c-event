import { summarizeCart } from './cart';
import { fieldErrors, inquiryInputSchema, looksLikeSpam, type Inquiry } from './inquiry';
import { renderAgencyNotification, renderCustomerConfirmation, type MailContext } from './mail';
import type { Services } from './services';

export type SubmitResult =
  | { ok: true; inquiry: Inquiry }
  | { ok: false; status: 400 | 422; errors: Record<string, string> };

/**
 * Der komplette Anfrage-Ablauf, unabhängig von Web oder App:
 * validieren → Spam prüfen → Warenkorb bepreisen → speichern → zwei Mails senden.
 */
export async function submitInquiry(
  raw: unknown,
  services: Pick<Services, 'inquiries' | 'mail' | 'catalog'>,
  ctx: MailContext & { recipient: string },
  now = Date.now(),
): Promise<SubmitResult> {
  const parsed = inquiryInputSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, status: 422, errors: fieldErrors(parsed.error) };
  const input = parsed.data;
  if (looksLikeSpam(input, now)) return { ok: false, status: 400, errors: { _: 'Anfrage konnte nicht gesendet werden.' } };

  const catalog = await services.catalog.getCatalog();
  const summary = summarizeCart(input.cart, catalog);

  const { privacy: _p, website: _w, startedAt: _s, cart: _c, ...rest } = input;
  const inquiry = await services.inquiries.create({
    ...rest,
    cart: summary.lines.map((l) => ({
      kind: l.kind,
      name: l.name,
      qty: l.qty,
      unit: l.unit,
      unitCents: l.unitCents,
      totalCents: l.totalCents,
    })),
    cartSubtotalCents: summary.subtotalCents,
    cartHasOnRequest: summary.hasOnRequest,
    consentAt: new Date(now).toISOString(),
  });

  const customer = renderCustomerConfirmation(inquiry, ctx);
  const agency = renderAgencyNotification(inquiry, ctx);
  await services.mail.send({
    kind: 'kunde-bestaetigung',
    to: inquiry.email,
    from: ctx.fromAddress,
    replyTo: ctx.agencyEmail,
    inquiryId: inquiry.id,
    ...customer,
  });
  await services.mail.send({
    kind: 'agentur-anfrage',
    to: ctx.recipient,
    from: ctx.fromAddress,
    replyTo: inquiry.email,
    inquiryId: inquiry.id,
    ...agency,
  });

  return { ok: true, inquiry };
}
