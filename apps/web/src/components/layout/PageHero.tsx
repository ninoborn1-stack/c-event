import type { ReactNode } from 'react';
import { Media } from '@/components/Media';
import { Split } from '@/components/Split';

/**
 * Seiten-Hero im Plakat-Look: Vollbild-Foto (78 % der Höhe), Verlauf von unten,
 * unten links Eyebrow → Plakat-Headline → Linie → Text links, CTAs rechts.
 */
export function PageHero({ media, kicker, title, lead, children }: { media: string; kicker: string; title: string; lead?: ReactNode; children?: ReactNode }) {
  return (
    <header className="phero">
      <div className="phero__img duo">
        <Media id={media} priority sizes="100vw" />
      </div>
      <div className="phero__body">
        <span className="eyebrow eyebrow--sq">{kicker}</span>
        <Split as="h1" className="phero__title" text={title} />
        {(lead || children) && (
          <div className="phero__foot">
            {lead && <div className="phero__lead">{lead}</div>}
            {children && <div className="phero__ctas">{children}</div>}
          </div>
        )}
      </div>
    </header>
  );
}
