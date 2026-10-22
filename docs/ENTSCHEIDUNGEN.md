# Entscheidungen

Getroffen beim Bau der Demo (22.10.2026), wo Briefing oder Start-Prompt offen oder widersprüchlich waren.

## Design

| Thema | Entscheidung | Warum |
|---|---|---|
| Ruhig vs. mutig | Der Start-Prompt wollte „ruhige Animationen, keine Effekthascherei“, Nino wollte „mutig, full width, darf nicht nach KI aussehen, die ganze Seite ist ein Event“. **Ninos Vorgabe gilt.** Farben aus dem Briefing-Deck bleiben als Basis. | Ausdrückliche Vorgabe von Nino für diese Kundin. |
| Leitidee | Die Seite ist eine Veranstaltung: Countdown und Einlass beim Laden, „Line-up“ statt Leistungsliste, „Running Order“ für Referenzen, „Doors“ für Zielgruppen, „Rider“ statt Warenkorb, Ticket-Optik, Vorhang zwischen den Seiten. | Event-Vokabular statt Agentur-Standard. |
| Schriften | **Archivo** (variabel, schmaler Schnitt `wdth 62`) für Headlines, **Cormorant Garamond kursiv** für Akzentwörter, **DM Sans** für Text. Selbst gehostet über `next/font` (kein Google-Aufruf im Browser). | Cormorant + DM Sans aus dem Briefing; als Display allein wäre Cormorant zu ruhig. Archivo trägt Plakat-Typo. |
| Farben | Briefing-Basis (Dunkel, Champagner `#d4a25a`, Creme `#f3eee5`) plus **Signal-Rot `#ff4a26`** für Live-Momente, CTAs und das Finale. | Ein Signal macht es zum Event, ohne den edlen Grundton zu verlieren. |
| Hero-Intro | Ladezähler → Countdown 3-2-1 mit Lichtblitz → das Bild öffnet sich durch ein **„C“ (Markenzeichen statt Bogen)** → Kamerafahrt durch das C → Slogan schlägt Buchstabe für Buchstabe ein. Volle Version einmal pro Tab, danach eine kurze Version. Abkürzung per Scroll/Klick/Taste (Zeitraffer). | Wunsch: „das Laden als eigenes kleines Event“, „den Bogen anders, spannender“. |
| Hero-Scroll | Zweite Botschaft, dann reißt das Bild in **fünf Vorhang-Streifen** nach oben weg und gibt „360°“ frei. | Greift den Vorhang-Übergang auf, statt Lohnias abgerundetem Rahmen. |
| Seitenwechsel | Vorhang aus dem Bunker-West-Projekt, umgebaut für den Next.js App Router (Klick abfangen → `router.push`), Linktext als Label. | Client-Navigation bleibt erhalten, kein harter Reload. |
| Video | Kein echtes Stock-Video im Hero (Downloadlinks ohne API nicht verlässlich). Zwei **Demo-Loops** (Ken-Burns aus Stockfotos, WebM) für Galerie und Social-Seite. | Video-Unterstützung ist testbar; der Hero kann später per Medien-ID auf ein Video umgestellt werden. |
| Custom Cursor | Nur mit Maus, mit Label auf Buttons. Auf Touch aus. | Event-Gefühl auf dem Desktop ohne Nachteil auf dem Handy. |

## Technik

| Thema | Entscheidung | Warum |
|---|---|---|
| Stack | Next.js 16.4 (App Router, Turbopack), React 19, TypeScript 6 strict, pnpm-Workspace, GSAP 3.15 + ScrollTrigger, Lenis | Wie vorgeschlagen. TypeScript 6 statt 7, weil typescript-eslint 7 noch nicht unterstützt. |
| Kein Tailwind | Eigenes CSS mit Tokens als CSS-Variablen (`globals.css`, `pages.css`) | Das Design ist sehr eigenständig (Masken, Clip-Paths, Typo-Achsen). Tokens kommen trotzdem aus einer TS-Datei, die eine App direkt übernehmen kann. |
| Demo-Ablage | JSON-Datei `apps/web/.demo-data/db.json` (git-ignoriert), Schreibzugriffe serialisiert | Läuft ohne native Abhängigkeiten (kein SQLite-Build), ausreichend für eine Demo. |
| Demo-Seiten dynamisch | Im Demo-Modus werden Seiten pro Anfrage gerendert, weil Cockpit-Einstellungen (Slogan, Preise, Flags) sofort wirken sollen. Live werden Einstellungen aus der Config gelesen. | Umschalten ohne Neustart. |
| Pflichtfelder | Pflicht: Kategorie, Name, E-Mail, Datenschutz. Alles andere optional, Datum zusätzlich „flexibel“. | Möglichst wenig Hürden. Die endgültigen Felder legt Celia fest. |
| Spam-Schutz | Honeypot-Feld plus Mindest-Ausfüllzeit (2,5 s) | Kein Captcha, kein Cookie-Banner nötig. |
| Warenkorb | Nur IDs und Mengen im Browser (`localStorage`). Preise werden serverseitig neu aus dem Katalog berechnet. | Manipulierte Preise im Browser landen nie in der Anfrage. |
| Mindestmengen | Artikel mit `minQty` (z. B. Barkeeper:in 4 Std.) werden mit dieser Menge in den Rider gelegt. | Realistische Richtwerte. |
| URLs | Leistungsseiten unter `/leistungen/<slug>` (laut Start-Prompt) statt `/bar-catering` (Bauplan). Suchbegriff steht in H1, Title und Description. | Ein Template, klare Struktur. Falls gewünscht, sind Kurz-URLs per Redirect schnell ergänzt. |
| robots im Demo-Modus | `Disallow: /` plus `noindex` | Die Vorschau soll nicht im Index landen. |
| Service Worker | Nur im Production-Build registriert, Seiten network-first, Assets cache-first | Keine Cache-Überraschungen beim Entwickeln. |
| E2E | Playwright 1.60 (passt zum lokal installierten Chromium), läuft gegen `next start` auf Port 4317, Desktop + Pixel 7, nacheinander | Port 3100 war auf dem Rechner schon belegt; parallele Läufe teilen sich sonst die Demo-Ablage. |

## Online-Vorschau

| Thema | Entscheidung | Warum |
|---|---|---|
| Hosting der Vorschau | GitHub Pages statt Vercel | Wunsch von Nino: alles bei GitHub, kein weiterer Account. |
| Ohne Server | `STATIC_EXPORT=1`: `output: 'export'` mit basePath `/c-event`. Server-Routen heißen `route.server.ts` und fallen dabei über `pageExtensions` raus. Die Client-API (`apps/web/src/lib/api.ts`) ruft dann die Demo-Services direkt im Browser auf (`@c-event/services-demo/browser`, localStorage). | Dieselbe Logik wie lokal (Validierung, Bepreisung, Mails), nur die Ablage ist eine andere. |
| Einstellungen | Slogan, Preise und Flags werden clientseitig gelesen (`SiteProvider`, `PriceTag`, `IfFlag`), damit sie auch ohne Server sofort wirken. | Statische Seiten können sonst nicht auf das Cockpit reagieren. |
| Grenzen | Daten gelten pro Browser; Bilder werden nicht optimiert (`images.unoptimized`). | Gilt nur für die Vorschau, nicht für den späteren Live-Betrieb. |

## Stabilität & Performance (Hero und Scroll)

| Thema | Entscheidung | Warum |
|---|---|---|
| Hero-Intro | Hero-Inhalte und Navigation verdeckt während des Intros nur CSS (`.is-intro`, `html.intro-on`). Die Tweens setzen ihren Startzustand erst, wenn sie dran sind. Ein Wächter mit `setTimeout` springt nach spätestens 10 s auf den Endzustand, eine CSS-Notbremse nach 9 s. Im Hintergrund-Tab geladen → kein Intro. | Vorher konnten Buttons und Navigation unsichtbar bleiben, wenn `requestAnimationFrame` stand (Hintergrund-Tab, stockender Browser). |
| Effekte | Filmkorn statisch und nur Viewport-groß, Cursor ohne `mix-blend-mode`, bewegte Großflächen mit `will-change`, ScrollTrigger-Refresh nach Fonts und Bildern | Weniger Arbeit pro Frame beim Scrollen. |
| Bilder statisch | `scripts/stock-variants.mjs` erzeugt WebP-Varianten (480/960/1600/2200 px), ein eigener Loader wählt die passende. | GitHub Pages hat keinen Bild-Optimierer; vorher wurden überall die Originale (bis 2400 px) geladen. |

## Afterhour Arcade

| Thema | Entscheidung | Warum |
|---|---|---|
| Maus-Follower | Entfernt | Wunsch von Nino. |
| Minispiele | Eigene Seite `/arcade` mit drei Retro-Spielen passend zu den Leistungen: Shaker Rush (Bar), DJ Drop (Musik/Regie), Türsteher (Personal/Einlass). Teaser auf der Startseite, Link im Footer und auf der 404-Seite, nicht in der Hauptnavigation. | Event-Gefühl ohne die geforderte 6-Punkte-Navigation aufzubrechen. |
| Technik | Eigene Mini-Engine (Canvas 240×180, Pixel-Skalierung, WebAudio-Chiptune), keine Spiel-Bibliothek. Tastatur nur, wenn der Automat fokussiert ist; Touch per Ziehen/Tippen. Auto-Pause bei Tab-Wechsel oder wenn der Automat aus dem Bild scrollt. Highscores nur lokal im Browser. Pixel-Schrift „Press Start 2P“ ohne Preload. | Leicht, offline-fähig, keine Daten an Dritte. |

## Inhalte

- Alle Texte sind **Vorschläge**, als Platzhalter markiert, bis Celia sie freigibt.
- Drei Slogan-Varianten: „Ideen auf die Bühne.“, „Abende, über die man redet.“, „Alles ist ein Event.“ (im Cockpit umschaltbar).
- 22 Demo-Artikel in 7 Kategorien, 3 Pakete (S Afterwork, M Weihnachtsfeier, L Full Night). Preise sind plausible Richtwerte.
- Referenzen (Yami Club, JD Sports) nur als „z. B.“-Platzhalter, bis die Freigaben da sind.
- Gastro-Content ist bewusst ausgeschlossen (Hinweis auf der Social-Media-Seite).

## Bekannte Grenzen der Demo

- Es werden keine echten Mails verschickt (Demo-Postfach im Cockpit).
- Der Kalender ist nicht an Celias Kalender angebunden.
- Einige kurze UI-Beschriftungen (z. B. Formular-Labels und Abschnittstitel auf Über uns und Social Media) stehen noch direkt in den Komponenten statt in `packages/content`. Das ziehen wir beim Einsetzen der echten Inhalte nach.
- Das Cockpit hat keinen Login. Im Live-Modus ist es komplett abgeschaltet (404).
