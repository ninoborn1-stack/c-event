import { ph, type Maybe, type ServiceSlug } from '@c-event/core';
import type { MediaId } from './media';

export interface ServicePage {
  slug: ServiceSlug;
  name: string;
  /** Ein Satz für das Leistungs-Raster auf der Startseite. */
  line: string;
  seo: { title: string; description: string; h1: string; keywords: string[] };
  kicker: string;
  intro: Maybe<string>;
  hero: MediaId;
  points: Maybe<{ title: string; text: string }[]>;
  occasions: string[];
  process: { title: string; text: string }[];
  gallery: MediaId[];
  faq: Maybe<{ q: string; a: string }[]>;
  cta: string;
  /** Exklusive Partner-Location auf dieser Seite zeigen (Bunker West). */
  showPartnerLocation?: boolean;
}

const TEXT_NOTE = 'Text-Vorschlag von Nino. Celia liefert Stichpunkte, dann finaler Text';
const FAQ_NOTE = 'FAQ-Vorschlag. Durch echte Kundenfragen von Celia ersetzen';

const processFor = (offer: string, dayX: string) => [
  { title: 'Anfrage', text: 'Du erzählst uns Anlass, Datum, Ort und Gästezahl. Über das Formular, dauert zwei Minuten.' },
  { title: 'Angebot', text: `Celia meldet sich persönlich, klärt Details und schickt dir ein festes Angebot: ${offer}` },
  { title: 'Event', text: dayX },
];

export const services: ServicePage[] = [
  {
    slug: 'bar-catering',
    name: 'Bar-Catering',
    line: 'Mobile Bar, Crew und Signature-Drinks, aufgebaut wo immer du feierst.',
    seo: {
      title: 'Bar-Catering & mobile Bar mieten in Berlin',
      description:
        'Mobile Bar mit Barkeeper:innen für Firmenfeier, Weihnachtsfeier, Hochzeit und Release-Event in Berlin & Brandenburg. Signature-Drinks, Aufbau und Abbau inklusive. Jetzt anfragen.',
      h1: 'Bar-Catering in Berlin',
      keywords: ['mobile Bar mieten Berlin', 'Bar-Catering Firmenfeier', 'Cocktail-Catering Berlin'],
    },
    kicker: 'Act 01 · Die Bar',
    intro: ph(
      'Die Bar ist der Ort, an dem ein Abend kippt, vom höflichen Smalltalk zum Abend, über den man noch Wochen redet. Wir bringen sie mit: mobile Bar, eingespielte Crew, Eis, Glas, Karte. Du sagst, wie es sich anfühlen soll, wir mixen den Rest.',
      TEXT_NOTE,
    ),
    hero: 'whisky-pour-bar',
    points: ph(
      [
        { title: 'Mobile Bar', text: 'Modulare Bar-Theken, beleuchtet und in 60 Minuten startklar, drinnen wie draußen.' },
        { title: 'Bar-Crew', text: 'Barkeeper:innen, die Tempo können und trotzdem Gastgeber bleiben.' },
        { title: 'Signature-Drinks', text: 'Ein Drink, der nach deiner Marke, deinem Paar oder deinem Release schmeckt und so heißt.' },
        { title: 'Alles drumherum', text: 'Glas, Eis, Spülstation, Aufbau, Abbau. Du musst an nichts denken.' },
      ],
      TEXT_NOTE,
    ),
    occasions: ['Weihnachtsfeier', 'Sommerfest', 'Release-Night', 'Hochzeit', 'Vernissage', 'Afterwork'],
    process: processFor('Bar, Crew, Karte, Menge.', 'Wir bauen auf, mixen bis zum letzten Gast und räumen wieder ab.'),
    gallery: ['cocktails-drei', 'bar-lichter', 'cocktail-dunkel', 'bar-tresen-regal', 'anstossen-nachts', 'bar-flaschen-rot'],
    faq: ph(
      [
        { q: 'Ab wie vielen Gästen lohnt sich eine mobile Bar?', a: 'Ab etwa 30 Gästen. Nach oben gibt es keine Grenze, ab 150 Gästen planen wir mehrere Stationen.' },
        { q: 'Bringt ihr Getränke und Eis mit?', a: 'Ja, auf Wunsch komplett. Du kannst auch eigene Getränke stellen, dann rechnen wir nur Bar und Crew ab.' },
        { q: 'Wie viel Platz braucht die Bar?', a: 'Eine Standard-Bar braucht etwa 3 × 2 Meter und einen normalen Stromanschluss.' },
        { q: 'Gibt es alkoholfreie Signature-Drinks?', a: 'Immer. Jede Karte hat mindestens zwei alkoholfreie Drinks, die nicht nach Kompromiss schmecken.' },
      ],
      FAQ_NOTE,
    ),
    cta: 'Bar anfragen',
  },
  {
    slug: 'personalvermittlung',
    name: 'Personalvermittlung',
    line: 'Service, Bar, Hosts und Aufbau-Crew, eingespielt statt zusammengewürfelt.',
    seo: {
      title: 'Eventpersonal in Berlin: Service, Bar, Hosts & Crew',
      description:
        'Eventpersonal für Berlin & Brandenburg: Servicekräfte, Barkeeper:innen, Hosts, Einlass und Auf-/Abbau-Crew für Firmenfeiern, Messen und private Events. Kurzfristig anfragen.',
      h1: 'Eventpersonal in Berlin',
      keywords: ['Eventpersonal Berlin', 'Servicekräfte Event', 'Hostessen Berlin'],
    },
    kicker: 'Act 02 · Die Crew',
    intro: ph(
      'Gute Events sieht man an den Leuten, die man kaum bemerkt. Wir stellen dir Crew zusammen, die schon zusammen gearbeitet hat: Service, Bar, Einlass, Garderobe, Auf- und Abbau. Gebrieft, pünktlich, passend gekleidet.',
      TEXT_NOTE,
    ),
    hero: 'tanzende-gaeste',
    points: ph(
      [
        { title: 'Service & Runner', text: 'Für Dinner, Flying Buffet und Empfang, mit Erfahrung bei 20 bis 800 Gästen.' },
        { title: 'Bar-Personal', text: 'Barkeeper:innen und Barbacks, auch ohne unsere Bar buchbar.' },
        { title: 'Hosts & Einlass', text: 'Gästeliste, Garderobe, Wegeleitung. Der erste Eindruck deines Events.' },
        { title: 'Auf- & Abbau', text: 'Kräftige Hände und ein klarer Plan, damit der Raum pünktlich steht.' },
      ],
      TEXT_NOTE,
    ),
    occasions: ['Firmenfeier', 'Messe', 'Konferenz', 'Gala', 'Private Feier', 'Produktion'],
    process: processFor('Rollen, Stunden, Stundensätze.', 'Eine Crew-Leitung von uns ist vor Ort und dein einziger Ansprechpartner.'),
    gallery: ['dinner-gesellschaft', 'firmenfeier-festsaal', 'weinglaeser-anstossen', 'talk-publikum'],
    faq: ph(
      [
        { q: 'Wie kurzfristig kann ich Personal buchen?', a: 'Oft innerhalb einer Woche. Für Dezember empfehlen wir, bis Ende Oktober anzufragen.' },
        { q: 'Was trägt das Personal?', a: 'Standard ist Schwarz, schlicht und elegant. Branding oder Dresscode stimmen wir gern mit dir ab.' },
        { q: 'Gibt es eine Mindestbuchung?', a: 'Ja, in der Regel vier Stunden pro Person, inklusive Briefing vor Ort.' },
      ],
      FAQ_NOTE,
    ),
    cta: 'Crew anfragen',
  },
  {
    slug: 'catering',
    name: 'Catering',
    line: 'Food, das zum Format passt: Flying Dinner, Buffet oder Late-Night-Snack.',
    seo: {
      title: 'Event-Catering in Berlin für Firmen & Feiern',
      description:
        'Event-Catering in Berlin & Brandenburg: Fingerfood, Flying Dinner, Buffet und Late-Night-Snacks für Firmenfeiern, Weihnachtsfeiern und private Events. Passend zum Format.',
      h1: 'Event-Catering in Berlin',
      keywords: ['Event-Catering Berlin', 'Catering Weihnachtsfeier', 'Fingerfood Catering Berlin'],
    },
    kicker: 'Act 03 · Das Essen',
    intro: ph(
      'Essen muss zum Abend passen. Beim Stehempfang will niemand mit Messer und Gabel kämpfen, beim Dinner niemand Häppchen jagen. Wir planen Food nach Format: was, wann, in welchem Tempo, und mit Partnerküchen, die wir seit Jahren kennen.',
      TEXT_NOTE,
    ),
    hero: 'fine-dining',
    points: ph(
      [
        { title: 'Fingerfood & Flying Dinner', text: 'Kleine Gänge, die herumgereicht werden. Ideal, wenn Leute reden und sich bewegen sollen.' },
        { title: 'Buffet & Dinner', text: 'Vom lockeren Buffet bis zum gesetzten Mehrgang-Menü.' },
        { title: 'Late-Night-Snack', text: 'Der Moment um Mitternacht, an den sich alle erinnern.' },
        { title: 'Alle Ernährungsformen', text: 'Vegetarisch, vegan, glutenfrei, ohne dass es als Sonderwunsch auffällt.' },
      ],
      TEXT_NOTE,
    ),
    occasions: ['Weihnachtsfeier', 'Empfang', 'Hochzeit', 'Produktion am Set', 'Sommerfest'],
    process: processFor('Menü, Mengen, Preis pro Person.', 'Unsere Partnerküche liefert, unser Service serviert.'),
    gallery: ['buffet-catering', 'dessert-beeren', 'dinner-tafel-blumen', 'fine-dining'],
    faq: ph(
      [
        { q: 'Kocht ihr selbst?', a: 'Wir arbeiten mit festen Partnerküchen in Berlin und übernehmen Planung, Service und Ablauf.' },
        { q: 'Gibt es eine Verkostung?', a: 'Ab 80 Gästen bieten wir eine Verkostung an. Die Kosten werden bei Buchung verrechnet.' },
        { q: 'Ab wie vielen Personen?', a: 'Ab 20 Personen. Darunter ist es eher ein Dinner, auch das geht, sprich uns an.' },
      ],
      FAQ_NOTE,
    ),
    cta: 'Catering anfragen',
  },
  {
    slug: 'event-management',
    name: 'Event-Management',
    line: 'Am Tag X hält eine Person alle Fäden. Du feierst, wir steuern.',
    seo: {
      title: 'Event-Management in Berlin: Ablauf & Regie am Tag X',
      description:
        'Event-Management in Berlin: Regie, Ablaufplan, Dienstleister-Koordination und Krisenmanagement am Veranstaltungstag. Für Firmenevents, Galas, Releases und Produktionen.',
      h1: 'Event-Management in Berlin',
      keywords: ['Event-Management Berlin', 'Eventagentur Berlin', 'Veranstaltungsleitung'],
    },
    kicker: 'Act 04 · Die Regie',
    intro: ph(
      'Der Tag X ist ein Live-Auftritt ohne zweite Chance. Wir übernehmen die Regie: Ablaufplan, Timing, Dienstleister, Technik-Cues, und den einen Anruf, wenn der DJ im Stau steht. Du bist Gastgeber:in, nicht Feuerwehr.',
      TEXT_NOTE,
    ),
    hero: 'buehne-gelbes-licht',
    points: ph(
      [
        { title: 'Ablaufplan & Regie', text: 'Minutengenauer Run-of-Show, den alle Beteiligten vorher kennen.' },
        { title: 'Dienstleister-Steuerung', text: 'Location, Technik, Catering, Artists: ein Ansprechpartner statt zwanzig.' },
        { title: 'Live-Koordination', text: 'Funk, Cues und Entscheidungen in Echtzeit.' },
        { title: 'Plan B', text: 'Wetter, Ausfälle, Verspätungen. Wir haben immer eine zweite Lösung in der Tasche.' },
      ],
      TEXT_NOTE,
    ),
    occasions: ['Gala', 'Konferenz', 'Release-Event', 'Konzert', 'Musikvideo-Dreh'],
    process: processFor('Leistungsumfang und Tagessatz.', 'Wir sind ab Aufbau vor Ort und gehen als Letzte.'),
    gallery: ['buehne-gegenlicht-rauch', 'mikrofon-publikum', 'keynote-leinwand', 'club-buehne-dunkel'],
    faq: ph(
      [
        { q: 'Was ist der Unterschied zur Event-Organisation?', a: 'Organisation ist die Planung davor, Management die Steuerung am Tag selbst. Beides gibt es einzeln oder zusammen.' },
        { q: 'Übernehmt ihr auch Events, die wir selbst geplant haben?', a: 'Ja. Wir steigen ein paar Wochen vorher ein, prüfen den Plan und übernehmen die Regie.' },
        { q: 'Wie viele Leute bringt ihr mit?', a: 'Je nach Größe eine Event-Leitung plus Assistenz. Ab 300 Gästen meist ein Team von drei.' },
      ],
      FAQ_NOTE,
    ),
    cta: 'Regie anfragen',
  },
  {
    slug: 'event-organisation',
    name: 'Event-Organisation',
    line: 'Von der ersten Idee bis zum letzten Song: Konzept, Location, Programm, alles.',
    seo: {
      title: 'Event-Organisation Berlin: Weihnachtsfeier, Firmenevent & mehr',
      description:
        'Eventagentur in Berlin für die komplette Organisation: Konzept, Location, Programm, Catering, Technik und Deko. Firmen-Weihnachtsfeier, Sommerfest, Release-Event oder Konzert im Heißluftballon.',
      h1: 'Event-Organisation in Berlin',
      keywords: ['Weihnachtsfeier organisieren Firma', 'Eventagentur Berlin', 'Firmenevent planen'],
    },
    kicker: 'Act 05 · Die Idee',
    intro: ph(
      'Du hast eine Idee, ein Datum oder nur das Gefühl, dass es dieses Jahr anders werden soll. Wir machen daraus ein Event: Konzept, Location, Programm, Dienstleister, Budget. 360°, aus einer Hand, und gern auch etwas, das es so noch nicht gab.',
      TEXT_NOTE,
    ),
    hero: 'konfetti-blau-crowd',
    points: ph(
      [
        { title: 'Konzept & Dramaturgie', text: 'Ein roter Faden vom Einlass bis zum Ende, kein Programm-Flickenteppich.' },
        { title: 'Location-Scouting', text: 'Von der Fabriketage bis zu exklusiven Partner-Locations wie Bunker West.' },
        { title: 'Programm & Artists', text: 'DJs, Live-Acts, Speaker, Überraschungsmomente.' },
        { title: 'Budget & Planung', text: 'Transparent kalkuliert, mit klaren Meilensteinen.' },
      ],
      TEXT_NOTE,
    ),
    occasions: ['Firmen-Weihnachtsfeier', 'Sommerfest', 'Jubiläum', 'Release-Event', 'Konzert', 'Hochzeit'],
    process: processFor('Konzept, Zeitplan, Budget.', 'Wir organisieren alles bis zum Tag X und übernehmen auf Wunsch auch die Regie.'),
    gallery: ['konfetti-buehne-crowd', 'gartenparty-crowd', 'firmenfeier-festsaal', 'crowd-herz-haende', 'weihnachtsbaum-kugeln'],
    faq: ph(
      [
        { q: 'Wie früh sollten wir eine Weihnachtsfeier planen?', a: 'Idealerweise im Sommer. Für Dezember-Termine sind gute Locations ab Oktober knapp.' },
        { q: 'Habt ihr eigene Locations?', a: 'Wir arbeiten mit festen Partnern, zum Beispiel exklusiv mit Bunker West, und finden auch alles andere.' },
        { q: 'Macht ihr auch verrückte Ideen?', a: 'Gerade die. Vom Konzert im Heißluftballon bis zum Pop-up in einem leeren Kaufhaus.' },
        { q: 'Was kostet eine komplette Organisation?', a: 'Das hängt von Umfang und Gästezahl ab. Nach dem Erstgespräch bekommst du ein transparentes Angebot.' },
      ],
      FAQ_NOTE,
    ),
    cta: 'Event planen lassen',
    showPartnerLocation: true,
  },
  {
    slug: 'dekoration',
    name: 'Dekoration',
    line: 'Licht, Floristik, Möbel, Neon: Atmosphäre, die man fotografieren will.',
    seo: {
      title: 'Eventdekoration in Berlin: Licht, Floristik & Styling',
      description:
        'Eventdekoration in Berlin & Brandenburg: Deko-Konzepte, Floristik, Licht, Lounge-Möbel und Neon-Schriftzüge für Firmenfeiern, Hochzeiten und Brand-Events.',
      h1: 'Eventdekoration in Berlin',
      keywords: ['Eventdekoration Berlin', 'Deko Weihnachtsfeier', 'Hochzeitsdeko Berlin'],
    },
    kicker: 'Act 06 · Die Atmosphäre',
    intro: ph(
      'Ein Raum ist ein Versprechen. Wir machen aus einer leeren Halle einen Ort, an dem man bleiben will: mit Licht, das schmeichelt, Blumen, die nicht nach Standard aussehen, und Details, die auf jedem Foto landen.',
      TEXT_NOTE,
    ),
    hero: 'hochzeit-tafel',
    points: ph(
      [
        { title: 'Deko-Konzept', text: 'Moodboard, Farbwelt, Materialien, abgestimmt auf Marke oder Anlass.' },
        { title: 'Floristik', text: 'Tischdeko, Installationen, Statement-Pieces.' },
        { title: 'Licht', text: 'Uplights, Lichterketten, Spots. Licht macht 80 % der Stimmung.' },
        { title: 'Möbel & Neon', text: 'Lounge-Sets, Stehtische, individuelle Neon-Schriftzüge.' },
      ],
      TEXT_NOTE,
    ),
    occasions: ['Hochzeit', 'Weihnachtsfeier', 'Brand-Event', 'Geburtstag', 'Gala'],
    process: processFor('Moodboard, Stückliste, Preis.', 'Wir dekorieren vor Ort und bauen danach alles wieder ab.'),
    gallery: ['dinner-tafel-blumen', 'hochzeit-tafel', 'ballons-bunt', 'bar-lichter', 'weihnachtsbaum-kugeln'],
    faq: ph(
      [
        { q: 'Kann ich Deko auch nur mieten?', a: 'Ja, viele Stücke findest du direkt im Konfigurator. Styling vor Ort buchst du optional dazu.' },
        { q: 'Macht ihr auch Branding?', a: 'Ja: Neon-Logos, Fotowände, Tischaufsteller im CI deiner Marke.' },
        { q: 'Wie lange vorher baut ihr auf?', a: 'Je nach Umfang zwei bis acht Stunden. Wir stimmen das mit der Location ab.' },
      ],
      FAQ_NOTE,
    ),
    cta: 'Deko anfragen',
  },
  {
    slug: 'equipment-mieten',
    name: 'Equipment-Vermietung',
    line: 'Ausgesuchtes Sortiment statt Lagerhalle: Bar, Licht, Sound, Möbel.',
    seo: {
      title: 'Eventequipment mieten in Berlin: Bar, Licht, Sound & Möbel',
      description:
        'Eventequipment mieten in Berlin: mobile Bar, Stehtische, Lounge-Möbel, PA-Anlage, DJ-Setup und Licht. Online zusammenstellen, unverbindlich anfragen, persönliches Angebot.',
      h1: 'Eventequipment mieten in Berlin',
      keywords: ['Eventequipment mieten Berlin', 'Stehtische mieten Berlin', 'PA-Anlage mieten'],
    },
    kicker: 'Act 07 · Das Equipment',
    intro: ph(
      'Kein Katalog mit 4.000 Positionen, sondern das, was wir selbst auf unseren Events einsetzen. Ausgesucht, gepflegt, getestet. Stell dir im Konfigurator zusammen, was du brauchst, wir prüfen Verfügbarkeit und schicken dir ein Angebot.',
      TEXT_NOTE,
    ),
    hero: 'dj-party-crowd',
    points: ph(
      [
        { title: 'Bar & Gastro', text: 'Mobile Bar-Module, Champagner-Turm, Kühlung.' },
        { title: 'Sound & DJ', text: 'PA-Anlagen bis 200 Gäste, DJ-Setup, Funkmikrofone.' },
        { title: 'Licht & Effekte', text: 'Akku-Uplights, Hazer, Lichterketten.' },
        { title: 'Möbel', text: 'Stehtische mit Hussen, Lounge-Sets, Designstühle.' },
      ],
      TEXT_NOTE,
    ),
    occasions: ['Firmenfeier', 'Private Party', 'Pop-up', 'Produktion', 'Hochzeit'],
    process: processFor('Verfügbarkeit, Mietpreis, Kaution.', 'Lieferung, Aufbau und Abholung auf Wunsch, sonst Abholung bei uns.'),
    gallery: ['stuhl-design', 'dj-party-crowd', 'bar-vintage', 'club-buehne-dunkel'],
    faq: ph(
      [
        { q: 'Gibt es eine Kaution?', a: 'Bei einigen Artikeln ja. Sie steht direkt am Artikel und wird nach Rückgabe erstattet.' },
        { q: 'Liefert ihr?', a: 'Ja, in Berlin und Brandenburg. Anfahrtskosten stehen im Angebot.' },
        { q: 'Kann ich vor Ort abholen?', a: 'Ja, nach Absprache. Die Abholadresse bekommst du mit dem Angebot.' },
      ],
      FAQ_NOTE,
    ),
    cta: 'Equipment anfragen',
  },
];

export function getService(slug: string): ServicePage | undefined {
  return services.find((s) => s.slug === slug);
}
