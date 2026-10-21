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

/** Preis in Cent. `null` = „auf Anfrage“. */
export interface Price {
  amountCents: number | null;
  /** z. B. „pro Abend“, „pro Stunde“, „pro Person“ */
  unit: string;
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

export interface SiteSettings {
  sloganVariant: number;
  showPrices: boolean;
  bunkerWestCode: boolean;
  showPlaceholders: boolean;
}

export const DEFAULT_SETTINGS: SiteSettings = {
  sloganVariant: 0,
  showPrices: true,
  bunkerWestCode: false,
  showPlaceholders: true,
};
