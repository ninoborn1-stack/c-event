import { brand, legal } from '@c-event/content';
import { LegalPage } from '@/components/LegalPage';
import { Ph, PhText } from '@/components/Ph';
import { pageMeta } from '@/lib/seo';

export const metadata = pageMeta({ title: 'Impressum', description: `Impressum von ${brand.name}`, path: '/impressum' });

export default function ImpressumPage() {
  const f = legal.impressum.fields;
  return (
    <LegalPage title={legal.impressum.title}>
      <h2>Angaben gemäß § 5 DDG</h2>
      <p>
        <PhText v={f.company} />
        <br />
        <PhText v={f.street} />
        <br />
        <PhText v={f.city} />
      </p>
      <h2>Vertreten durch</h2>
      <p>
        <PhText v={f.representative} />
      </p>
      <h2>Kontakt</h2>
      <p>
        Telefon: <PhText v={brand.contact.phone} />
        <br />
        E-Mail: <Ph v={brand.contact.email}>{(m) => <a href={`mailto:${m}`}>{m}</a>}</Ph>
      </p>
      <h2>Registereintrag</h2>
      <p>
        <PhText v={f.register} />
      </p>
      <h2>Umsatzsteuer-ID</h2>
      <p>
        Umsatzsteuer-Identifikationsnummer gemäß § 27a UStG: <PhText v={f.vatId} />
      </p>
      <h2>Verantwortlich für den Inhalt</h2>
      <p>
        <PhText v={f.responsible} />
      </p>
      <h2>Bildnachweise</h2>
      <p>Demo-Bilder: Unsplash (Unsplash-Lizenz). Details siehe /stock/CREDITS.md.</p>
    </LegalPage>
  );
}
