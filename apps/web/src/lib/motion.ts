'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type Lenis from 'lenis';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

const g = globalThis as unknown as { __cevLenis?: Lenis | null };

export function setLenis(l: Lenis | null) {
  g.__cevLenis = l;
}
export function getLenis(): Lenis | null {
  return g.__cevLenis ?? null;
}

export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export { gsap, ScrollTrigger };
