import { services } from './services';
import { ui } from './pages';

export interface NavLink {
  href: string;
  label: string;
  children?: { href: string; label: string; line: string }[];
  primary?: boolean;
}

export const mainNav: NavLink[] = [
  {
    href: '/leistungen/event-organisation',
    label: ui.nav.services,
    children: services.map((s) => ({ href: `/leistungen/${s.slug}`, label: s.name, line: s.line })),
  },
  { href: '/konfigurator', label: ui.nav.configurator },
  { href: '/galerie', label: ui.nav.gallery },
  { href: '/ueber-uns', label: ui.nav.about },
  { href: '/social-media', label: ui.nav.social },
  { href: '/anfrage', label: ui.nav.inquiry, primary: true },
];

export const legalNav = [
  { href: '/impressum', label: 'Impressum' },
  { href: '/datenschutz', label: 'Datenschutz' },
  { href: '/agb', label: 'AGB & Mietbedingungen' },
];

/** Baut den Link zum zentralen Formular mit vorausgewählter Kategorie. */
export function inquiryHref(category?: string, extra?: Record<string, string>): string {
  const p = new URLSearchParams();
  if (category) p.set('kategorie', category);
  for (const [k, v] of Object.entries(extra ?? {})) p.set(k, v);
  const q = p.toString();
  return q ? `/anfrage?${q}` : '/anfrage';
}
