'use client';

import { useEffect, useState } from 'react';
import { getMedia } from '@c-event/content';
import { Media } from '@/components/Media';
import { getLenis } from '@/lib/motion';

interface Item {
  media: string;
  services: string[];
  occasion: string;
}

export function GalleryGrid({ items, services, occasions }: { items: Item[]; services: { slug: string; name: string }[]; occasions: readonly string[] }) {
  const [filter, setFilter] = useState<{ type: 'all' | 'service' | 'occasion'; value?: string }>({ type: 'all' });
  const [open, setOpen] = useState<number | null>(null);
  const list = items.filter((i) =>
    filter.type === 'all' ? true : filter.type === 'service' ? i.services.includes(filter.value!) : i.occasion === filter.value,
  );

  useEffect(() => {
    const l = getLenis();
    if (open !== null) l?.stop();
    else l?.start();
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(null);
      if (e.key === 'ArrowRight') setOpen((o) => (o === null ? o : (o + 1) % list.length));
      if (e.key === 'ArrowLeft') setOpen((o) => (o === null ? o : (o - 1 + list.length) % list.length));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, list.length]);

  const cur = open !== null ? list[open] : undefined;
  const curMedia = cur ? getMedia(cur.media) : undefined;

  return (
    <>
      <div className="gfilter">
        <div className="chips">
          <button type="button" className={`chip${filter.type === 'all' ? ' is-on' : ''}`} onClick={() => setFilter({ type: 'all' })}>
            Alles<sup>{items.length}</sup>
          </button>
          {occasions.map((o) => (
            <button
              key={o}
              type="button"
              className={`chip${filter.type === 'occasion' && filter.value === o ? ' is-on' : ''}`}
              onClick={() => setFilter({ type: 'occasion', value: o })}
            >
              {o}
            </button>
          ))}
        </div>
        <label className="gfilter__select">
          <span className="micro">Leistung</span>
          <select
            value={filter.type === 'service' ? filter.value : ''}
            onChange={(e) => setFilter(e.target.value ? { type: 'service', value: e.target.value } : { type: 'all' })}
          >
            <option value="">Alle Leistungen</option>
            {services.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="gal" key={`${filter.type}-${filter.value ?? ''}`}>
        {list.map((it, i) => {
          const m = getMedia(it.media);
          return (
            <button key={`${it.media}-${i}`} type="button" className={`gal__item gal__item--${i % 7}`} onClick={() => setOpen(i)} data-cursor={m.kind === 'video' ? 'Play' : 'Zoom'}>
              <Media id={it.media} sizes="(min-width: 1000px) 33vw, 50vw" />
              {m.kind === 'video' && <span className="gal__play">▶ Video</span>}
              <span className="gal__cap">
                {it.occasion} · {services.find((s) => it.services.includes(s.slug))?.name}
              </span>
            </button>
          );
        })}
        {list.length === 0 && <p className="muted">Noch keine Bilder in dieser Auswahl.</p>}
      </div>
      {cur && curMedia && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={curMedia.alt} data-lenis-prevent>
          <button type="button" className="lightbox__close" onClick={() => setOpen(null)}>
            Schließen ×
          </button>
          <button type="button" className="lightbox__nav lightbox__nav--prev" onClick={() => setOpen((open! - 1 + list.length) % list.length)} aria-label="Vorheriges">
            ←
          </button>
          <figure>
            {curMedia.kind === 'video' ? (
              <video src={curMedia.src} poster={curMedia.poster} controls autoPlay muted loop playsInline />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={curMedia.src} alt={curMedia.alt} />
            )}
            <figcaption>
              {curMedia.alt} <small>{curMedia.credit}</small>
            </figcaption>
          </figure>
          <button type="button" className="lightbox__nav lightbox__nav--next" onClick={() => setOpen((open! + 1) % list.length)} aria-label="Nächstes">
            →
          </button>
        </div>
      )}
    </>
  );
}
