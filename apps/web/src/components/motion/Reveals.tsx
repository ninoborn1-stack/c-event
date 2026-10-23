'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { gsap, prefersReducedMotion, ScrollTrigger } from '@/lib/motion';

/**
 * Der eine Reveal-Effekt der Seite (siehe docs/EFFEKTE.md), per data-Attribut:
 *  data-reveal="words"  Wörter (aus <Split>) steigen aus einer Kante – für Headlines
 *  data-reveal="up"     Block gleitet hoch und blendet ein – für Karten/Absätze
 * Der CSS-Grundzustand ist immer der fertige Zustand.
 */
export function Reveals() {
  const pathname = usePathname();
  useEffect(() => {
    if (prefersReducedMotion()) return;
    let ctx: gsap.Context | null = null;
    const id = requestAnimationFrame(() => {
      ctx = gsap.context(() => {
        const st = (el: Element) => ({ trigger: el, start: 'top 88%', once: true });
        gsap.utils.toArray<HTMLElement>('[data-reveal="words"]').forEach((el) => {
          gsap.fromTo(el.querySelectorAll('.wi'), { yPercent: 110 }, { yPercent: 0, duration: 1, ease: 'expo.out', stagger: 0.04, scrollTrigger: st(el) });
        });
        gsap.utils.toArray<HTMLElement>('[data-reveal="up"]').forEach((el) => {
          gsap.fromTo(el, { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.9, ease: 'expo.out', scrollTrigger: st(el) });
        });
      });
      ScrollTrigger.refresh();
    });
    return () => {
      cancelAnimationFrame(id);
      ctx?.revert();
    };
  }, [pathname]);
  return null;
}
