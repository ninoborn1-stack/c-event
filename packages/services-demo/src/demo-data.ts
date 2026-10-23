import type { ReviewSummary, SocialFeed } from '@c-event/core';

/**
 * Beispieldaten für Social Feed und Rezensionen. NUR Demo: Der Live-Modus nutzt ausschließlich
 * echte Daten aus der Instagram Graph API bzw. Google (siehe packages/services-live).
 */
export const DEMO_HANDLE = 'cneventagency';

export function demoFeed(): SocialFeed {
  const posts: [string, string, string][] = [
    ['champagner-turm-gold', 'Champagner-Pyramide, Kerzenlicht, ein Moment für die Kamera.', 'carousel'],
    ['barkeeper-strainer', 'Signature-Drink des Abends: rauchig, bitter, zu gut.', 'image'],
    ['gala-tafel-kerzen', 'Lange Tafel, warmes Licht. So sieht eine Winter Gala bei uns aus.', 'carousel'],
    ['dj-party-crowd', 'Um 1 Uhr nachts ist die Tanzfläche voller als um 22 Uhr.', 'video'],
    ['neon-lets-party', 'Neon nach Wunsch – dieses Mal: Let’s Party.', 'image'],
    ['weihnachtstafel-lichter', 'Weihnachtsfeier für 120 Gäste. Danke an das ganze Team!', 'carousel'],
    ['canapes-auswahl', 'Fingerfood, das nicht nach Fingerfood aussieht.', 'image'],
    ['mobile-bar-anhaenger', 'Die mobile Bar ist wieder unterwegs.', 'image'],
  ];
  const day = 864e5;
  return {
    source: 'demo',
    handle: DEMO_HANDLE,
    profileUrl: `https://www.instagram.com/${DEMO_HANDLE}/`,
    posts: posts.map(([image, caption, kind], i) => ({
      id: `demo-post-${i + 1}`,
      image,
      caption,
      kind: kind as 'image' | 'video' | 'carousel',
      permalink: `https://www.instagram.com/${DEMO_HANDLE}/`,
      postedAt: new Date(Date.UTC(2026, 9, 20) - i * 6 * day).toISOString(),
    })),
  };
}

export function demoReviews(): ReviewSummary {
  return {
    source: 'demo',
    rating: 4.9,
    count: 23,
    allUrl: 'https://www.google.com/maps/search/CN+Event+Agency',
    notice: 'Beispiel-Bewertungen (Demo). Live werden ausschließlich echte Google-Rezensionen angezeigt.',
    reviews: [
      { id: 'demo-r1', author: 'Beispiel-Kundin (Demo)', rating: 5, when: 'vor 2 Wochen', text: 'Unsere Weihnachtsfeier war perfekt organisiert. Bar, Food und Deko aus einer Hand – das Team war super entspannt.' },
      { id: 'demo-r2', author: 'Beispiel-Kunde (Demo)', rating: 5, when: 'vor 1 Monat', text: 'Release-Event in sechs Wochen auf die Beine gestellt. Würden wir sofort wieder buchen.' },
      { id: 'demo-r3', author: 'Beispiel-Gast (Demo)', rating: 5, when: 'vor 2 Monaten', text: 'Die besten Drinks, die ich auf einer Hochzeit getrunken habe. Danke für den tollen Abend!' },
      { id: 'demo-r4', author: 'Beispiel-Firma (Demo)', rating: 4, when: 'vor 3 Monaten', text: 'Sehr flexibel, auch bei kurzfristigen Änderungen. Kommunikation top.' },
    ],
  };
}

/** Demo-Zugang für /admin. Bewusst simpel und öffentlich bekannt – es gibt nur Demo-Daten. */
export const DEMO_ADMIN = { email: 'demo@cn-event.de', password: 'demo', name: 'Celia (Demo)' };
