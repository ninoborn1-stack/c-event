import os from 'node:os';
import path from 'node:path';
import { connection } from 'next/server';
import { DEFAULT_SETTINGS, type Services, type SiteSettings } from '@c-event/core';
import { createDemoServices, type DemoServices } from '@c-event/services-demo';
import { DATA_MODE, IS_STATIC } from '@/lib/env';

type AppServices = Services & { demo?: DemoServices['demo'] };

const g = globalThis as unknown as { __cevServices?: AppServices };

/**
 * Service-Container. Die UI und die API holen sich ihre Services nur hier.
 * DATA_MODE=demo → lokale Demo-Implementierungen, DATA_MODE=live → echte Services (siehe docs/UEBERGABE.md).
 */
export function getServices(): AppServices {
  if (g.__cevServices) return g.__cevServices;
  if (DATA_MODE === 'demo') {
    // Demo-Ablage liegt außerhalb des Bundles; turbopackIgnore verhindert, dass das ganze Projekt getraced wird.
    // Auf Vercel ist nur /tmp beschreibbar; die Demo-Daten sind dort flüchtig (pro Instanz).
    const dir = process.env.DEMO_DATA_DIR
      ? path.resolve(/* turbopackIgnore: true */ process.cwd(), process.env.DEMO_DATA_DIR)
      : process.env.VERCEL
        ? path.join(os.tmpdir(), 'cevent-demo')
        : path.join(/* turbopackIgnore: true */ process.cwd(), '.demo-data');
    g.__cevServices = createDemoServices({ dir });
    return g.__cevServices;
  }
  throw new Error(
    'DATA_MODE=live ist gesetzt, aber noch keine Live-Services verdrahtet. Siehe docs/UEBERGABE.md, Abschnitt „Demo → Live“.',
  );
}

/** Seiteneinstellungen. Im Demo-Modus aus dem Cockpit (dynamisch), live aus der Config. */
export async function getSettings(): Promise<SiteSettings> {
  // Statische Vorschau: Standardwerte beim Build, die echten Einstellungen lädt der Browser (SiteProvider).
  if (IS_STATIC) return { ...DEFAULT_SETTINGS };
  if (DATA_MODE === 'demo') {
    await connection();
    return getServices().settings.get();
  }
  return { ...DEFAULT_SETTINGS, showPlaceholders: false, bunkerWestCode: process.env.FEATURE_BUNKER_CODE === '1' };
}

export { mailContext } from '@/lib/mail-context';
