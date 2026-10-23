'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { Media } from '@/components/Media';
import { gsap, prefersReducedMotion, ScrollTrigger } from '@/lib/motion';

export interface RailItem {
  media: string;
  label?: string;
  sub?: string;
  href?: string;
}

/**
 * Horizontaler Foto-Scroll (Celias Highlight von Bar-Catering): Die Bilder laufen seitlich durch,
 * während man vertikal weiterscrollt. Kein Pinning – die Seite scrollt normal weiter.
 * Ohne Bewegung (reduced motion) wird daraus eine normal wischbare Leiste.
 */
export function PhotoRail({ items, title, tone = 'ink' }: { items: RailItem[]; title?: string; tone?: 'ink' | 'cream' }) {
  const wrap = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const w = wrap.current;
    const t = track.current;
    if (!w || !t || prefersReducedMotion()) return;
    w.classList.add('is-driven');
    const ctx = gsap.context(() => {
      gsap.fromTo(
        t,
        { x: () => Math.min(0, window.innerWidth * 0.08) },
        {
          x: () => -Math.max(0, t.scrollWidth - window.innerWidth * 0.92),
          ease: 'none',
          scrollTrigger: { trigger: w, start: 'top bottom', end: 'bottom top', scrub: 0.6, invalidateOnRefresh: true },
        },
      );
    }, w);
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => {
      cancelAnimationFrame(id);
      ctx.revert();
      w.classList.remove('is-driven');
    };
  }, [items.length]);

  return (
    <section ref={wrap} className={`rail rail--${tone}`} aria-label={title}>
      {title && <h2 className="rail__title eyebrow">{title}</h2>}
      <div className="rail__viewport">
        <div className="rail__track" ref={track}>
          {items.map((it, i) => {
            const inner = (
              <>
                <div className="rail__img">
                  <Media id={it.media} sizes="(min-width: 900px) 34vw, 75vw" />
                </div>
                {it.label && (
                  <span className="rail__cap">
                    <em>{String(i + 1).padStart(2, '0')}</em>
                    <strong>{it.label}</strong>
                    {it.sub && <small>{it.sub}</small>}
                  </span>
                )}
              </>
            );
            return it.href ? (
              <Link key={`${it.media}-${i}`} href={it.href} className="rail__item" data-label={it.label}>
                {inner}
              </Link>
            ) : (
              <div key={`${it.media}-${i}`} className="rail__item">
                {inner}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
