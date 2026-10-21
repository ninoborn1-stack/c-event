import Link from 'next/link';
import { inquiryHref, socialMedia } from '@c-event/content';
import { Btn } from '@/components/Btn';
import { JsonLd } from '@/components/JsonLd';
import { Media } from '@/components/Media';
import { Ph, PhText } from '@/components/Ph';
import { Split } from '@/components/Split';
import { SITE_URL } from '@/lib/env';
import { pageMeta } from '@/lib/seo';

export const metadata = pageMeta({ ...socialMedia.seo, path: '/social-media', image: socialMedia.hero.media });

export default function SocialPage() {
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: socialMedia.hero.h1,
          serviceType: 'Social-Media-Strategie & Content-Production',
          provider: { '@id': `${SITE_URL}/#org` },
          areaServed: ['Berlin', 'Deutschland'],
        }}
      />
      <header className="social-hero">
        <div className="social-hero__phone" aria-hidden="true">
          <div className="social-hero__screen">
            <Media id="video-dj-loop" />
            <span className="social-hero__rec">● REC</span>
          </div>
        </div>
        <div className="social-hero__body">
          <span className="micro">
            <i className="live-dot" /> {socialMedia.hero.kicker}
          </span>
          <Split as="h1" className="page-head__title" text={socialMedia.hero.h1.replace('Events machen', '*Events machen*')} />
          <PhText v={socialMedia.hero.lead} className="page-head__lead" />
          <Btn href={inquiryHref('social-media')} variant="signal" label="Booking">
            {socialMedia.cta}
          </Btn>
        </div>
      </header>
      <section className="sec sec--cream">
        <header className="sec__head">
          <span className="micro">Bausteine</span>
          <Split as="h2" className="display-l" text="Von der Strategie bis zum *fertigen Post*." />
        </header>
        <Ph v={socialMedia.blocks} as="div" className="points points--5">
          {(blocks) =>
            blocks.map((b, i) => (
              <div key={b.title} className="point" data-reveal="up">
                <em>{String(i + 1).padStart(2, '0')}</em>
                <h2>{b.title}</h2>
                <p>{b.text}</p>
              </div>
            ))
          }
        </Ph>
        <p className="note-line">{socialMedia.notFor}</p>
      </section>
      <section className="sec sec--night">
        <header className="sec__head">
          <span className="micro">Ablauf</span>
        </header>
        <ol className="steps steps--4">
          {socialMedia.process.map((st, i) => (
            <li key={st.title} data-reveal="up">
              <span className="steps__no">{i + 1}</span>
              <h3>{st.title}</h3>
              <p>{st.text}</p>
            </li>
          ))}
        </ol>
      </section>
      <section className="sec sec--ink">
        <header className="sec__head">
          <span className="micro">Referenzen</span>
        </header>
        <Ph v={socialMedia.references} as="div" className="refs">
          {(refs) =>
            refs.map((r) => (
              <article key={r.name} className="refs__card" data-reveal="up">
                <div className="refs__img">
                  <Media id={r.media} sizes="(min-width: 900px) 33vw, 100vw" />
                </div>
                <h3>{r.name}</h3>
                <p>{r.text}</p>
              </article>
            ))
          }
        </Ph>
      </section>
      <section className="svc-cta">
        <Link href={inquiryHref('social-media')} className="svc-cta__big" data-label="Booking">
          <span className="micro">Kategorie vorausgewählt: Social Media</span>
          <strong>{socialMedia.cta} →</strong>
        </Link>
      </section>
    </>
  );
}
