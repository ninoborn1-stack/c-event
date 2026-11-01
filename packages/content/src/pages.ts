import { ph } from '@c-event/core';
import type { MediaId } from './media';

const REF_NOTE = 'Referenz-Platzhalter. Echte Events mit Freigabe der Kunden von Celia';

export const home = {
  seo: {
    title: 'Event Concept & Production in Berlin – Firmenfeiern, Releases, Private Events',
    description:
      'CN Event Agency – Event Concept & Production aus Berlin. Bar-Catering, Catering, Personal, Deko, Equipment, Event-Organisation und Social Media. Event selbst zusammenstellen und unverbindlich anfragen.',
  },
  hero: {
    media: 'konfetti-buehne-crowd' as MediaId,
    eyebrow: ['Event Concept & Production', 'Berlin'],
    lead: 'Firmenfeier, Release-Night, Hochzeit oder Produktion: Stell dein Event selbst zusammen, wir machen den Abend daraus.',
    cta: 'Event zusammenstellen',
    ctaSecondary: 'Leistungen ansehen',
    bar: ['Jetzt buchbar für Dezember', 'Antwort in 48 h', 'Berlin & Brandenburg'],
  },
  intro: {
    doors: 'Doors open',
    behind: '360°',
  },
  services: {
    kicker: 'Leistungen',
    title: 'Alles für deinen *Abend.*',
    text: 'Sieben Gewerke, ein Team. Fahr über eine Leistung, um sie aufzuklappen – im Shop legst du sie direkt in dein Event.',
    more: 'Mehr zur Leistung',
    toShop: 'Im Shop ansehen',
  },
  /** Event-Match: Kartenstapel zum Wischen (Anlass + Location + passende Leistung) */
  swipe: {
    kicker: 'Event-Match',
    title: 'Wischen. Merken. *Feiern.*',
    text: 'Keine Lust auf Formulare? Wisch dich durch Anlässe und Locations. Was dir gefällt, merkst du dir – am Ende zeigen wir dir, was dafür im Shop liegt.',
    steps: [
      { key: '→', label: 'Passt', text: 'Nach rechts wischen' },
      { key: '←', label: 'Weiter', text: 'Nach links wischen' },
      { key: '♥', label: 'Gemerkt', text: 'Deine Matches' },
    ],
    like: 'Passt',
    skip: 'Weiter',
    hint: 'Ziehen, wischen oder Pfeiltasten',
    doneTitle: 'Deine *Matches.*',
    doneEmpty: 'Noch nichts gemerkt. Nochmal?',
    restart: 'Nochmal wischen',
    toShop: 'Im Shop ansehen',
    cards: ph(
      [
        { title: 'Weihnachtsfeier im Loft', venue: 'Industrie-Loft · Kreuzberg', guests: '80–150 Gäste', fit: 'Paket M · Bar, Crew, Food', category: 'bar', media: 'weihnachtsbaum-kugeln' as MediaId },
        { title: 'Release-Night im Bunker', venue: 'Bunker West · Partner-Location', guests: 'bis 400 Gäste', fit: 'Licht, Sound, Einlass', category: 'technik', media: 'club-buehne-dunkel' as MediaId },
        { title: 'Rooftop-Afterwork', venue: 'Dachterrasse · Mitte', guests: 'bis 60 Gäste', fit: 'Mobile Bar & Signature-Drinks', category: 'bar', media: 'anstossen-nachts' as MediaId },
        { title: 'Sommerfest im Hof', venue: 'Hinterhof · Friedrichshain', guests: '100–250 Gäste', fit: 'Catering & Stehtische', category: 'catering', media: 'gartenparty-crowd' as MediaId },
        { title: 'Hochzeit im Glashaus', venue: 'Gewächshaus · Potsdam', guests: '60–120 Gäste', fit: 'Deko-Konzept & Floristik', category: 'deko', media: 'hochzeit-tafel' as MediaId },
        { title: 'Launch-Dinner', venue: 'Galerie · Schöneberg', guests: '30–80 Gäste', fit: 'Service-Crew & Flying Dinner', category: 'personal', media: 'fine-dining' as MediaId },
      ],
      'Venue-Vorschläge: echte Partner-Locations und Anlässe von Celia',
      'Partner',
    ),
  },
  shopEntry: {
    kicker: 'Shop',
    title: 'Stell dein Event *zusammen.*',
    text: 'Pakete als Startpunkt, Bar, Crew, Food, Licht und Möbel einzeln dazu. Am Ende fragst du unverbindlich an – ohne Bezahlung, ohne Login.',
    cta: 'Zum Shop',
  },
  highlights: {
    kicker: 'Galerie',
    title: 'Abende, die schon *gelaufen* sind.',
    items: ph(
      [
        { title: 'Winter Gala', meta: 'Firmenfeier · 280 Gäste', place: 'Berlin-Mitte', year: '2025', media: 'gala-tafel-kerzen' as MediaId },
        { title: 'Sneaker Release Night', meta: 'Brand-Event · 400 Gäste', place: 'Kreuzberg', year: '2025', media: 'sneaker-wand' as MediaId },
        { title: 'Hochzeit im Loft', meta: 'Privat · 120 Gäste', place: 'Potsdam', year: '2024', media: 'hochzeit-loft' as MediaId },
        { title: 'Musikvideo-Dreh', meta: 'Produktion · Set & Catering', place: 'Studio Lichtenberg', year: '2024', media: 'filmset-kamera' as MediaId },
      ],
      REF_NOTE,
      'Referenzen',
    ),
    cta: 'Zur Galerie',
    /** Rote Kachel am Ende der Plakatwand */
    archive: {
      kicker: 'Archiv',
      title: 'Noch mehr Nächte im *Archiv.*',
      count: 'Fotos aus echten Abenden',
    },
    no: 'Nr.',
  },
  voices: {
    kicker: 'Stimmen',
    title: 'Was Gäste *sagen.*',
    feedTitle: 'Neu auf Instagram',
    follow: 'Folge uns auf Instagram',
    allReviews: 'Alle Bewertungen auf Google',
    reviewsOf: 'Bewertungen',
  },
  finale: {
    lines: ['Lass uns', 'deinen Abend', 'machen.'],
    cta: 'Event zusammenstellen',
    secondary: 'Oder direkt anfragen',
  },
  bunker: {
    kicker: 'Exklusive Location',
    title: 'Bunker West',
    text: 'Beton, Geschichte, perfekte Akustik. Als exklusiver Partner planen wir Events im Bunker West von der ersten Idee bis zum letzten Gast.',
    cta: 'Location ansehen',
    codeLabel: 'Willkommens-Code',
    media: 'bunker-beton' as MediaId,
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
    /** Plakat-Headline im Seiten-Hero (das H1 oben bleibt für Google im Titel-Attribut/SEO) */
    poster: 'Content, der länger *läuft* als die Nacht.',
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
      { name: 'Sportswear-Brand (z. B. JD Sports)', text: 'Release-Content und Store-Event', media: 'sneaker-store-sw' as MediaId },
      { name: 'Artist-Kollektiv', text: 'Tour-Content und Skripte', media: 'artist-rauch-buehne' as MediaId },
    ],
    'Referenzen nur nach Freigabe der Beteiligten (Yami Club, JD Sports o. ä.)',
    'Referenzen',
  ),
  notFor: 'Kein Gastro-Content. Wir konzentrieren uns auf Events, Brands und Collectives.',
  cta: 'Social Media anfragen',
  statement: ['Ein Event dauert eine Nacht.', 'Der Content *Monate.*'],
  sections: {
    blocks: 'Bausteine',
    blocksTitle: 'Von der Strategie bis zum *fertigen Post.*',
    feed: 'Live aus dem Feed',
    feedTitle: 'Frisch *gepostet.*',
    process: 'Ablauf',
    processTitle: 'In vier *Schritten.*',
    refs: 'Referenzen',
    refsTitle: 'Für wen wir *drehen.*',
    finale: 'Lass uns über euren *Content* reden.',
    finaleText: 'Erstgespräch, 45 Minuten, unverbindlich. Danach wisst ihr, was eure Kanäle brauchen.',
  },
};

export const about = {
  seo: {
    title: 'Über uns – Event Concept & Production aus Berlin',
    description: 'Celia und das Team hinter CN Event Agency: Event Concept & Production aus Berlin, mit Netzwerk aus Crew, Partnerküchen, Technik und exklusiven Locations wie Bunker West.',
  },
  hero: { kicker: 'Über uns', h1: 'Wir sind die, die es dann *einfach machen.*', media: 'weisses-buehnenlicht-crowd' as MediaId },
  story: ph(
    'CN Event Agency ist aus einer einfachen Beobachtung entstanden: Die meisten Ideen für Events scheitern nicht an Kreativität, sondern an der Umsetzung. Zu viele Dienstleister, zu viele Absprachen, zu wenig Zeit. Wir sind die Abkürzung – Event Concept & Production aus einer Hand, mit einem Netzwerk, auf das wir uns verlassen.',
    'Geschichte der Agentur von Celia',
    'Texte',
    'P1',
  ),
  kickers: { whatWeDo: 'Was wir machen', story: 'Haltung', team: 'Team', network: 'Netzwerk' },
  whatWeDo: {
    title: 'Für jeden *Anlass.*',
    items: [
      { title: 'Firmenfeiern', text: 'Weihnachtsfeier, Sommerfest, Jubiläum, Konferenz. Ein Ansprechpartner, eine Rechnung.', media: 'weihnachtstafel-lichter' as MediaId, href: '/leistungen/event-organisation' },
      { title: 'Private Events', text: 'Hochzeit, runder Geburtstag, die Party, die du schon ewig schmeißen willst.', media: 'hochzeit-loft' as MediaId, href: '/leistungen/event-organisation' },
      { title: 'Brand- & Release-Events', text: 'Launches, Pop-ups, Store-Events – mit Gästeliste, Bar und Content.', media: 'sneaker-wand' as MediaId, href: '/leistungen/event-management' },
      { title: 'Produktionen', text: 'Musikvideos und Film: Set, Crew, Catering und Ablauf am Drehtag.', media: 'filmset-kamera' as MediaId, href: '/leistungen/event-management' },
    ],
  },
  values: [
    { title: 'Machen statt Moodboard', text: 'Wir lieben Ideen, aber wir messen uns am Abend selbst.' },
    { title: 'Ein Ansprechpartner', text: 'Du hast eine Nummer. Die geht ran.' },
    { title: 'Keine Standard-Events', text: 'Jeder Abend bekommt eine eigene Dramaturgie.' },
  ],
  teamTitle: 'Das *Team.*',
  storyTitle: 'Warum es uns *gibt.*',
  team: ph(
    [
      { name: 'Celia', role: 'Gründerin & Inhaberin', text: 'Idee, Angebot, Regie – bei jedem Event persönlich erreichbar.', media: 'planerin-notizbuch' as MediaId },
      { name: 'Josh', role: 'Social Media & Content', text: 'Strategie und Content für Brands und Collectives.', media: 'videograf' as MediaId },
      { name: 'Name folgt', role: 'Bar & Crew-Leitung', text: 'Hält am Abend Bar und Service zusammen.', media: 'barcrew-team' as MediaId },
      { name: 'Name folgt', role: 'Produktion & Technik', text: 'Aufbau, Licht, Ton – und der Plan B.', media: 'regie-silhouette' as MediaId },
    ],
    'Team: Namen, Rollen, Fotos und je ein Satz (Instagram-Highlight „Team“)',
    'Team',
    'P1',
  ),
  networkTitle: 'Netzwerk & Partner',
  network: ph(
    ['Bunker West · Location', 'Partnerküchen Berlin', 'Licht- & Tontechnik', 'Floristik', 'DJs & Live-Acts', 'Foto & Video'],
    'Netzwerk und Partner mit Celia bestätigen',
    'Partner',
  ),
  cta: 'Lass uns reden',
};

export const gallery = {
  seo: { title: 'Galerie: Events, Bars, Bühnen', description: 'Einblicke in Events von CN Event Agency: Firmenfeiern, Release-Events, Hochzeiten, Bars, Catering und Produktionen in Berlin.' },
  kicker: 'Galerie',
  h1: 'Beweis*fotos.*',
  countLabel: 'Momente aus echten Nächten',
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
    { media: 'champagner-turm-gold', services: ['bar-catering', 'dekoration'], occasion: 'Privat' },
    { media: 'neon-lets-party', services: ['dekoration'], occasion: 'Privat' },
    { media: 'filmset-kamera', services: ['event-management'], occasion: 'Produktion' },
    { media: 'gala-tafel-kerzen', services: ['event-organisation', 'dekoration'], occasion: 'Firma' },
    { media: 'sneaker-wand', services: ['event-organisation'], occasion: 'Brand' },
    { media: 'canapes-auswahl', services: ['catering'], occasion: 'Firma' },
    { media: 'mobile-bar-anhaenger', services: ['bar-catering'], occasion: 'Privat' },
    { media: 'pa-line-array', services: ['equipment-mieten'], occasion: 'Konzert' },
    { media: 'weihnachtsbaum-kugeln', services: ['dekoration'], occasion: 'Firma' },
    { media: 'mikrofon-blau', services: ['equipment-mieten'], occasion: 'Produktion' },
    { media: 'gartenparty-crowd', services: ['event-organisation'], occasion: 'Firma' },
    { media: 'bar-vintage', services: ['bar-catering'], occasion: 'Privat' },
    { media: 'konzert-pink', services: ['event-management'], occasion: 'Konzert' },
  ] as { media: MediaId; services: string[]; occasion: string }[],
};

export const arcade = {
  seo: {
    title: 'Afterhour Arcade: Retro-Minispiele',
    description: 'Drei Retro-Minispiele rund ums Event: Shaker Rush an der Bar, DJ Drop am Pult und Türsteher am Einlass. Spielbar im Browser, auf Handy und Desktop.',
  },
  kicker: 'Afterhour Arcade',
  h1: 'Insert *Coin.*',
  lead: 'Bevor du dein Event anfragst: drei Runden aus dem Nachtleben. Bar, Pult, Tür. Dein Highscore bleibt in deinem Browser.',
  ui: { start: 'Press Start', again: 'Nochmal', pause: 'Weiter', highscore: 'Best', newHigh: 'Neuer Highscore!' },
  games: [
    {
      id: 'shaker-rush' as const,
      title: 'Shaker Rush',
      tagline: 'Fang die Zutaten für den Signature-Drink.',
      howTo: 'Bewege den Shaker, fang die Zutaten aus dem Rezept oben links und weich den Bomben aus.',
      controls: ['← → / A D', 'Touch: Finger ziehen'],
      service: 'bar-catering',
    },
    {
      id: 'dj-drop' as const,
      title: 'DJ Drop',
      tagline: 'Halt die Crowd am Tanzen.',
      howTo: 'Triff die Noten genau auf der Linie. Jeder Treffer pusht die Crowd, jeder Fehler kostet Energie.',
      controls: ['D F J K oder Pfeiltasten', 'Touch: auf die Spur tippen'],
      service: 'event-management',
    },
    {
      id: 'tuersteher' as const,
      title: 'Türsteher',
      tagline: 'Nur mit dem richtigen Armband.',
      howTo: 'Oben steht, welche Armbänder heute rein dürfen. Entscheide schnell: rein oder nicht. Die Regel ändert sich.',
      controls: ['← Nein · Rein →', 'Touch: linke / rechte Hälfte'],
      service: 'personalvermittlung',
    },
  ],
  teaser: { kicker: 'Afterhour Arcade', title: 'Drei Runden *Nachtleben.*', text: 'Bar, Pult, Tür: drei Retro-Minispiele, die zeigen, was bei uns am Abend passiert. Spielbar auf Handy und Desktop.', cta: 'Zur Arcade' },
  outro: { title: 'Genug geübt?', cta: 'Echtes Event anfragen' },
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

export const shopPage = {
  seo: {
    title: 'Shop: Event zusammenstellen',
    description: 'Stell dein Event zusammen: mobile Bar, Crew, Catering, Deko, Licht, Sound, Möbel und fertige Pakete. Unverbindliches Angebot anfragen, ohne Bezahlung.',
  },
  kicker: 'Event zusammenstellen',
  h1: 'Alles für *deinen Abend.*',
  lead: 'Leg in dein Event, was du brauchst. Nichts davon kostet jetzt etwas: Am Ende fragst du ein unverbindliches Angebot an, Celia prüft Verfügbarkeit und meldet sich persönlich.',
  packagesTitle: 'Pakete als Startpunkt',
  itemsTitle: 'Einzeln dazu',
  all: 'Alles',
  /** Hinweis, wenn man von einer Leistungsseite oder aus dem Event-Match kommt */
  from: { label: 'Du kommst von', match: 'deinem Event-Match', preselected: 'Passende Kategorie ist vorausgewählt.', back: 'Zurück zur Leistung', showAll: 'Alles zeigen' },
  detail: { back: 'Zurück zum Shop', includes: 'Enthalten', fits: 'Passt zu', stock: 'Verfügbar', minQty: 'Mindestmenge', deposit: 'Kaution' },
  note: 'Unverbindlich. Kein Checkout, keine Zahlung.',
};

export const cartPage = {
  seo: { title: 'Dein Event', description: 'Deine Auswahl im Überblick – Mengen anpassen, Notizen ergänzen und unverbindlich anfragen.' },
  kicker: 'Warenkorb',
  lead: 'Mengen anpassen, Notizen ergänzen, dann unverbindlich anfragen. Celia prüft Verfügbarkeit und schickt dir ein persönliches Angebot.',
  empty: 'Noch nichts drin. Stöbere im Shop oder auf den Leistungsseiten.',
};

export const legal = {
  impressum: {
    title: 'Impressum',
    fields: {
      company: ph('CN Event Agency [Rechtsform]', 'Impressum: Firmenname und Rechtsform', 'Rechtliches', 'P2'),
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
      { h: '2. Anfrage-Formular', p: 'Wenn du uns über das Formular eine Anfrage schickst, verarbeiten wir deine Angaben (Name, Kontaktdaten, Eventdaten, Nachricht, Warenkorb-Inhalt) ausschließlich, um deine Anfrage zu beantworten und ein Angebot zu erstellen (Art. 6 Abs. 1 lit. b DSGVO). Du erhältst eine automatische Bestätigung per E-Mail.' },
      { h: '3. Speicherdauer', p: 'Anfragen speichern wir, solange es für die Bearbeitung nötig ist, und löschen sie spätestens nach Ablauf gesetzlicher Aufbewahrungsfristen.' },
      { h: '4. Shop & Warenkorb', p: 'Deine Auswahl wird nur lokal in deinem Browser gespeichert (localStorage), bis du ihn mit einer Anfrage abschickst. Es werden keine Cookies für Tracking gesetzt.' },
      { h: '5. Hosting & Schriften', p: 'Schriften werden lokal ausgeliefert, es findet kein Aufruf von Google-Servern statt. Angaben zum Hosting-Anbieter folgen.' },
      { h: '6. Deine Rechte', p: 'Du hast das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung, Datenübertragbarkeit und Widerspruch sowie ein Beschwerderecht bei einer Aufsichtsbehörde.' },
    ],
  },
  agb: {
    title: 'AGB & Mietbedingungen',
    note: ph('Vorlage, Mietbedingungen und AGB kommen von Celia', 'Mietbedingungen und AGB fehlen', 'Rechtliches'),
    sections: [
      { h: '1. Geltungsbereich', p: 'Diese Bedingungen gelten für alle Leistungen und Mietverträge von CN Event Agency. Die Website enthält kein verbindliches Angebot; Verträge kommen erst mit unserem schriftlichen Angebot und deiner Bestätigung zustande.' },
      { h: '2. Anfrage & Angebot', p: 'Preise im Shop sind unverbindliche Richtwerte. Maßgeblich ist ausschließlich das individuelle Angebot.' },
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
    gallery: 'Galerie',
    about: 'Über uns',
    social: 'Social Media',
    menu: 'Menü',
    close: 'Schließen',
  },
  cart: {
    empty: 'Noch nichts drin.',
    send: 'Unverbindliches Angebot anfragen',
    add: 'Zum Event hinzufügen',
    added: 'Im Event',
    onRequest: 'auf Anfrage',
    from: 'ab',
    deposit: 'Kaution',
    estimate: 'Richtwert',
    plusOnRequest: 'zzgl. Positionen auf Anfrage',
    clear: 'Alles entfernen',
    remove: 'Entfernen',
    note: 'Notiz',
    notePlaceholder: 'z. B. „Bar bitte in Weiß“',
    open: 'Ansehen',
    toPage: 'Zur Übersicht',
    positions: 'Positionen',
    admit: 'Admit one',
    summary: 'Zusammenfassung',
    noPayment: 'Unverbindlich. Kein Checkout, keine Zahlung.',
  },
  service: {
    whatWeDo: 'Was wir machen',
    occasions: 'Für welche Anlässe',
    process: 'So läuft’s',
    gallery: 'Eindrücke',
    fit: 'Im Shop zusammenstellen',
    fitTitle: 'Alles dafür liegt im *Shop.*',
    fitText: 'Wir nehmen dich mit: Der Shop öffnet mit der passenden Kategorie, du legst dir zusammen, was du brauchst, und fragst alles in einem Rutsch an.',
    fitLink: 'Im Shop zusammenstellen',
    fitIncludes: 'Zum Beispiel',
    faq: 'Fragen & Antworten',
    faqTitle: 'Gute Frage.',
    preselected: 'Kategorie vorausgewählt:',
    nextAct: 'Nächste Leistung',
    all: 'Alle Leistungen',
    teamTitle: 'Team',
  },
  footer: { contact: 'Kontakt', legal: 'Rechtliches', more: 'Mehr' },
  placeholder: 'Platzhalter',
};

export const adminUi = {
  title: 'Admin',
  login: {
    title: 'Anmelden',
    email: 'E-Mail',
    password: 'Passwort',
    submit: 'Anmelden',
    error: 'Zugangsdaten stimmen nicht.',
    demoHint: 'Demo-Zugang',
  },
  logout: 'Abmelden',
  tabs: { anfragen: 'Anfragen', mails: 'Mails', posts: 'Posts', rezensionen: 'Rezensionen', kalender: 'Kalender', demo: 'Demo' },
  status: {
    neu: 'Neu',
    'in-bearbeitung': 'In Bearbeitung',
    'angebot-raus': 'Angebot raus',
    gebucht: 'Gebucht',
    abgesagt: 'Abgesagt',
  },
  inquiries: {
    empty: 'Noch keine Anfragen.',
    all: 'Alle',
    detail: 'Details',
    contact: 'Kontakt',
    event: 'Event',
    cart: 'Warenkorb',
    message: 'Nachricht',
    notes: 'Interne Notizen',
    notesHint: 'Nur hier sichtbar, nicht für den Kunden.',
    saveNotes: 'Notizen speichern',
    reply: 'Antwort aus Vorlage',
    subject: 'Betreff',
    body: 'Text',
    send: 'Antwort senden',
    sent: 'Antwort im Postfach – Status auf „Angebot raus“ gesetzt.',
    back: '← Alle Anfragen',
  },
  mails: { empty: 'Noch keine Mails.', to: 'An', from: 'Von', replyTo: 'Antwort an', transport: 'Versand', demoTransport: 'Demo-Postfach (nicht verschickt)' },
  posts: { planned: 'Beiträge planen: vorbereitet, Umsetzung offen (Instagram Content Publishing API).', open: 'Auf Instagram öffnen' },
  reviews: { source: 'Quelle' },
  calendar: { hint: 'Klick auf einen Tag belegt ihn bzw. gibt ihn frei. Öffentlich sichtbar ist nur Belegt/Frei.' },
  demo: {
    hint: 'Nur im Demo-Modus. Im Live-Modus ist dieser Tab aus.',
    transition: 'Hero-Übergang „Doors open → 360°“',
    transitions: { punkte: 'Punkte – das Bild zerfällt in Punkte, die sich zur 360° formen', blende: 'Blende – das Bild schließt sich wie eine Kamerablende', ticket: 'Ticket – das Bild reißt an der Perforation auf' },
    slogan: 'Slogan-Variante (Hero)',
    flags: 'Feature-Flags',
    flagLabels: {
      showPrices: ['Preise anzeigen', 'Aus = überall „auf Anfrage“'],
      bunkerWestCode: ['Bunker-West-Willkommens-Code', 'ca. 10 %, noch mit Albi abstimmen'],
      showPlaceholders: ['Platzhalter markieren', 'gestrichelter Rahmen + Badge'],
    },
    placeholders: 'Platzhalter nach Priorität',
    placeholdersHint: 'P1 = vor dem Bau nötig · P2 = nach und nach (für den Livegang nur Domain + Impressum zwingend).',
    replayIntro: 'Intro erneut abspielen',
    reset: 'Demo-Daten zurücksetzen',
    resetConfirm: 'Alle Demo-Daten (Anfragen, Mails, Kalender, Einstellungen) zurücksetzen?',
    flow: 'Hauptflow testen: Startseite → Leistung → „Zum Event hinzufügen“ → Warenkorb → Anfrage → Danke → hier unter „Anfragen“.',
  },
};
