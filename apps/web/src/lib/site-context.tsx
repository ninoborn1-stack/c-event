'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { DEFAULT_SETTINGS, type SiteSettings } from '@c-event/core';
import { api, SETTINGS_EVENT } from './api';
import { IS_STATIC } from './env';

interface SiteCtx {
  settings: SiteSettings;
  isDemo: boolean;
}

const Ctx = createContext<SiteCtx>({ settings: DEFAULT_SETTINGS, isDemo: false });

/**
 * Seiteneinstellungen für Client-Komponenten. Startwert kommt vom Server;
 * in der statischen Vorschau lädt der Browser die im Cockpit gesetzten Werte nach.
 */
export function SiteProvider({ value, children }: { value: SiteCtx; children: ReactNode }) {
  const [settings, setSettings] = useState(value.settings);
  // Nur echte Wertänderungen vom Server übernehmen (z. B. nach router.refresh()); bei Seitenwechseln
  // kommt dasselbe Objekt neu deserialisiert an und darf die im Browser geladenen Werte nicht überschreiben.
  const serverKey = JSON.stringify(value.settings);
  const [prevKey, setPrevKey] = useState(serverKey);
  if (prevKey !== serverKey) {
    setPrevKey(serverKey);
    setSettings(value.settings);
  }

  useEffect(() => {
    if (!IS_STATIC) return;
    let alive = true;
    const load = () =>
      api.settings().then((s) => {
        if (alive) setSettings(s);
      });
    void load();
    window.addEventListener(SETTINGS_EVENT, load);
    return () => {
      alive = false;
      window.removeEventListener(SETTINGS_EVENT, load);
    };
  }, []);

  useEffect(() => {
    if (value.isDemo) document.documentElement.dataset.ph = settings.showPlaceholders ? 'on' : 'off';
  }, [settings.showPlaceholders, value.isDemo]);

  return <Ctx.Provider value={{ settings, isDemo: value.isDemo }}>{children}</Ctx.Provider>;
}

export const useSite = () => useContext(Ctx);

/** Rendert Kinder nur, wenn ein Feature-Flag an ist (clientseitig, reagiert aufs Cockpit). */
export function IfFlag({ flag, children }: { flag: 'bunkerWestCode' | 'showPrices'; children: ReactNode }) {
  const { settings } = useSite();
  return settings[flag] ? <>{children}</> : null;
}
