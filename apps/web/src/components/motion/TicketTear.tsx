'use client';

import { useEffect } from 'react';
import { prefersReducedMotion } from '@/lib/motion';

const TEAR_MS = 900;

/**
 * Klick auf ein Ticket (.tk): der Abriss-Stub reißt an der Perforation ab und fällt weg.
 * Für Links läuft das während des Vorhangs, bei Buttons wächst der Stub danach wieder an.
 * Reine CSS-Animation über data-torn (ein Attribut, das React nicht anfasst – Klassen würden beim Neu-Rendern, z. B. „Im Event“, verloren gehen).
 */
export function TicketTear() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const timers = new Map<HTMLElement, number>();
    const onClick = (e: MouseEvent) => {
      const tk = (e.target as Element | null)?.closest?.<HTMLElement>('.tk');
      if (!tk || tk.matches(':disabled')) return;
      window.clearTimeout(timers.get(tk));
      tk.removeAttribute('data-torn');
      void tk.offsetWidth; // Animation bei schnellem Doppelklick neu starten
      tk.setAttribute('data-torn', '');
      timers.set(
        tk,
        window.setTimeout(() => {
          tk.removeAttribute('data-torn');
          timers.delete(tk);
        }, TEAR_MS),
      );
    };
    document.addEventListener('click', onClick, true);
    return () => {
      document.removeEventListener('click', onClick, true);
      timers.forEach((t, tk) => {
        window.clearTimeout(t);
        tk.removeAttribute('data-torn');
      });
    };
  }, []);
  return null;
}
