import { collectPlaceholders } from '@c-event/core';
import { brand, partners } from './brand';
import { catalog } from './catalog';
import { media } from './media';
import { about, configuratorPage, gallery, home, inquiryPage, legal, socialMedia } from './pages';
import { services } from './services';

export * from './brand';
export * from './labels';
export * from './media';
export * from './services';
export * from './catalog';
export * from './pages';
export * from './design-tokens';
export * from './nav';

/** Alles, was Inhalte enthält – Grundlage für die automatische Platzhalter-Liste. */
export const allContent = {
  brand,
  partners,
  home,
  services,
  socialMedia,
  about,
  gallery,
  inquiryPage,
  configuratorPage,
  catalog,
  legal,
  media,
};

export function listPlaceholders() {
  return collectPlaceholders(allContent);
}
