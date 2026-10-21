import { promises as fs } from 'node:fs';
import path from 'node:path';
import { randomBytes } from 'node:crypto';
import {
  addDays,
  buildAvailability,
  DEFAULT_SETTINGS,
  toIsoDate,
  type Inquiry,
  type SentMail,
  type Services,
  type SiteSettings,
} from '@c-event/core';
import { catalog } from '@c-event/content';

interface DemoDb {
  version: 1;
  seededAt: string;
  inquiries: Inquiry[];
  mails: SentMail[];
  booked: string[];
  settings: SiteSettings;
}

/** Belegte Demo-Tage in den nächsten drei Monaten, deterministisch pro Seed-Datum. */
export function seedBookedDays(today = new Date()): string[] {
  const out: string[] = [];
  let x = Number(toIsoDate(today).replace(/-/g, '')) % 2147483647;
  const rnd = () => (x = (x * 48271) % 2147483647) / 2147483647;
  for (let i = 1; i <= 95; i++) {
    const d = addDays(today, i);
    const wd = d.getDay();
    const dec = d.getMonth() === 11;
    const chance = wd === 5 || wd === 6 ? (dec ? 0.8 : 0.45) : wd === 4 ? 0.2 : 0.06;
    if (rnd() < chance) out.push(toIsoDate(d));
  }
  return out;
}

function freshDb(): DemoDb {
  return {
    version: 1,
    seededAt: new Date().toISOString(),
    inquiries: [],
    mails: [],
    booked: seedBookedDays(),
    settings: { ...DEFAULT_SETTINGS },
  };
}

const newId = (prefix: string) => `${prefix}-${Date.now().toString(36)}-${randomBytes(4).toString('hex')}`;

export interface DemoAdmin {
  toggleDay(date: string): Promise<string[]>;
  listBooked(): Promise<string[]>;
  setSettings(patch: Partial<SiteSettings>): Promise<SiteSettings>;
  reset(): Promise<void>;
}

export type DemoServices = Services & { demo: DemoAdmin };

export function createDemoServices(opts: { dir: string }): DemoServices {
  const file = path.join(opts.dir, 'db.json');
  let queue: Promise<unknown> = Promise.resolve();

  let init: Promise<void> | null = null;
  async function read(): Promise<DemoDb> {
    try {
      return JSON.parse(await fs.readFile(file, 'utf8')) as DemoDb;
    } catch {
      // Erste Nutzung: genau einmal anlegen, auch bei parallelen Zugriffen.
      init ??= write(freshDb()).finally(() => (init = null));
      await init;
      return JSON.parse(await fs.readFile(file, 'utf8')) as DemoDb;
    }
  }
  async function write(db: DemoDb) {
    await fs.mkdir(opts.dir, { recursive: true });
    const tmp = `${file}.${process.pid}.${randomBytes(6).toString('hex')}.tmp`;
    await fs.writeFile(tmp, JSON.stringify(db, null, 2));
    await fs.rename(tmp, file);
  }
  /** Serialisiert Schreibzugriffe innerhalb des Prozesses. */
  function mutate<T>(fn: (db: DemoDb) => T | Promise<T>): Promise<T> {
    const run = queue.then(async () => {
      const db = await read();
      const result = await fn(db);
      await write(db);
      return result;
    });
    queue = run.catch(() => undefined);
    return run;
  }

  return {
    mode: 'demo',
    inquiries: {
      create: (data) =>
        mutate((db) => {
          const inquiry: Inquiry = { ...data, id: newId('A'), createdAt: new Date().toISOString(), status: 'neu' };
          db.inquiries.unshift(inquiry);
          return inquiry;
        }),
      get: async (id) => (await read()).inquiries.find((i) => i.id === id) ?? null,
      list: async () => (await read()).inquiries,
    },
    mail: {
      send: (mail) =>
        mutate((db) => {
          const sent: SentMail = { ...mail, id: newId('M'), sentAt: new Date().toISOString(), transport: 'demo-postfach' };
          db.mails.unshift(sent);
          return sent;
        }),
      list: async () => (await read()).mails,
    },
    availability: {
      getRange: async (from, to) => buildAvailability(from, to, new Set((await read()).booked)),
    },
    catalog: { getCatalog: async () => catalog },
    settings: { get: async () => ({ ...DEFAULT_SETTINGS, ...(await read()).settings }) },
    demo: {
      toggleDay: (date) =>
        mutate((db) => {
          db.booked = db.booked.includes(date) ? db.booked.filter((d) => d !== date) : [...db.booked, date].sort();
          return db.booked;
        }),
      listBooked: async () => (await read()).booked,
      setSettings: (patch) =>
        mutate((db) => {
          db.settings = { ...DEFAULT_SETTINGS, ...db.settings, ...patch };
          return db.settings;
        }),
      reset: () =>
        mutate((db) => {
          Object.assign(db, freshDb());
        }),
    },
  };
}
