# Projektregeln C-Event

- Sprache der Seite und der Doku: Deutsch. Kein Lorem ipsum, fehlende Inhalte als realistischer Vorschlag mit `ph(wert, notiz, gruppe)` aus `@c-event/core`.
- **Inhalte nie im JSX hart codieren.** Texte, Preise, Medien kommen aus `packages/content`. Markenname, Kontakt und Domain nur in `packages/content/src/brand.ts` (Namenswechsel „C-Event Agency“ → „C-Event“ im Januar).
- **Logik nicht in Komponenten.** Warenkorb, Validierung, Anfrage-Ablauf und Mails liegen in `packages/core` und werden von Web und späterer App geteilt.
- UI und API sprechen nur mit den Service-Interfaces (`packages/core/src/services.ts`), geholt über `apps/web/src/server/services.ts`. Demo vs. live über `DATA_MODE`.
- Ein Formular für alles: Jeder „Buchen“- oder „Anfragen“-Button verlinkt per `inquiryHref(kategorie)` auf `/anfrage?kategorie=…`.
- Bilder und Videos nur über die Medien-Registry (`packages/content/src/media.ts`) und `<Media id>`.
- Design-Tokens nur in `packages/content/src/design-tokens.ts`; im CSS als `var(--color-…)`, `var(--font-…)`.
- Animationen: Der CSS-Grundzustand ist immer der fertige Zustand. Intro und Scroll bewegen nie dieselbe Eigenschaft am selben Element (siehe Kommentar in `Hero.tsx`). `prefers-reduced-motion` respektieren. `clearProps: 'all'` nie auf `next/image`-Bildern verwenden.
- Vor dem Abschluss: `pnpm check` und nach UI-Änderungen `pnpm build && pnpm test:e2e`.
- Neue Platzhalter → `pnpm docs:placeholders` ausführen.
