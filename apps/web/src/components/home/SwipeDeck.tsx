'use client';

import { useCallback, useRef, useState } from 'react';
import { home, shopHref } from '@c-event/content';
import { Media } from '@/components/Media';
import { Split } from '@/components/Split';
import { TicketLink } from '@/components/ui/Ticket';
import { prefersReducedMotion } from '@/lib/motion';

type Card = { title: string; venue: string; guests: string; fit: string; category: string; media: string };

const T = home.swipe;

/**
 * Event-Match: Kartenstapel im Tinder-Stil in einer Handy-Attrappe.
 * Rechts = gemerkt, links = weiter. Ziehen (Maus/Touch), Buttons oder Pfeiltasten.
 * Am Ende: die Matches mit Ticket in den Shop (Kategorie vorausgewählt, Herkunft „match“).
 */
export function SwipeDeck({ cards }: { cards: readonly Card[] }) {
  const [index, setIndex] = useState(0);
  const [liked, setLiked] = useState<string[]>([]);
  const [drag, setDrag] = useState({ x: 0, y: 0, active: false });
  const [leaving, setLeaving] = useState<null | 'left' | 'right'>(null);
  const start = useRef({ x: 0, y: 0 });
  const card = cards[index];
  const done = index >= cards.length;

  const decide = useCallback(
    (dir: 'left' | 'right') => {
      if (!card || leaving) return;
      if (dir === 'right') {
        setLiked((l) => (l.includes(card.title) ? l : [...l, card.title]));
      }
      setLeaving(dir);
      window.setTimeout(
        () => {
          setLeaving(null);
          setDrag({ x: 0, y: 0, active: false });
          setIndex((i) => i + 1);
        },
        prefersReducedMotion() ? 0 : 320,
      );
    },
    [card, leaving],
  );

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') decide('right');
    if (e.key === 'ArrowLeft') decide('left');
  };
  const onDown = (e: React.PointerEvent) => {
    if (leaving) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    start.current = { x: e.clientX, y: e.clientY };
    setDrag({ x: 0, y: 0, active: true });
  };
  const onMove = (e: React.PointerEvent) => {
    if (!drag.active) return;
    setDrag({ x: e.clientX - start.current.x, y: (e.clientY - start.current.y) * 0.3, active: true });
  };
  const onUp = () => {
    if (!drag.active) return;
    if (Math.abs(drag.x) > 90) decide(drag.x > 0 ? 'right' : 'left');
    else setDrag({ x: 0, y: 0, active: false });
  };
  const restart = () => {
    setIndex(0);
    setLiked([]);
  };

  const dx = leaving ? (leaving === 'right' ? 600 : -600) : drag.x;
  const topStyle = {
    transform: `translate(${dx}px, ${drag.y}px) rotate(${dx * 0.05}deg)`,
    transition: drag.active ? 'none' : 'transform .32s cubic-bezier(.16,1,.3,1)',
  };
  const matches = cards.filter((c) => liked.includes(c.title));

  return (
    <div className="match">
      <div className="match__text">
        <span className="eyebrow eyebrow--sq">{T.kicker}</span>
        <Split as="h2" className="h-l" text={T.title} />
        <p className="sec__lead">{T.text}</p>
        <ol className="match__steps">
          {T.steps.map((s) => (
            <li key={s.label}>
              <b>{s.key}</b>
              <strong>{s.label}</strong>
              <span className="mono">{s.text}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="phone">
        <div className="phone__screen">
          <div className="phone__bar mono">
            <span>Event-Match</span>
            <span>
              ♥ {liked.length} / {cards.length}
            </span>
          </div>

          {!done ? (
            <div className="deck" tabIndex={0} onKeyDown={onKey} role="group" aria-roledescription="Kartenstapel" aria-label={`${index + 1} von ${cards.length}: ${card?.title ?? ''}`}>
              {cards
                .slice(index, index + 3)
                .reverse()
                .map((c, ri, arr) => {
                  const depth = arr.length - 1 - ri; // 0 = oben
                  const top = depth === 0;
                  return (
                    <div
                      key={c.title}
                      className={`deck__card${top ? ' is-top' : ''}`}
                      style={top ? topStyle : { transform: `translateY(${depth * 12}px) scale(${1 - depth * 0.05})` }}
                      onPointerDown={top ? onDown : undefined}
                      onPointerMove={top ? onMove : undefined}
                      onPointerUp={top ? onUp : undefined}
                      onPointerCancel={top ? onUp : undefined}
                      aria-hidden={!top}
                    >
                      <div className="deck__img">
                        <Media id={c.media} sizes="360px" />
                      </div>
                      {top && (
                        <>
                          <span className="deck__stamp deck__stamp--yes" style={{ opacity: Math.max(0, Math.min(1, dx / 90)) }}>
                            {T.like}
                          </span>
                          <span className="deck__stamp deck__stamp--no" style={{ opacity: Math.max(0, Math.min(1, -dx / 90)) }}>
                            {T.skip}
                          </span>
                        </>
                      )}
                      <div className="deck__info">
                        <span className="mono">
                          {c.venue} · {c.guests}
                        </span>
                        <strong>{c.title}</strong>
                        <span className="deck__fit">{c.fit}</span>
                      </div>
                    </div>
                  );
                })}
            </div>
          ) : (
            <div className="matches">
              <Split as="h3" className="h-m" text={T.doneTitle} />
              {matches.length === 0 && <p className="muted">{T.doneEmpty}</p>}
              <ul>
                {matches.map((m) => (
                  <li key={m.title}>
                    <span className="mono">{m.venue}</span>
                    <strong>{m.title}</strong>
                    <TicketLink href={shopHref(m.category, 'match')} label={m.title} size="sm">
                      {T.toShop}
                    </TicketLink>
                  </li>
                ))}
              </ul>
              <button type="button" className="link-btn" onClick={restart}>
                {T.restart}
              </button>
            </div>
          )}

          {!done && (
            <div className="deck__btns">
              <button type="button" className="deck__btn" onClick={() => decide('left')} aria-label={T.skip}>
                ←
              </button>
              <span className="mono">{T.hint}</span>
              <button type="button" className="deck__btn deck__btn--yes" onClick={() => decide('right')} aria-label={T.like}>
                ♥
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
