import { isInquiryCategory, isValidIsoDate, OCCASIONS, type Occasion } from '@c-event/core';
import { brand, inquiryPage } from '@c-event/content';
import { InquiryForm } from '@/components/inquiry/InquiryForm';
import { Ph, PhText } from '@/components/Ph';
import { Split } from '@/components/Split';
import { pageMeta } from '@/lib/seo';

export const metadata = pageMeta({ ...inquiryPage.seo, path: '/anfrage', image: 'anstossen-nachts' });

export default async function InquiryPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const one = (k: string) => (Array.isArray(sp[k]) ? sp[k][0] : sp[k]);
  const kat = one('kategorie');
  const datum = one('datum');
  const anlass = one('anlass');
  return (
    <>
      <header className="page-head page-head--signal">
        <span className="micro">{inquiryPage.kicker}</span>
        <Split as="h1" className="page-head__title" text={inquiryPage.h1} />
        <p className="page-head__lead">{inquiryPage.lead}</p>
      </header>
      <section className="sec sec--cream sec--tight inquiry">
        <InquiryForm
          initialCategory={isInquiryCategory(kat) ? kat : undefined}
          initialDate={isValidIsoDate(datum) ? datum : undefined}
          initialOccasion={(OCCASIONS as readonly string[]).includes(anlass ?? '') ? (anlass as Occasion) : undefined}
        />
        <aside className="inquiry__aside">
          <span className="micro">Lieber direkt?</span>
          <Ph v={brand.contact.phone}>{(p) => <a href={`tel:${p.replace(/\s/g, '')}`}>{p}</a>}</Ph>
          <Ph v={brand.contact.email}>{(m) => <a href={`mailto:${m}`}>{m}</a>}</Ph>
          <Ph v={brand.contact.whatsapp}>{(w) => <a href={`https://wa.me/${w}`} target="_blank" rel="noopener noreferrer">WhatsApp</a>}</Ph>
          <p className="muted">{brand.contact.responseTime}.</p>
          <p className="muted">
            Einsatzgebiet: <PhText v={brand.region} />
          </p>
        </aside>
      </section>
    </>
  );
}
