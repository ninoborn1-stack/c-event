import { ph, type Catalog, type CatalogItem, type CatalogPackage, type Price } from '@c-event/core';

const PRICE_NOTE = 'Artikel-Liste: Mietpreis aus Celias Liste (Name, Foto, Stückzahl, Mietpreis, Kaution)';
const STOCK_NOTE = 'Stückzahl fehlt';
const DEPOSIT_NOTE = 'Kaution fehlt';

const eur = (euro: number | null, unit: string, mode?: Price['mode']): Price => ({ amountCents: euro === null ? null : euro * 100, unit, ...(mode ? { mode } : {}) });
const price = (euro: number | null, unit: string) => ph(eur(euro, unit), PRICE_NOTE, 'Equipment & Preise');
const stock = (n: number) => ph(n, STOCK_NOTE, 'Equipment & Preise');
const deposit = (euro: number) => ph(euro * 100, DEPOSIT_NOTE, 'Equipment & Preise');
const short = (s: string) => ph(s, 'Artikeltext-Vorschlag, mit Celia abstimmen', 'Equipment & Preise');

const items: CatalogItem[] = [
  { id: 'mobile-bar', name: 'Mobile Bar, 3 m, beleuchtet', category: 'bar', services: ['bar-catering', 'equipment-mieten'], short: short('Modulare Theke mit LED-Front, Kühlfach und Spülstation.'), price: price(450, 'pro Event'), depositCents: deposit(300), stock: stock(2), media: 'mobile-bar-anhaenger' },
  { id: 'barkeeper', name: 'Barkeeper:in', category: 'personal', services: ['bar-catering', 'personalvermittlung'], short: short('Erfahrene Crew, Mindestbuchung 4 Stunden.'), price: price(45, 'pro Stunde'), stock: stock(60), minQty: 4, media: 'barkeeper-strainer' },
  { id: 'signature-drinks', name: 'Signature-Drink-Entwicklung', category: 'bar', services: ['bar-catering'], short: short('Zwei eigene Drinks inkl. Name und Karte, auch alkoholfrei.'), price: price(null, 'pauschal'), stock: stock(1), media: 'cocktail-dunkel' },
  { id: 'champagner-turm', name: 'Champagner-Turm Setup', category: 'bar', services: ['bar-catering', 'dekoration'], short: short('60 Coupes, Podest, Aufbau. Der Moment für das Foto.'), price: price(290, 'pro Event'), depositCents: deposit(150), stock: stock(1), media: 'champagner-turm-gold' },
  { id: 'servicekraft', name: 'Servicekraft', category: 'personal', services: ['personalvermittlung', 'catering'], short: short('Für Empfang, Dinner und Flying Buffet.'), price: price(38, 'pro Stunde'), stock: stock(120), minQty: 4, media: 'kellner-tablett' },
  { id: 'host', name: 'Host / Einlass / Garderobe', category: 'personal', services: ['personalvermittlung', 'event-management'], short: short('Gästeliste, Begrüßung, Wegeleitung.'), price: price(40, 'pro Stunde'), stock: stock(40), minQty: 4, media: 'eingang-einlass' },
  { id: 'aufbau-crew', name: 'Auf- & Abbau-Crew', category: 'personal', services: ['personalvermittlung', 'equipment-mieten'], short: short('Pro Person und Stunde, inkl. Werkzeug.'), price: price(35, 'pro Stunde'), stock: stock(60), minQty: 3, media: 'aufbau-open-air' },
  { id: 'fingerfood', name: 'Fingerfood-Auswahl', category: 'catering', services: ['catering'], short: short('Sechs Sorten, davon zwei vegan. Ab 20 Personen.'), price: price(24, 'pro Person'), stock: stock(1000), minQty: 20, media: 'canapes-auswahl' },
  { id: 'flying-dinner', name: 'Flying Dinner, 5 Gänge', category: 'catering', services: ['catering'], short: short('Kleine Gänge, herumgereicht. Ab 30 Personen.'), price: price(49, 'pro Person'), stock: stock(1000), minQty: 30, media: 'koch-anrichten' },
  { id: 'late-night-snack', name: 'Late-Night-Snack', category: 'catering', services: ['catering'], short: short('Um Mitternacht. Glaub uns, das wird der Moment.'), price: price(9, 'pro Person'), stock: stock(1000), minQty: 20, media: 'burger-late-night' },
  { id: 'deko-konzept', name: 'Deko-Konzept & Styling', category: 'deko', services: ['dekoration', 'event-organisation'], short: short('Moodboard, Planung und Styling vor Ort.'), price: price(null, 'pauschal'), stock: stock(1), media: 'deko-pink-tafel' },
  { id: 'tischdeko-floral', name: 'Tischdeko floral', category: 'deko', services: ['dekoration'], short: short('Saisonale Floristik und Kerzen pro Tisch.'), price: price(35, 'pro Tisch'), stock: stock(40), media: 'tischdeko-blumen' },
  { id: 'neon-schriftzug', name: 'Neon-Schriftzug individuell', category: 'deko', services: ['dekoration'], short: short('Dein Logo oder Satz als LED-Neon, bis 120 cm.'), price: price(180, 'pro Event'), depositCents: deposit(100), stock: stock(3), media: 'neon-lets-party' },
  { id: 'stehtisch', name: 'Stehtisch mit Husse', category: 'moebel', services: ['equipment-mieten', 'dekoration'], short: short('Ø 80 cm, Husse in Schwarz oder Creme.'), price: price(14, 'pro Stück'), depositCents: deposit(10), stock: stock(40), media: 'stehtische-saal' },
  { id: 'lounge-set', name: 'Lounge-Set', category: 'moebel', services: ['equipment-mieten', 'dekoration'], short: short('Sofa, zwei Sessel, Couchtisch.'), price: price(160, 'pro Event'), depositCents: deposit(150), stock: stock(4), media: 'lounge-sofas-gruen' },
  { id: 'designstuhl', name: 'Designstuhl gepolstert', category: 'moebel', services: ['equipment-mieten'], short: short('Für Dinner und gesetzte Events.'), price: price(9, 'pro Stück'), depositCents: deposit(5), stock: stock(120), media: 'stuhl-design' },
  { id: 'pa-anlage', name: 'PA-Anlage bis 200 Gäste', category: 'technik', services: ['equipment-mieten', 'event-management'], short: short('Zwei Tops, Sub, Mischpult, zwei Funkmikrofone.'), price: price(220, 'pro Event'), depositCents: deposit(300), stock: stock(2), media: 'pa-line-array' },
  { id: 'dj-setup', name: 'DJ-Setup', category: 'technik', services: ['equipment-mieten'], short: short('Zwei Player, Mixer, Monitor. DJ auf Wunsch dazu.'), price: price(150, 'pro Event'), depositCents: deposit(300), stock: stock(2), media: 'dj-mixer' },
  { id: 'licht-paket', name: 'Ambient-Licht-Paket', category: 'technik', services: ['equipment-mieten', 'dekoration'], short: short('12 Akku-Uplights, Farbe per App.'), price: price(140, 'pro Event'), depositCents: deposit(150), stock: stock(3), media: 'scheinwerfer-stativ' },
  { id: 'hazer', name: 'Hazer (Nebel)', category: 'technik', services: ['equipment-mieten'], short: short('Macht Licht sichtbar. Vorher mit der Location klären.'), price: price(60, 'pro Event'), stock: stock(2), media: 'buehne-lila-licht' },
  { id: 'event-leitung', name: 'Event-Leitung am Tag X', category: 'leistung', services: ['event-management'], short: short('Regie, Ablauf, Dienstleister, bis 12 Stunden.'), price: price(690, 'pro Tag'), stock: stock(3), media: 'regie-silhouette' },
  { id: 'konzept-planung', name: 'Konzept & Planung', category: 'leistung', services: ['event-organisation'], short: short('Vom Erstgespräch bis zum fertigen Ablaufplan.'), price: price(null, 'pauschal'), stock: stock(1), media: 'moodboard-bilder' },
];

const packages: CatalogPackage[] = [
  {
    id: 'paket-s',
    name: 'Paket S · Afterwork',
    tagline: 'Bar auf, Musik an, Feierabend.',
    guests: 'bis 50 Gäste',
    items: [
      { itemId: 'mobile-bar', qty: 1 },
      { itemId: 'barkeeper', qty: 8 },
      { itemId: 'stehtisch', qty: 6 },
      { itemId: 'licht-paket', qty: 1 },
    ],
    price: ph(eur(1490, 'pro Event', 'from'), 'Paketpreis-Vorschlag; Pakete und Preise kommen von Celia', 'Pakete', 'P1'),
    media: 'anstossen-nachts',
    services: ['bar-catering', 'equipment-mieten'],
  },
  {
    id: 'paket-m',
    name: 'Paket M · Weihnachtsfeier',
    tagline: 'Der Abend, von dem das Team im Januar noch redet.',
    guests: '50 – 150 Gäste',
    items: [
      { itemId: 'mobile-bar', qty: 1 },
      { itemId: 'barkeeper', qty: 12 },
      { itemId: 'servicekraft', qty: 16 },
      { itemId: 'fingerfood', qty: 100 },
      { itemId: 'tischdeko-floral', qty: 10 },
      { itemId: 'pa-anlage', qty: 1 },
    ],
    price: ph(eur(6900, 'pro Event', 'from'), 'Paketpreis-Vorschlag; Pakete und Preise kommen von Celia', 'Pakete', 'P1'),
    media: 'weihnachtstafel-lichter',
    services: ['event-organisation', 'catering', 'bar-catering'],
  },
  {
    id: 'paket-l',
    name: 'Paket L · Full Night',
    tagline: 'Alles. Konzept, Crew, Bar, Food, Licht, Regie.',
    guests: '150 – 400 Gäste',
    items: [
      { itemId: 'konzept-planung', qty: 1 },
      { itemId: 'event-leitung', qty: 1 },
      { itemId: 'mobile-bar', qty: 2 },
      { itemId: 'barkeeper', qty: 24 },
      { itemId: 'flying-dinner', qty: 200 },
      { itemId: 'lounge-set', qty: 2 },
      { itemId: 'dj-setup', qty: 1 },
      { itemId: 'licht-paket', qty: 2 },
    ],
    price: ph(eur(null, 'pro Event'), 'Paketpreis fehlt, Pakete und Preise kommen von Celia', 'Pakete'),
    media: 'funken-buehne-crowd',
    services: ['event-organisation', 'event-management'],
  },
];

export const catalog: Catalog = {
  categories: [
    { id: 'bar', label: 'Bar' },
    { id: 'personal', label: 'Crew' },
    { id: 'catering', label: 'Food' },
    { id: 'deko', label: 'Deko' },
    { id: 'moebel', label: 'Möbel' },
    { id: 'technik', label: 'Licht & Sound' },
    { id: 'leistung', label: 'Planung & Regie' },
  ],
  items,
  packages,
};
