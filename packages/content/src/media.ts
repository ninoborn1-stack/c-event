import { ph, type Placeholder } from '@c-event/core';

export interface MediaAsset {
  src: string;
  alt: string;
  width: number;
  height: number;
  kind: 'image' | 'video';
  poster?: string;
  credit: string;
  /** Gewünschtes Motiv – damit Celias Material 1:1 zugeordnet werden kann */
  motif: string;
  /** Stockmaterial = Platzhalter, bis Celias echte Fotos und Videos da sind. */
  stock: Placeholder<true> | false;
}

const STOCK_NOTE = 'Stockfoto, gegen echtes Event-Material von Celia tauschen';

/** Wunschmotive für die wichtigsten Positionen (Rest: aus dem Alt-Text abgeleitet) */
const MOTIFS: Record<string, string> = {
  'konfetti-buehne-crowd': 'HERO: Clip 10–30 s, quer + hochkant – Höhepunkt eines Abends (Konfetti, volle Tanzfläche, Bühne)',
  'whisky-pour-bar': 'Bar-Catering Hero: Bar in Aktion, warmes Licht, Hände beim Mixen',
  'service-kellnerin': 'Personal Hero: Service-Crew im Einsatz auf vollem Event',
  'buffet-gaeste': 'Catering Hero: Gäste am Buffet / Flying Dinner, warmes Licht',
  'buehne-traversen': 'Event-Management Hero: Bühne/Technik beim Aufbau oder Show-Moment',
  'konfetti-blau-crowd': 'Event-Organisation Hero: Gesamtbild eines eurer Events',
  'hochzeit-tafel': 'Dekoration Hero: dekorierte Tafel oder Raum im Detail',
  'lichtshow-buehne': 'Equipment Hero: euer Equipment im Einsatz (Licht, Sound, Bar)',
  'bunker-beton': 'Bunker West: Außen- oder Innenansicht der Location',
  'planerin-notizbuch': 'Team: Porträt Celia',
  'videograf': 'Team: Porträt Josh',
  'barcrew-team': 'Team: Porträt Bar & Crew-Leitung',
  'regie-silhouette': 'Team: Porträt Produktion & Technik',
};

const img = (file: string, alt: string, width: number, height: number, unsplashId: string): MediaAsset => ({
  src: `/stock/${file}.jpg`,
  alt,
  width,
  height,
  kind: 'image',
  credit: `Unsplash, Foto ${unsplashId} (Unsplash-Lizenz)`,
  motif: MOTIFS[file] ?? `Eigenes Foto: ${alt}`,
  stock: ph(true as const, STOCK_NOTE, 'Medien', 'P1'),
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
  'mobile-bar-anhaenger': img('mobile-bar-anhaenger', "Mobile Bar in einem Anhänger mit Lichterketten bei Nacht", 1600, 1200, '1759415343170-6debcde7eb6d'),
  'barkeeper-strainer': img('barkeeper-strainer', "Barkeeper gießt einen Drink durch das Barsieb in ein Coupe-Glas", 1600, 2400, '1644809818390-9a441722ae24'),
  'champagner-turm-gold': img('champagner-turm-gold', "Pyramide aus Champagnergläsern mit goldenem Sekt", 1600, 2400, '1780435167958-184d3f2cb7aa'),
  'kellner-tablett': img('kellner-tablett', "Kellner trägt ein Tablett mit Drinks durch den Raum", 1600, 1063, '1516788875874-c5912cae7b43'),
  'eingang-einlass': img('eingang-einlass', "Verzierter Eingang einer Location, an dem Gäste begrüßt werden", 1600, 2400, '1742753751080-72b78bde2513'),
  'aufbau-open-air': img('aufbau-open-air', "Aufgebaute Tischreihen und Bühnentraversen vor einem Open-Air-Event", 1600, 1067, '1759306221569-028a35bc8c66'),
  'canapes-auswahl': img('canapes-auswahl', "Auswahl an Canapés und Fingerfood auf einer Platte", 1600, 1067, '1771154136172-0633db70b7dc'),
  'koch-anrichten': img('koch-anrichten', "Fein angerichteter Teller mit Fisch und Gemüse", 1600, 1600, '1676471926534-d5c9771909fa'),
  'burger-late-night': img('burger-late-night', "Burger mit Pommes als Late-Night-Snack", 1600, 2400, '1610440042657-612c34d95e9f'),
  'deko-pink-tafel': img('deko-pink-tafel', "Festlich dekorierter Saal mit pinkem Licht und runden Tischen", 1600, 1067, '1653821355736-0c2598d0a63e'),
  'tischdeko-blumen': img('tischdeko-blumen', "Gedeckter Tisch mit Blumenarrangement und Gläsern", 1600, 1067, '1758810743028-6b8e150ec98f'),
  'neon-lets-party': img('neon-lets-party', "Pinker Neon-Schriftzug „Let’s Party“ vor Glitzervorhang", 1600, 2133, '1640103856233-833930665307'),
  'stehtische-saal': img('stehtische-saal', "Leerer Veranstaltungsraum mit eingedeckten Stehtischen", 1600, 1065, '1768851244529-39180171a168'),
  'lounge-sofas-gruen': img('lounge-sofas-gruen', "Grüne Chesterfield-Sofas als Lounge mit Blumen", 1600, 1068, '1769812343786-c8cdbd73f3cd'),
  'pa-line-array': img('pa-line-array', "Hängender Line-Array-Lautsprecher an einer Bühnentraverse", 1600, 1069, '1563680401337-b77b5e0be9f7'),
  'dj-mixer': img('dj-mixer', "DJ-Setup mit Mixer und Laptop im Clublicht", 1600, 1067, '1571266028243-d220c6a7edbf'),
  'lichtshow-buehne': img('lichtshow-buehne', "Bühnenbeleuchtung mit blauen und orangen Lichtstrahlen", 2400, 1600, '1758706552632-64ab529c2631'),
  'scheinwerfer-stativ': img('scheinwerfer-stativ', "Moving Head Scheinwerfer im Rauch", 1600, 2395, '1681149341674-45fd772fd463'),
  'buehne-lila-licht': img('buehne-lila-licht', "Leere Bühne mit lila Licht und Nebel", 1600, 1200, '1576514129883-2f1d47a65da6'),
  'regie-silhouette': img('regie-silhouette', "Silhouette einer Person mit Stativ vor der beleuchteten Bühne", 1600, 1067, '1777671291459-111add7d4e72'),
  'moodboard-bilder': img('moodboard-bilder', "Moodboard mit Fotos und Materialien auf einem Tisch", 1600, 2400, '1690733546457-029606fbc0e6'),
  'weihnachtstafel-lichter': img('weihnachtstafel-lichter', "Festliche Weihnachtstafel unter Lichterketten", 1600, 2405, '1763463608554-1a1d7ec7147b'),
  'gala-tafel-kerzen': img('gala-tafel-kerzen', "Lange Gala-Tafel mit Kerzen und Blumen", 1600, 1067, '1536392706976-e486e2ba97af'),
  'sneaker-wand': img('sneaker-wand', "Wand mit Sneakern in einem Store", 1600, 1050, '1633464129147-777bdcc97c1d'),
  'sneaker-store-sw': img('sneaker-store-sw', "Sneaker-Regal in einem Store, schwarz-weiß", 1600, 2395, '1708088641654-d096243830c1'),
  'party-lichterketten': img('party-lichterketten', "Gäste feiern unter Lichterketten auf einer Sommerparty", 1600, 1068, '1517456793572-1d8efd6dc135'),
  'filmset-kamera': img('filmset-kamera', "Professionelle Filmkamera am Set eines Drehs", 1600, 1067, '1594394489098-74ac04c0fc2e'),
  'videograf': img('videograf', "Videograf mit Kamera im roten Licht", 1600, 1066, '1611784728558-6c7d9b409cdf'),
  'hochzeit-loft': img('hochzeit-loft', "Hochzeitstafeln in einem Loft mit Lichterketten", 1600, 2253, '1723832348105-2e69f948135a'),
  'ballons-nacht': img('ballons-nacht', "Leuchtende Heißluftballons in der Nacht über dem Wasser", 1600, 1067, '1756839413014-70f8f9b17875'),
  'planerin-notizbuch': img('planerin-notizbuch', "Frau schreibt in ein Notizbuch und plant", 1600, 2400, '1621606676970-fc3a0a39aa96'),
  'barcrew-team': img('barcrew-team', "Drei lächelnde Barkeeper:innen hinter der Bar", 1600, 900, '1758526348403-b729c700d675'),
  'bunker-beton': img('bunker-beton', "Brutalistischer Betonbunker mit begrüntem Dach", 1600, 1200, '1783667598871-f052152df9f1'),
  'buffet-gaeste': img('buffet-gaeste', "Gäste am Buffet bei einem Event", 2400, 1349, '1768508663341-ed48fd1e69d8'),
  'buehne-traversen': img('buehne-traversen', "Bühne mit Traversen und Lichtstrahlen im Dunkeln", 2400, 1590, '1598387992836-7e365d21602a'),
  'service-kellnerin': img('service-kellnerin', "Kellnerin serviert Drinks auf einem vollen Event", 2400, 1600, '1776603174157-bf286ef86149'),
  'video-dj-loop': {
    src: '/stock/video/dj-party-loop.webm',
    poster: '/stock/dj-party-crowd.jpg',
    alt: 'Kurzer Loop: DJ vor tanzender Menge',
    width: 1280,
    height: 720,
    kind: 'video',
    credit: 'Aus Unsplash-Foto 1496337589254 erzeugter Demo-Loop',
    motif: 'Video: DJ / Tanzfläche, 10–30 s, hochkant für Social',
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
    motif: 'Video: Show-Moment (Funken, Bühne), 10–30 s, quer',
    stock: ph(true as const, 'Demo-Video, gegen echte Event-Videos tauschen', 'Medien'),
  },
} satisfies Record<string, MediaAsset>;

export type MediaId = keyof typeof media;

export function getMedia(id: string): MediaAsset {
  return (media as Record<string, MediaAsset>)[id] ?? media['konfetti-buehne-crowd'];
}
