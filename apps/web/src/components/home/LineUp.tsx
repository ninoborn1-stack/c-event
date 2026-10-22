'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Media } from '@/components/Media';
import { gsap, prefersReducedMotion } from '@/lib/motion';

interface Item {
  href: string;
  name: string;
  line: string;
  media: string;
}

/** Leistungen als „Line-up“: große Namen, das Bild folgt der Maus wie ein Spot. */
export function LineUp({ items }: { items: Item[] }) {
  const [active, setActive] = useState(-1);
  const wrap = useRef<HTMLDivElement>(null);
  const float = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrap.current;
    const f = float.current;
    if (!el || !f || prefersReducedMotion() || !window.matchMedia('(pointer: fine)').matches) return;
    const xTo = gsap.quickTo(f, 'x', { duration: 0.6, ease: 'power3' });
    const yTo = gsap.quickTo(f, 'y', { duration: 0.6, ease: 'power3' });
    const rTo = gsap.quickTo(f, 'rotate', { duration: 0.8, ease: 'power3' });
    let lastX = 0;
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      xTo(e.clientX - r.left);
      yTo(e.clientY - r.top);
      rTo(gsap.utils.clamp(-12, 12, (e.clientX - lastX) * 0.6));
      lastX = e.clientX;
    };
    el.addEventListener('pointermove', move);
    return () => el.removeEventListener('pointermove', move);
  }, []);

  return (
    <div className="lineup" ref={wrap} onPointerLeave={() => setActive(-1)}>
      <ol className="lineup__list">
        {items.map((it, i) => (
          <li key={it.href} onPointerEnter={() => setActive(i)} className={active === i ? 'is-active' : active >= 0 ? 'is-dim' : ''}>
            <Link href={it.href} data-label={it.name}>
              <em className="lineup__no">{String(i + 1).padStart(2, '0')}</em>
              <span className="lineup__name">{it.name}</span>
              <span className="lineup__line">{it.line}</span>
              <span className="lineup__thumb">
                <Media id={it.media} sizes="40vw" />
              </span>
              <span className="lineup__arrow" aria-hidden="true">
                ↗
              </span>
            </Link>
          </li>
        ))}
      </ol>
      <div className="lineup__float" ref={float} aria-hidden="true">
        {items.map((it, i) => (
          <div key={it.href} className={`lineup__float-img${active === i ? ' is-on' : ''}`}>
            <Media id={it.media} sizes="420px" />
          </div>
        ))}
      </div>
    </div>
  );
}
