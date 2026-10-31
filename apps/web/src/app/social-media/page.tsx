import { inquiryHref, socialMedia } from '@c-event/content';
import { TicketLink } from '@/components/ui/Ticket';
import { JsonLd } from '@/components/JsonLd';
import { Media } from '@/components/Media';
import { PageHero } from '@/components/layout/PageHero';
import { Ph, PhText } from '@/components/Ph';
import { SocialFeed } from '@/components/social/SocialFeed';
import { Split } from '@/components/Split';
import { SITE_URL } from '@/lib/env';
import { pageMeta } from '@/lib/seo';
import { getServices } from '@/server/services';

export const metadata = pageMeta({ ...socialMedia.seo, path: '/social-media', image: socialMedia.hero.media });

export default async function SocialPage() {
  const feed = await getServices().social.getFeed(12);
  const T = socialMedia.sections;
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
      <PageHero media={socialMedia.hero.media} kicker={socialMedia.hero.kicker} title={socialMedia.hero.poster} lead={<PhText v={socialMedia.hero.lead} />}>
        <TicketLink href={inquiryHref('social-media')} label="Anfrage" size="lg">
          {socialMedia.cta}
        </TicketLink>
      </PageHero>

      {/* Rote Statement-Fläche über die volle Breite */}
      <section className="statement">
        <h2 className="statement__text" aria-label={socialMedia.statement.join(' ').replace(/\*/g, '')}>
          {socialMedia.statement.map((l) => (
            <Split key={l} text={l} className="statement__line" />
          ))}
        </h2>
      </section>

      <section className="sec">
        <header className="sec__head sec__head--row">
          <div>
            <span className="eyebrow">{T.blocks}</span>
            <Split as="h2" className="h-l" text={T.blocksTitle} />
          </div>
          <p className="sec__lead">{socialMedia.notFor}</p>
        </header>
        <Ph v={socialMedia.blocks} as="ol" className="hairgrid hairgrid--5">
          {(blocks) =>
            blocks.map((b, i) => (
              <li key={b.title} className="hairgrid__cell" data-reveal="up">
                <span className="mono">{String(i + 1).padStart(2, '0')}</span>
                <h3>{b.title}</h3>
                <p>{b.text}</p>
              </li>
            ))
          }
        </Ph>
      </section>

      <section className="sec sec--night">
        <header className="sec__head sec__head--row">
          <div>
            <span className="eyebrow">{T.feed}</span>
            <Split as="h2" className="h-l" text={T.feedTitle} />
          </div>
        </header>
        <SocialFeed feed={feed} grid />
      </section>

      <section className="sec">
        <header className="sec__head">
          <span className="eyebrow">{T.process}</span>
          <Split as="h2" className="h-l" text={T.processTitle} />
        </header>
        <ol className="bignum">
          {socialMedia.process.map((st, i) => (
            <li key={st.title} data-reveal="up">
              <span className="bignum__no">{String(i + 1).padStart(2, '0')}</span>
              <h3>{st.title}</h3>
              <p>{st.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="sec sec--ink">
        <header className="sec__head">
          <span className="eyebrow">{T.refs}</span>
          <Split as="h2" className="h-l" text={T.refsTitle} />
        </header>
        <Ph v={socialMedia.references} as="div" className="ptiles">
          {(refs) =>
            refs.map((r) => (
              <article key={r.name} className="ptile" data-reveal="up">
                <div className="ptile__img duo">
                  <Media id={r.media} sizes="(min-width: 900px) 33vw, 100vw" />
                </div>
                <div className="ptile__text">
                  <span className="mono">{r.text}</span>
                  <h3>{r.name}</h3>
                </div>
              </article>
            ))
          }
        </Ph>
      </section>

      <section className="split-red">
        <div className="split-red__img duo">
          <Media id="mikrofon-publikum" sizes="(min-width: 900px) 50vw, 100vw" />
        </div>
        <div className="split-red__body">
          <Split as="h2" className="h-l" text={T.finale} />
          <p>{T.finaleText}</p>
          <TicketLink href={inquiryHref('social-media')} label="Anfrage" size="lg" tone="cream">
            {socialMedia.cta}
          </TicketLink>
        </div>
      </section>
    </>
  );
}
