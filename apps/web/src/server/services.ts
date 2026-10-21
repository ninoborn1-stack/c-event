import path from 'node:path';
import { connection } from 'next/server';
import { DEFAULT_SETTINGS, val, type MailContext, type Services, type SiteSettings } from '@c-event/core';
import { brand, labelFns } from '@c-event/content';
import { createDemoServices, type DemoServices } from '@c-event/services-demo';
import { DATA_MODE, SITE_URL } from '@/lib/env';

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
    const dir = process.env.DEMO_DATA_DIR
      ? path.resolve(/* turbopackIgnore: true */ process.cwd(), process.env.DEMO_DATA_DIR)
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
  if (DATA_MODE === 'demo') {
    await connection();
    return getServices().settings.get();
  }
  return { ...DEFAULT_SETTINGS, showPlaceholders: false, bunkerWestCode: process.env.FEATURE_BUNKER_CODE === '1' };
}

export function mailContext(): MailContext & { recipient: string } {
  return {
    brandName: brand.name,
    agencyEmail: val(brand.contact.email),
    agencyPhone: val(brand.contact.phone),
    fromAddress: process.env.MAIL_FROM || `noreply@${new URL(SITE_URL).hostname}`,
    siteUrl: SITE_URL,
    recipient: process.env.INQUIRY_RECIPIENT || val(brand.contact.inquiryRecipient),
    labels: labelFns,
  };
}
