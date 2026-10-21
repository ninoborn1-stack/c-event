import type { MetadataRoute } from 'next';
import { brand, tokens } from '@c-event/content';
import { asset } from '@/lib/env';

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: brand.name,
    short_name: brand.short,
    description: brand.claim,
    start_url: asset('/'),
    scope: asset('/'),
    display: 'standalone',
    background_color: tokens.color.ink,
    theme_color: tokens.color.ink,
    lang: 'de',
    icons: [
      { src: asset('/icons/icon-192.png'), sizes: '192x192', type: 'image/png' },
      { src: asset('/icons/icon-512.png'), sizes: '512x512', type: 'image/png' },
      { src: asset('/icons/icon-maskable-512.png'), sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
