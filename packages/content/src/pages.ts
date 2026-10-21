import { ph } from '@c-event/core';
import type { MediaId } from './media';

const REF_NOTE = 'Referenz-Platzhalter. Echte Events mit Freigabe der Kunden von Celia';

export const home = {
  seo: {
    title: 'Eventagentur Berlin für Firmenfeiern, Releases & alles dazwischen',
    description:
      'C-Event ist die 360°-Eventagentur aus Berlin: Bar-Catering, Catering, Personal, Deko, Equipment, Event-Organisation und Social Media. Vom Firmen-Weihnachtsfest bis zum Konzert im Heißluftballon.',
  },
  hero: {
    media: 'konfetti-buehne-crowd' as MediaId,
    eyebrow: ['360° Event Agency', 'Berlin', 'Seit Tag eins live'],
    lead: 'Weihnachtsfeier, Release-Night, Musikvideo oder Konzert im Heißluftballon. Du hast die Idee, wir machen den Abend daraus.',
    cta: 'Event anfragen',
    ctaSecondary: 'Rider bauen',
    bar: ['Jetzt buchbar für Dezember', 'Antwort in 48 h', 'Berlin & Brandenburg'],
  },
  intro: {
    countdown: ['3', '2', '1'],
    doors: 'Doors open',
  },
  manifesto: {
    kicker: 'Positionierung',
    big: '360° – die Umsetzer für alle Ideen.',
    text: 'Wir sind keine Agentur, die dir zehn Moodboards schickt und dann verschwindet. Wir bauen auf, mixen, kochen, steuern, filmen. Eine Agentur, ein Ansprechpartner, alle Gewerke.',
    ring: '360° · BAR · CREW · FOOD · REGIE · IDEE · DEKO · EQUIPMENT · CONTENT · ',
  },
  ticker: ['Bar-Catering', 'Personal', 'Catering', 'Event-Management', 'Event-Organisation', 'Dekoration', 'Equipment', 'Social Media'],
  lineup: { kicker: 'Das Line-up', title: 'Alles, was ein Abend braucht.', more: 'Ansehen' },
  highlights: {
    kicker: 'Running Order',
    title: 'Abende, die schon gelaufen sind.',
    items: ph(
      [
        { time: '19:00', title: 'Winter Gala', meta: 'Tech-Unternehmen · 280 Gäste · Dezember', media: 'firmenfeier-festsaal' as MediaId, tag: 'Firma' },
        { time: '21:30', title: 'Sneaker Release Night', meta: 'Brand-Event · 400 Gäste · Kreuzberg', media: 'crowd-handy-licht' as MediaId, tag: 'Brand' },
        { time: '16:00', title: 'Sommerfest am Wasser', meta: 'Mittelstand · 150 Gäste · Wannsee', media: 'gartenparty-crowd' as MediaId, tag: 'Firma' },
        { time: '06:00', title: 'Musikvideo-Dreh', meta: 'Artist-Produktion · Set, Crew & Catering', media: 'artist-rauch-buehne' as MediaId, tag: 'Produktion' },
        { time: '20:00', title: 'Hochzeit im Bunker', meta: 'Privat · 120 Gäste · Bunker West', media: 'hochzeit-tafel' as MediaId, tag: 'Privat' },
        { time: '23:59', title: 'Konzert über den Wolken', meta: 'Die Idee, die alle für unmöglich hielten', media: 'crowd-goldenes-licht' as MediaId, tag: 'Idee' },
      ],
      REF_NOTE,
      'Referenzen',
    ),
  },
  audiences: {
    kicker: 'Für wen',
    items: [
      { id: 'firmen', title: 'Für Firmen', text: 'Weihnachtsfeier, Sommerfest, Jubiläum, Konferenz. Ein Ansprechpartner, eine Rechnung, null Stress für HR.', media: 'firmenfeier-festsaal' as MediaId, href: '/anfrage?kategorie=event-organisation&anlass=weihnachtsfeier', cta: 'Firmenevent anfragen' },
      { id: 'privat', title: 'Für Privat', text: 'Hochzeit, runder Geburtstag, die Party, die du schon ewig schmeißen willst.', media: 'weinglaeser-anstossen' as MediaId, href: '/anfrage?kategorie=event-organisation&anlass=private-feier', cta: 'Feier anfragen' },
      { id: 'brands', title: 'Für Brands & Produktionen', text: 'Release-Events, Pop-ups, Musikvideos, Film. Wir können Set und Nachtleben.', media: 'artist-rauch-buehne' as MediaId, href: '/anfrage?kategorie=event-management&anlass=release-event', cta: 'Projekt anfragen' },
    ],
  },
  configurator: {
    kicker: 'Konfigurator',
    title: 'Bau dir deinen Rider.',
    text: 'Bands haben einen Rider, auf dem steht, was sie brauchen. Du jetzt auch. Bar, Crew, Food, Licht, Möbel: zusammenklicken, abschicken, Angebot bekommen. Ohne Bezahlung, ohne Login.',
    cta: 'Zum Konfigurator',
  },
  bunker: {
    kicker: 'Exklusive Location',
    title: 'Bunker West',
    text: 'Beton, Geschichte, perfekte Akustik. Als exklusiver Partner planen wir Events im Bunker West von der ersten Idee bis zum letzten Gast.',
    cta: 'Location ansehen',
    codeLabel: 'Willkommens-Code',
    media: 'club-buehne-dunkel' as MediaId,
  },
  voices: {
    kicker: 'Stimmen',
    items: ph(
      [
        { quote: 'Wir haben Celia ein Datum und ein Budget gegeben. Zurück kam die beste Weihnachtsfeier, die wir je hatten.', who: 'Name, Position', org: 'Firma (Platzhalter)' },
        { quote: 'Bar, Crew und Regie aus einer Hand. Ich war zum ersten Mal Gast auf meinem eigenen Event.', who: 'Name', org: 'Release-Event (Platzhalter)' },
        { quote: 'Die haben unser Set in sechs Stunden gebaut und um vier Uhr morgens noch Kaffee gebracht.', who: 'Name', org: 'Musikvideo-Produktion (Platzhalter)' },
      ],
      'Kundenstimmen fehlen, nur mit Freigabe veröffentlichen',
      'Referenzen',
    ),
    logos: ph(['Kunde 01', 'Kunde 02', 'Kunde 03', 'Kunde 04', 'Kunde 05', 'Kunde 06'], 'Kundenlogos fehlen, nur mit Freigabe', 'Referenzen'),
  },
  calendar: {
    kicker: 'Freie Termine',
    title: 'Wann geht’s los?',
    text: 'Grün ist frei. Klick auf einen Tag und das Datum landet direkt in deiner Anfrage.',
  },
  finale: {
    lines: ['Lass uns', 'deinen Abend', 'machen.'],
    cta: 'Event anfragen',
  },
};

export const socialMedia = {
  seo: {
    title: 'Social-Media-Strategie & Content für Event-Brands',
    description:
      'Social-Media-Strategie, Content-Production, Skripte und Handbuch für Brands und Collectives, die Events machen. Von der Strategie bis zum fertigen Post, aus Berlin.',
  },
  hero: {
    kicker: 'Social Media & Content',
    h1: 'Social-Media-Strategie für Brands, die Events machen.',
    lead: ph(
      'Ein Event dauert eine Nacht. Der Content dazu läuft Monate. Wir entwickeln Strategie und Formate für Brands und Collectives aus der Event-Welt und begleiten bis zum fertigen Post.',
      'Social-Media-Leistungsbeschreibung: Entwurf von Nino, Freigabe durch Celia',
    ),
    media: 'crowd-handy-licht' as MediaId,
  },
  blocks: ph(
    [
      { title: 'Strategie & Beratung', text: 'Zielgruppe, Kanäle, Tonalität, Posting-Rhythmus. Ein Plan, der zu eurer Szene passt.' },
      { title: 'Content-Production', text: 'Drehs auf euren Events, Recaps, Teaser, Backstage, Reels in Serie.' },
      { title: 'Skripte', text: 'Hooks und Abläufe für Videos, die man nicht wegwischt.' },
      { title: 'Handbuch', text: 'Euer Social-Media-Playbook: Looks, Formate, Do’s & Don’ts, damit auch das Team posten kann.' },
      { title: 'Laufende Begleitung', text: 'Monatliche Planung, Feedback, Auswertung. Bis zum fertigen Post.' },
    ],
    'Umfang und Umsetzung (Celia, Josh, Partner) klären',
  ),
  process: [
    { title: 'Erstgespräch', text: '45 Minuten über eure Events, Ziele und was bisher nicht funktioniert.' },
    { title: 'Konzept', text: 'Strategie, Formate und Redaktionsplan als Dokument.' },
    { title: 'Umsetzung', text: 'Drehs, Schnitt, Skripte, Handbuch.' },
    { title: 'Begleitung', text: 'Laufende Betreuung oder Übergabe an euer Team.' },
  ],
  references: ph(
    [
      { name: 'Club-Collective (z. B. Yami Club)', text: 'Event-Recaps und Line-up-Teaser', media: 'dj-party-crowd' as MediaId },
      { name: 'Sportswear-Brand (z. B. JD Sports)', text: 'Release-Content und Store-Event', media: 'konzert-pink' as MediaId },
      { name: 'Artist-Kollektiv', text: 'Tour-Content und Skripte', media: 'artist-rauch-buehne' as MediaId },
    ],
    'Referenzen nur nach Freigabe der Beteiligten (Yami Club, JD Sports o. ä.)',
    'Referenzen',
  ),
  notFor: 'Kein Gastro-Content. Wir konzentrieren uns auf Events, Brands und Collectives.',
  cta: 'Social Media anfragen',
};

export const about = {
  seo: {
    title: 'Über uns: die Umsetzer für alle Ideen',
    description: 'Celia und das Team hinter C-Event: 360°-Eventagentur aus Berlin mit Netzwerk aus Crew, Partnerküchen, Technik und exklusiven Locations wie Bunker West.',
  },
  hero: { kicker: 'Über uns', h1: 'Wir sind die, die es dann einfach machen.', media: 'weisses-buehnenlicht-crowd' as MediaId },
  story: ph(
    'C-Event ist aus einer einfachen Beobachtung entstanden: Die meisten Ideen für Events scheitern nicht an Kreativität, sondern an der Umsetzung. Zu viele Dienstleister, zu viele Absprachen, zu wenig Zeit. Wir sind die Abkürzung. Eine Agentur, die von der Bar bis zur Regie alles selbst kann und für den Rest ein Netzwerk hat, auf das sie sich verlässt.',
    'Geschichte der Agentur von Celia',
  ),
  values: [
    { title: 'Machen statt Moodboard', text: 'Wir lieben Ideen, aber wir messen uns am Abend selbst.' },
    { title: 'Ein Ansprechpartner', text: 'Du hast eine Nummer. Die geht ran.' },
    { title: 'Keine Standard-Events', text: 'Jeder Abend bekommt eine eigene Dramaturgie.' },
  ],
  team: ph(
    [
      { name: 'Celia', role: 'Gründerin & Inhaberin', text: 'Idee, Angebot, Regie. Bei jedem Event persönlich erreichbar.', media: 'mikrofon-publikum' as MediaId },
      { name: 'Josh', role: 'Social Media & Content', text: 'Strategie und Content für Brands und Collectives.', media: 'crowd-handy-licht' as MediaId },
      { name: 'Die Crew', role: 'Netzwerk', text: 'Barkeeper:innen, Service, Technik, Deko. Eingespielt seit Jahren.', media: 'tanzende-gaeste' as MediaId },
    ],
    'Teamfotos und -texte fehlen',
    'Team',
  ),
  network: ph(
    ['Bunker West · Location', 'Partnerküchen Berlin', 'Licht- & Tontechnik', 'Floristik', 'DJs & Live-Acts', 'Foto & Video'],
    'Netzwerk und Partner mit Celia bestätigen',
    'Partner',
  ),
};

export const gallery = {
  seo: { title: 'Galerie: Events, Bars, Bühnen', description: 'Einblicke in Events von C-Event: Firmenfeiern, Release-Events, Hochzeiten, Bars, Catering und Produktionen in Berlin.' },
  kicker: 'Galerie',
  h1: 'Beweisfotos.',
  lead: 'Ein Querschnitt durch Bars, Bühnen und Abende. Filter nach Leistung oder Anlass.',
  occasions: ['Firma', 'Privat', 'Brand', 'Konzert', 'Produktion'] as const,
  items: [
    { media: 'konfetti-buehne-crowd', services: ['event-organisation'], occasion: 'Konzert' },
    { media: 'video-funken-loop', services: ['event-management'], occasion: 'Konzert' },
    { media: 'cocktails-drei', services: ['bar-catering'], occasion: 'Privat' },
    { media: 'firmenfeier-festsaal', services: ['event-organisation', 'dekoration'], occasion: 'Firma' },
    { media: 'buffet-catering', services: ['catering'], occasion: 'Firma' },
    { media: 'crowd-handy-licht', services: ['event-management'], occasion: 'Brand' },
    { media: 'hochzeit-tafel', services: ['dekoration'], occasion: 'Privat' },
    { media: 'video-dj-loop', services: ['equipment-mieten'], occasion: 'Brand' },
    { media: 'bar-lichter', services: ['bar-catering'], occasion: 'Firma' },
    { media: 'artist-rauch-buehne', services: ['event-management'], occasion: 'Produktion' },
    { media: 'dinner-tafel-blumen', services: ['dekoration', 'catering'], occasion: 'Privat' },
    { media: 'keynote-leinwand', services: ['event-management'], occasion: 'Firma' },
    { media: 'whisky-pour-bar', services: ['bar-catering'], occasion: 'Brand' },
    { media: 'tanzende-gaeste', services: ['personalvermittlung'], occasion: 'Privat' },
    { media: 'festival-lila-licht', services: ['event-organisation'], occasion: 'Konzert' },
    { media: 'dessert-beeren', services: ['catering'], occasion: 'Privat' },
    { media: 'stuhl-design', services: ['equipment-mieten'], occasion: 'Firma' },
    { media: 'weihnachtsbaum-kugeln', services: ['dekoration'], occasion: 'Firma' },
    { media: 'mikrofon-blau', services: ['equipment-mieten'], occasion: 'Produktion' },
    { media: 'gartenparty-crowd', services: ['event-organisation'], occasion: 'Firma' },
    { media: 'bar-vintage', services: ['bar-catering'], occasion: 'Privat' },
    { media: 'konzert-pink', services: ['event-management'], occasion: 'Konzert' },
  ] as { media: MediaId; services: string[]; occasion: string }[],
};

export const inquiryPage = {
  seo: { title: 'Event anfragen', description: 'Unverbindlich anfragen: Bar-Catering, Catering, Personal, Deko, Equipment, Event-Organisation oder Social Media. Persönliches Angebot von Celia.' },
  kicker: 'Booking',
  h1: 'Erzähl uns von deinem Abend.',
  lead: 'Ein Formular für alles. Du bekommst sofort eine Bestätigung, das Angebot macht Celia persönlich.',
  thanks: {
    h1: 'Ist angekommen.',
    lead: 'Du hast gerade eine Bestätigung per Mail bekommen. Celia meldet sich mit deinem persönlichen Angebot.',
  },
};

export const configuratorPage = {
  seo: { title: 'Event-Konfigurator: Rider zusammenstellen', description: 'Stell dein Event-Paket zusammen: mobile Bar, Crew, Catering, Deko, Licht, Sound und Möbel. Unverbindlich anfragen, ohne Bezahlung.' },
  kicker: 'Konfigurator',
  h1: 'Dein Rider.',
  lead: 'Klick zusammen, was dein Event braucht. Nichts davon kostet jetzt etwas: Am Ende schickst du eine Anfrage, Celia prüft Verfügbarkeit und macht dir ein Angebot.',
  packagesTitle: 'Oder nimm ein Paket als Startpunkt.',
};

export const legal = {
  impressum: {
    title: 'Impressum',
    fields: {
      company: ph('C-Event Agency [Rechtsform]', 'Firmenname und Rechtsform', 'Rechtliches'),
      street: ph('Musterstraße 1', 'Anschrift', 'Rechtliches'),
      city: ph('10115 Berlin', 'PLZ und Ort', 'Rechtliches'),
      representative: ph('Celia [Nachname]', 'Vertretungsberechtigte Person', 'Rechtliches'),
      register: ph('Amtsgericht Berlin-Charlottenburg, HRB 000000', 'Registergericht und -nummer (falls vorhanden)', 'Rechtliches'),
      vatId: ph('DE000000000', 'USt-IdNr.', 'Rechtliches'),
      responsible: ph('Celia [Nachname], Anschrift wie oben', 'Verantwortlich i. S. d. § 18 Abs. 2 MStV', 'Rechtliches'),
    },
  },
  datenschutz: {
    title: 'Datenschutzerklärung',
    note: ph('Vorlage, vor Livegang rechtlich prüfen lassen', 'Datenschutzerklärung vor Livegang prüfen (Hosting, Mail-Anbieter, Kalender)', 'Rechtliches'),
    sections: [
      { h: '1. Verantwortliche Stelle', p: 'Verantwortlich für die Datenverarbeitung auf dieser Website ist die im Impressum genannte Stelle.' },
      { h: '2. Anfrage-Formular', p: 'Wenn du uns über das Formular eine Anfrage schickst, verarbeiten wir deine Angaben (Name, Kontaktdaten, Eventdaten, Nachricht, Rider) ausschließlich, um deine Anfrage zu beantworten und ein Angebot zu erstellen (Art. 6 Abs. 1 lit. b DSGVO). Du erhältst eine automatische Bestätigung per E-Mail.' },
      { h: '3. Speicherdauer', p: 'Anfragen speichern wir, solange es für die Bearbeitung nötig ist, und löschen sie spätestens nach Ablauf gesetzlicher Aufbewahrungsfristen.' },
      { h: '4. Konfigurator', p: 'Dein Rider wird nur lokal in deinem Browser gespeichert (localStorage), bis du ihn mit einer Anfrage abschickst. Es werden keine Cookies für Tracking gesetzt.' },
      { h: '5. Hosting & Schriften', p: 'Schriften werden lokal ausgeliefert, es findet kein Aufruf von Google-Servern statt. Angaben zum Hosting-Anbieter folgen.' },
      { h: '6. Deine Rechte', p: 'Du hast das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung, Datenübertragbarkeit und Widerspruch sowie ein Beschwerderecht bei einer Aufsichtsbehörde.' },
    ],
  },
  agb: {
    title: 'AGB & Mietbedingungen',
    note: ph('Vorlage, Mietbedingungen und AGB kommen von Celia', 'Mietbedingungen und AGB fehlen', 'Rechtliches'),
    sections: [
      { h: '1. Geltungsbereich', p: 'Diese Bedingungen gelten für alle Leistungen und Mietverträge von C-Event. Die Website enthält kein verbindliches Angebot; Verträge kommen erst mit unserem schriftlichen Angebot und deiner Bestätigung zustande.' },
      { h: '2. Anfrage & Angebot', p: 'Preise im Konfigurator sind unverbindliche Richtwerte. Maßgeblich ist ausschließlich das individuelle Angebot.' },
      { h: '3. Kaution', p: 'Für einzelne Mietartikel wird eine Kaution fällig, die nach ordnungsgemäßer Rückgabe erstattet wird.' },
      { h: '4. Lieferung & Abholung', p: 'Lieferung, Aufbau und Abholung erfolgen nach Absprache. Anfahrtskosten werden im Angebot ausgewiesen.' },
      { h: '5. Stornierung', p: '[Stornostaffel von Celia einsetzen]' },
      { h: '6. Haftung', p: '[Haftungsregelung für Mietgegenstände von Celia einsetzen]' },
    ],
  },
};

export const ui = {
  nav: {
    services: 'Leistungen',
    configurator: 'Konfigurator',
    gallery: 'Galerie',
    about: 'Über uns',
    social: 'Social Media',
    inquiry: 'Anfrage',
    menu: 'Menü',
    close: 'Schließen',
  },
  rider: { label: 'Rider', empty: 'Dein Rider ist noch leer.', send: 'Anfrage senden', add: 'In den Rider', added: 'Im Rider', onRequest: 'auf Anfrage', deposit: 'Kaution', estimate: 'Richtwert', plusOnRequest: 'zzgl. Positionen auf Anfrage', clear: 'Leeren' },
  service: { whatWeDo: 'Was wir machen', occasions: 'Für welche Anlässe', process: 'So läuft’s', gallery: 'Eindrücke', fit: 'Passt dazu', fitTitle: 'Direkt in den *Rider*.', fitText: 'Leg dir Artikel und Pakete zusammen und schick sie mit deiner Anfrage.', fitLink: 'Alle Artikel im Konfigurator →', faq: 'Fragen & Antworten', faqTitle: 'Gute Frage.', preselected: 'Kategorie vorausgewählt:', nextAct: 'Next act', all: 'Alle Leistungen' },
  footer: { contact: 'Kontakt', legal: 'Rechtliches', bigLine: 'Wir sehen uns auf der Tanzfläche.' },
  placeholder: 'Platzhalter',
};
