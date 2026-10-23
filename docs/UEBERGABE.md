# Übergabe: Demo → Live → App

## Wie die Teile zusammenhängen

```
packages/content  ──►  packages/core  ◄──  packages/services-demo
   (Daten)           (Logik + Interfaces)      (Demo-Implementierung)
        │                    │
        └──────► apps/web ◄──┘   UI + API-Endpunkte; holt Services nur über src/server/services.ts
```

- **UI** kennt nur Inhalte (`@c-event/content`) und die Interfaces aus `@c-event/core`.
- **API-Endpunkte** (`apps/web/src/app/api/*`) sind die einzige Schnittstelle nach außen. Eine App ruft dieselben Endpunkte auf.
- **`DATA_MODE`** entscheidet in `apps/web/src/server/services.ts`, welche Implementierung läuft.

## API

| Methode | Pfad | Zweck |
|---|---|---|
| `POST` | `/api/inquiries` | Anfrage senden. Body = `inquiryInputSchema` (Zod, `packages/core/src/inquiry.ts`). Antwort `201 { ok, id }` oder `422 { errors }` |
| `GET` | `/api/availability?from=YYYY-MM-DD&to=YYYY-MM-DD` | Nur `{ date, status: free \| booked \| past }`, keine Details |
| `GET` | `/api/catalog` | Kategorien, Artikel, Pakete (ohne Platzhalter-Markierung) |
| `GET` | `/api/inquiries/:id` | Eine Anfrage (Danke-Seite; zufällige, nicht erratbare ID) |
| `POST` | `/api/admin/login` · `/api/admin/logout` · `GET /api/admin/me` | Admin-Sitzung (Cookie) |
| `GET` | `/api/admin/data` | Dashboard: Anfragen, Mails, Posts, Rezensionen, Kalender, Einstellungen |
| `PATCH` | `/api/admin/inquiries/:id` | Status (`neu`, `in-bearbeitung`, `angebot-raus`, `gebucht`, `abgesagt`) und interne Notizen |
| `POST` | `/api/admin/inquiries/:id/reply` | Antwort-Mail an den Kunden (Vorlage aus `replyTemplate()`) |
| `POST` | `/api/demo/*` | Nur im Demo-Modus: Kalender umschalten, Einstellungen, Reset |

## Online-Vorschau

`pnpm build:pages` erzeugt eine statische Version, die GitHub Pages per Workflow bei jedem Push auf `main` veröffentlicht. Die Demo-Services laufen dort im Browser. Für den echten Livegang braucht es ein Node-Hosting (Server-Routen unter `route.server.ts`), siehe unten.

## Demo → Live

1. **Inhalte einsetzen** (ohne Code-Änderung an der UI):
   - Texte, Preise, Pakete, Referenzen in `packages/content/src/*.ts`; dort jeweils `ph(…)` entfernen, sobald der Wert final ist.
   - Medien: Dateien ablegen und in `packages/content/src/media.ts` die IDs auf die neuen Dateien zeigen lassen (`stock: false`).
   - `pnpm docs:placeholders` zeigt, was noch fehlt.
2. **Live-Services schreiben**, z. B. als `packages/services-live` mit denselben Interfaces aus `packages/core/src/services.ts`:
   - `MailService.send` mit dem Anbieter (Postmark, Resend oder SMTP). `list()` gibt `[]` zurück.
   - `InquiryService`: Anfragen speichern (z. B. Postgres/Supabase oder nur per Mail plus Ablage im CRM).
   - `AvailabilityService`: Belegt/Frei aus Celias Kalender (z. B. öffentliche iCal-URL nur mit Frei/Belegt). Das Tool ist noch offen.
   - `CatalogService`: anfangs einfach `catalog` aus `@c-event/content`, später ein CMS, damit Celia Preise und Bilder selbst pflegt.
   - `SettingsService`: feste Config oder CMS.
3. **Verdrahten** in `apps/web/src/server/services.ts`: Im `live`-Zweig die Live-Services zurückgeben (dort wird aktuell bewusst ein Fehler geworfen).
4. **Env-Variablen** setzen (siehe `.env.example`):

   | Variable | Live-Wert |
   |---|---|
   | `DATA_MODE` | `live` |
   | `NEXT_PUBLIC_SITE_URL` | `https://<domain>` (im Januar ggf. neue CN Event Agency-Domain) |
   | `MAIL_PROVIDER`, `MAIL_API_KEY`, `MAIL_FROM` | Mailversand |
   | `INQUIRY_RECIPIENT` | Celias Anfrage-Postfach |
   | `AVAILABILITY_ICAL_URL` | Kalender-Quelle |
   | `FEATURE_BUNKER_CODE` | `1`, wenn der Willkommens-Code sichtbar sein soll |

   Mit `DATA_MODE=live` gilt automatisch: `robots.txt` erlaubt Indexierung, `/demo` und `/api/demo/*` liefern 404, Platzhalter werden nicht mehr markiert.
5. **Rechtliches**: Impressum-Daten, Datenschutz (Hosting, Mail-Anbieter, Kalender) und Mietbedingungen in `packages/content/src/pages.ts` (`legal`) einsetzen und prüfen lassen.
6. **SEO**: Search Console, Sitemap einreichen, Google-Unternehmensprofil verknüpfen. Beim Domainwechsel im Januar 301-Weiterleitungen.


## Social Feed (Instagram)

- Interface `SocialFeedService` (`packages/core/src/services.ts`), Live-Adapter `createInstagramFeed()` in `packages/services-live/src/instagram.ts`.
- **Voraussetzung:** Die Instagram Basic Display API ist seit 4.12.2024 abgeschaltet. Nötig ist ein **Business- oder Creator-Account** und die „Instagram API with Instagram Login“ (Meta-App, Produkt „Instagram“, Berechtigung `instagram_business_basic`).
- **Token:** Kurzlebiges Token aus dem Login gegen ein **langlebiges Token (60 Tage)** tauschen und in `INSTAGRAM_ACCESS_TOKEN` hinterlegen. Vor Ablauf (frühestens nach 24 h) mit `refreshInstagramToken()` verlängern, z. B. per wöchentlichem Cron (GitHub Action oder Hosting-Cron) und das neue Token im Secret-Store des Hostings speichern. Das Token nie ins Repo.
- **Caching:** Der Adapter cached 30 Minuten im Speicher, die Seite trifft die API also nicht bei jedem Aufruf. Beim Hosting mit ISR zusätzlich `revalidate` setzen.

## Google-Rezensionen

- Interface `ReviewsService`, Live-Adapter in `packages/services-live/src/google-reviews.ts`.
- **Places API (New)** – `createPlacesReviews({ apiKey, placeId })`: maximal 5 Rezensionen. **Pflicht:** Autor nennen (mit Link, wenn vorhanden), Link zur Originalrezension, Hinweis auf Auswahl/Sortierung (macht die Komponente). **Inhalte nicht speichern** – deshalb kein Cache im Adapter; gespeichert wird nur die Place-ID (`GOOGLE_PLACE_ID`).
- **Business Profile API** – `createBusinessProfileReviews(...)`: alle Rezensionen, braucht die **OAuth-Freigabe des verifizierten Inhabers** (Scope `https://www.googleapis.com/auth/business.manage`). Einmalig OAuth durchlaufen, Refresh-Token sicher speichern, Account- und Location-ID eintragen. Der API-Zugang muss bei Google beantragt werden.
- **Niemals erfundene Rezensionen live:** Den Demo-Adapter gibt es nur in `services-demo`; im Live-Modus wird er nicht verdrahtet.

## Admin & Login

- Interface `AuthService` (login/verify/logout). Demo: fester Demo-User (`demo@cn-event.de` / `demo`). Live: z. B. Auth.js, Clerk oder Supabase Auth als Implementierung desselben Interfaces – die Admin-UI (`components/admin/AdminApp.tsx`) und die Endpunkte (`/api/admin/*`) bleiben gleich.
- Sitzung im Server-Modus als httpOnly-Cookie `cev_admin`; jeder Admin-Endpunkt prüft sie über `server/admin-auth.ts`.
- Der Tab „Demo“ und `/api/demo/*` existieren nur mit `DATA_MODE=demo`.

## Design drehen (Celias CI)

Alles in `packages/content/src/design-tokens.ts`: Farben (`color`), Schriften (`font`), **Ticket-Stil** (`ticket`: Radius, Kerben, Perforation, Farben, Schatten) und Radien. Die Headline-Schrift wird in `apps/web/src/app/layout.tsx` geladen (next/font).

## Namenswechsel im Januar

`packages/content/src/brand.ts` → `name`/`short` (z. B. „CN Event“), `brand.nameStatus` als erledigt markieren (Platzhalter entfernen). Der Name steht sonst nirgends hart im Code (Titel, Mails, JSON-LD, Manifest, llms.txt lesen alle daraus). Logo-Datei austauschen und die Domain in `NEXT_PUBLIC_SITE_URL` umstellen.

## Corporate-Strecke (später)

`brand.tracks` ist vorbereitet (`corporate`). Vorschlag: eine Next.js-Middleware/Proxy liest den Host `corporate.<domain>` und rewritet auf `/(corporate)/…`-Routen, die dieselben Komponenten mit eigenen Inhalten aus `packages/content/src/tracks/corporate.ts` nutzen.

## App

- **Jetzt:** Die Seite ist eine PWA (Manifest, Icons, Service Worker). „Zum Home-Bildschirm“ funktioniert im Production-Build.
- **Später nativ** (z. B. Expo/React Native):
  - `@c-event/core` direkt importieren: Zod-Schemas, Warenkorb-Logik (`addToCart`, `summarizeCart`), Formatierung. Dasselbe Formular validiert dann identisch.
  - `@c-event/content` für Texte, Katalog und Tokens (`design-tokens.ts` → Theme der App).
  - Daten und Aktionen ausschließlich über die API oben, keine eigene Server-Logik in der App.
  - Der Rider-Store (`apps/web/src/lib/rider-store.ts`) ist eine dünne Hülle um die Core-Funktionen; in der App dieselben Funktionen mit AsyncStorage.
