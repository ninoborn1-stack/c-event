import { collectPlaceholders } from '@c-event/core';
import { brand, partners, shop } from './brand';
import { catalog } from './catalog';
import { media } from './media';
import { about, arcade, cartPage, gallery, home, inquiryPage, legal, shopPage, socialMedia } from './pages';
import { briefing } from './briefing';
import { services } from './services';

export * from './brand';
export * from './labels';
export * from './media';
export * from './services';
export * from './catalog';
export * from './pages';
export * from './design-tokens';
export * from './nav';
export * from './briefing';

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
  shopPage,
  cartPage,
  shop,
  briefing,
  arcade,
  catalog,
  legal,
  media,
};

export function listPlaceholders() {
  return collectPlaceholders(allContent);
}
