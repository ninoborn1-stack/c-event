'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getLenis, prefersReducedMotion, ScrollTrigger } from '@/lib/motion';
import { BASE_PATH } from '@/lib/env';

const CLOSE_MS = 680;

/**
 * Vorhang-Übergang zwischen Seiten (Vorbild Bunker West), angepasst an den App Router:
 * Klick abfangen → Vorhang fällt (is-leaving) → router.push → neue Seite → Vorhang öffnet sich (is-entering).
 */
export function Curtain() {
  const router = useRouter();
  const pathname = usePathname();
  const [label, setLabel] = useState('');
  const [act, setAct] = useState('');
  const leaving = useRef(false);
  const fallback = useRef<number>(0);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const root = document.documentElement;
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      const a = (e.target as Element | null)?.closest?.('a');
      if (!a || a.target === '_blank' || a.hasAttribute('download') || 'noCurtain' in a.dataset) return;
      const href = a.getAttribute('href') ?? '';
      if (/^(#|mailto:|tel:)/.test(href)) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin) return;
      if (url.pathname === location.pathname) return; // nur Query/Anker geändert: normal navigieren
      if (url.pathname.startsWith('/api') || /\.[a-z0-9]+$/i.test(url.pathname)) return;
      e.preventDefault();
      e.stopPropagation();
      const text = (a.dataset.label || a.textContent || '').replace(/\s+/g, ' ').replace('→', '').trim().slice(0, 26);
      setLabel(text);
      const shown = url.pathname.replace(BASE_PATH, '') || '/';
      setAct(shown === '/' ? 'Main Stage' : `Next up · ${shown.split('/').filter(Boolean).join(' / ')}`);
      root.classList.remove('is-entering');
      void root.offsetWidth;
      root.classList.add('is-leaving');
      leaving.current = true;
      // a.href enthält den basePath, router.push setzt ihn selbst davor.
      const path = BASE_PATH && url.pathname.startsWith(BASE_PATH) ? url.pathname.slice(BASE_PATH.length) || '/' : url.pathname;
      window.setTimeout(() => router.push(path + url.search + url.hash, { scroll: false }), CLOSE_MS);
      window.clearTimeout(fallback.current);
      fallback.current = window.setTimeout(() => {
        if (leaving.current) {
          leaving.current = false;
          root.classList.remove('is-leaving');
        }
      }, 6000);
    };
    const onEnd = (e: AnimationEvent) => {
      if (e.animationName === 'curtainOut') root.classList.remove('is-entering');
    };
    document.addEventListener('click', onClick, true);
    root.addEventListener('animationend', onEnd);
    return () => {
      document.removeEventListener('click', onClick, true);
      root.removeEventListener('animationend', onEnd);
    };
  }, [router]);

  useEffect(() => {
    if (!leaving.current) return;
    leaving.current = false;
    const root = document.documentElement;
    getLenis()?.scrollTo(0, { immediate: true, force: true });
    window.scrollTo(0, 0);
    requestAnimationFrame(() => {
      root.classList.remove('is-leaving');
      root.classList.add('is-entering');
      ScrollTrigger.refresh();
    });
  }, [pathname]);

  return (
    <div className="curtain" aria-hidden="true">
      {[0, 1, 2, 3, 4].map((i) => (
        <i key={i} style={{ '--i': i } as React.CSSProperties} />
      ))}
      <div className="curtain__label">
        <small>{act}</small>
        <span>{label}</span>
      </div>
    </div>
  );
}
