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
| `GET/POST` | `/api/demo/*` | Nur im Demo-Modus: Cockpit-Daten, Kalender umschalten, Einstellungen, Reset |

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
   | `NEXT_PUBLIC_SITE_URL` | `https://<domain>` (im Januar ggf. neue C-Event-Domain) |
   | `MAIL_PROVIDER`, `MAIL_API_KEY`, `MAIL_FROM` | Mailversand |
   | `INQUIRY_RECIPIENT` | Celias Anfrage-Postfach |
   | `AVAILABILITY_ICAL_URL` | Kalender-Quelle |
   | `FEATURE_BUNKER_CODE` | `1`, wenn der Willkommens-Code sichtbar sein soll |

   Mit `DATA_MODE=live` gilt automatisch: `robots.txt` erlaubt Indexierung, `/demo` und `/api/demo/*` liefern 404, Platzhalter werden nicht mehr markiert.
5. **Rechtliches**: Impressum-Daten, Datenschutz (Hosting, Mail-Anbieter, Kalender) und Mietbedingungen in `packages/content/src/pages.ts` (`legal`) einsetzen und prüfen lassen.
6. **SEO**: Search Console, Sitemap einreichen, Google-Unternehmensprofil verknüpfen. Beim Domainwechsel im Januar 301-Weiterleitungen.

## Namenswechsel im Januar

`packages/content/src/brand.ts` → `name: 'C-Event'`. Der Name steht sonst nirgends hart im Code (Titel, Mails, JSON-LD, Manifest, llms.txt lesen alle daraus). Logo-Datei austauschen und die Domain in `NEXT_PUBLIC_SITE_URL` umstellen.

## Corporate-Strecke (später)

`brand.tracks` ist vorbereitet (`corporate`). Vorschlag: eine Next.js-Middleware/Proxy liest den Host `corporate.<domain>` und rewritet auf `/(corporate)/…`-Routen, die dieselben Komponenten mit eigenen Inhalten aus `packages/content/src/tracks/corporate.ts` nutzen.

## App

- **Jetzt:** Die Seite ist eine PWA (Manifest, Icons, Service Worker). „Zum Home-Bildschirm“ funktioniert im Production-Build.
- **Später nativ** (z. B. Expo/React Native):
  - `@c-event/core` direkt importieren: Zod-Schemas, Warenkorb-Logik (`addToCart`, `summarizeCart`), Formatierung. Dasselbe Formular validiert dann identisch.
  - `@c-event/content` für Texte, Katalog und Tokens (`design-tokens.ts` → Theme der App).
  - Daten und Aktionen ausschließlich über die API oben, keine eigene Server-Logik in der App.
  - Der Rider-Store (`apps/web/src/lib/rider-store.ts`) ist eine dünne Hülle um die Core-Funktionen; in der App dieselben Funktionen mit AsyncStorage.
