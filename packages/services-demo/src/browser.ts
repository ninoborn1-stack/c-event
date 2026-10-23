import { createDemoServicesWithStore, type DemoDb, type DemoServices } from './demo';

export * from './demo';
export * from './demo-data';

const KEY = 'cev-demo-db';

/**
 * Demo-Services komplett im Browser (localStorage). Für die statische Vorschau auf GitHub Pages,
 * wo es keinen Server gibt. Daten gelten pro Browser.
 */
export function createBrowserDemoServices(): DemoServices {
  return createDemoServicesWithStore({
    async read() {
      try {
        const raw = localStorage.getItem(KEY);
        return raw ? (JSON.parse(raw) as DemoDb) : null;
      } catch {
        return null;
      }
    },
    async write(db) {
      try {
        localStorage.setItem(KEY, JSON.stringify(db));
      } catch {
        /* privater Modus oder voll: Demo läuft dann nur bis zum Neuladen */
      }
    },
  });
}
