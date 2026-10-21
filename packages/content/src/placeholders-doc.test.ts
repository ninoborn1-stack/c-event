import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { listPlaceholders } from './index';

/**
 * Erzeugt docs/PLATZHALTER.md aus den markierten Inhalten.
 * Aufruf: pnpm docs:placeholders (setzt WRITE_DOCS=1). Ohne Flag läuft nur der Check.
 */
describe('Platzhalter-Doku', () => {
  it('lässt sich aus den Inhalten erzeugen', () => {
    const list = listPlaceholders();
    expect(list.length).toBeGreaterThan(0);
    if (!process.env.WRITE_DOCS) return;
    const groups = new Map<string, typeof list>();
    for (const p of list) groups.set(p.group, [...(groups.get(p.group) ?? []), p]);
    const lines = [
      '# Offene Platzhalter',
      '',
      `Automatisch erzeugt aus \`packages/content\` (alles, was mit \`ph()\` markiert ist). Stand: ${new Date().toLocaleDateString('de-DE')}. **${list.length} Einträge.**`,
      '',
      'Neu erzeugen: `pnpm docs:placeholders`. Dieselbe Liste zeigt das Demo-Cockpit unter `/demo#platzhalter`.',
      '',
    ];
    for (const [group, entries] of groups) {
      lines.push(`## ${group} (${entries.length})`, '');
      if (group === 'Medien') {
        lines.push(`Alle ${entries.length} Bilder/Videos sind Stockmaterial bzw. Demo-Loops und werden 1:1 über die IDs in \`packages/content/src/media.ts\` gegen Celias Material getauscht.`, '');
        continue;
      }
      // Gleiche Hinweise zusammenfassen (z. B. 22 Preise mit derselben Notiz)
      const byNote = new Map<string, string[]>();
      for (const e of entries) byNote.set(e.note, [...(byNote.get(e.note) ?? []), e.path]);
      lines.push('| Was fehlt | Wo (Pfad im Content) | Anzahl |', '|---|---|---|');
      for (const [note, paths] of byNote) {
        const shown = paths.slice(0, 3).map((p) => `\`${p}\``).join('<br>') + (paths.length > 3 ? `<br>… +${paths.length - 3}` : '');
        lines.push(`| ${note} | ${shown} | ${paths.length} |`);
      }
      lines.push('');
    }
    writeFileSync(path.resolve(import.meta.dirname, '../../../docs/PLATZHALTER.md'), lines.join('\n'));
  });
});
