import Link from 'next/link';
import { isPlaceholder, val } from '@c-event/core';
import { brand, catalog, home, inquiryHref, partners, services } from '@c-event/content';
import { Hero } from '@/components/home/Hero';
import { LineUp } from '@/components/home/LineUp';
import { Highlights } from '@/components/home/Highlights';
import { DateStrip } from '@/components/calendar/DateStrip';
import { AddToRider } from '@/components/rider/AddToRider';
import { Btn } from '@/components/Btn';
import { Media } from '@/components/Media';
import { Ph, PhText } from '@/components/Ph';
import { Split } from '@/components/Split';
import { pageMeta } from '@/lib/seo';
import { PriceTag } from '@/components/catalog/PriceTag';
import { IfFlag } from '@/lib/site-context';

export const metadata = pageMeta({ ...home.seo, path: '/' });

export default function HomePage() {
  const hl = home.highlights.items;
  const teaserItems = ['mobile-bar', 'neon-schriftzug', 'licht-paket', 'lounge-set']
    .map((id) => catalog.items.find((i) => i.id === id))
    .filter((i) => i !== undefined);

  return (
    <>
      <Hero
        mediaId={home.hero.media}
        slogans={val(brand.slogans)}
        eyebrow={home.hero.eyebrow}
        lead={home.hero.lead}
        cta={{ label: home.hero.cta, href: '/anfrage' }}
        ctaSecondary={{ label: home.hero.ctaSecondary, href: '/konfigurator' }}
        bar={home.hero.bar}
        countdown={home.intro.countdown}
        doors={home.intro.doors}
        sloganIsPlaceholder={isPlaceholder(brand.slogans)}
        sloganNote={isPlaceholder(brand.slogans) ? brand.slogans.note : undefined}
        behind="360°"
      />

      {/* 02 Positionierung */}
      <section className="manifesto sec sec--cream">
        <div className="manifesto__ring" aria-hidden="true">
          <svg viewBox="0 0 200 200">
            <defs>
              <path id="ring" d="M100,100 m-80,0 a80,80 0 1,1 160,0 a80,80 0 1,1 -160,0" />
            </defs>
            <text>
              <textPath href="#ring">{home.manifesto.ring.repeat(2)}</textPath>
            </text>
          </svg>
          <b>360°</b>
        </div>
        <span className="micro">{home.manifesto.kicker}</span>
        <Split as="h2" className="manifesto__big" text={home.manifesto.big.replace('Umsetzer', '*Umsetzer*')} reveal="scrub" />
        <p className="manifesto__text" data-reveal="up">
          {home.manifesto.text}
        </p>
      </section>

      {/* Laufband */}
      <div className="ticker" aria-hidden="true">
        <div className="ticker__row ticker__row--a">
          <div>
            {[...home.ticker, ...home.ticker].map((t, i) => (
              <span key={i}>
                {t} <i>✺</i>
              </span>
            ))}
          </div>
        </div>
        <div className="ticker__row ticker__row--b">
          <div>
            {[...home.ticker, ...home.ticker].reverse().map((t, i) => (
              <span key={i}>
                {t} <i>●</i>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 03 Leistungen */}
      <section className="sec sec--ink" id="leistungen">
        <header className="sec__head">
          <span className="micro">{home.lineup.kicker}</span>
          <Split as="h2" className="display-l" text={home.lineup.title} />
        </header>
        <LineUp
          more={home.lineup.more}
          items={[
            ...services.map((s) => ({ href: `/leistungen/${s.slug}`, name: s.name, line: s.line, media: s.hero })),
            { href: '/social-media', name: 'Social Media', line: 'Strategie & Content für Brands, die Events machen.', media: 'crowd-handy-licht' },
          ]}
        />
      </section>

      {/* 04 Highlights */}
      <Highlights
        kicker={home.highlights.kicker}
        title={home.highlights.title}
        items={val(hl)}
        isPlaceholder={isPlaceholder(hl)}
        note={isPlaceholder(hl) ? hl.note : undefined}
      />

      {/* 05 Zielgruppen */}
      <section className="doors" aria-label={home.audiences.kicker}>
        {home.audiences.items.map((a, i) => (
          <Link key={a.id} href={a.href} className="door" data-label={a.title}>
            <div className="door__img">
              <Media id={a.media} sizes="(min-width: 900px) 50vw, 100vw" />
            </div>
            <span className="door__no micro">
              Door {String(i + 1).padStart(2, '0')}
            </span>
            <div className="door__body">
              <h3>{a.title}</h3>
              <p>{a.text}</p>
              <span className="door__cta">{a.cta} →</span>
            </div>
          </Link>
        ))}
      </section>

      {/* 06 Konfigurator-Teaser */}
      <section className="sec sec--cream teaser">
        <div className="teaser__copy">
          <span className="micro">{home.configurator.kicker}</span>
          <Split as="h2" className="display-xl" text={home.configurator.title.replace('Rider', '*Rider*')} />
          <p data-reveal="up">{home.configurator.text}</p>
          <Btn href="/konfigurator" variant="ink" label="Konfigurator">
            {home.configurator.cta}
          </Btn>
        </div>
        <div className="ticket" data-reveal="up">
          <div className="ticket__head">
            <span>Rider</span>
            <span>No. 0001</span>
          </div>
          <ul className="ticket__list">
            {teaserItems.map((it) => {
              const p = val(it.price);
              return (
                <li key={it.id}>
                  <div>
                    <strong>{it.name}</strong>
                    <PriceTag price={p} as="small" />
                  </div>
                  <AddToRider kind="item" id={it.id} qty={it.minQty ?? 1} />
                </li>
              );
            })}
          </ul>
          <div className="ticket__foot">
            <span>Admit one</span>
            <span className="ticket__barcode" aria-hidden="true" />
          </div>
        </div>
      </section>

      {/* 07 Bunker West */}
      <section className="bunker">
        <div className="bunker__img" data-parallax="-18">
          <Media id={home.bunker.media} sizes="100vw" />
        </div>
        <div className="bunker__body">
          <span className="micro">{home.bunker.kicker}</span>
          <Split as="h2" className="bunker__title" text={home.bunker.title} />
          <p data-reveal="up">{home.bunker.text}</p>
          <Ph v={partners.bunkerWest.href}>
            {(href) => (
              <a className="btn btn--gold" href={href} target="_blank" rel="noopener noreferrer">
                <span className="btn__text">{home.bunker.cta}</span>
                <span className="btn__arrow">↗</span>
              </a>
            )}
          </Ph>
          <IfFlag flag="bunkerWestCode">
            <div className="code-stamp">
              <small>{home.bunker.codeLabel}</small>
              <PhText v={partners.bunkerWest.code} className="code-stamp__code" />
              <span>
                <PhText v={partners.bunkerWest.discount} /> auf die Location
              </span>
            </div>
          </IfFlag>
        </div>
      </section>

      {/* 08 Stimmen */}
      <section className="sec sec--ink voices">
        <span className="micro">{home.voices.kicker}</span>
        <Ph v={home.voices.items} as="div" className="voices__grid">
          {(items) =>
            items.map((v, i) => (
              <figure key={i} data-reveal="up">
                <blockquote>„{v.quote}“</blockquote>
                <figcaption>
                  {v.who} · <em>{v.org}</em>
                </figcaption>
              </figure>
            ))
          }
        </Ph>
        <Ph v={home.voices.logos} as="div" className="logos">
          {(logos) => (
            <div className="logos__row">
              {[...logos, ...logos].map((l, i) => (
                <span key={i}>{l}</span>
              ))}
            </div>
          )}
        </Ph>
      </section>

      {/* 09 Kalender */}
      <section className="sec sec--cream cal-teaser">
        <header className="sec__head sec__head--row">
          <div>
            <span className="micro">{home.calendar.kicker}</span>
            <Split as="h2" className="display-l" text={home.calendar.title} />
          </div>
          <p>{home.calendar.text}</p>
        </header>
        <DateStrip />
        <div className="cal-teaser__legend micro">
          <span className="lg lg--free">Frei</span>
          <span className="lg lg--booked">Belegt</span>
        </div>
      </section>

      {/* 10 Finale */}
      <section className="finale">
        <h2 className="finale__title" aria-label={home.finale.lines.join(' ')}>
          {home.finale.lines.map((l, i) => (
            <Split key={i} text={i === 1 ? `*${l}*` : l} className="finale__line" />
          ))}
        </h2>
        <Link href={inquiryHref()} className="finale__btn" data-label="Booking" data-cursor="Los">
          <span>{home.finale.cta}</span>
        </Link>
      </section>
    </>
  );
}
