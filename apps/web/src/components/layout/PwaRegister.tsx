'use client';

import { useEffect } from 'react';

/** Service Worker nur im Production-Build, damit der Dev-Server nicht aus dem Cache läuft. */
export function PwaRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production' || !('serviceWorker' in navigator)) return;
    navigator.serviceWorker.register('/sw.js').catch(() => undefined);
  }, []);
  return null;
}
