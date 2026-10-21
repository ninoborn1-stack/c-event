'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { brand, mainNav, ui } from '@c-event/content';
import { getLenis } from '@/lib/motion';
import { useRider } from '@/lib/rider-store';

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [drop, setDrop] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);
  const rider = useRider();
  const count = rider.length;

  // Menü beim Seitenwechsel schließen (State-Anpassung während des Renderns statt Effekt).
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
    setDrop(false);
  }

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setSolid(y > 40);
      setHidden(y > 300 && y > last + 4 ? true : y < last - 4 ? false : (h) => h);
      last = y;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('menu-open', open);
    const l = getLenis();
    if (open) l?.stop();
    else l?.start();
  }, [open]);

  return (
    <header className={`nav${hidden && !open ? ' is-hidden' : ''}${solid ? ' is-solid' : ''}${open ? ' is-open' : ''}`}>
      <Link href="/" className="nav__logo" data-label={brand.short} aria-label={`${brand.name} – Startseite`}>
        <span className="nav__mark">{brand.logoMark}</span>
        <span className="nav__word">
          {brand.short.replace(/^C-?/, '')}
          <small>{brand.name.replace(brand.short, '').trim() || '360°'}</small>
        </span>
      </Link>

      <nav className="nav__links" aria-label="Hauptnavigation">
        {mainNav
          .filter((l) => !l.primary)
          .map((l) =>
            l.children ? (
              <div
                key={l.label}
                className={`nav__drop${drop ? ' is-open' : ''}`}
                onMouseEnter={() => setDrop(true)}
                onMouseLeave={() => setDrop(false)}
              >
                <button type="button" aria-expanded={drop} onClick={() => setDrop((d) => !d)} className="nav__link">
                  {l.label} <span aria-hidden="true">↓</span>
                </button>
                <div className="nav__panel">
                  {l.children.map((c, i) => (
                    <Link key={c.href} href={c.href} className="nav__panel-link" data-label={c.label}>
                      <em>{String(i + 1).padStart(2, '0')}</em>
                      <strong>{c.label}</strong>
                      <span>{c.line}</span>
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link key={l.href} href={l.href} className={`nav__link${pathname.startsWith(l.href) ? ' is-active' : ''}`}>
                {l.label}
              </Link>
            ),
          )}
      </nav>

      <div className="nav__actions">
        <button
          type="button"
          className="nav__rider"
          onClick={() => window.dispatchEvent(new Event('rider:open'))}
          aria-label={`${ui.rider.label} öffnen, ${count} Positionen`}
        >
          {ui.rider.label}
          <b data-count={count}>{count}</b>
        </button>
        <Link href="/anfrage" className="nav__cta" data-label="Booking">
          <i className="live-dot" aria-hidden="true" />
          {ui.nav.inquiry}
        </Link>
        <button type="button" className="nav__burger" aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen((o) => !o)}>
          <span className="sr-only">{open ? ui.nav.close : ui.nav.menu}</span>
          <i />
          <i />
        </button>
      </div>

      <div id="mobile-menu" className="mmenu" data-lenis-prevent hidden={!open}>
        <ol className="mmenu__list">
          {mainNav.flatMap((l) => (l.children ? l.children : [{ href: l.href, label: l.label }])).map((l, i) => (
            <li key={l.href} style={{ '--i': i } as React.CSSProperties}>
              <Link href={l.href} data-label={l.label}>
                <em>{String(i + 1).padStart(2, '0')}</em>
                {l.label}
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </header>
  );
}
