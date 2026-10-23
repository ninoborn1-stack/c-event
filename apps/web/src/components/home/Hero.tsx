'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { DEFAULT_SETTINGS, HERO_TRANSITIONS, type HeroTransition } from '@c-event/core';
import { getMedia } from '@c-event/content';
import { PhotoRail, type RailItem } from '@/components/media/PhotoRail';
import { TicketLink } from '@/components/ui/Ticket';
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
  countdown: string[];
  doors: string;
  sloganIsPlaceholder: boolean;
  sloganNote?: string;
  behind: string;
  rail: RailItem[];
  railTitle: string;
}

/** „CN“ als Blende (viewBox 1000): C-Ring links, N rechts. Zoom-Ursprung liegt im linken N-Schaft. */
const CN_PATHS = [
  'M 510.2 390.7 A 170 170 0 1 0 510.2 609.3 L 456.6 564.3 A 100 100 0 1 1 456.6 435.7 Z',
  'M 580 330 H 646 L 714 488 V 330 H 780 V 670 H 714 L 646 512 V 670 H 580 Z',
];
const ZOOM_ORIGIN = '613 500';
const INTRO_KEY = 'cev-intro-seen';

/** Stücke, in die das Hero-Bild für den Übergang zerfällt: 1 Bild (Tiefe, Blende), 2 Ticket-Hälften */
const PIECES: Record<HeroTransition, number> = { tiefe: 1, blende: 1, ticket: 2 };
/** Ebenen der 3D-Zahl: hintereinander gestaffelte Kopien ergeben die harte Extrusion */
const DEPTH_LAYERS = 16;

/**
 * Hero als eigenes kleines Event.
 * Ebenen-Regel: Intro und Scroll bewegen NIE dieselbe Eigenschaft am selben Element.
 * Intro: .intro*, .hero__img (scale), .ch, .hero__eyebrow/.hero__foot-Kinder, .hero__bar-in, .nav.
 * Scroll: .hero__zoom (scale), .hero__content, .hero__bar, .hero__second, .hero__strip, .hero__strips (clip/3D), .hero__behind-in.
 * Maus: nur .num3d (Neigung) und dessen Licht-Variablen.
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
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: el, start: 'top top', end: 'bottom bottom', scrub: 0.8, onUpdate: (s) => s.progress > 0.02 && finishRef.current() },
      });
      tl.fromTo(q('.hero__zoom'), { scale: 1 }, { scale: 1.2, duration: 1 }, 0)
        .fromTo(q('.hero__content'), { yPercent: 0, autoAlpha: 1 }, { yPercent: -22, autoAlpha: 0, duration: 0.3, ease: 'power1.in' }, 0)
        .fromTo(q('.hero__bar'), { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.12 }, 0)
        .fromTo(q('.hero__second'), { autoAlpha: 0, y: 90 }, { autoAlpha: 1, y: 0, duration: 0.2, ease: 'power2.out' }, 0.26)
        .fromTo(q('.hero__second'), { autoAlpha: 1, y: 0 }, { autoAlpha: 0, y: -70, duration: 0.12, ease: 'power2.in', immediateRender: false }, 0.54);

      if (variant === 'tiefe') {
        // Tiefe: das Bild kippt nach hinten in den Raum, aus der Tiefe dreht sich die 3D-Zahl einmal um 360° nach vorn
        tl.fromTo(q('.hero__strips'), { rotationX: 0, scale: 1, transformPerspective: 1100, transformOrigin: '50% 100%' }, { rotationX: 68, scale: 0.6, duration: 0.36, ease: 'power2.in' }, 0.56)
          .fromTo(q('.hero__strips'), { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.1, immediateRender: false }, 0.82)
          .fromTo(q('.hero__behind-in'), { scale: 0.12, rotationY: -360 }, { scale: 1, rotationY: 0, duration: 0.42, ease: 'power3.out' }, 0.6);
      } else if (variant === 'blende') {
        // Blende: das Bild schließt sich wie eine Kamerablende zum Kreis, dahinter dreht sich 360° ein
        tl.fromTo(q('.hero__strips'), { clipPath: 'circle(120% at 50% 50%)' }, { clipPath: 'circle(0% at 50% 50%)', duration: 0.34, ease: 'power3.inOut' }, 0.6)
          .fromTo(q('.hero__ring'), { scale: 1.8, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.3, ease: 'power2.out' }, 0.68)
          .fromTo(q('.hero__behind-in'), { scale: 0.5, rotate: -90 }, { scale: 1, rotate: 0, duration: 0.36, ease: 'power3.out' }, 0.64);
      } else {
        // Ticket: das Bild reißt an der Perforation in zwei Hälften auseinander
        const [top, bottom] = q('.hero__strip');
        tl.fromTo(q('.hero__perf'), { autoAlpha: 0, scaleX: 0 }, { autoAlpha: 1, scaleX: 1, duration: 0.08 }, 0.56)
          .fromTo(top!, { yPercent: 0, rotate: 0 }, { yPercent: -105, rotate: -3, duration: 0.3, ease: 'power3.in' }, 0.64)
          .fromTo(bottom!, { yPercent: 0, rotate: 0 }, { yPercent: 105, rotate: 2, duration: 0.3, ease: 'power3.in' }, 0.64)
          .fromTo(q('.hero__perf'), { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.06, immediateRender: false }, 0.66)
          .fromTo(q('.hero__behind-in'), { scale: 0.8, yPercent: 20 }, { scale: 1, yPercent: 0, duration: 0.34, ease: 'power3.out' }, 0.66);
      }
    }, el);
    return () => ctx.revert();
  }, [variant]);

  // ---------- 3D-ZAHL: folgt der Maus, auf Touch-Geräten schwingt sie langsam ----------
  useEffect(() => {
    const el = root.current;
    const num = el?.querySelector<HTMLElement>('.num3d');
    if (!el || !num || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const rx = gsap.quickTo(num, 'rotationX', { duration: 0.9, ease: 'power3.out' });
      const ry = gsap.quickTo(num, 'rotationY', { duration: 0.9, ease: 'power3.out' });
      if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        const move = (e: PointerEvent) => {
          const x = e.clientX / window.innerWidth - 0.5;
          const y = e.clientY / window.innerHeight - 0.5;
          rx(y * -34);
          ry(x * 46);
          num.style.setProperty('--gx', `${(x + 0.5) * 100}%`);
          num.style.setProperty('--gy', `${(y + 0.5) * 100}%`);
        };
        window.addEventListener('pointermove', move, { passive: true });
        return () => window.removeEventListener('pointermove', move);
      }
      gsap.fromTo(num, { rotationY: -22, rotationX: 8 }, { rotationY: 22, rotationX: -8, duration: 3.2, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    }, el);
    return () => ctx.revert();
  }, []);

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
      const counter = { v: 0 };
      const loadNum = q('.intro__load b')[0];
      gsap.set(q('.hero__img'), { scale: 1.6 });
      // Titel, Eyebrow, Lead, CTA, Leiste und Navigation verdeckt bis zu ihrem Auftritt nur CSS (.is-intro / .intro-on).

      if (full) {
        intro.to(counter, {
          v: 100,
          duration: 0.7,
          ease: 'power2.inOut',
          onUpdate: () => {
            if (loadNum) loadNum.textContent = String(Math.round(counter.v)).padStart(2, '0');
          },
        });
        intro.to(q('.intro__load'), { autoAlpha: 0, duration: 0.15 });
        q('.intro__digit').forEach((c, i, all) => {
          intro!
            .fromTo(c, { scale: 2.2, autoAlpha: 0, svgOrigin: '50 50' }, { scale: 1, autoAlpha: 1, svgOrigin: '50 50', duration: 0.2, ease: 'expo.out' })
            .to(c, { scale: i === all.length - 1 ? 6 : 0.7, autoAlpha: 0, duration: 0.14, ease: 'power2.in' }, '+=0.08');
        });
        intro.fromTo(q('.intro__flash'), { opacity: 0 }, { opacity: 0.85, duration: 0.05 }, '-=0.08').to(q('.intro__flash'), { opacity: 0, duration: 0.4 });
      } else {
        intro.set(q('.intro__load'), { autoAlpha: 0 });
      }
      intro
        .set(q('.intro__c'), { visibility: 'visible' }, full ? '-=0.4' : 0)
        .fromTo(q('.intro__c'), { scale: 0.001, rotation: -160, svgOrigin: '500 500' }, { scale: 1, rotation: 0, svgOrigin: '500 500', duration: full ? 0.8 : 0.55, ease: 'expo.out' }, '<')
        .fromTo(q('.intro__doors'), { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power3.out' }, '<0.15')
        .fromTo(q('.intro__zoomc'), { scale: 1, svgOrigin: ZOOM_ORIGIN }, { scale: 90, svgOrigin: ZOOM_ORIGIN, duration: full ? 1.05 : 0.8, ease: 'expo.in' }, full ? '+=0.25' : '+=0.05')
        .to(q('.intro__doors'), { autoAlpha: 0, scale: 1.4, duration: 0.3, ease: 'power2.in' }, '<')
        .to(q('.hero__img'), { scale: 1.12, duration: 2, ease: 'expo.out' }, '<0.55')
        .set(q('.intro'), { autoAlpha: 0 }, '<0.5')
        .fromTo(q('.ch'), { yPercent: 125, rotate: 9 }, { yPercent: 0, rotate: 0, duration: 1.1, stagger: 0.022, ease: 'expo.out', immediateRender: false }, '<0.05')
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
            <div className="hero__behind-in">
              <div className="num3d">
                {Array.from({ length: DEPTH_LAYERS }, (_, i) => (
                  <span key={i} className="num3d__layer" style={{ '--l': DEPTH_LAYERS - i } as React.CSSProperties}>
                    {p.behind}
                  </span>
                ))}
                <span className="num3d__face">{p.behind}</span>
              </div>
            </div>
          </div>
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
                        <path key={d} d={d} fill="black" />
                      ))}
                    </g>
                  </g>
                </mask>
              </defs>
              <rect x="-5000" y="-5000" width="11000" height="11000" fill="var(--color-ink)" mask="url(#intro-mask)" />
            </svg>
            {/* Als SVG-Text: sonst wertet Lighthouse die Countdown-Ziffern als „größtes Element“ (LCP) */}
            <svg className="intro__count" viewBox="0 0 100 100" aria-hidden="true">
              {p.countdown.map((c) => (
                <text key={c} x="50" y="50" textAnchor="middle" dominantBaseline="central" className="intro__digit">
                  {c}
                </text>
              ))}
            </svg>
            <div className="intro__doors">{p.doors}</div>
            <div className="intro__load eyebrow">
              Einlass <b>00</b>%
            </div>
            <div className="intro__flash" />
          </div>
        )}
      </section>
      <PhotoRail items={p.rail} title={p.railTitle} />
    </>
  );
}
