# Effekt-Inventur (Review 22.10.2026, aktualisiert 31.10.2026)

Vorgabe: „Consistency is key“ – nur die drei bis vier besten Effekte behalten und seitenweit einheitlich nutzen.

## Bleibt (4)

| # | Effekt | Wo | Warum |
|---|---|---|---|
| 1 | **Hero-Intro mit CN-Blende** – das Foto erscheint durch „CN“, dann geht der Vorhang auf (C fährt nach links, N nach rechts; nur transform ganzer Flächen), die Headline steigt Buchstabe für Buchstabe auf (kein Countdown mehr, Wunsch vom 01.11.). Dazu der **Übergang „Doors open → 360°“** in drei Varianten (Punkte · Blende · Ticket, im Admin → Demo umschaltbar). Standard „Punkte“: Das Foto zerfällt in ein Punkteraster wie eine LED-Wand, die Punkte fliegen zur „360°“ zusammen, der Rest fällt weg. Die Zahl besteht aus Punkten auf der Kontur (zwei Ebenen = räumliche Tiefe) und einem lockeren, gedämpften Raster in der Fläche, damit die Ziffern lesbar bleiben, neigt sich zur Maus und weicht ihr aus (Touch: langsames Schwingen). Canvas 2D, `components/home/dots360.ts`. | Startseite | Von Celia ausdrücklich gewünscht („komplette Hero-Animation inkl. C“). |
| 2 | **Vorhang zwischen Seiten** – fünf Bahnen fallen, Linktext als Label, öffnen sich auf der neuen Seite. | überall | Event-Gefühl bei jedem Seitenwechsel. Bewusst nur hier: Der Hero-Übergang nutzt keine Bahnen mehr (Review 23.10.). |
| 3 | **Foto-Leiste (horizontaler Foto-Scroll)** – Bilder laufen seitlich durch, während man scrollt. Komponente `PhotoRail`. | jede Leistungsseite (Eindrücke) | Celias Highlight von Bar-Catering. Auf der Startseite seit 31.10. ersetzt durch die aufklappenden Leistungs-Streifen. |
| 4 | **Reveal** – Headlines steigen wortweise aus einer Kante (`data-reveal="words"`), Karten/Absätze gleiten hoch (`data-reveal="up"`). | überall | Ruhige, einheitliche Bewegung für alle übrigen Inhalte. |

Interaktionen (kein Scroll-Effekt, nur auf Hover/Geste): **aufklappende Bildstreifen** der Leistungen (Startseite), **Event-Match** (Kartenstapel zum Wischen), Abende als Plakatzeilen mit aufklappendem Bild beim Hover.

Infrastruktur (kein sichtbarer Effekt): Smooth Scroll (Lenis), `prefers-reduced-motion` schaltet alles ab.

Kleine, einheitliche Hover- und Klick-Zustände (Bild-Zoom 5 % auf Karten, Ticket hebt sich leicht, beim Klick reißt der Ticket-Stub an der Perforation ab – `components/motion/TicketTear.tsx`, CSS `.tk[data-torn]`) zählen nicht als eigener Effekt.

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
