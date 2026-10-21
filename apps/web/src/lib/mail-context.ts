import { val, type MailContext } from '@c-event/core';
import { brand, labelFns } from '@c-event/content';
import { SITE_URL } from './env';

/** Absender, Empfänger und Labels für die Anfrage-Mails. Läuft auf dem Server und (statische Demo) im Browser. */
export function mailContext(): MailContext & { recipient: string } {
  return {
    brandName: brand.name,
    agencyEmail: val(brand.contact.email),
    agencyPhone: val(brand.contact.phone),
    fromAddress: process.env.MAIL_FROM || `noreply@${new URL(SITE_URL).hostname}`,
    siteUrl: SITE_URL,
    recipient: process.env.INQUIRY_RECIPIENT || val(brand.contact.inquiryRecipient),
    labels: labelFns,
  };
}
