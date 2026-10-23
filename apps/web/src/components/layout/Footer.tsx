import Link from 'next/link';
import { val } from '@c-event/core';
import { brand, home, legalNav, services, shop, ui } from '@c-event/content';
import { Ph, PhText } from '@/components/Ph';
import { Logo } from '@/components/brand/Logo';
import { TicketLink } from '@/components/ui/Ticket';
import { asset } from '@/lib/env';

export function Footer() {
  const wa = val(brand.contact.whatsapp);
  return (
    <footer className="footer">
      <div className="footer__grid">
        <div className="footer__brand">
          <Logo size={72} />
          <p className="footer__claim">{brand.claim}</p>
          <TicketLink href={shop.path} label={val(shop.label)} tone="cream">
            {home.finale.cta}
          </TicketLink>
        </div>
        <div>
          <h2 className="eyebrow">{ui.nav.services}</h2>
          <ul className="footer__list">
            {services.map((s) => (
              <li key={s.slug}>
                <Link href={`/leistungen/${s.slug}`}>{s.name}</Link>
              </li>
            ))}
            <li>
              <Link href="/social-media">Social Media & Content</Link>
            </li>
            <li>
              <Link href={shop.path}>{val(shop.label)}</Link>
            </li>
            <li>
              <Link href="/arcade">Afterhour Arcade</Link>
            </li>
          </ul>
        </div>
        <div>
          <h2 className="eyebrow">{ui.footer.contact}</h2>
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
          <h2 className="eyebrow">{ui.footer.legal}</h2>
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
