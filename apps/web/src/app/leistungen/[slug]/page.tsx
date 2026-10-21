import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { val } from '@c-event/core';
import { brand, catalog, getService, home, inquiryHref, partners, services, ui } from '@c-event/content';
import { Btn } from '@/components/Btn';
import { ItemCard, PackageCard } from '@/components/catalog/ItemCard';
import { JsonLd } from '@/components/JsonLd';
import { Media } from '@/components/Media';
import { Ph, PhText } from '@/components/Ph';
import { Split } from '@/components/Split';
import { SITE_URL } from '@/lib/env';
import { pageMeta } from '@/lib/seo';
import { IfFlag } from '@/lib/site-context';

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const s = getService((await params).slug);
  if (!s) return {};
  return pageMeta({ title: s.seo.title, description: s.seo.description, path: `/leistungen/${s.slug}`, image: s.hero });
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const s = getService((await params).slug);
  if (!s) notFound();
  const idx = services.findIndex((x) => x.slug === s.slug);
  const next = services[(idx + 1) % services.length]!;
  const items = catalog.items.filter((i) => i.services.includes(s.slug)).slice(0, 8);
  const pkgs = catalog.packages.filter((p) => p.services.includes(s.slug));
  const faq = val(s.faq);
  const url = `${SITE_URL}/leistungen/${s.slug}`;

  return (
    <article className="svc">
      <JsonLd
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: s.seo.h1,
            serviceType: s.name,
            description: s.seo.description,
            url,
            provider: { '@id': `${SITE_URL}/#org`, name: brand.name },
            areaServed: ['Berlin', 'Brandenburg'],
          },
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
          },
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Start', item: SITE_URL },
              { '@type': 'ListItem', position: 2, name: s.name, item: url },
            ],
          },
        ]}
      />

      <header className="svc-hero">
        <div className="svc-hero__img" data-reveal="clip">
          <div data-parallax="-14" className="svc-hero__par">
            <Media id={s.hero} priority sizes="100vw" />
          </div>
        </div>
        <div className="svc-hero__body">
          <span className="micro">
            <i className="live-dot" /> {s.kicker}
          </span>
          <Split as="h1" className="svc-hero__title" text={s.seo.h1.replace(' in ', ' *in* ')} />
          <div className="svc-hero__foot">
            <PhText v={s.intro} className="svc-hero__intro" />
            <Btn href={inquiryHref(s.slug)} variant="signal" label="Booking">
              {s.cta}
            </Btn>
          </div>
        </div>
      </header>

      <section className="sec sec--cream">
        <header className="sec__head">
          <span className="micro">01 · {ui.service.whatWeDo}</span>
        </header>
        <Ph v={s.points} as="div" className="points">
          {(points) =>
            points.map((pt, i) => (
              <div key={pt.title} className="point" data-reveal="up">
                <em>{String(i + 1).padStart(2, '0')}</em>
                <h2>{pt.title}</h2>
                <p>{pt.text}</p>
              </div>
            ))
          }
        </Ph>
      </section>

      <section className="sec sec--ink occasions">
        <span className="micro">02 · {ui.service.occasions}</span>
        <ul className="stickers" data-reveal="stagger">
          {s.occasions.map((o, i) => (
            <li key={o} style={{ '--r': `${((i * 37) % 11) - 5}deg` } as React.CSSProperties}>
              {o}
            </li>
          ))}
        </ul>
      </section>

      <section className="sec sec--night">
        <header className="sec__head">
          <span className="micro">03 · {ui.service.process}</span>
        </header>
        <ol className="steps">
          {s.process.map((st, i) => (
            <li key={st.title} data-reveal="up">
              <span className="steps__no">{i + 1}</span>
              <h3>{st.title}</h3>
              <p>{st.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="svc-gallery" aria-label={ui.service.gallery}>
        <div className="svc-gallery__track" data-marquee="">
          {[...s.gallery, ...s.gallery].map((m, i) => (
            <div key={`${m}-${i}`} className="svc-gallery__img">
              <Media id={m} sizes="40vw" />
            </div>
          ))}
        </div>
      </section>

      {s.showPartnerLocation && (
        <section className="bunker bunker--compact">
          <div className="bunker__img" data-parallax="-18">
            <Media id={home.bunker.media} sizes="100vw" />
          </div>
          <div className="bunker__body">
            <span className="micro">{home.bunker.kicker}</span>
            <Split as="h2" className="bunker__title" text={partners.bunkerWest.name} />
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
              </div>
            </IfFlag>
          </div>
        </section>
      )}

      {(items.length > 0 || pkgs.length > 0) && (
        <section className="sec sec--cream">
          <header className="sec__head sec__head--row">
            <div>
              <span className="micro">04 · {ui.service.fit}</span>
              <Split as="h2" className="display-l" text={ui.service.fitTitle} />
            </div>
            <p>
              {ui.service.fitText} <Link href="/konfigurator">{ui.service.fitLink}</Link>
            </p>
          </header>
          {pkgs.length > 0 && (
            <div className="pkgs pkgs--inline">
              {pkgs.map((p) => (
                <PackageCard key={p.id} pkg={p} index={catalog.packages.indexOf(p)} />
              ))}
            </div>
          )}
          <div className="items">
            {items.map((i) => (
              <ItemCard key={i.id} item={i} />
            ))}
          </div>
        </section>
      )}

      <section className="sec sec--ink faq">
        <header className="sec__head">
          <span className="micro">05 · {ui.service.faq}</span>
          <Split as="h2" className="display-l" text={ui.service.faqTitle} />
        </header>
        <Ph v={s.faq} as="div" className="faq__list">
          {(list) =>
            list.map((f) => (
              <details key={f.q}>
                <summary>
                  <span>{f.q}</span>
                  <i aria-hidden="true" />
                </summary>
                <p>{f.a}</p>
              </details>
            ))
          }
        </Ph>
      </section>

      <section className="svc-cta">
        <Link href={inquiryHref(s.slug)} className="svc-cta__big" data-label="Booking">
          <span className="micro">
            {ui.service.preselected} {s.name}
          </span>
          <strong>{s.cta} →</strong>
        </Link>
        <Link href={`/leistungen/${next.slug}`} className="svc-cta__next" data-label={next.name}>
          <span className="micro">{ui.service.nextAct}</span>
          <strong>{next.name}</strong>
        </Link>
      </section>
    </article>
  );
}
