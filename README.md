# C-Event · Demo-Website

Präsentations-, Konfigurator- und Anfrageseite für die 360°-Eventagentur von Celia.
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
| Demo-Cockpit (Postfach, Anfragen, Kalender, Einstellungen, Platzhalter) | http://localhost:3000/demo |
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

1. Startseite: Das Intro (Countdown, „C“-Blende, Doors open) läuft beim ersten Besuch pro Tab. Neu abspielen über das Cockpit.
2. Eine Leistung öffnen, z. B. `/leistungen/bar-catering`, und Artikel oder Paket „In den Rider“ legen.
3. Rider unten rechts öffnen, „Anfrage senden“ klicken. Die Kategorie ist vorausgewählt.
4. Im Kalender einen freien Tag anklicken, Formular ausfüllen, abschicken.
5. Danke-Seite mit Zusammenfassung, dann im **Cockpit → Postfach**: Bestätigung an den Kunden und Benachrichtigung an die Agentur.

Im Cockpit kannst du außerdem Tage belegen und freigeben, die Slogan-Variante umschalten, die Feature-Flags setzen (Preise, Bunker-West-Code, Platzhalter-Markierung) und alles zurücksetzen.

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
packages/services-demo/   Demo-Implementierungen: JSON-Ablage, Mail-Postfach, Kalender
docs/                     Bauplan, Entscheidungen, Platzhalter, Übergabe
```

Mehr dazu steht in [docs/UEBERGABE.md](docs/UEBERGABE.md) (Demo → Live, App) und [docs/ENTSCHEIDUNGEN.md](docs/ENTSCHEIDUNGEN.md).

Bildnachweise: [apps/web/public/stock/CREDITS.md](apps/web/public/stock/CREDITS.md)
