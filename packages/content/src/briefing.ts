import { ph } from '@c-event/core';

/**
 * Offene Punkte aus „Briefing 2“, die nicht direkt an einem Inhalt hängen.
 * Jeder Punkt trägt Priorität (P1 = vor dem Bau, P2 = nach und nach) und unseren Vorschlag als Wert.
 * Erscheinen automatisch in der Platzhalter-Liste (Admin → Demo, docs/PLATZHALTER.md).
 */
export const briefing = {
  design: {
    fontsColors: ph(
      'Headlines: Archivo Black/Condensed (blockig), Text: DM Sans; Farben Dunkel #15110F, Creme #F2ECE3, Rot #9E2B25, Bernstein #D9A04E',
      'Schriften und Farben: Celias CI oder Okay für unsere Richtung',
      'Marke & Logo',
      'P1',
    ),
    ticketStyle: ph(
      'Weiche Radien (14 px), Perforation, Rot als Ticket-Farbe – „ein bisschen weiblich“ noch offen',
      'Ticket-Stil der CTAs und des Warenkorbs (Celia klärt „ein bisschen weibig“)',
      'Marke & Logo',
      'P1',
    ),
    media: ph(
      'Stockfotos als Platzhalter; Richtwerte: Hero 2–3 Clips à 10–30 s (quer + hochkant), 5–10 Fotos je Leistung, 20–40 Galerie, 1 je Shop-Artikel, 1 je Teammitglied',
      'Fotos und Videos als Ordner',
      'Medien',
      'P1',
    ),
  },
  offer: {
    finalServices: ph(
      'Bar-Catering, Personal, Catering, Event-Management, Event-Organisation, Dekoration, Equipment, Social Media & Content',
      'Finale Leistungen bestätigen (fehlt etwas, fällt etwas weg?)',
      'Texte',
      'P1',
    ),
    priceDisplay: ph('Richtpreise sichtbar, Pakete „ab“, individuelle Leistungen „auf Anfrage“', 'Preisanzeige: fest / ab / auf Anfrage – global schaltbar', 'Shop', 'P1'),
    formFields: ph(
      'Pflicht: Kategorie, Name, E-Mail, Datenschutz. Optional: Firma, Telefon, Anlass, Datum, Ort, Gäste, Budget, Nachricht',
      'Formularfelder festlegen',
      'Shop',
      'P1',
    ),
    socialScope: ph(
      'Strategie & Beratung, Content-Production, Skripte, Handbuch, laufende Begleitung',
      'Umfang des Social-Media-Angebots und wer umsetzt (Celia, Josh, Partner)',
      'Texte',
      'P1',
    ),
  },
  accounts: {
    oldWebsite: ph('Keine bekannt', 'Alte Website, Hosting, Vertragslaufzeit', 'Technik & Konten', 'P2'),
    mailProvider: ph('Bestehendes Postfach behalten, MX-Einträge beim Umzug sichern', 'E-Mail-Anbieter', 'Technik & Konten', 'P2'),
    calendarTool: ph('Öffentliche iCal-URL nur mit Frei/Belegt', 'Kalender-Tool und was öffentlich sichtbar sein darf', 'Technik & Konten', 'P2'),
    adminScope: ph('Anfragen, Mails, Posts, Rezensionen, Kalender', 'Umfang des Admin-Dashboards', 'Technik & Konten', 'P2'),
    instagramType: ph(
      'Business- oder Creator-Account mit Instagram Login (Graph API)',
      'Instagram-Account-Typ und Login (Basic Display API seit 4.12.2024 abgeschaltet)',
      'Technik & Konten',
      'P2',
    ),
    googleProfile: ph('Profil anlegen bzw. übernehmen, Place-ID hinterlegen', 'Google-Unternehmensprofil und verifizierter Inhaber', 'Technik & Konten', 'P2'),
    ownTools: ph('Keine', 'Anbindung eigener Tools (CRM, Buchhaltung …)', 'Technik & Konten', 'P2'),
  },
  legal: {
    privacyContact: ph('Celia [Nachname], Anschrift wie Impressum', 'Datenschutz-Kontakt', 'Rechtliches', 'P2'),
  },
  organisation: {
    approver: ph('Celia', 'Wer gibt Feedback und Freigaben?', 'Organisation', 'P2'),
    clientKcee: ph('„kcee“ – Kunde oder Partner?', 'Referenzen: klären, ob „kcee“ ein Kunde ist', 'Referenzen', 'P2'),
    corporate: ph('Später: corporate.<domain>', 'Corporate-Strecke auf eigener Subdomain', 'Organisation', 'P2'),
    english: ph('Erst Deutsch', 'Englische Version?', 'Organisation', 'P2'),
    analytics: ph('Datenschutzfreundliche Statistik ohne Cookie-Banner, kein Newsletter', 'Statistik und Newsletter', 'Organisation', 'P2'),
  },
};
