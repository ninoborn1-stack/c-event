import type { Metadata } from 'next';
import { val } from '@c-event/core';
import { brand, getMedia, type MediaId } from '@c-event/content';
import { SITE_URL } from './env';

export function pageMeta(opts: { title: string; description: string; path: string; image?: MediaId }): Metadata {
  const img = getMedia(opts.image ?? 'konfetti-buehne-crowd');
  return {
    title: opts.title,
    description: opts.description,
    alternates: { canonical: opts.path },
    openGraph: {
      title: `${opts.title} | ${brand.name}`,
      description: opts.description,
      url: `${SITE_URL}${opts.path}`,
      siteName: brand.name,
      locale: 'de_DE',
      type: 'website',
      images: [{ url: img.kind === 'video' ? (img.poster ?? img.src) : img.src, width: img.width, height: img.height, alt: img.alt }],
    },
  };
}

export function organizationLd() {
  return {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'EventPlanner'],
    '@id': `${SITE_URL}/#org`,
    name: brand.name,
    alternateName: brand.short,
    slogan: brand.claim,
    url: SITE_URL,
    email: val(brand.contact.email),
    telephone: val(brand.contact.phone),
    image: `${SITE_URL}${getMedia('konfetti-buehne-crowd').src}`,
    areaServed: [{ '@type': 'City', name: 'Berlin' }, { '@type': 'State', name: 'Brandenburg' }],
    address: { '@type': 'PostalAddress', addressLocality: 'Berlin', addressCountry: 'DE' },
    sameAs: val(brand.social).map((s) => s.href),
  };
}
