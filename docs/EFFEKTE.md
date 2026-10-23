# Effekt-Inventur (Review 22.10.2026)

Vorgabe: „Consistency is key“ – nur die drei bis vier besten Effekte behalten und seitenweit einheitlich nutzen.

## Bleibt (4)

| # | Effekt | Wo | Warum |
|---|---|---|---|
| 1 | **Hero-Intro mit CN-Blende** – Ladezähler, Countdown 3-2-1, Lichtblitz, das Bild öffnet sich durch „CN“, Kamerafahrt durchs N, Headline steigt Buchstabe für Buchstabe auf. Dazu der **Übergang „Doors open → 360°“** in drei Varianten (Tiefe · Blende · Ticket, im Admin → Demo umschaltbar; Standard „Tiefe“: das Bild kippt nach hinten in den Raum, die „360°“ dreht sich einmal um sich selbst nach vorn). Die „360°“ ist eine **3D-Zahl** mit harter Extrusion und Glanzlicht, die sich zur Maus neigt (Touch: langsames Schwingen). | Startseite | Von Celia ausdrücklich gewünscht („komplette Hero-Animation inkl. C“). |
| 2 | **Vorhang zwischen Seiten** – fünf Bahnen fallen, Linktext als Label, öffnen sich auf der neuen Seite. | überall | Event-Gefühl bei jedem Seitenwechsel. Bewusst nur hier: Der Hero-Übergang nutzt keine Bahnen mehr (Review 23.10.). |
| 3 | **Foto-Leiste (horizontaler Foto-Scroll)** – Bilder laufen seitlich durch, während man scrollt. Komponente `PhotoRail`. | Hero (Leistungen), jede Leistungsseite (Eindrücke) | Celias Highlight von Bar-Catering, jetzt wiederverwendbar. |
| 4 | **Reveal** – Headlines steigen wortweise aus einer Kante (`data-reveal="words"`), Karten/Absätze gleiten hoch (`data-reveal="up"`). | überall | Ruhige, einheitliche Bewegung für alle übrigen Inhalte. |

Infrastruktur (kein sichtbarer Effekt): Smooth Scroll (Lenis), `prefers-reduced-motion` schaltet alles ab.

Kleine, einheitliche Hover-Zustände (Bild-Zoom 5 % auf Karten, Ticket hebt sich leicht) zählen nicht als eigener Effekt.

## Fliegt raus

| Effekt | Warum |
|---|---|
| Geschwungene Schrift (Cormorant Garamond kursiv) | Celia: „komplett raus“. Akzentwörter sind jetzt Bernstein in derselben Headline-Schrift. |
| CTA-Karten mit abgeschnittenen Ecken (`clip-path`-Buttons) | Wirkte „Cyberpunk“. Ersetzt durch die eine Ticket-Komponente. |
| Eigener Maus-Cursor | Schon vorher entfernt. |
| Filmkorn-Overlay | Unruhig, kostet Performance, passt nicht zu „ruhiger“. |
| Laufbänder/Ticker (Leistungen, Footer, Kundenlogos) | Zu viel Bewegung auf der Startseite. |
| Rotierender 360°-Textring | Ersetzt durch die 360°-Varianten im Hero-Übergang. |
| Line-up mit Bild, das der Maus folgt | Startseite entschlackt; Leistungen jetzt als ruhige Kacheln. |
| Gepinnte „Running Order“ (horizontal, Pinning) | Doppelte sich mit der Foto-Leiste; Highlights jetzt als einfaches Raster. |
| Zielgruppen-„Doors“ (aufklappende Paneele) | Startseite: eine Aufgabe pro Sektion. Zielgruppen jetzt unter Über uns → „Was wir machen“. |
| Parallax auf Bildern, Clip-Reveal von Bildern | Nicht unter den besten vier. |
| Scrub-Wörter (Wörter „schalten sich ein“) | Nicht unter den besten vier. |
| Gedrehte Sticker-Pills, Stempel-Animation, pulsierender Live-Punkt, Pop-Animation am Warenkorb | Zu verspielt; statisch beibehalten, wo die Form hilft. |

## Regeln für neue Inhalte

- Neue Seiten nutzen nur die vier Effekte oben – nichts Zusätzliches ohne Abstimmung.
- Jeder CTA ist ein `TicketLink`/`TicketButton` (`components/ui/Ticket.tsx`).
- Der CSS-Grundzustand ist immer der fertige Zustand; Animationen starten von Zwischenzuständen.
