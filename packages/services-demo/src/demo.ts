import {
  addDays,
  buildAvailability,
  DEFAULT_SETTINGS,
  HERO_TRANSITIONS,
  toIsoDate,
  type Inquiry,
  type SentMail,
  type Services,
  type SiteSettings,
} from '@c-event/core';
import { catalog } from '@c-event/content';
import { DEMO_ADMIN, demoFeed, demoReviews } from './demo-data';

/** Demo-Logik ohne Node- oder Browser-Abhängigkeiten. Die Ablage wird von außen hereingereicht. */
export interface DemoDb {
  version: 1;
  seededAt: string;
  inquiries: Inquiry[];
  mails: SentMail[];
  booked: string[];
  settings: SiteSettings;
  sessions?: { token: string; expiresAt: string }[];
}

export interface DemoStore {
  /** `null`, wenn noch nichts gespeichert ist. */
  read(): Promise<DemoDb | null>;
  write(db: DemoDb): Promise<void>;
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

export function freshDb(): DemoDb {
  return {
    version: 1,
    seededAt: new Date().toISOString(),
    inquiries: [],
    mails: [],
    booked: seedBookedDays(),
    settings: { ...DEFAULT_SETTINGS },
  };
}

function randomHex(bytes: number): string {
  const a = new Uint8Array(bytes);
  globalThis.crypto.getRandomValues(a);
  return [...a].map((b) => b.toString(16).padStart(2, '0')).join('');
}

const newId = (prefix: string) => `${prefix}-${Date.now().toString(36)}-${randomHex(4)}`;

export interface DemoAdmin {
  toggleDay(date: string): Promise<string[]>;
  listBooked(): Promise<string[]>;
  setSettings(patch: Partial<SiteSettings>): Promise<SiteSettings>;
  reset(): Promise<void>;
}

export type DemoServices = Services & { demo: DemoAdmin };

export function createDemoServicesWithStore(store: DemoStore): DemoServices {
  let queue: Promise<unknown> = Promise.resolve();
  let init: Promise<void> | null = null;

  async function read(): Promise<DemoDb> {
    const db = await store.read();
    if (db) return db;
    // Erste Nutzung: genau einmal anlegen, auch bei parallelen Zugriffen.
    init ??= store.write(freshDb()).finally(() => (init = null));
    await init;
    return (await store.read()) ?? freshDb();
  }
  /** Serialisiert Schreibzugriffe innerhalb des Prozesses bzw. Tabs. */
  function mutate<T>(fn: (db: DemoDb) => T | Promise<T>): Promise<T> {
    const run = queue.then(async () => {
      const db = await read();
      const result = await fn(db);
      await store.write(db);
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
      update: (id, patch) =>
        mutate((db) => {
          const inq = db.inquiries.find((i) => i.id === id);
          if (!inq) return null;
          if (patch.status) inq.status = patch.status;
          if (patch.adminNotes !== undefined) inq.adminNotes = patch.adminNotes.slice(0, 4000);
          inq.updatedAt = new Date().toISOString();
          return inq;
        }),
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
    settings: {
      get: async () => {
        const s = { ...DEFAULT_SETTINGS, ...(await read()).settings };
        // Alte Ablagen kennen noch entfernte Varianten (z. B. „vorhang“)
        if (!HERO_TRANSITIONS.includes(s.heroTransition)) s.heroTransition = DEFAULT_SETTINGS.heroTransition;
        return s;
      },
    },
    social: {
      getFeed: async (limit = 9) => {
        const f = demoFeed();
        return { ...f, posts: f.posts.slice(0, limit) };
      },
    },
    reviews: { getSummary: async () => demoReviews() },
    auth: {
      login: async (email, password) => {
        if (email.trim().toLowerCase() !== DEMO_ADMIN.email || password !== DEMO_ADMIN.password) return null;
        const token = `S-${randomHex(16)}`;
        const expiresAt = new Date(Date.now() + 12 * 3600e3).toISOString();
        await mutate((db) => {
          db.sessions = [...(db.sessions ?? []).filter((s) => s.expiresAt > new Date().toISOString()), { token, expiresAt }];
        });
        return { token, expiresAt, user: { id: 'demo', name: DEMO_ADMIN.name, email: DEMO_ADMIN.email } };
      },
      verify: async (token) => {
        const s = (await read()).sessions?.find((x) => x.token === token && x.expiresAt > new Date().toISOString());
        return s ? { id: 'demo', name: DEMO_ADMIN.name, email: DEMO_ADMIN.email } : null;
      },
      logout: (token) =>
        mutate((db) => {
          db.sessions = (db.sessions ?? []).filter((s) => s.token !== token);
        }),
    },
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
          // Anmeldung bleibt bestehen, alles andere wird neu angelegt
          const sessions = db.sessions;
          Object.assign(db, freshDb(), { sessions });
        }),
    },
  };
}
