import { val } from '@c-event/core';
import { shop } from './brand';
import { services } from './services';
import { ui } from './pages';

export interface NavLink {
  href: string;
  label: string;
  children?: { href: string; label: string; line: string }[];
}

/** Navbar laut Review: Leistungen (Dropdown) · Shop · Galerie · Über uns · Social Media – plus Warenkorb-Ticket rechts. */
export const mainNav: NavLink[] = [
  {
    href: '/leistungen/event-organisation',
    label: ui.nav.services,
    children: services.map((s) => ({ href: `/leistungen/${s.slug}`, label: s.name, line: s.line })),
  },
  { href: shop.path, label: val(shop.label) },
  { href: '/galerie', label: ui.nav.gallery },
  { href: '/ueber-uns', label: ui.nav.about },
  { href: '/social-media', label: ui.nav.social },
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

/**
 * Shop-Link, optional mit Kategorie-Filter und Herkunft (Slug der Leistungsseite oder „match“).
 * Der Shop wählt die Kategorie vor und zeigt, woher man kommt; die Anfrage übernimmt die Herkunft später.
 */
export function shopHref(category?: string, from?: string): string {
  const p = new URLSearchParams();
  if (category) p.set('kategorie', category);
  if (from) p.set('von', from);
  const q = p.toString();
  return q ? `${shop.path}?${q}#artikel` : shop.path;
}

/** Detailseite eines Shop-Artikels oder Pakets */
export function productHref(id: string): string {
  return `${shop.path}/${id}`;
}

export const CART_PATH = '/warenkorb';
