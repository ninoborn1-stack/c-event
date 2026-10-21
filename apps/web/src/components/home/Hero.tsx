'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { getMedia } from '@c-event/content';
import { gsap, prefersReducedMotion } from '@/lib/motion';

interface HeroProps {
  mediaId: string;
  lines: string[];
  second: string[];
  eyebrow: string[];
  lead: string;
  cta: { label: string; href: string };
  ctaSecondary: { label: string; href: string };
  bar: string[];
  countdown: string[];
  doors: string;
  sloganIsPlaceholder: boolean;
  sloganNote?: string;
  behind: string;
}

const STRIPS = [0, 1, 2, 3, 4];
/** „C“ als Ring mit Öffnung nach rechts, Mittelpunkt 500/500 (viewBox 1000). */
const C_PATH = 'M 668.5 358.6 A 220 220 0 1 0 668.5 641.4 L 599.6 583.6 A 130 130 0 1 1 599.6 416.4 Z';
const INTRO_KEY = 'cev-intro-seen';

/**
 * Hero als eigenes kleines Event.
 * Ebenen-Regel (aus dem Lohnia-Konzept übernommen): Intro und Scroll bewegen NIE dieselbe Eigenschaft
 * am selben Element. Intro: .intro*, .hero__img (scale), .ch, .hero__eyebrow/.hero__foot-Kinder, .hero__bar-in, .nav.
 * Scroll: .hero__zoom (scale), .hero__content, .hero__bar, .hero__second, .hero__strip, .hero__behind-in.
 * Der CSS-Grundzustand ist immer der fertige Zustand.
 */
export function Hero(p: HeroProps) {
  const root = useRef<HTMLElement>(null);
  const [introDone, setIntroDone] = useState(false);
  const img = getMedia(p.mediaId);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    // Reduzierte Bewegung: CSS blendet .intro aus, der Hero steht im fertigen Zustand.
    if (prefersReducedMotion()) return;
    const q = gsap.utils.selector(el);
    let intro: gsap.core.Timeline | null = null;
    let cancelled = false;

    const ctx = gsap.context(() => {
      const small = window.innerWidth < 761;
      // ---------- SCROLL ----------
      const scroll = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: el,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.8,
          onUpdate: (s) => s.progress > 0.02 && finish(),
        },
      });
      scroll
        .fromTo(q('.hero__zoom'), { scale: 1 }, { scale: 1.22, duration: 1 }, 0)
        .fromTo(q('.hero__content'), { yPercent: 0, autoAlpha: 1 }, { yPercent: -22, autoAlpha: 0, duration: 0.3, ease: 'power1.in' }, 0)
        .fromTo(q('.hero__bar'), { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.12 }, 0)
        .fromTo(q('.hero__second'), { autoAlpha: 0, y: 90 }, { autoAlpha: 1, y: 0, duration: 0.2, ease: 'power2.out' }, 0.28)
        .fromTo(
          q('.hero__second'),
          { autoAlpha: 1, y: 0 },
          { autoAlpha: 0, y: -70, duration: 0.12, ease: 'power2.in', immediateRender: false },
          0.58,
        )
        .fromTo(q('.hero__behind-in'), { scale: 1.5 }, { scale: 1, duration: 0.4, ease: 'power2.out' }, 0.6);
      q('.hero__strip').forEach((s, i) => {
        const order = small ? i : [2, 1, 3, 0, 4][i]!;
        scroll.fromTo(s, { yPercent: 0 }, { yPercent: -101, duration: 0.24, ease: 'power3.in' }, 0.62 + order * 0.045);
      });

      // ---------- INTRO ----------
      const seen = (() => {
        try {
          return sessionStorage.getItem(INTRO_KEY) === '1';
        } catch {
          return false;
        }
      })();
      if (location.hash) {
        setIntroDone(true);
        return;
      }
      window.scrollTo(0, 0);
      const full = !seen;
      const introTargets = '.intro, .intro__c, .intro__zoomc, .ch, .hero__eyebrow > *, .hero__foot > *, .hero__bar-in';
      const nav = document.querySelector('.nav');
      intro = gsap.timeline({
        paused: true,
        onComplete: () => {
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
      if (nav) gsap.set(nav, { autoAlpha: 0, y: -30 });

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
        q('.intro__count span').forEach((n, i, all) => {
          intro!
            .fromTo(n, { scale: 2.2, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.2, ease: 'expo.out' })
            .to(n, { scale: i === all.length - 1 ? 6 : 0.7, autoAlpha: 0, duration: 0.14, ease: 'power2.in' }, '+=0.08');
        });
        intro.fromTo(q('.intro__flash'), { opacity: 0 }, { opacity: 0.85, duration: 0.05 }, '-=0.08').to(q('.intro__flash'), { opacity: 0, duration: 0.4 });
      } else {
        intro.set(q('.intro__load'), { autoAlpha: 0 });
      }
      intro
        .set(q('.intro__c'), { visibility: 'visible' }, full ? '-=0.4' : 0)
        .fromTo(
          q('.intro__c'),
          { scale: 0.001, rotation: -160, svgOrigin: '500 500' },
          { scale: 1, rotation: 0, svgOrigin: '500 500', duration: full ? 0.8 : 0.55, ease: 'expo.out' },
          '<',
        )
        .fromTo(q('.intro__doors'), { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power3.out' }, '<0.15')
        .fromTo(
          q('.intro__zoomc'),
          { scale: 1, svgOrigin: '325 500' },
          { scale: 90, svgOrigin: '325 500', duration: full ? 1.05 : 0.8, ease: 'expo.in' },
          full ? '+=0.25' : '+=0.05',
        )
        .to(q('.intro__doors'), { autoAlpha: 0, scale: 1.4, duration: 0.3, ease: 'power2.in' }, '<')
        .to(q('.hero__img'), { scale: 1.12, duration: 2, ease: 'expo.out' }, '<0.55')
        .set(q('.intro'), { autoAlpha: 0 }, '<0.5')
        .fromTo(q('.ch'), { yPercent: 125, rotate: 9 }, { yPercent: 0, rotate: 0, duration: 1.1, stagger: 0.022, ease: 'expo.out' }, '<0.05')
        .fromTo(q('.hero__eyebrow > *'), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.06, ease: 'power3.out' }, '<0.3')
        .fromTo(q('.hero__foot > *'), { autoAlpha: 0, y: 26 }, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.1, ease: 'power3.out' }, '<0.1')
        .fromTo(q('.hero__bar-in'), { yPercent: 110 }, { yPercent: 0, duration: 0.8, ease: 'expo.out' }, '<0.1');
      if (nav) intro.to(nav, { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '<');

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
    function finish() {
      if (intro && intro.progress() < 1 && intro.timeScale() < 6) intro.timeScale(6).play();
    }
    const opts = { once: true, passive: true } as const;
    window.addEventListener('wheel', finish, opts);
    window.addEventListener('touchmove', finish, opts);
    window.addEventListener('pointerdown', finish, opts);
    window.addEventListener('keydown', finish, { once: true });

    return () => {
      cancelled = true;
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
    <section ref={root} className="hero" aria-label="Willkommen">
      <div className="hero__stage">
        <div className="hero__behind" aria-hidden="true">
          <span className="hero__behind-in">{p.behind}</span>
        </div>
        <div className="hero__strips">
          {STRIPS.map((i) => (
            <div key={i} className="hero__strip" style={{ '--i': i } as React.CSSProperties}>
              <div className="hero__strip-inner">
                <div className="hero__zoom">
                  <Image
                    className={`hero__img media${img.stock ? ' is-stock' : ''}`}
                    src={img.src}
                    alt={i === 0 ? img.alt : ''}
                    fill
                    sizes="100vw"
                    priority={i === 0}
                    quality={75}
                  />
                </div>
                <div className="hero__shade" />
              </div>
            </div>
          ))}
        </div>

        <div className="hero__content">
          <p className="hero__eyebrow micro">
            {p.eyebrow.map((e, i) => (
              <span key={e}>
                {i > 0 && <i aria-hidden="true" />}
                {e}
              </span>
            ))}
          </p>
          <h1
            className={`hero__title${p.sloganIsPlaceholder ? ' ph' : ''}`}
            data-ph-note={p.sloganNote}
            aria-label={p.lines.join(' ')}
          >
            {p.lines.map((line, li) => (
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
              <Link href={p.cta.href} className="btn btn--signal btn--xl" data-label="Booking" data-cursor="Los">
                <span className="btn__text">{p.cta.label}</span>
                <span className="btn__arrow">→</span>
              </Link>
              <Link href={p.ctaSecondary.href} className="btn btn--ghost" data-label="Konfigurator">
                <span className="btn__text">{p.ctaSecondary.label}</span>
                <span className="btn__arrow">→</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="hero__second" aria-hidden="true">
          <p>
            {p.second.map((s, i) => (
              <span key={i} className={i === 0 ? 'serif' : ''}>
                {s}
              </span>
            ))}
          </p>
        </div>

        <div className="hero__bar">
          <div className="hero__bar-in micro">
            {p.bar.map((b, i) => (
              <span key={b}>
                {i === 0 && <i className="live-dot" aria-hidden="true" />}
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
                  <path className="intro__c" d={C_PATH} fill="black" style={{ visibility: 'hidden' }} />
                </g>
              </mask>
            </defs>
            <rect x="-5000" y="-5000" width="11000" height="11000" fill="var(--color-ink)" mask="url(#intro-mask)" />
          </svg>
          <div className="intro__count">
            {p.countdown.map((n) => (
              <span key={n}>{n}</span>
            ))}
          </div>
          <div className="intro__doors">{p.doors}</div>
          <div className="intro__load micro">
            Einlass <b>00</b>%
          </div>
          <div className="intro__flash" />
        </div>
      )}
    </section>
  );
}
