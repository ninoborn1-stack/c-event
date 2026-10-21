'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { gsap, prefersReducedMotion, ScrollTrigger } from '@/lib/motion';

/**
 * Scroll-Animationen per data-Attribut, damit Seiten Server-Komponenten bleiben:
 *  data-reveal="words"    Wörter (aus <Split>) steigen aus einer Kante
 *  data-reveal="up"       Element gleitet hoch und blendet ein
 *  data-reveal="clip"     Bild öffnet sich von unten (clip-path)
 *  data-reveal="stagger"  Kinder nacheinander
 *  data-parallax="-15"    Parallaxe in yPercent
 *  data-scrub="words"     Wörter werden beim Scrollen nacheinander „angeschaltet“
 * Der CSS-Grundzustand ist immer der fertige Zustand.
 */
export function Reveals() {
  const pathname = usePathname();
  useEffect(() => {
    if (prefersReducedMotion()) return;
    let ctx: gsap.Context | null = null;
    const id = requestAnimationFrame(() => {
      ctx = gsap.context(() => {
        const st = (el: Element, start = 'top 85%') => ({ trigger: el, start, once: true });
        gsap.utils.toArray<HTMLElement>('[data-reveal="words"]').forEach((el) => {
          gsap.fromTo(
            el.querySelectorAll('.wi'),
            { yPercent: 115, rotate: 4 },
            { yPercent: 0, rotate: 0, duration: 1.1, ease: 'expo.out', stagger: 0.045, scrollTrigger: st(el) },
          );
        });
        gsap.utils.toArray<HTMLElement>('[data-reveal="up"]').forEach((el) => {
          gsap.fromTo(el, { y: 60, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1.1, ease: 'expo.out', scrollTrigger: st(el) });
        });
        gsap.utils.toArray<HTMLElement>('[data-reveal="clip"]').forEach((el) => {
          gsap.fromTo(
            el,
            { clipPath: 'inset(100% 0% 0% 0%)' },
            { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'expo.inOut', scrollTrigger: st(el, 'top 90%') },
          );
        });
        gsap.utils.toArray<HTMLElement>('[data-reveal="stagger"]').forEach((el) => {
          gsap.fromTo(
            el.children,
            { y: 50, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.9, ease: 'expo.out', stagger: 0.08, scrollTrigger: st(el) },
          );
        });
        gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
          const amt = Number(el.dataset.parallax) || -12;
          gsap.fromTo(
            el,
            { yPercent: -amt / 2 },
            { yPercent: amt / 2, ease: 'none', scrollTrigger: { trigger: el.parentElement ?? el, start: 'top bottom', end: 'bottom top', scrub: true } },
          );
        });
        gsap.utils.toArray<HTMLElement>('[data-scrub="words"]').forEach((el) => {
          gsap.fromTo(
            el.querySelectorAll('.wi'),
            { opacity: 0.12 },
            { opacity: 1, stagger: 0.1, ease: 'none', scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 45%', scrub: true } },
          );
        });
        gsap.utils.toArray<HTMLElement>('[data-marquee]').forEach((el) => {
          const dir = el.dataset.marquee === 'rev' ? 1 : -1;
          gsap.fromTo(
            el,
            { xPercent: dir === -1 ? 0 : -25 },
            { xPercent: dir === -1 ? -25 : 0, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 0.6 } },
          );
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
