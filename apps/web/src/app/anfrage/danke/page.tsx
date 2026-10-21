import { Suspense } from 'react';
import { ThanksView } from '@/components/inquiry/ThanksView';
import { IS_DEMO } from '@/lib/env';

export const metadata = { title: 'Danke', robots: { index: false } };

export default function ThanksPage() {
  return (
    <section className="thanks">
      <div className="thanks__stamp" aria-hidden="true">
        Admit
        <br />
        one
      </div>
      <Suspense fallback={<p className="muted">Lädt …</p>}>
        <ThanksView isDemo={IS_DEMO} />
      </Suspense>
    </section>
  );
}
