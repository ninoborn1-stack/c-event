import { ph, type Placeholder } from '@c-event/core';

export interface MediaAsset {
  src: string;
  alt: string;
  width: number;
  height: number;
  kind: 'image' | 'video';
  poster?: string;
  credit: string;
  /** Stockmaterial = Platzhalter, bis Celias echte Fotos und Videos da sind. */
  stock: Placeholder<true> | false;
}

const STOCK_NOTE = 'Stockfoto, gegen echtes Event-Material von Celia tauschen';

const img = (file: string, alt: string, width: number, height: number, unsplashId: string): MediaAsset => ({
  src: `/stock/${file}.jpg`,
  alt,
  width,
  height,
  kind: 'image',
  credit: `Unsplash, Foto ${unsplashId} (Unsplash-Lizenz)`,
  stock: ph(true as const, STOCK_NOTE, 'Medien'),
});

/** Zentrale Medien-Registry. Alle Bilder und Videos laufen hierüber, Austausch 1:1 per ID. */
export const media = {
  'konfetti-buehne-crowd': img('konfetti-buehne-crowd', "Konfetti regnet über eine feiernde Menge vor einer beleuchteten Bühne", 2400, 1602, '1492684223066-81342ee5ff30'),
  'lichtshow-festival-buehne': img('lichtshow-festival-buehne', "Bunte Lichtshow und Konfetti über einem großen Publikum", 2400, 1800, '1514525253161-7a46d19cd819'),
  'weisses-buehnenlicht-crowd': img('weisses-buehnenlicht-crowd', "Weiße Scheinwerferstrahlen über einem Publikum mit erhobenen Händen", 2400, 1600, '1522158637959-30385a09e0da'),
  'crowd-herz-haende': img('crowd-herz-haende', "Gäste formen vor der Bühne ein Herz mit den Händen", 1600, 1067, '1429962714451-bb934ecdc4ec'),
  'buehne-gelbes-licht': img('buehne-gelbes-licht', "Bühne mit gelbem Licht vor einem dichten Publikum", 1600, 1067, '1459749411175-04bf5292ceea'),
  'buehne-gegenlicht-rauch': img('buehne-gegenlicht-rauch', "Gegenlicht und Rauch über einem Konzertpublikum", 1600, 1067, '1470229722913-7c0e2dbbafd3'),
  'firmenfeier-festsaal': img('firmenfeier-festsaal', "Eingedeckter Festsaal mit runden Tischen für eine Firmenfeier", 1600, 1068, '1464366400600-7168b8af9bc3'),
  'whisky-pour-bar': img('whisky-pour-bar', "Barkeeper gießt einen Drink über Eis auf dem Bartresen", 1600, 1069, '1470337458703-46ad1756a187'),
  'mikrofon-publikum': img('mikrofon-publikum', "Mikrofon im Vordergrund vor einem Publikum", 1600, 1067, '1475721027785-f74eccf877e2'),
  'haende-im-spotlight': img('haende-im-spotlight', "Erhobene Hände im Lichtkegel auf einer dunklen Tanzfläche", 1600, 1067, '1478147427282-58a87a120781'),
  'weihnachtsbaum-kugeln': img('weihnachtsbaum-kugeln', "Goldene Weihnachtskugel am Baum mit warmem Licht", 1600, 1068, '1482517967863-00e15c9b44be'),
  'anstossen-nachts': img('anstossen-nachts', "Gäste stoßen nachts mit Drinks an", 1600, 1660, '1485872299829-c673f5194813'),
  'artist-rauch-buehne': img('artist-rauch-buehne', "Artist auf der Bühne in Rauch und rotem Licht", 1600, 1067, '1493225457124-a3eb161ffa5f'),
  'dj-party-crowd': img('dj-party-crowd', "DJ am Pult vor einer tanzenden Menge mit Nebel", 1600, 1067, '1496337589254-7e19d01cec44'),
  'crowd-handy-licht': img('crowd-handy-licht', "Gäste filmen die Show mit dem Handy, buntes Bühnenlicht", 1600, 1067, '1501281668745-f7f57925c3b4'),
  'club-buehne-dunkel': img('club-buehne-dunkel', "Dunkle Clubbühne mit Lichttraversen", 1600, 1068, '1504680177321-2e6a879aac86'),
  'konfetti-blau-crowd': img('konfetti-blau-crowd', "Konfetti über einer Menge in blauem Licht", 1600, 965, '1505236858219-8359eb29e329'),
  'keynote-leinwand': img('keynote-leinwand', "Keynote mit großer Leinwand vor Publikum in einer Halle", 1600, 1143, '1505373877841-8d25f7d46678'),
  'festival-lila-licht': img('festival-lila-licht', "Festivalpublikum in lila Bühnenlicht", 1600, 1067, '1506157786151-b8491531f063'),
  'crowd-goldenes-licht': img('crowd-goldenes-licht', "Publikum mit erhobenen Händen im goldenen Gegenlicht", 1600, 1067, '1507874457470-272b3c8d8ee2'),
  'konferenzsaal': img('konferenzsaal', "Konferenzsaal mit Leinwänden und weißen Tischen", 1600, 1068, '1511578314322-379afb476865'),
  'dinner-tafel-blumen': img('dinner-tafel-blumen', "Lange Dinnertafel mit Blumen und Gläsern", 1600, 1068, '1511795409834-ef04bbd61622'),
  'konfetti-nah': img('konfetti-nah', "Buntes Konfetti in der Luft vor türkisem Hintergrund", 1600, 1067, '1513151233558-d860c5398176'),
  'bar-tresen-regal': img('bar-tresen-regal', "Bar mit beleuchtetem Flaschenregal und Hockern", 1600, 1200, '1514933651103-005eec06c04b'),
  'konzert-pink': img('konzert-pink', "Konzert mit pinkem und rotem Bühnenlicht", 1600, 1067, '1516450360452-9312f5e86fc7'),
  'gartenparty-crowd': img('gartenparty-crowd', "Gäste auf einer Party unter Lichterketten", 1600, 1068, '1517457373958-b7bdd4587205'),
  'hochzeit-tafel': img('hochzeit-tafel', "Festlich gedeckte Tafel mit Blumen und Kerzen", 1600, 1067, '1519225421980-715cb0215aed'),
  'weinglaeser-anstossen': img('weinglaeser-anstossen', "Gäste stoßen mit Weingläsern an", 1600, 1067, '1519671482749-fd09be7ccebf'),
  'klavier-detail': img('klavier-detail', "Tasten eines Flügels im warmen Licht", 1600, 1067, '1520523839897-bd0b52f945a0'),
  'konzert-bernstein': img('konzert-bernstein', "Konzertpublikum vor bernsteinfarbener Bühne", 1600, 1067, '1524368535928-5b5e00ddc76b'),
  'bar-flaschen-rot': img('bar-flaschen-rot', "Flaschen auf der Bar im roten Gegenlicht", 1600, 1065, '1525268323446-0505b6fe7778'),
  'mikrofon-blau': img('mikrofon-blau', "Mikrofon auf einer Bühne in blauem Licht", 1600, 1067, '1527261834078-9b37d35a4a32'),
  'dinner-gesellschaft': img('dinner-gesellschaft', "Gesellschaft beim gemeinsamen Dinner", 1600, 1067, '1528605248644-14dd04022da1'),
  'ballons-bunt': img('ballons-bunt', "Bunte Ballons an der Decke", 1600, 1067, '1530103862676-de8c9debad1d'),
  'funken-buehne-crowd': img('funken-buehne-crowd', "Funkenregen über einer Bühne und Publikum", 1600, 1068, '1533174072545-7a4b6ad7a6c3'),
  'cocktail-dunkel': img('cocktail-dunkel', "Dunkler Cocktail mit getrockneter Zitrusscheibe", 1600, 1167, '1536935338788-846bb9981813'),
  'publikum-dunkel': img('publikum-dunkel', "Publikum in einem abgedunkelten Saal", 1600, 1067, '1540575467063-178a50c2df87'),
  'tanzende-gaeste': img('tanzende-gaeste', "Gäste tanzen ausgelassen auf einer Party", 1600, 2397, '1541532713592-79a0317b6b77'),
  'cocktails-drei': img('cocktails-drei', "Drei bunte Cocktails auf einem Bartresen", 1600, 970, '1551024709-8f23befc6f87'),
  'buffet-catering': img('buffet-catering', "Buffet mit warmen Speisen in Chafing Dishes", 1600, 1067, '1555244162-803834f70033'),
  'talk-publikum': img('talk-publikum', "Publikum bei einem Talk in einem Loft", 1600, 1067, '1559223607-a43c990c692c'),
  'dessert-beeren': img('dessert-beeren', "Dessert mit Himbeeren auf dunklem Teller", 1600, 2000, '1565958011703-44f9829ba187'),
  'bar-lichter': img('bar-lichter', "Bar mit vielen warmen Glühbirnen", 1600, 1200, '1572116469696-31de0f17cc34'),
  'bar-vintage': img('bar-vintage', "Vintage-Bar mit Holztresen und Lichtern", 1600, 2133, '1574096079513-d8259312b785'),
  'stuhl-design': img('stuhl-design', "Gepolsterter Designstuhl vor hellem Hintergrund", 1600, 2000, '1598300042247-d088f8ab3a91'),
  'fine-dining': img('fine-dining', "Gedeckter Tisch mit Speisen und Weingläsern", 1600, 1067, '1414235077428-338989a2e8c0'),
  'video-dj-loop': {
    src: '/stock/video/dj-party-loop.webm',
    poster: '/stock/dj-party-crowd.jpg',
    alt: 'Kurzer Loop: DJ vor tanzender Menge',
    width: 1280,
    height: 720,
    kind: 'video',
    credit: 'Aus Unsplash-Foto 1496337589254 erzeugter Demo-Loop',
    stock: ph(true as const, 'Demo-Video, gegen echte Event-Videos tauschen', 'Medien'),
  },
  'video-funken-loop': {
    src: '/stock/video/funken-buehne-loop.webm',
    poster: '/stock/funken-buehne-crowd.jpg',
    alt: 'Kurzer Loop: Funkenregen über der Bühne',
    width: 1280,
    height: 720,
    kind: 'video',
    credit: 'Aus Unsplash-Foto 1533174072545 erzeugter Demo-Loop',
    stock: ph(true as const, 'Demo-Video, gegen echte Event-Videos tauschen', 'Medien'),
  },
} satisfies Record<string, MediaAsset>;

export type MediaId = keyof typeof media;

export function getMedia(id: string): MediaAsset {
  return (media as Record<string, MediaAsset>)[id] ?? media['konfetti-buehne-crowd'];
}
