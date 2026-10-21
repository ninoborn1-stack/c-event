'use client';

import { useEffect, useRef } from 'react';
import { gsap, prefersReducedMotion } from '@/lib/motion';

/** Eigener Cursor: ein Spot, der über Links wächst und ein Label zeigt (nur mit Maus). */
export function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion() || !window.matchMedia('(pointer: fine)').matches) return;
    document.documentElement.classList.add('has-cursor');
    const xTo = gsap.quickTo(el, 'x', { duration: 0.35, ease: 'power3' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.35, ease: 'power3' });
    const label = el.querySelector('span')!;
    const move = (e: PointerEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      const t = (e.target as Element | null)?.closest?.('a, button, [data-cursor], input, select, textarea, label');
      const text = t?.getAttribute('data-cursor') ?? (t?.matches('a') ? '' : null);
      el.classList.toggle('is-hover', !!t && !t.matches('input, select, textarea'));
      el.classList.toggle('is-text', !!t && t.matches('input, select, textarea'));
      label.textContent = text ?? '';
      el.classList.toggle('has-label', !!text);
    };
    const down = () => el.classList.add('is-down');
    const up = () => el.classList.remove('is-down');
    const leave = () => el.classList.add('is-gone');
    const enter = () => el.classList.remove('is-gone');
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerdown', down);
    window.addEventListener('pointerup', up);
    document.addEventListener('pointerleave', leave);
    document.addEventListener('pointerenter', enter);
    return () => {
      document.documentElement.classList.remove('has-cursor');
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerdown', down);
      window.removeEventListener('pointerup', up);
      document.removeEventListener('pointerleave', leave);
      document.removeEventListener('pointerenter', enter);
    };
  }, []);
  return (
    <div ref={ref} className="cursor" aria-hidden="true">
      <span />
    </div>
  );
}
