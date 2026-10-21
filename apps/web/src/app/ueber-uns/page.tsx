import { about, partners } from '@c-event/content';
import { Btn } from '@/components/Btn';
import { Media } from '@/components/Media';
import { Ph, PhText } from '@/components/Ph';
import { Split } from '@/components/Split';
import { pageMeta } from '@/lib/seo';

export const metadata = pageMeta({ ...about.seo, path: '/ueber-uns', image: about.hero.media });

export default function AboutPage() {
  return (
    <>
      <header className="page-hero">
        <div className="page-hero__img" data-reveal="clip">
          <Media id={about.hero.media} priority sizes="100vw" />
        </div>
        <div className="page-hero__body">
          <span className="micro">{about.hero.kicker}</span>
          <Split as="h1" className="page-head__title" text={about.hero.h1.replace('einfach machen', '*einfach machen*')} />
        </div>
      </header>
      <section className="sec sec--cream story">
        <PhText v={about.story} className="story__text" />
        <div className="values" data-reveal="stagger">
          {about.values.map((v, i) => (
            <div key={v.title}>
              <em>{String(i + 1).padStart(2, '0')}</em>
              <h2>{v.title}</h2>
              <p>{v.text}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="sec sec--ink">
        <header className="sec__head">
          <span className="micro">Team</span>
          <Split as="h2" className="display-l" text="Die Crew hinter der Crew." />
        </header>
        <Ph v={about.team} as="div" className="team">
          {(team) =>
            team.map((t) => (
              <article key={t.name} className="team__card" data-reveal="up">
                <div className="team__img">
                  <Media id={t.media} sizes="(min-width: 900px) 33vw, 100vw" />
                </div>
                <h3>{t.name}</h3>
                <span className="micro">{t.role}</span>
                <p>{t.text}</p>
              </article>
            ))
          }
        </Ph>
      </section>
      <section className="sec sec--night network">
        <span className="micro">Netzwerk & Partner</span>
        <Ph v={about.network} as="div" className="network__list">
          {(list) =>
            list.map((n) => (
              <span key={n} className={n.startsWith(partners.bunkerWest.name) ? 'is-star' : ''}>
                {n}
              </span>
            ))
          }
        </Ph>
        <Btn href="/anfrage" variant="gold" label="Booking">
          Lass uns reden
        </Btn>
      </section>
    </>
  );
}
