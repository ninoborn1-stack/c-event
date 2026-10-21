import type { NextConfig } from 'next';

const config: NextConfig = {
  transpilePackages: ['@c-event/core', '@c-event/content', '@c-event/services-demo'],
  images: { formats: ['image/avif', 'image/webp'], deviceSizes: [640, 828, 1080, 1440, 1920, 2400] },
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: '/stock/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ];
  },
};

export default config;
