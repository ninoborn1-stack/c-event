import Link from 'next/link';
import { isPlaceholder, val } from '@c-event/core';
import { brand, catalog, gallery, home, inquiryHref, shop } from '@c-event/content';
import { Hero } from '@/components/home/Hero';
import { ServiceStrips } from '@/components/home/ServiceStrips';
import { SwipeDeck } from '@/components/home/SwipeDeck';
import { Media } from '@/components/Media';
import { Ph } from '@/components/Ph';
import { PackageCard } from '@/components/shop/ProductCard';
import { Reviews } from '@/components/social/Reviews';
import { SocialFeed } from '@/components/social/SocialFeed';
import { Split } from '@/components/Split';
import { TicketLink } from '@/components/ui/Ticket';
import { pageMeta } from '@/lib/seo';
import { getServices } from '@/server/services';

export const metadata = pageMeta({ ...home.seo, path: '/' });


export default async function HomePage() {
  const s = getServices();
  const [reviews, feed] = await Promise.all([s.reviews.getSummary(), s.social.getFeed(8)]);
  const hl = home.highlights.items;

  return (
    <>
      {/* 1 · Hero mit CN-Intro und Übergang „Doors open → 360°“ */}
      <Hero
        mediaId={home.hero.media}
        slogans={val(brand.slogans)}
        eyebrow={home.hero.eyebrow}
        lead={home.hero.lead}
        cta={{ label: home.hero.cta, href: shop.path }}
        bar={home.hero.bar}
        countdown={home.intro.countdown}
        doors={home.intro.doors}
        sloganIsPlaceholder={isPlaceholder(brand.slogans)}
        sloganNote={isPlaceholder(brand.slogans) ? brand.slogans.note : undefined}
        behind={home.intro.behind}
      />

      {/* 2 · Leistungen als aufklappende Bildstreifen; jedes Ticket führt in den Shop */}
      <section className="sec sec--flush" id="leistungen">
        <header className="sec__head sec__head--row">
          <div>
            <span className="eyebrow">{home.services.kicker}</span>
            <Split as="h2" className="h-l" text={home.services.title} />
          </div>
          <p className="sec__lead">{home.services.text}</p>
        </header>
        <ServiceStrips />
      </section>

      {/* 3 · Shop-Einstieg (hell) mit den Paketen */}
      <section className="sec sec--cream">
        <header className="sec__head sec__head--row">
          <div>
            <span className="eyebrow">{home.shopEntry.kicker}</span>
            <Split as="h2" className="h-l" text={home.shopEntry.title} />
          </div>
          <div className="sec__aside">
            <p>{home.shopEntry.text}</p>
            <TicketLink href={shop.path} label={val(shop.label)}>
              {home.shopEntry.cta}
            </TicketLink>
          </div>
        </header>
        <div className="products products--pkgs">
          {catalog.packages.map((p, i) => (
            <PackageCard key={p.id} pkg={p} index={i} />
          ))}
        </div>
      </section>

      {/* 4 · Event-Match: wischen statt Formular */}
      <section className="sec sec--ink">
        <SwipeDeck cards={val(home.swipe.cards)} />
      </section>

      {/* 5 · Abende als Plakatwand im Ticket-Stil (hell) */}
      <section className="sec sec--cream">
        <header className="sec__head sec__head--row">
          <div>
            <span className="eyebrow">{home.highlights.kicker}</span>
            <Split as="h2" className="h-l" text={home.highlights.title} />
          </div>
        </header>
        <Ph v={hl} as="ol" className="bills">
          {(items) => [
            ...items.map((h, i) => (
              <li key={h.title} className={`bill bill--${i}`} data-reveal="up">
                <Link href="/galerie" className="bill__link" data-label="Galerie">
                  <span className="bill__img">
                    <Media id={h.media} sizes={i === 0 ? '(min-width: 900px) 58vw, 100vw' : '(min-width: 900px) 42vw, 100vw'} />
                  </span>
                  <span className="bill__top mono">
                    <span>
                      {home.highlights.no} {String(i + 1).padStart(2, '0')}
                    </span>
                    <span>{h.year}</span>
                  </span>
                  <strong className="bill__title">{h.title}</strong>
                  <span className="bill__stub mono">
                    <span>{h.meta}</span>
                    <span className="bill__place">{h.place}</span>
                    <span className="bill__arrow" aria-hidden="true">
                      ↗
                    </span>
                  </span>
                </Link>
              </li>
            )),
            <li key="archiv" className="bill bill--more" data-reveal="up">
              <span className="eyebrow eyebrow--sq">{home.highlights.archive.kicker}</span>
              <Split as="h3" className="bill__more-title" text={home.highlights.archive.title} />
              <div className="bill__more-foot">
                <p className="mono">
                  <b>{gallery.items.length}</b> {home.highlights.archive.count}
                </p>
                <TicketLink href="/galerie" label="Galerie" tone="cream">
                  {home.highlights.cta}
                </TicketLink>
              </div>
            </li>,
          ]}
        </Ph>
      </section>

      {/* 5 · Stimmen: Google-Rezensionen + Instagram */}
      <section className="sec sec--night">
        <header className="sec__head">
          <span className="eyebrow">{home.voices.kicker}</span>
          <Split as="h2" className="h-l" text={home.voices.title} />
        </header>
        <Reviews data={reviews} />
        <SocialFeed feed={feed} />
      </section>

      {/* 6 · Abschluss */}
      <section className="finale">
        <h2 className="finale__title" aria-label={home.finale.lines.join(' ')}>
          {home.finale.lines.map((l, i) => (
            <Split key={i} text={i === 1 ? `*${l}*` : l} className="finale__line" />
          ))}
        </h2>
        <div className="finale__ctas">
          <TicketLink href={shop.path} label={val(shop.label)} size="lg" tone="cream">
            {home.finale.cta}
          </TicketLink>
          <Link href={inquiryHref()} className="text-link" data-label="Anfrage">
            {home.finale.secondary} →
          </Link>
        </div>
      </section>
    </>
  );
}
