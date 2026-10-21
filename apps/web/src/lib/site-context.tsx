'use client';

import { createContext, useContext, type ReactNode } from 'react';
import { DEFAULT_SETTINGS, type SiteSettings } from '@c-event/core';

interface SiteCtx {
  settings: SiteSettings;
  isDemo: boolean;
}

const Ctx = createContext<SiteCtx>({ settings: DEFAULT_SETTINGS, isDemo: false });

export function SiteProvider({ value, children }: { value: SiteCtx; children: ReactNode }) {
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useSite = () => useContext(Ctx);
