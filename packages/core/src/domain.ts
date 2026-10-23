import type { Maybe } from './placeholder';

/** Die sieben Leistungen mit eigener Seite. */
export const SERVICE_SLUGS = [
  'bar-catering',
  'personalvermittlung',
  'catering',
  'event-management',
  'event-organisation',
  'dekoration',
  'equipment-mieten',
] as const;
export type ServiceSlug = (typeof SERVICE_SLUGS)[number];

/** Alle Kategorien, die das zentrale Anfrage-Formular kennt. */
export const INQUIRY_CATEGORIES = [...SERVICE_SLUGS, 'social-media', 'konfigurator', 'allgemein'] as const;
export type InquiryCategory = (typeof INQUIRY_CATEGORIES)[number];

export function isInquiryCategory(v: unknown): v is InquiryCategory {
  return typeof v === 'string' && (INQUIRY_CATEGORIES as readonly string[]).includes(v);
}

export const BUDGET_RANGES = ['bis-2500', '2500-5000', '5000-10000', '10000-25000', 'ueber-25000', 'offen'] as const;
export type BudgetRange = (typeof BUDGET_RANGES)[number];

export const OCCASIONS = [
  'weihnachtsfeier',
  'sommerfest',
  'firmenevent',
  'release-event',
  'produktion',
  'hochzeit',
  'geburtstag',
  'private-feier',
  'sonstiges',
] as const;
export type Occasion = (typeof OCCASIONS)[number];

// ---------- Katalog ----------

export interface CatalogCategory {
  id: string;
  label: string;
}

/**
 * Preis in Cent. Drei Anzeige-Modi (pro Artikel):
 *  fixed   = fester Richtpreis, „450 € pro Event“
 *  from    = Einstiegspreis, „ab 1.490 €“
 *  request = „auf Anfrage“ (amountCents = null)
 */
export type PriceMode = 'fixed' | 'from' | 'request';
export interface Price {
  amountCents: number | null;
  /** z. B. „pro Abend“, „pro Stunde“, „pro Person“ */
  unit: string;
  mode?: PriceMode;
}

export function priceMode(p: Price): PriceMode {
  if (p.amountCents === null) return 'request';
  return p.mode ?? 'fixed';
}

export interface CatalogItem {
  id: string;
  name: string;
  category: string;
  /** Leistung, zu der der Artikel gehört (für „passende Artikel“ auf Leistungsseiten). */
  services: ServiceSlug[];
  short: Maybe<string>;
  price: Maybe<Price>;
  depositCents?: Maybe<number>;
  /** Max. verfügbare Stückzahl. */
  stock: Maybe<number>;
  minQty?: number;
  media: string;
  /** Längere Beschreibung für die Detailansicht im Shop. */
  details?: Maybe<string[]>;
}

export interface CatalogPackage {
  id: string;
  name: string;
  tagline: string;
  guests: string;
  items: { itemId: string; qty: number }[];
  price: Maybe<Price>;
  media: string;
  services: ServiceSlug[];
}

export interface Catalog {
  categories: CatalogCategory[];
  items: CatalogItem[];
  packages: CatalogPackage[];
}

// ---------- Verfügbarkeit ----------

export type DayStatus = 'free' | 'booked' | 'past';
export interface DayAvailability {
  /** YYYY-MM-DD */
  date: string;
  status: DayStatus;
}

// ---------- Einstellungen (Demo-Cockpit bzw. Live-Config) ----------

/** Drei Varianten für den Hero-Übergang „Doors open → 360°“ (Celia wählt im Admin-Demo-Tab). */
export const HERO_TRANSITIONS = ['vorhang', 'blende', 'ticket'] as const;
export type HeroTransition = (typeof HERO_TRANSITIONS)[number];

export interface SiteSettings {
  sloganVariant: number;
  showPrices: boolean;
  bunkerWestCode: boolean;
  showPlaceholders: boolean;
  heroTransition: HeroTransition;
}

export const DEFAULT_SETTINGS: SiteSettings = {
  sloganVariant: 0,
  showPrices: true,
  bunkerWestCode: false,
  showPlaceholders: true,
  heroTransition: 'vorhang',
};

// ---------- Social Feed & Rezensionen ----------

export interface SocialPost {
  id: string;
  /** Bild-URL oder Medien-ID (Demo) */
  image: string;
  caption: string;
  permalink: string;
  postedAt: string;
  kind: 'image' | 'video' | 'carousel';
}

export interface SocialFeed {
  source: 'demo' | 'instagram';
  handle: string;
  profileUrl: string;
  posts: SocialPost[];
}

export interface Review {
  id: string;
  author: string;
  authorUrl?: string;
  rating: number;
  text: string;
  /** relative Zeitangabe, wie die Quelle sie liefert (z. B. „vor 2 Wochen“) */
  when: string;
  /** Link zur Originalrezension (Pflicht bei Google) */
  url?: string;
}

export interface ReviewSummary {
  /** demo = Beispieldaten, nie im Live-Modus anzeigen */
  source: 'demo' | 'google-places' | 'google-business';
  rating: number;
  count: number;
  reviews: Review[];
  /** „Alle Bewertungen auf Google“ */
  allUrl: string;
  /** Pflichthinweis der Quelle, z. B. Sortierung/Filter */
  notice?: string;
}
