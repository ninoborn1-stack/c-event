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
    const tick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      setLenis(null);
    };
  }, []);
  return null;
}
