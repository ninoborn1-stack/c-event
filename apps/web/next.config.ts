import type { NextConfig } from 'next';

/**
 * STATIC_EXPORT=1 → statische Vorschau für GitHub Pages (output: 'export', basePath, Demo im Browser).
 * Server-only-Routen heißen route.server.ts und werden dabei über pageExtensions ausgelassen.
 */
const isStatic = process.env.STATIC_EXPORT === '1';
const basePath = (process.env.NEXT_PUBLIC_BASE_PATH || '').replace(/\/$/, '');

const config: NextConfig = {
  transpilePackages: ['@c-event/core', '@c-event/content', '@c-event/services-demo'],
  pageExtensions: isStatic ? ['tsx', 'ts'] : ['tsx', 'ts', 'server.ts'],
  poweredByHeader: false,
  ...(isStatic
    ? {
        output: 'export',
        basePath: basePath || undefined,
        trailingSlash: true,
        images: { unoptimized: true },
      }
    : {
        images: { formats: ['image/avif', 'image/webp'], deviceSizes: [640, 828, 1080, 1440, 1920, 2400] },
        async headers() {
          return [{ source: '/stock/:path*', headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }] }];
        },
      }),
};

export default config;
