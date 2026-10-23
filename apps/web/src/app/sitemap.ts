import type { MetadataRoute } from 'next';
import { catalog, services, shop } from '@c-event/content';
import { SITE_URL } from '@/lib/env';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const paths: [string, number][] = [
    ['/', 1],
    ...services.map((s) => [`/leistungen/${s.slug}`, 0.9] as [string, number]),
    ['/social-media', 0.8],
    [shop.path, 0.8],
    ...[...catalog.packages, ...catalog.items].map((x) => [`${shop.path}/${x.id}`, 0.5] as [string, number]),
    ['/anfrage', 0.8],
    ['/galerie', 0.6],
    ['/ueber-uns', 0.6],
    ['/arcade', 0.4],
    ['/impressum', 0.2],
    ['/datenschutz', 0.2],
    ['/agb', 0.2],
  ];
  return paths.map(([p, priority]) => ({ url: `${SITE_URL}${p}`, lastModified: now, changeFrequency: 'monthly', priority }));
}
