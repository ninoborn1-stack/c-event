import type { ReactNode } from 'react';
import type { Maybe } from '@c-event/core';
import { PhText } from '@/components/Ph';

export function LegalPage({ title, note, children }: { title: string; note?: Maybe<string>; children: ReactNode }) {
  return (
    <article className="legal">
      <header className="page-head page-head--ink page-head--small">
        <span className="micro">Rechtliches</span>
        <h1 className="page-head__title">{title}</h1>
        {note && <PhText v={note} className="legal__note" />}
      </header>
      <div className="legal__body sec sec--cream sec--tight">{children}</div>
    </article>
  );
}
