'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { brand, mainNav, ui } from '@c-event/content';
import { Logo } from '@/components/brand/Logo';
import { CartButton } from '@/components/cart/CartButton';
import { getLenis } from '@/lib/motion';

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [drop, setDrop] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);
  const closeTimer = useRef(0);
  const viaClick = useRef(false);

  // Menüs beim Seitenwechsel schließen (State-Anpassung während des Renderns statt Effekt).
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
    setDrop(false);
  }

  useEffect(() => {
    let last = window.scrollY;
    // Nach „Zum Event hinzufügen“ bleibt die Nav (mit dem Warenkorb-Ticket) ein paar Sekunden sichtbar
    let showUntil = 0;
    const onScroll = () => {
      const y = window.scrollY;
      setSolid(y > 40);
      if (Date.now() < showUntil) setHidden(false);
      else setHidden(y > 300 && y > last + 4 ? true : y < last - 4 ? false : (h) => h);
      last = y;
    };
    const onAdded = () => {
      showUntil = Date.now() + 3500;
      setHidden(false);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('cart:added', onAdded);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('cart:added', onAdded);
    };
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('menu-open', open);
    const l = getLenis();
    if (open) l?.stop();
    else l?.start();
  }, [open]);

  // Dropdown: Öffnen sofort, Schließen mit Verzögerung – sonst klappt es auf dem Weg vom Button
  // zum Panel zu (das war der Bug „Unterseiten kurz nicht aufrufbar“).
  const openDrop = () => {
    window.clearTimeout(closeTimer.current);
    setDrop(true);
  };
  const closeDropSoon = () => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => {
      viaClick.current = false;
      setDrop(false);
    }, 220);
  };
  useEffect(() => {
    if (!drop) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setDrop(false);
    const onDown = (e: PointerEvent) => !(e.target as Element).closest('.nav__drop') && setDrop(false);
    window.addEventListener('keydown', onKey);
    window.addEventListener('pointerdown', onDown);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('pointerdown', onDown);
    };
  }, [drop]);
  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  return (
    <header className={`nav${hidden && !open && !drop ? ' is-hidden' : ''}${solid ? ' is-solid' : ''}${open ? ' is-open' : ''}`}>
      <Link href="/" className="nav__logo" data-label={brand.short} aria-label={`${brand.name} – Startseite`}>
        <Logo size={46} />
        <span className="nav__word">
          {brand.short}
          <small>{brand.claim}</small>
        </span>
      </Link>

      <nav className="nav__links" aria-label="Hauptnavigation">
        {mainNav.map((l) =>
          l.children ? (
            <div key={l.label} className={`nav__drop${drop ? ' is-open' : ''}`} onPointerEnter={openDrop} onPointerLeave={closeDropSoon}>
              <button
                type="button"
                aria-expanded={drop}
                aria-controls="nav-services"
                // Klick auf ein per Hover geöffnetes Menü lässt es offen (vorher klappte es zu);
                // geschlossen wird per zweitem Klick, Esc, Klick daneben oder Verlassen mit der Maus.
                onClick={() => {
                  window.clearTimeout(closeTimer.current);
                  if (!drop || !viaClick.current) {
                    viaClick.current = true;
                    setDrop(true);
                  } else {
                    viaClick.current = false;
                    setDrop(false);
                  }
                }}
                onFocus={openDrop}
                className={`nav__link${pathname.startsWith('/leistungen') ? ' is-active' : ''}`}
              >
                {l.label} <span aria-hidden="true">↓</span>
              </button>
              <div className="nav__panel" id="nav-services">
                {l.children.map((c, i) => (
                  <Link key={c.href} href={c.href} className="nav__panel-link" data-label={c.label} onFocus={openDrop}>
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
        <CartButton />
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
