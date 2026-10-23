import { promises as fs } from 'node:fs';
import path from 'node:path';
import { randomBytes } from 'node:crypto';
import { createDemoServicesWithStore, type DemoDb, type DemoServices } from './demo';

export * from './demo';
export * from './demo-data';

/** Demo-Services mit JSON-Datei als Ablage (lokaler Server, `pnpm dev`). */
export function createDemoServices(opts: { dir: string }): DemoServices {
  const file = path.join(opts.dir, 'db.json');
  return createDemoServicesWithStore({
    async read() {
      try {
        return JSON.parse(await fs.readFile(file, 'utf8')) as DemoDb;
      } catch {
        return null;
      }
    },
    async write(db) {
      await fs.mkdir(opts.dir, { recursive: true });
      const tmp = `${file}.${process.pid}.${randomBytes(6).toString('hex')}.tmp`;
      await fs.writeFile(tmp, JSON.stringify(db, null, 2));
      await fs.rename(tmp, file);
    },
  });
}
