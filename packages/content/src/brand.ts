import { ph } from '@c-event/core';

/**
 * EINZIGE Stelle für Marke, Domain und Kontakt.
 * Namenswechsel im Januar (vermutlich „CN Event“): `name` und `short` hier ändern, fertig.
 */
export const brand = {
  name: 'CN Event Agency',
  /** Kurzform für Wortmarke, App-Icon und Footer. */
  short: 'CN Event',
  logoMark: 'CN',
  logoSub: 'Event Agency',
  /** Der Name selbst ist noch nicht final – als Platzhalter geführt, damit er in der Liste auftaucht. */
  nameStatus: ph('CN Event Agency', 'Name von Celia bestätigen; ab Januar vermutlich „CN Event“', 'Marke & Logo', 'P1'),
  logo: ph(
    'Typografischer Platzhalter: „CN“ auf schwarzem Kreis, darunter „EVENT AGENCY“',
    'Logo als Vektordatei (SVG) von Celia; aktuell nachgebaut nach dem Instagram-Profilbild',
    'Marke & Logo',
    'P1',
  ),
  /** Bio auf Instagram */
  claim: 'Event Concept & Production',
  /** Positionierung aus dem Briefing */
  positioning: '360° – die Umsetzer für alle Ideen',
  /** Drei Slogan-Vorschläge, im Admin-Demo-Tab umschaltbar. Zeilen = Umbrüche im Hero. */
  slogans: ph(
    [
      { lines: ['Ideen', 'auf die', 'Bühne.'], second: ['Doors open.', 'Berlin.'] },
      { lines: ['Abende,', 'über die man', 'redet.'], second: ['Von der Idee', 'bis zum letzten Song.'] },
      { lines: ['Alles ist', 'ein Event.'], second: ['Concept.', 'Production.'] },
    ],
    'Slogan: Celia wählt eine der drei Varianten oder liefert einen eigenen',
    'Marke & Logo',
    'P1',
  ),
  region: ph('Berlin & Brandenburg', 'Einsatzgebiet und Anfahrtskosten mit Celia klären', 'Einsatzgebiet'),
  city: 'Berlin',
  domain: ph('cn-event.de', 'Domain: vorhanden? Anbieter, Login, Wunsch-Domain für den neuen Namen', 'Technik & Konten', 'P2'),
  contact: {
    email: ph('hallo@cn-event.de', 'Echte E-Mail-Adresse (Postfach/Anbieter klären)', 'Kontakt & Social', 'P2'),
    phone: ph('+49 30 000 000 00', 'Telefonnummer', 'Kontakt & Social', 'P2'),
    whatsapp: ph('+4917000000000', 'WhatsApp-Nummer (nur Ziffern mit Ländervorwahl)', 'Kontakt & Social', 'P2'),
    /** Empfänger für Anfragen (Celia). */
    inquiryRecipient: ph('anfragen@cn-event.de', 'Empfänger der Anfragen festlegen (E-Mail oder WhatsApp)', 'Kontakt & Social', 'P1'),
    responseTime: 'Antwort in der Regel innerhalb von 48 Stunden',
  },
  /** Instagram-Handle laut Profil @cneventagency */
  instagram: 'cneventagency',
  social: ph(
    [
      { label: 'Instagram', href: 'https://www.instagram.com/cneventagency/' },
      { label: 'TikTok', href: 'https://www.tiktok.com/' },
      { label: 'LinkedIn', href: 'https://www.linkedin.com/' },
    ],
    'Weitere Kanäle (TikTok, LinkedIn …) bestätigen; Instagram ist @cneventagency',
    'Kontakt & Social',
    'P2',
  ),
  /** Später: eigene Zielgruppen-Strecken auf Subdomains (siehe docs/UEBERGABE.md). */
  tracks: [{ id: 'main', host: null as string | null }, { id: 'corporate', host: 'corporate' }],
} as const;

/** Shop-Begriffe: Celia entscheidet noch, deshalb zentral als Config-Wert. */
export const shop = {
  label: ph('Shop', 'Shop-Name: „Shop“, „Konfigurator“ oder „Event zusammenstellen“', 'Shop', 'P1'),
  cartLabel: ph('Dein Event', 'Begriff für den Warenkorb: „Rider“ oder „Dein Event“', 'Shop', 'P1'),
  path: '/shop',
} as const;

export const partners = {
  bunkerWest: {
    name: 'Bunker West',
    href: ph('https://bunker-west.example', 'Bunker-West-Verlinkung (URL)', 'Partner', 'P2'),
    code: ph('CNEVENT10', 'Willkommens-Code ca. 10 %, mit Albi abstimmen', 'Partner', 'P2'),
    discount: ph('10 %', 'Höhe des Rabatts mit Albi klären', 'Partner', 'P2'),
  },
} as const;
