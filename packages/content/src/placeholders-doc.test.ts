import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { listPlaceholders, media } from './index';

/**
 * Erzeugt docs/PLATZHALTER.md aus den markierten Inhalten – gruppiert nach Priorität (P1/P2), dann Gruppe.
 * Aufruf: pnpm docs:placeholders (setzt WRITE_DOCS=1). Ohne Flag läuft nur der Check.
 */
describe('Platzhalter-Doku', () => {
  it('lässt sich aus den Inhalten erzeugen', () => {
    const list = listPlaceholders();
    expect(list.length).toBeGreaterThan(0);
    expect(list.every((p) => p.priority === 'P1' || p.priority === 'P2')).toBe(true);
    if (!process.env.WRITE_DOCS) return;
    const lines = [
      '# Offene Platzhalter',
      '',
      `Automatisch erzeugt aus \`packages/content\` (alles, was mit \`ph()\` markiert ist). Stand: ${new Date().toLocaleDateString('de-DE')}. **${list.length} Einträge**, davon **${list.filter((p) => p.priority === 'P1').length} × P1**.`,
      '',
      '- **P1** = vor dem Bau nötig (Briefing 2)',
      '- **P2** = nach und nach; für den Livegang sind nur **Domain** und **Impressum** zwingend',
      '',
      'Neu erzeugen: `pnpm docs:placeholders`. Dieselbe Liste zeigt der Admin unter `/admin#demo`. Die Spalte „Vorschlag“ ist das, was die Demo gerade zeigt.',
      '',
    ];
    for (const prio of ['P1', 'P2'] as const) {
      const entries = list.filter((p) => p.priority === prio);
      lines.push(`## ${prio} (${entries.length})`, '');
      const groups = new Map<string, typeof entries>();
      for (const p of entries) groups.set(p.group, [...(groups.get(p.group) ?? []), p]);
      for (const [group, items] of groups) {
        lines.push(`### ${group} (${items.length})`, '');
        if (group === 'Medien') {
          lines.push(
            `Alle ${items.length} Bilder/Videos sind Stockmaterial bzw. Demo-Loops. Jede Position hat in \`packages/content/src/media.ts\` ein **Wunschmotiv** (\`motif\`), damit Celias Material 1:1 zugeordnet werden kann.`,
            '',
            'Richtwerte: Hero 2–3 Clips à 10–30 s (quer + hochkant) · 5–10 Fotos je Leistung · 20–40 für die Galerie · 1 je Shop-Artikel · 1 je Teammitglied.',
            '',
            '| Datei-ID | Wunschmotiv |',
            '|---|---|',
            ...Object.entries(media).map(([id, m]) => `| \`${id}\` | ${m.motif} |`),
            '',
          );
          continue;
        }
        const byNote = new Map<string, typeof items>();
        for (const e of items) byNote.set(e.note, [...(byNote.get(e.note) ?? []), e]);
        lines.push('| Was fehlt | Vorschlag (aktuell in der Demo) | Wo | Anzahl |', '|---|---|---|---|');
        for (const [note, es] of byNote) {
          const where = es.slice(0, 2).map((p) => `\`${p.path}\``).join('<br>') + (es.length > 2 ? `<br>… +${es.length - 2}` : '');
          const preview = es[0]!.preview.replace(/\|/g, '\\|');
          lines.push(`| ${note} | ${preview} | ${where} | ${es.length} |`);
        }
        lines.push('');
      }
    }
    writeFileSync(path.resolve(import.meta.dirname, '../../../docs/PLATZHALTER.md'), lines.join('\n'));
  });
});
