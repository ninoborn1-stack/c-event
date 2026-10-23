import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { val } from '@c-event/core';
import { brand, catalog, getService, home, inquiryHref, partners, services, shop, shopHref, ui } from '@c-event/content';
import { JsonLd } from '@/components/JsonLd';
import { Media } from '@/components/Media';
import { PhotoRail } from '@/components/media/PhotoRail';
import { Ph, PhText } from '@/components/Ph';
import { PackageCard, ProductCard } from '@/components/shop/ProductCard';
import { Split } from '@/components/Split';
import { TicketLink } from '@/components/ui/Ticket';
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
        <div className="svc-hero__img">
          <Media id={s.hero} priority sizes="100vw" />
        </div>
        <div className="svc-hero__body">
          <span className="eyebrow">{s.kicker}</span>
          <Split as="h1" className="svc-hero__title" text={s.seo.h1.replace(' in ', ' *in* ')} />
          <div className="svc-hero__foot">
            <PhText v={s.intro} className="svc-hero__intro" />
            <div className="svc-hero__ctas">
              <TicketLink href={shopHref(s.shopCategory)} label={ui.service.fit} size="lg">
                {ui.service.fit}
              </TicketLink>
              <Link href={inquiryHref(s.slug)} className="text-link" data-label="Anfrage">
                {s.cta} →
              </Link>
            </div>
          </div>
        </div>
      </header>

      <section className="sec sec--cream">
        <header className="sec__head">
          <span className="eyebrow eyebrow--dark">01 · {ui.service.whatWeDo}</span>
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

      <section className="sec occasions">
        <span className="eyebrow">02 · {ui.service.occasions}</span>
        <ul className="pills">
          {s.occasions.map((o) => (
            <li key={o} className="pill pill--lg">
              {o}
            </li>
          ))}
        </ul>
      </section>

      {/* Highlight aus dem Review: Bilder laufen seitlich durch, während man scrollt */}
      <PhotoRail title={`03 · ${ui.service.gallery}`} items={s.gallery.map((m) => ({ media: m }))} />

      <section className="sec sec--night">
        <header className="sec__head">
          <span className="eyebrow">04 · {ui.service.process}</span>
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

      {(items.length > 0 || pkgs.length > 0) && (
        <section className="sec sec--cream" id="zum-event">
          <header className="sec__head sec__head--row">
            <div>
              <span className="eyebrow eyebrow--dark">05 · {ui.service.fit}</span>
              <Split as="h2" className="h-l" text={ui.service.fitTitle} />
            </div>
            <div className="sec__aside">
              <p>{ui.service.fitText}</p>
              <TicketLink href={shopHref(s.shopCategory)} label={val(shop.label)} tone="outline">
                {ui.service.fitLink}
              </TicketLink>
            </div>
          </header>
          {pkgs.length > 0 && (
            <div className="products products--pkgs">
              {pkgs.map((p) => (
                <PackageCard key={p.id} pkg={p} index={catalog.packages.indexOf(p)} />
              ))}
            </div>
          )}
          <div className="products">
            {items.map((i) => (
              <ProductCard key={i.id} item={i} />
            ))}
          </div>
        </section>
      )}

      {s.showPartnerLocation && (
        <section className="bunker">
          <div className="bunker__img">
            <Media id={home.bunker.media} sizes="100vw" />
          </div>
          <div className="bunker__body">
            <span className="eyebrow">{home.bunker.kicker}</span>
            <Split as="h2" className="h-l" text={partners.bunkerWest.name} />
            <p>{home.bunker.text}</p>
            <Ph v={partners.bunkerWest.href}>
              {(href) => (
                <TicketLink href={href} external tone="cream">
                  {home.bunker.cta}
                </TicketLink>
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

      <section className="sec faq">
        <header className="sec__head">
          <span className="eyebrow">06 · {ui.service.faq}</span>
          <Split as="h2" className="h-l" text={ui.service.faqTitle} />
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
        <div className="svc-cta__main">
          <span className="eyebrow">
            {ui.service.preselected} {s.name}
          </span>
          <TicketLink href={inquiryHref(s.slug)} label="Anfrage" size="lg" tone="cream">
            {s.cta}
          </TicketLink>
        </div>
        <Link href={`/leistungen/${next.slug}`} className="svc-cta__next" data-label={next.name}>
          <span className="eyebrow">{ui.service.nextAct}</span>
          <strong>{next.name} →</strong>
        </Link>
      </section>
    </article>
  );
}
