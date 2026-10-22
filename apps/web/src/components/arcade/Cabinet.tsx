'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { getLenis } from '@/lib/motion';
import { H, makeGfx, makeSfx, PAL, W, type Game, type GameFactory } from './engine';
import { GAMES } from './games';

type Phase = 'title' | 'play' | 'pause' | 'over';

const HS_KEY = (id: string) => `cev-arcade-${id}`;
const MUTE_KEY = 'cev-arcade-mute';
const read = (k: string) => {
  try {
    return localStorage.getItem(k);
  } catch {
    return null;
  }
};
const write = (k: string, v: string) => {
  try {
    localStorage.setItem(k, v);
  } catch {
    /* egal */
  }
};

export interface CabinetCopy {
  id: keyof typeof GAMES;
  title: string;
  tagline: string;
  howTo: string;
  controls: string[];
  start: string;
  again: string;
  pause: string;
  highscore: string;
  newHigh: string;
}

/** Ein Spielautomat: Canvas in Retro-Auflösung, Startbildschirm, Pause, Game Over, Highscore. */
export function Cabinet({ copy }: { copy: CabinetCopy }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<Phase>('title');
  const [score, setScore] = useState(0);
  const [high, setHigh] = useState(0);
  const [isNewHigh, setIsNewHigh] = useState(false);
  const [muted, setMuted] = useState(false);
  const phaseRef = useRef<Phase>('title');
  const game = useRef<Game | null>(null);
  const mutedRef = useRef(false);
  const sfx = useRef<ReturnType<typeof makeSfx> | null>(null);
  const held = useRef(new Set<string>());

  useEffect(() => {
    // Gespeicherte Werte erst nach dem Mount lesen (localStorage gibt es auf dem Server nicht).
    const h = Number(read(HS_KEY(copy.id)) ?? 0) || 0;
    const m = read(MUTE_KEY) === '1';
    mutedRef.current = m;
    const id = requestAnimationFrame(() => {
      setHigh(h);
      setMuted(m);
    });
    return () => cancelAnimationFrame(id);
  }, [copy.id]);

  const go = useCallback((p: Phase) => {
    phaseRef.current = p;
    setPhase(p);
  }, []);

  const start = useCallback(() => {
    if (!sfx.current) sfx.current = makeSfx(() => mutedRef.current);
    sfx.current.unlock();
    if (!game.current) game.current = (GAMES[copy.id] as GameFactory)(sfx.current);
    game.current.reset();
    held.current.clear();
    setScore(0);
    setIsNewHigh(false);
    go('play');
    canvas.current?.focus({ preventScroll: true });
  }, [copy.id, go]);

  // Game-Loop
  useEffect(() => {
    const c = canvas.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;
    const font =
      getComputedStyle(document.documentElement).getPropertyValue('--font-pixel').trim() || 'monospace';
    const g = makeGfx(ctx, font);
    let raf = 0;
    let last = performance.now();
    let visible = true;
    let shown = 0;

    const io = new IntersectionObserver(([e]) => {
      visible = !!e?.isIntersecting;
      if (!visible && phaseRef.current === 'play') go('pause');
    });
    io.observe(c);

    const attract = (t: number) => {
      g.rect(0, 0, W, H, PAL.ink);
      for (let i = 0; i < 40; i++) {
        const x = (i * 53 + t * 20 * ((i % 3) + 1)) % W;
        const y = (i * 37) % H;
        g.rect(x, y, 2, 2, i % 4 === 0 ? PAL.gold : i % 4 === 1 ? PAL.signal : PAL.ash);
      }
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!visible) return;
      g.t = now / 1000;
      const gm = game.current;
      if (phaseRef.current === 'play' && gm) {
        gm.update(dt, held.current);
        gm.render(g);
        if (gm.score !== shown) {
          shown = gm.score;
          setScore(gm.score);
        }
        if (gm.over) {
          const best = Number(read(HS_KEY(copy.id)) ?? 0) || 0;
          if (gm.score > best) {
            write(HS_KEY(copy.id), String(gm.score));
            setHigh(gm.score);
            setIsNewHigh(true);
          }
          sfx.current?.blip(110, 0.4, 'sawtooth', 0.08);
          go('over');
        }
      } else if (phaseRef.current === 'title') {
        attract(g.t);
      } else if (gm) {
        gm.render(g);
        g.rect(0, 0, W, H, 'rgba(12,10,8,0.55)');
      }
    };
    raf = requestAnimationFrame(frame);

    const onVis = () => document.visibilityState === 'hidden' && phaseRef.current === 'play' && go('pause');
    document.addEventListener('visibilitychange', onVis);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [copy.id, go]);

  // Tastatur: nur wenn dieser Automat fokussiert ist; Spieltasten scrollen die Seite nicht.
  useEffect(() => {
    const c = canvas.current;
    if (!c) return;
    const GAME_KEYS = new Set([
      'ArrowLeft',
      'ArrowRight',
      'ArrowUp',
      'ArrowDown',
      'Space',
      'KeyA',
      'KeyD',
      'KeyW',
      'KeyS',
      'KeyF',
      'KeyJ',
      'KeyK',
      'Enter',
    ]);
    const down = (e: KeyboardEvent) => {
      if (GAME_KEYS.has(e.code)) e.preventDefault();
      if (e.code === 'Escape' || e.code === 'KeyP') {
        if (phaseRef.current === 'play') go('pause');
        else if (phaseRef.current === 'pause') go('play');
        return;
      }
      if (phaseRef.current !== 'play') {
        if (e.code === 'Enter' || e.code === 'Space') {
          if (phaseRef.current === 'pause') go('play');
          else start();
        }
        return;
      }
      if (!e.repeat) game.current?.key?.(e.code);
      held.current.add(e.code);
    };
    const up = (e: KeyboardEvent) => held.current.delete(e.code);
    const blur = () => held.current.clear();
    c.addEventListener('keydown', down);
    c.addEventListener('keyup', up);
    c.addEventListener('blur', blur);
    return () => {
      c.removeEventListener('keydown', down);
      c.removeEventListener('keyup', up);
      c.removeEventListener('blur', blur);
    };
  }, [go, start]);

  // Während des Spiels kein Smooth-Scroll-Wheel im Automaten
  useEffect(() => {
    const l = getLenis();
    if (phase === 'play') l?.stop();
    else l?.start();
    return () => l?.start();
  }, [phase]);

  const toGame = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    return [((e.clientX - r.left) / r.width) * W, ((e.clientY - r.top) / r.height) * H] as const;
  };
  const onPointer = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (phaseRef.current !== 'play') return;
    const type = e.type === 'pointerdown' ? 'down' : e.type === 'pointermove' ? 'move' : 'up';
    if (type === 'down') e.currentTarget.setPointerCapture(e.pointerId);
    const [x, y] = toGame(e);
    game.current?.pointer?.(type, x, y);
  };

  const toggleMute = () => {
    const m = !muted;
    mutedRef.current = m;
    setMuted(m);
    write(MUTE_KEY, m ? '1' : '0');
  };

  return (
    <article className="cab" ref={wrap} data-game={copy.id}>
      <header className="cab__head">
        <span className="cab__title">{copy.title}</span>
        <span className="cab__score" aria-live="polite">
          <small>Score</small> {String(score).padStart(5, '0')}
        </span>
        <span className="cab__score">
          <small>{copy.highscore}</small> {String(high).padStart(5, '0')}
        </span>
      </header>
      <div className="cab__screen">
        <canvas
          ref={canvas}
          width={W}
          height={H}
          tabIndex={0}
          aria-label={`${copy.title}: ${copy.howTo}`}
          onPointerDown={onPointer}
          onPointerMove={onPointer}
          onPointerUp={onPointer}
          onPointerCancel={onPointer}
        />
        {phase !== 'play' && (
          <div className="cab__overlay">
            {phase === 'title' && (
              <>
                <p className="cab__tagline">{copy.tagline}</p>
                <button type="button" className="cab__start" onClick={start}>
                  {copy.start}
                </button>
                <p className="cab__howto">{copy.howTo}</p>
              </>
            )}
            {phase === 'pause' && (
              <button type="button" className="cab__start" onClick={() => go('play')}>
                {copy.pause}
              </button>
            )}
            {phase === 'over' && (
              <>
                <p className="cab__big">Game Over</p>
                <p className="cab__tagline">
                  {String(score).padStart(5, '0')} {isNewHigh ? `· ${copy.newHigh}` : ''}
                </p>
                <button type="button" className="cab__start" onClick={start}>
                  {copy.again}
                </button>
              </>
            )}
          </div>
        )}
      </div>
      <footer className="cab__foot">
        <ul>
          {copy.controls.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
        <button type="button" className="cab__mute" onClick={toggleMute} aria-pressed={muted}>
          {muted ? 'Sound aus' : 'Sound an'}
        </button>
      </footer>
    </article>
  );
}
