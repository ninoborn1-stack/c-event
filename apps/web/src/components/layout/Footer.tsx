import Link from 'next/link';
import { val } from '@c-event/core';
import { brand, home, legalNav, services, ui } from '@c-event/content';
import { Ph, PhText } from '@/components/Ph';
import { Split } from '@/components/Split';
import { asset } from '@/lib/env';

export function Footer() {
  const wa = val(brand.contact.whatsapp);
  return (
    <footer className="footer">
      <div className="footer__marquee" aria-hidden="true">
        <div data-marquee="">
          {Array.from({ length: 4 }).map((_, i) => (
            <span key={i}>
              {ui.footer.bigLine} <i>✺</i>{' '}
            </span>
          ))}
        </div>
      </div>
      <div className="footer__grid">
        <div className="footer__brand">
          <Split as="p" className="footer__claim" text={`${brand.claim.replace('–', '—')}`} />
          <Link href="/anfrage" className="btn btn--gold" data-label="Booking">
            <span className="btn__text">{home.finale.cta}</span>
            <span className="btn__arrow">→</span>
          </Link>
        </div>
        <div>
          <h3 className="micro">{ui.nav.services}</h3>
          <ul className="footer__list">
            {services.map((s) => (
              <li key={s.slug}>
                <Link href={`/leistungen/${s.slug}`}>{s.name}</Link>
              </li>
            ))}
            <li>
              <Link href="/social-media">Social Media & Content</Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="micro">{ui.footer.contact}</h3>
          <ul className="footer__list">
            <li>
              <Ph v={brand.contact.email}>{(m) => <a href={`mailto:${m}`}>{m}</a>}</Ph>
            </li>
            <li>
              <Ph v={brand.contact.phone}>{(p) => <a href={`tel:${p.replace(/\s/g, '')}`}>{p}</a>}</Ph>
            </li>
            <li>
              <Ph v={brand.contact.whatsapp}>
                {() => (
                  <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer">
                    WhatsApp
                  </a>
                )}
              </Ph>
            </li>
            <li>
              <PhText v={brand.region} />
            </li>
          </ul>
          <Ph v={brand.social} as="div" className="footer__social">
            {(links) =>
              links.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer">
                  {s.label}
                </a>
              ))
            }
          </Ph>
        </div>
        <div>
          <h3 className="micro">{ui.footer.legal}</h3>
          <ul className="footer__list">
            {legalNav.map((l) => (
              <li key={l.href}>
                <Link href={l.href}>{l.label}</Link>
              </li>
            ))}
            <li>
              <a href={asset('/llms.txt')}>llms.txt</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer__bottom">
        <span className="footer__giant" aria-hidden="true">
          {brand.short}
        </span>
        <small>
          © {new Date().getFullYear()} {brand.name} · {brand.claim}
        </small>
      </div>
    </footer>
  );
}
