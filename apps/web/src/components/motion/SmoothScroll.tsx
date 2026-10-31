'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap, prefersReducedMotion, ScrollTrigger, setLenis } from '@/lib/motion';

export function SmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const lenis = new Lenis({ lerp: 0.11, smoothWheel: true });
    setLenis(lenis);
    lenis.on('scroll', ScrollTrigger.update);
    // Während des Scrollens Hover aus: sonst klappen Streifen/Bilder auf, die unter der stehenden Maus vorbeiziehen
    const root = document.documentElement;
    let scrollTimer = 0;
    lenis.on('scroll', () => {
      root.classList.add('is-scrolling');
      window.clearTimeout(scrollTimer);
      scrollTimer = window.setTimeout(() => root.classList.remove('is-scrolling'), 180);
    });
    const tick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    // Nach Webfonts und Bildern stimmen Höhen erst final: ScrollTrigger-Positionen einmal neu berechnen.
    const refresh = () => ScrollTrigger.refresh();
    void document.fonts?.ready.then(refresh);
    window.addEventListener('load', refresh);
    return () => {
      window.removeEventListener('load', refresh);
      window.clearTimeout(scrollTimer);
      root.classList.remove('is-scrolling');
      gsap.ticker.remove(tick);
      lenis.destroy();
      setLenis(null);
    };
  }, []);
  return null;
}
