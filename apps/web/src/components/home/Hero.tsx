'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { DEFAULT_SETTINGS, HERO_TRANSITIONS, type HeroTransition } from '@c-event/core';
import { getMedia } from '@c-event/content';
import { TicketLink } from '@/components/ui/Ticket';
import { createDots360, type DotsState } from './dots360';
import { asset } from '@/lib/env';
import { gsap, prefersReducedMotion } from '@/lib/motion';
import { useSite } from '@/lib/site-context';

interface HeroProps {
  mediaId: string;
  slogans: { lines: readonly string[]; second: readonly string[] }[];
  eyebrow: string[];
  lead: string;
  cta: { label: string; href: string };
  bar: string[];
  doors: string;
  sloganIsPlaceholder: boolean;
  sloganNote?: string;
  behind: string;
}

/** „CN“ als Blende (viewBox 1000): C-Ring links, N rechts. Zum Öffnen quellen die Buchstaben per Kontur auf, bis sie das ganze Fenster füllen. */
const CN_PATHS = [
  'M 510.2 390.7 A 170 170 0 1 0 510.2 609.3 L 456.6 564.3 A 100 100 0 1 1 456.6 435.7 Z',
  'M 580 330 H 646 L 714 488 V 330 H 780 V 670 H 714 L 646 512 V 670 H 580 Z',
];
const ZOOM_ORIGIN = '495 500';
const INTRO_KEY = 'cev-intro-seen';

/** Stücke, in die das Hero-Bild für den Übergang zerfällt: 1 Bild (Punkte, Blende), 2 Ticket-Hälften */
const PIECES: Record<HeroTransition, number> = { punkte: 1, blende: 1, ticket: 2 };

/**
 * Hero als eigenes kleines Event.
 * Ebenen-Regel: Intro und Scroll bewegen NIE dieselbe Eigenschaft am selben Element.
 * Intro: .intro*, .hero__img (scale), .ch, .hero__eyebrow/.hero__foot-Kinder, .hero__bar-in, .nav.
 * Scroll: .hero__zoom (scale), .hero__content, .hero__bar, .hero__second, .hero__strip, .hero__strips (clip/opacity), .hero__ring, Punkte-Zustand (Canvas).
 * Die „360°“ zeichnet .hero__dots (Canvas, dots360.ts); Maus und Touch wirken nur dort.
 * Der CSS-Grundzustand ist immer der fertige Zustand.
 */
export function Hero(p: HeroProps) {
  const root = useRef<HTMLElement>(null);
  const finishRef = useRef<() => void>(() => undefined);
  const [introDone, setIntroDone] = useState(false);
  const img = getMedia(p.mediaId);
  const { settings } = useSite();
  const variant: HeroTransition = HERO_TRANSITIONS.includes(settings.heroTransition) ? settings.heroTransition : DEFAULT_SETTINGS.heroTransition;
  const n = PIECES[variant];
  const slogan = p.slogans[settings.sloganVariant % p.slogans.length] ?? p.slogans[0]!;
  const sloganNote = p.sloganNote ? `${p.sloganNote} (Variante ${(settings.sloganVariant % p.slogans.length) + 1}/${p.slogans.length})` : undefined;

  // ---------- SCROLL: hängt an der gewählten Übergangs-Variante ----------
  useEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    const q = gsap.utils.selector(el);
    const canvas = el.querySelector<HTMLCanvasElement>('.hero__dots');
    const dots: DotsState = { grid: 0, fly: 0, alpha: 0 };
    const touch = !window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const font = getComputedStyle(el.querySelector('.hero__title') ?? el).fontFamily;
    const field = canvas
      ? createDots360(canvas, {
          text: p.behind,
          accentFrom: Math.max(1, p.behind.length - 1),
          img: el.querySelector<HTMLImageElement>('.hero__strip img'),
          fontFamily: font,
          fly: variant === 'punkte',
          touch,
        })
      : null;
    // Zeichnen nur, solange der Übergang läuft oder die Zahl zu sehen ist
    let raf = 0;
    let active = false;
    const loop = () => {
      raf = 0;
      if (!active) return;
      field?.draw(dots);
      raf = requestAnimationFrame(loop);
    };
    const setActive = (on: boolean) => {
      if (on === active) return;
      active = on;
      if (on && !raf) raf = requestAnimationFrame(loop);
      if (!on) {
        // geplanten Frame verwerfen, sonst malt er das Raster nach dem Löschen noch einmal hin
        if (raf) cancelAnimationFrame(raf);
        raf = 0;
        field?.clear();
      }
    };
    // Zeichnen hängt am tatsächlichen Punkte-Zustand (nicht an der Scrollposition, die dem Scrub vorausläuft)
    const visible = () => dots.grid > 0.001 || dots.alpha > 0.001;
    let inView = true;
    const io = new IntersectionObserver(([e]) => {
      inView = !!e?.isIntersecting;
      setActive(inView && visible());
    });
    io.observe(el);
    const onMove = (e: PointerEvent) => field?.pointer(e.clientX, e.clientY);
    const onLeave = () => field?.leave();
    if (!touch) {
      window.addEventListener('pointermove', onMove, { passive: true });
      document.documentElement.addEventListener('pointerleave', onLeave);
    }
    let resizeTimer = 0;
    // Punkte im Leerlauf vorberechnen (nach dem Laden des Bildes und der Schrift), nicht erst beim Scrollen
    const idle = (fn: () => void) => (typeof window.requestIdleCallback === 'function' ? window.requestIdleCallback(fn, { timeout: 2500 }) : setTimeout(fn, 1200));
    const prepare = () => void document.fonts?.ready.then(() => idle(() => field?.prepare()));
    const heroImg = el.querySelector<HTMLImageElement>('.hero__strip img');
    if (!heroImg || heroImg.complete) prepare();
    else heroImg.addEventListener('load', prepare, { once: true });
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        field?.rebuild();
        idle(() => field?.prepare());
      }, 200);
    };
    window.addEventListener('resize', onResize);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: el,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.8,
          onUpdate: (s) => {
            if (s.progress > 0.02) finishRef.current();
          },
        },
        onUpdate: () => setActive(inView && visible()),
      });
      tl.fromTo(q('.hero__zoom'), { scale: 1 }, { scale: 1.2, duration: 1 }, 0)
        .fromTo(q('.hero__content'), { yPercent: 0, autoAlpha: 1 }, { yPercent: -22, autoAlpha: 0, duration: 0.3, ease: 'power1.in' }, 0)
        .fromTo(q('.hero__bar'), { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.12 }, 0)
        .fromTo(q('.hero__second'), { autoAlpha: 0, y: 90 }, { autoAlpha: 1, y: 0, duration: 0.2, ease: 'power2.out' }, 0.26)
        .fromTo(q('.hero__second'), { autoAlpha: 1, y: 0 }, { autoAlpha: 0, y: -70, duration: 0.12, ease: 'power2.in', immediateRender: false }, 0.54);

      if (variant === 'punkte') {
        // Punkte: das Foto wird zum Punkteraster, dann fliegen die Punkte zur 360° zusammen
        tl.fromTo(dots, { grid: 0 }, { grid: 1, duration: 0.08 }, 0.5)
          .fromTo(q('.hero__strips'), { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.05, immediateRender: false }, 0.56)
          .fromTo(dots, { fly: 0 }, { fly: 1, duration: 0.3 }, 0.6);
      } else if (variant === 'blende') {
        // Blende: das Bild schließt sich wie eine Kamerablende zum Kreis, dahinter dreht sich 360° ein
        tl.fromTo(q('.hero__strips'), { clipPath: 'circle(120% at 50% 50%)' }, { clipPath: 'circle(0% at 50% 50%)', duration: 0.34, ease: 'power3.inOut' }, 0.6)
          .fromTo(q('.hero__ring'), { scale: 1.8, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.3, ease: 'power2.out' }, 0.68)
          .fromTo(dots, { alpha: 0 }, { alpha: 1, duration: 0.2 }, 0.7);
      } else {
        // Ticket: das Bild reißt an der Perforation in zwei Hälften auseinander
        const [top, bottom] = q('.hero__strip');
        tl.fromTo(q('.hero__perf'), { autoAlpha: 0, scaleX: 0 }, { autoAlpha: 1, scaleX: 1, duration: 0.08 }, 0.56)
          .fromTo(top!, { yPercent: 0, rotate: 0 }, { yPercent: -105, rotate: -3, duration: 0.3, ease: 'power3.in' }, 0.64)
          .fromTo(bottom!, { yPercent: 0, rotate: 0 }, { yPercent: 105, rotate: 2, duration: 0.3, ease: 'power3.in' }, 0.64)
          .fromTo(q('.hero__perf'), { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.06, immediateRender: false }, 0.66)
          .fromTo(dots, { alpha: 0 }, { alpha: 1, duration: 0.2 }, 0.7);
      }
    }, el);
    return () => {
      io.disconnect();
      setActive(false);
      if (raf) cancelAnimationFrame(raf);
      window.clearTimeout(resizeTimer);
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('resize', onResize);
      ctx.revert();
    };
  }, [variant, p.behind]);

  // ---------- INTRO: einmal beim Laden ----------
  useEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    const q = gsap.utils.selector(el);
    let intro: gsap.core.Timeline | null = null;
    let cancelled = false;

    const ctx = gsap.context(() => {
      const seen = (() => {
        try {
          return sessionStorage.getItem(INTRO_KEY) === '1';
        } catch {
          return false;
        }
      })();
      // Mit Anker oder im Hintergrund-Tab geladen: kein Intro, sofort der fertige Zustand.
      if (location.hash || document.visibilityState === 'hidden') {
        setIntroDone(true);
        return;
      }
      window.scrollTo(0, 0);
      document.documentElement.classList.add('intro-on');
      const full = !seen;
      const introTargets = '.intro, .intro__c, .intro__zoomc, .ch, .hero__eyebrow > *, .hero__foot > *, .hero__bar-in';
      const nav = document.querySelector('.nav');
      intro = gsap.timeline({
        paused: true,
        onComplete: () => {
          el.classList.remove('is-intro'); // vor clearProps, sonst greift die CSS-Verdeckung einen Frame lang
          document.documentElement.classList.remove('intro-on');
          gsap.set(q(introTargets), { clearProps: 'all' });
          // Nur transform zurücksetzen: next/image hält Layout-Styles (fill) inline am <img>.
          gsap.set(q('.hero__img'), { clearProps: 'transform,scale' });
          if (nav) gsap.set(nav, { clearProps: 'opacity,visibility,transform' });
          try {
            sessionStorage.setItem(INTRO_KEY, '1');
          } catch {
            /* egal */
          }
          setIntroDone(true);
        },
      });
      gsap.set(q('.hero__img'), { scale: 1.6 });
      // Hochformat: Ausschnitt in Fensterform um das CN (x 210–780) legen, sonst schneidet „slice“ C und N am Rand ab
      if (window.innerWidth < window.innerHeight) {
        const h = (640 * window.innerHeight) / window.innerWidth;
        q('.intro__svg')[0]?.setAttribute('viewBox', `175 ${500 - h / 2} 640 ${h}`);
      }
      // Titel, Eyebrow, Lead, CTA, Leiste und Navigation verdeckt bis zu ihrem Auftritt nur CSS (.is-intro / .intro-on).

      // Nur das CN: ruhig aufblenden, kurz stehen, dann quellen die Buchstaben auf und öffnen das Foto
      const swell = full ? 1.05 : 0.75;
      intro
        .set(q('.intro__c'), { visibility: 'visible' })
        .fromTo(q('.intro__c'), { autoAlpha: 0, scale: 0.94, svgOrigin: '500 500' }, { autoAlpha: 1, scale: 1, svgOrigin: '500 500', duration: full ? 0.9 : 0.5, ease: 'power2.out' })
        .fromTo(q('.intro__doors'), { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power3.out' }, '<0.25')
        // Aufquellen statt Durchzoomen: die Kontur wächst, die Buchstaben verschmelzen zum vollen Foto (keine schwarzen Kanten)
        .fromTo(q('.intro__c path'), { attr: { 'stroke-width': 0 } }, { attr: { 'stroke-width': 1500 }, duration: swell, ease: 'power3.inOut' }, full ? '+=0.35' : '+=0.05')
        .fromTo(q('.intro__zoomc'), { scale: 1, svgOrigin: ZOOM_ORIGIN }, { scale: 1.2, svgOrigin: ZOOM_ORIGIN, duration: swell, ease: 'power2.inOut' }, '<')
        .to(q('.hero__img'), { scale: 1.12, duration: swell + 1.2, ease: 'power2.out' }, '<')
        .to(q('.intro__doors'), { autoAlpha: 0, y: -10, duration: 0.3, ease: 'power2.in' }, '<')
        // Am Ende kurz ausblenden, falls in einer Ecke noch ein Rest Schwarz steht
        .to(q('.intro'), { autoAlpha: 0, duration: 0.2, ease: 'power1.in' }, `<${swell - 0.2}`)
        .fromTo(q('.ch'), { y: 0, yPercent: 125, rotate: 9 }, { y: 0, yPercent: 0, rotate: 0, duration: 1.1, stagger: 0.022, ease: 'expo.out', immediateRender: false }, '<-0.2')
        .fromTo(q('.hero__eyebrow > *'), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.06, ease: 'power3.out', immediateRender: false }, '<0.3')
        .fromTo(q('.hero__foot > *'), { autoAlpha: 0, y: 26 }, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.1, ease: 'power3.out', immediateRender: false }, '<0.1')
        .fromTo(q('.hero__bar-in'), { autoAlpha: 0, yPercent: 110 }, { autoAlpha: 1, yPercent: 0, duration: 0.8, ease: 'expo.out', immediateRender: false }, '<0.1');
      if (nav) intro.fromTo(nav, { autoAlpha: 0, y: -30 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out', immediateRender: false }, '<');

      const image = q('.hero__strip img')[0] as HTMLImageElement | undefined;
      const ready = image
        ? Promise.race([
            image.complete ? Promise.resolve() : new Promise<void>((r) => image.addEventListener('load', () => r(), { once: true })),
            new Promise<void>((r) => setTimeout(r, 2500)),
          ])
        : Promise.resolve();
      void ready.then(() => {
        if (!cancelled) intro?.play();
      });
    }, el);

    // Wer während des Intros scrollt, wischt oder klickt, bekommt es im Zeitraffer statt abgebrochen.
    const finish = () => {
      if (intro && intro.progress() < 1 && intro.timeScale() < 6) intro.timeScale(6).play();
    };
    finishRef.current = finish;
    // Wächter mit normalem Timer: läuft auch, wenn requestAnimationFrame steht (Hintergrund-Tab, hängender Browser).
    const watchdog = window.setTimeout(() => {
      if (intro && intro.progress() < 1) intro.progress(1);
    }, 10000);
    const onHide = () => {
      if (document.visibilityState === 'hidden' && intro && intro.progress() < 1) intro.progress(1);
    };
    document.addEventListener('visibilitychange', onHide);
    const opts = { once: true, passive: true } as const;
    window.addEventListener('wheel', finish, opts);
    window.addEventListener('touchmove', finish, opts);
    window.addEventListener('pointerdown', finish, opts);
    window.addEventListener('keydown', finish, { once: true });

    return () => {
      cancelled = true;
      finishRef.current = () => undefined;
      window.clearTimeout(watchdog);
      document.removeEventListener('visibilitychange', onHide);
      document.documentElement.classList.remove('intro-on');
      window.removeEventListener('wheel', finish);
      window.removeEventListener('touchmove', finish);
      window.removeEventListener('pointerdown', finish);
      window.removeEventListener('keydown', finish);
      const nav = document.querySelector('.nav');
      if (nav) gsap.set(nav, { clearProps: 'opacity,visibility,transform' });
      ctx.revert();
    };
  }, []);

  return (
    <>
      <section ref={root} className={`hero hero--${variant}${introDone ? '' : ' is-intro'}`} aria-label="Willkommen">
        <div className="hero__stage">
          <div className="hero__behind" aria-hidden="true">
            {variant === 'blende' && <span className="hero__ring" />}
            <span className="sr-only">{p.behind}</span>
          </div>
          <canvas className="hero__dots" aria-hidden="true" />
          <div className={`hero__strips hero__strips--${variant}`}>
            {Array.from({ length: n }, (_, i) => (
              <div key={`${variant}-${i}`} className="hero__strip" style={{ '--i': i, '--n': n } as React.CSSProperties}>
                <div className="hero__strip-inner">
                  <div className="hero__zoom">
                    <Image className={`hero__img media${img.stock ? ' is-stock' : ''}`} src={asset(img.src)} alt={i === 0 ? img.alt : ''} fill sizes="100vw" priority={i === 0} />
                  </div>
                  <div className="hero__shade" />
                </div>
              </div>
            ))}
            {variant === 'ticket' && (
              <div className="hero__perf" aria-hidden="true">
                <span>Admit one · {p.behind}</span>
              </div>
            )}
          </div>

          <div className="hero__content">
            <p className="hero__eyebrow eyebrow">
              {p.eyebrow.map((e, i) => (
                <span key={e}>
                  {i > 0 && <i aria-hidden="true" />}
                  {e}
                </span>
              ))}
            </p>
            <h1 className={`hero__title${p.sloganIsPlaceholder ? ' ph' : ''}`} data-ph-note={sloganNote} aria-label={slogan.lines.join(' ')}>
              {slogan.lines.map((line, li) => (
                <span key={li} className={`hero__line hero__line--${li}`} aria-hidden="true">
                  {[...line].map((c, ci) => (
                    <span key={ci} className="ch">
                      {c === ' ' ? ' ' : c}
                    </span>
                  ))}
                </span>
              ))}
            </h1>
            <div className="hero__foot">
              <p className="hero__lead">{p.lead}</p>
              <div className="hero__ctas">
                <TicketLink href={p.cta.href} label={p.cta.label} size="lg">
                  {p.cta.label}
                </TicketLink>
              </div>
            </div>
          </div>

          <div className="hero__second" aria-hidden="true">
            <p>
              {slogan.second.map((s, i) => (
                <span key={i} className={i === 0 ? 'accent' : ''}>
                  {s}
                </span>
              ))}
            </p>
          </div>

          <div className="hero__bar">
            <div className="hero__bar-in eyebrow">
              {p.bar.map((b, i) => (
                <span key={b}>
                  {i === 0 && <i className="dot" aria-hidden="true" />}
                  {b}
                </span>
              ))}
              <span className="hero__scroll">Scroll ↓</span>
            </div>
          </div>
        </div>

        {!introDone && (
          <div className="intro" aria-hidden="true">
            <svg className="intro__svg" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice">
              <defs>
                <mask id="intro-mask" maskUnits="userSpaceOnUse" x="-5000" y="-5000" width="11000" height="11000">
                  <rect x="-5000" y="-5000" width="11000" height="11000" fill="white" />
                  <g className="intro__zoomc">
                    <g className="intro__c" style={{ visibility: 'hidden' }}>
                      {CN_PATHS.map((d) => (
                        <path key={d} d={d} fill="black" stroke="black" strokeWidth={0} strokeLinejoin="round" />
                      ))}
                    </g>
                  </g>
                </mask>
              </defs>
              <rect x="-5000" y="-5000" width="11000" height="11000" fill="var(--color-ink)" mask="url(#intro-mask)" />
            </svg>
            <div className="intro__doors">{p.doors}</div>
          </div>
        )}
      </section>
    </>
  );
}
