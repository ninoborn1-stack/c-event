import { val } from '@c-event/core';
import { brand, services, socialMedia } from '@c-event/content';
import { SITE_URL } from '@/lib/env';

export const dynamic = 'force-static';

/** llms.txt: klare Agenturbeschreibung für KI-Crawler und Assistenten. */
export function GET() {
  const lines = [
    `# ${brand.name}`,
    '',
    `> ${brand.name} ist eine 360°-Eventagentur aus ${brand.city} (Einsatzgebiet: ${val(brand.region)}). ${brand.claim}. Vom Firmen-Weihnachtsfest bis zum Konzert im Heißluftballon, von Release-Events bis zu Musikvideos und Filmproduktionen.`,
    '',
    'Die Website verkauft nichts direkt: Jede Auswahl wird zu einer unverbindlichen Anfrage, das Angebot erstellt die Inhaberin Celia persönlich.',
    '',
    '## Leistungen',
    ...services.map((s) => `- [${s.name}](${SITE_URL}/leistungen/${s.slug}): ${s.line}`),
    `- [Social Media & Content](${SITE_URL}/social-media): ${socialMedia.seo.description}`,
    '',
    '## Zielgruppen',
    '- Firmen (Weihnachtsfeier, Sommerfest, Jubiläum, Konferenz)',
    '- Private Anlässe (Hochzeit, Geburtstag, Feiern)',
    '- Marken, Artists und Produktionen (Release-Events, Musikvideos, Film)',
    '- Brands und Collectives, die Events machen (Social Media)',
    '',
    '## Anfrage & Kontakt',
    `- [Anfrage-Formular](${SITE_URL}/anfrage) (Kategorie per ?kategorie=<slug> vorauswählbar)`,
    `- [Konfigurator / Rider](${SITE_URL}/konfigurator): Equipment, Crew, Food und Pakete zusammenstellen und anfragen`,
    `- E-Mail: ${val(brand.contact.email)}`,
    `- Telefon: ${val(brand.contact.phone)}`,
    '',
    '## Optional',
    `- [Galerie](${SITE_URL}/galerie)`,
    `- [Über uns](${SITE_URL}/ueber-uns)`,
    `- [Afterhour Arcade](${SITE_URL}/arcade): drei Retro-Minispiele (Bar, DJ, Türsteher)`,
    `- [Impressum](${SITE_URL}/impressum)`,
  ];
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
