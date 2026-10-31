import Link from 'next/link';
import { about, inquiryHref, partners } from '@c-event/content';
import { Media } from '@/components/Media';
import { PageHero } from '@/components/layout/PageHero';
import { Ph, PhText } from '@/components/Ph';
import { Split } from '@/components/Split';
import { TicketLink } from '@/components/ui/Ticket';
import { pageMeta } from '@/lib/seo';

export const metadata = pageMeta({ ...about.seo, path: '/ueber-uns', image: about.hero.media });

export default function AboutPage() {
  return (
    <>
      <PageHero media={about.hero.media} kicker={about.hero.kicker} title={about.hero.h1} />

      <section className="sec">
        <header className="sec__head">
          <span className="eyebrow">{about.kickers.whatWeDo}</span>
          <Split as="h2" className="h-l" text={about.whatWeDo.title} />
        </header>
        <div className="ptiles ptiles--4">
          {about.whatWeDo.items.map((w) => (
            <article key={w.title} className="ptile ptile--tall" data-reveal="up">
              <div className="ptile__img duo">
                <Media id={w.media} sizes="(min-width: 1100px) 25vw, (min-width: 700px) 50vw, 100vw" />
              </div>
              <div className="ptile__text">
                <span className="mono">{w.text}</span>
                <h3>
                  <Link href={w.href} data-label={w.title} className="ptile__link">
                    {w.title}
                  </Link>
                </h3>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="sec sec--cream">
        <header className="sec__head sec__head--row">
          <div>
            <span className="eyebrow">{about.kickers.story}</span>
            <Split as="h2" className="h-l" text={about.storyTitle} />
          </div>
          <PhText v={about.story} className="sec__lead" />
        </header>
        <ol className="hairgrid hairgrid--3 hairgrid--light">
          {about.values.map((v, i) => (
            <li key={v.title} className="hairgrid__cell" data-reveal="up">
              <span className="mono">{String(i + 1).padStart(2, '0')}</span>
              <h3>{v.title}</h3>
              <p>{v.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="sec">
        <header className="sec__head">
          <span className="eyebrow">{about.kickers.team}</span>
          <Split as="h2" className="h-l" text={about.teamTitle} />
        </header>
        <Ph v={about.team} as="div" className="portraits">
          {(team) =>
            team.map((t, i) => (
              <article key={`${t.name}-${i}`} className="portrait" data-reveal="up">
                <div className="portrait__img duo">
                  <Media id={t.media} sizes="(min-width: 1100px) 25vw, 50vw" />
                </div>
                <div className="portrait__text">
                  <span className="mono">{t.role}</span>
                  <h3>{t.name}</h3>
                  <p>{t.text}</p>
                </div>
              </article>
            ))
          }
        </Ph>
      </section>

      <section className="statement statement--list">
        <span className="eyebrow eyebrow--sq">{about.kickers.network}</span>
        <Ph v={about.network} as="ul" className="netlist">
          {(list) =>
            list.map((n) => (
              <li key={n} className={n.startsWith(partners.bunkerWest.name) ? 'is-star' : ''}>
                {n}
              </li>
            ))
          }
        </Ph>
        <TicketLink href={inquiryHref()} label="Anfrage" tone="cream" size="lg">
          {about.cta}
        </TicketLink>
      </section>
    </>
  );
}
