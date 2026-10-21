export const DATA_MODE: 'demo' | 'live' = process.env.DATA_MODE === 'live' ? 'live' : 'demo';
export const IS_DEMO = DATA_MODE === 'demo';
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');
