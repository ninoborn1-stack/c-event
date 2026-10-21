'use client';

import { useEffect, useRef } from 'react';
import { Media } from '@/components/Media';
import { gsap, prefersReducedMotion } from '@/lib/motion';

interface Highlight {
  time: string;
  title: string;
  meta: string;
  media: string;
  tag: string;
}

/** „Running Order“: horizontale Fahrt durch Referenz-Events, beim Scrollen gepinnt (Desktop). */
export function Highlights({ kicker, title, items, isPlaceholder, note }: { kicker: string; title: string; items: Highlight[]; isPlaceholder: boolean; note?: string }) {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const s = section.current;
    const t = track.current;
    if (!s || !t || prefersReducedMotion()) return;
    const mm = gsap.matchMedia();
    mm.add('(min-width: 900px)', () => {
      const dist = () => t.scrollWidth - window.innerWidth;
      const tween = gsap.fromTo(
        t,
        { x: 0 },
        {
          x: () => -dist(),
          ease: 'none',
          scrollTrigger: { trigger: s, start: 'top top', end: () => `+=${dist()}`, pin: true, scrub: 0.6, invalidateOnRefresh: true, anticipatePin: 1 },
        },
      );
      t.querySelectorAll<HTMLElement>('.hl__img').forEach((img) => {
        gsap.fromTo(img, { scale: 1.25 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: img, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true } });
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={section} className="hl" aria-labelledby="hl-title">
      <div className="hl__head">
        <span className="micro">{kicker}</span>
        <h2 id="hl-title" className="display-l">
          {title}
        </h2>
      </div>
      <div className={`hl__track${isPlaceholder ? ' ph' : ''}`} ref={track} data-ph-note={note}>
        {items.map((h, i) => (
          <article key={h.title} className="hl__card">
            <div className="hl__time">
              <span>{h.time}</span>
              <small>
                {String(i + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
              </small>
            </div>
            <div className="hl__frame">
              <div className="hl__img">
                <Media id={h.media} sizes="(min-width: 900px) 40vw, 90vw" />
              </div>
              <span className="hl__tag">{h.tag}</span>
            </div>
            <h3>{h.title}</h3>
            <p>{h.meta}</p>
          </article>
        ))}
        <div className="hl__end" aria-hidden="true">
          <span>Next:</span>
          <strong>Dein Event.</strong>
        </div>
      </div>
    </section>
  );
}
