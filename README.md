# CN Event Agency · Demo-Website

Präsentations-, Shop- und Anfrageseite für CN Event Agency (Event Concept & Production), die Agentur von Celia.
Die Demo läuft komplett lokal, alle Flows sind durchklickbar. Fehlende Inhalte sind als **Platzhalter** markiert.

## Starten

```bash
pnpm install
pnpm dev
```

Danach öffnest du **http://localhost:3000**. Mehr braucht es nicht: Ohne `.env` läuft automatisch `DATA_MODE=demo`.

| Was | Wo |
|---|---|
| Website | http://localhost:3000 |
| Shop | http://localhost:3000/shop |
| Warenkorb | http://localhost:3000/warenkorb |
| Admin (Demo-Login `demo@cn-event.de` / `demo`) | http://localhost:3000/admin |
| Anfrage mit Kategorie | http://localhost:3000/anfrage?kategorie=bar-catering |
| KI-Beschreibung | http://localhost:3000/llms.txt |

## Online-Vorschau (GitHub Pages)

**https://ninoborn1-stack.github.io/c-event/**

Jeder Push auf `main` baut automatisch eine statische Version (`.github/workflows/pages.yml`). Dort gibt es keinen Server: Formular, Postfach, Kalender und Cockpit laufen über dieselben Demo-Services direkt im Browser (localStorage). Alles ist testbar, die Daten gelten aber nur für den jeweiligen Browser. Lokal nachbauen:

```bash
NEXT_PUBLIC_BASE_PATH=/c-event pnpm build:pages
```

Das Ergebnis liegt in `apps/web/out`.

## Demo durchspielen

1. Startseite: Das Intro (Countdown, „CN“-Blende, Doors open) läuft beim ersten Besuch pro Tab.
2. Eine Leistung öffnen (Kachel oder Navbar → Leistungen) und einen Artikel „Zum Event hinzufügen“.
3. Oben rechts das Warenkorb-Ticket öffnen → „Zur Übersicht“ → Notizen ergänzen → „Unverbindliches Angebot anfragen“.
4. Im Kalender einen freien Tag anklicken, Formular ausfüllen, abschicken → Danke-Seite.
5. **Admin** (`/admin`, Demo-Login): Anfrage mit Warenkorb und Notizen, Status ändern, Antwort aus Vorlage senden; unter „Mails“ alle System-Mails.

Unter **Admin → Demo**: Hero-Übergang (Tiefe/Blende/Ticket), Slogan, Feature-Flags (Preise, Bunker-West-Code, Platzhalter-Markierung), Intro neu abspielen, Reset und alle Platzhalter nach P1/P2.

## Befehle

| Befehl | Zweck |
|---|---|
| `pnpm dev` | Entwicklungsserver |
| `pnpm build && pnpm start` | Produktions-Build lokal |
| `pnpm typecheck` | TypeScript (strict) in allen Paketen |
| `pnpm lint` | ESLint |
| `pnpm test` | Unit- und API-Tests (Vitest) |
| `pnpm test:e2e` | Playwright-Smoke-Test (vorher `pnpm build`), Desktop + Handy |
| `pnpm check` | Typecheck, Lint, Tests und Build am Stück |
| `pnpm docs:placeholders` | `docs/PLATZHALTER.md` neu erzeugen |
| `pnpm build:pages` | Statische Vorschau für GitHub Pages nach `apps/web/out` |

## Struktur

```
apps/web/                 Next.js 16 (App Router): UI, Routing, API-Endpunkte, SEO, PWA
packages/core/            Domain: Typen, Zod-Schemas, Warenkorb, Anfrage-Ablauf, Verfügbarkeit, Mail-Templates, Service-Interfaces
packages/content/         Alle Inhalte als typisierte Daten: Marke, Leistungen, Katalog, Seiten, Medien-Registry, Design-Tokens
packages/services-demo/   Demo-Implementierungen: JSON-/Browser-Ablage, Mail-Postfach, Kalender, Feed, Rezensionen, Demo-Login
packages/services-live/   Vorbereitete Live-Adapter: Instagram Graph API, Google Places API, Business Profile API
docs/                     Bauplan, Entscheidungen, Platzhalter, Übergabe
```

Mehr dazu: [docs/UEBERGABE.md](docs/UEBERGABE.md) (Demo → Live, App, Live-Adapter), [docs/ENTSCHEIDUNGEN.md](docs/ENTSCHEIDUNGEN.md), [docs/EFFEKTE.md](docs/EFFEKTE.md), [docs/PLATZHALTER.md](docs/PLATZHALTER.md).

Bildnachweise: [apps/web/public/stock/CREDITS.md](apps/web/public/stock/CREDITS.md)
