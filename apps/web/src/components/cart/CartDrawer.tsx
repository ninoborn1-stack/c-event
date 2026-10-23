'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { ui } from '@c-event/content';
import { getLenis } from '@/lib/motion';
import { CartTicket } from './CartTicket';

/** Warenkorb als Drawer, überall erreichbar. Öffnet sich per Event „cart:open“ (Nav-Ticket). */
export function CartDrawer() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    const onOpen = () => setOpen(true);
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('cart:open', onOpen);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('cart:open', onOpen);
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  useEffect(() => {
    const l = getLenis();
    if (open) l?.stop();
    else l?.start();
  }, [open]);

  return (
    <div className={`drawer${open ? ' is-open' : ''}`} aria-hidden={!open} inert={!open}>
      <button type="button" className="drawer__scrim" tabIndex={-1} aria-label={ui.nav.close} onClick={() => setOpen(false)} />
      <aside className="drawer__panel" role="dialog" aria-modal="true" aria-label="Warenkorb" data-lenis-prevent>
        <button type="button" className="drawer__close" onClick={() => setOpen(false)}>
          {ui.nav.close} ×
        </button>
        <CartTicket variant="drawer" />
      </aside>
    </div>
  );
}
