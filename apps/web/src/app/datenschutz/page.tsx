import { brand, legal } from '@c-event/content';
import { LegalPage } from '@/components/LegalPage';
import { pageMeta } from '@/lib/seo';

const L = legal.datenschutz;
export const metadata = pageMeta({ title: L.title, description: `${L.title} von ${brand.name}`, path: '/datenschutz' });

export default function Page() {
  return (
    <LegalPage title={L.title} note={L.note}>
      {L.sections.map((s) => (
        <section key={s.h}>
          <h2>{s.h}</h2>
          <p>{s.p}</p>
        </section>
      ))}
    </LegalPage>
  );
}
