# Bauplan: Stand der Demo

Kurzfassung des Website-Bauplans vom 21.10.2026 und wo jede Anforderung in der Demo steckt.

| Anforderung | Stufe | Stand | Wo |
|---|---|---|---|
| Eigene Seite pro Leistung (SEO) | Muss | ✅ 7 Seiten aus einem Template | `/leistungen/[slug]`, Inhalte `packages/content/src/services.ts` |
| Hero mit Slogan | Muss | ✅ 3 Varianten, Intro-Inszenierung | `components/home/Hero.tsx` |
| Navigation mit allen Leistungen | Muss | ✅ Dropdown, mobil Menü + Anfrage immer sichtbar | `components/layout/Nav.tsx` |
| Formular mit vorausgewählter Kategorie | Muss | ✅ `?kategorie=`, `?datum=`, `?anlass=` | `/anfrage`, `components/inquiry/InquiryForm.tsx` |
| Alle Buttons → dasselbe Formular | Muss | ✅ `inquiryHref()` | `packages/content/src/nav.ts` |
| Konfigurator mit Anfrage-Warenkorb | Muss | ✅ Rider, Pakete S/M/L, Filter, Kaution, Mengen | `/konfigurator`, `components/rider/*` |
| Anfrage an Agentur, Angebot durch Celia | Muss | ✅ kein Checkout, keine Zahlung | `packages/core/src/submit-inquiry.ts` |
| Bestätigungs-Mail an Kunden | Muss | ✅ Demo-Postfach | `packages/core/src/mail.ts`, `/demo#postfach` |
| Fotogalerie und Kunden | Muss | ✅ Filter nach Anlass/Leistung, Lightbox, Video | `/galerie`, Stimmen + Logos auf der Startseite |
| SEO- und KI-Sichtbarkeit | Muss | ✅ Title/Meta/H1/Canonical/OG, JSON-LD, Sitemap, robots, llms.txt | `lib/seo.ts`, `app/sitemap.ts`, `app/llms.txt` |
| Social-Media-Bereich | Muss | ✅ | `/social-media` |
| Kalender mit Verfügbarkeiten | Soll | ✅ nur Belegt/Frei, Klick übernimmt Datum | `components/calendar/*`, `/api/availability` |
| Bunker West als Location | Soll | ✅ Startseite + Event-Organisation + Über uns | `app/page.tsx` |
| Willkommens-Code Bunker West | Soll | ✅ per Flag (Standard aus) | Cockpit → Einstellungen |
| Corporate-Subdomain | Später | vorbereitet | `docs/UEBERGABE.md` |
| Community-App, Login | nicht gewünscht | – | – |

Offene Inhalte: siehe [PLATZHALTER.md](PLATZHALTER.md). Entscheidungen: [ENTSCHEIDUNGEN.md](ENTSCHEIDUNGEN.md).
