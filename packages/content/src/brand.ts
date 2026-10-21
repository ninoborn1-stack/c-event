import { ph } from '@c-event/core';

/**
 * EINZIGE Stelle für Marke, Domain und Kontakt.
 * Namenswechsel im Januar: `name` auf „C-Event“ setzen, fertig.
 */
export const brand = {
  name: 'C-Event Agency',
  /** Kurzform für Logo-Wortmarke und App-Icon. */
  short: 'C-Event',
  logoMark: 'C',
  logo: ph('Wortmarke als Text gesetzt', 'Logo als Vektordatei (SVG) fehlt, Namenswechsel im Januar beachten', 'Marke & Logo'),
  claim: '360° – die Umsetzer für alle Ideen',
  /** Drei Slogan-Vorschläge, im Demo-Cockpit umschaltbar. Zeilen = Umbrüche im Hero. */
  slogans: ph(
    [
      { lines: ['Ideen', 'auf die', 'Bühne.'], second: ['Doors open.', 'Berlin.'] },
      { lines: ['Abende,', 'über die man', 'redet.'], second: ['Von der Idee', 'bis zum letzten Song.'] },
      { lines: ['Alles ist', 'ein Event.'], second: ['Wenn man', "es richtig macht."] },
    ],
    'Slogan fehlt. Nino schlägt drei Varianten vor, Celia wählt',
    'Marke & Logo',
  ),
  region: ph('Berlin & Brandenburg', 'Einsatzgebiet und Anfahrtskosten mit Celia klären', 'Einsatzgebiet'),
  city: 'Berlin',
  contact: {
    email: ph('hallo@c-event.de', 'Echte E-Mail-Adresse fehlt (Postfach/Anbieter klären)', 'Kontakt & Social'),
    phone: ph('+49 30 000 000 00', 'Telefonnummer fehlt', 'Kontakt & Social'),
    whatsapp: ph('+4917000000000', 'WhatsApp-Nummer fehlt (nur Ziffern mit Ländervorwahl)', 'Kontakt & Social'),
    /** Empfänger für Anfragen (Celia). */
    inquiryRecipient: ph('anfragen@c-event.de', 'Empfänger der Anfragen festlegen (E-Mail, ggf. WhatsApp)', 'Kontakt & Social'),
    responseTime: 'Antwort in der Regel innerhalb von 48 Stunden',
  },
  social: ph(
    [
      { label: 'Instagram', href: 'https://instagram.com/' },
      { label: 'TikTok', href: 'https://tiktok.com/' },
      { label: 'LinkedIn', href: 'https://linkedin.com/' },
    ],
    'Social-Media-Accounts zum Verlinken fehlen',
    'Kontakt & Social',
  ),
  /** Später: eigene Zielgruppen-Strecken auf Subdomains (siehe docs/UEBERGABE.md). */
  tracks: [{ id: 'main', host: null as string | null }, { id: 'corporate', host: 'corporate' }],
} as const;

export const partners = {
  bunkerWest: {
    name: 'Bunker West',
    href: ph('https://bunker-west.example', 'Link zur Bunker-West-Seite fehlt', 'Partner'),
    code: ph('CEVENT10', 'Willkommens-Code ca. 10 %, mit Albi abstimmen', 'Partner'),
    discount: ph('10 %', 'Höhe des Rabatts mit Albi klären', 'Partner'),
  },
} as const;
