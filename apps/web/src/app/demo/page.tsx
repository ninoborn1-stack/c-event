import { notFound } from 'next/navigation';
import { val } from '@c-event/core';
import { brand } from '@c-event/content';
import { Cockpit } from '@/components/demo/Cockpit';
import { IS_DEMO } from '@/lib/env';

export const metadata = { title: 'Demo-Cockpit', robots: { index: false, follow: false } };

export default function DemoPage() {
  if (!IS_DEMO) notFound();
  return (
    <section className="demo-page">
      <header className="page-head page-head--ink page-head--small">
        <span className="micro">
          <i className="live-dot" /> Nur im Demo-Modus · DATA_MODE=demo
        </span>
        <h1 className="page-head__title">Demo-Cockpit</h1>
        <p className="page-head__lead">Postfach, Anfragen, Kalender, Einstellungen und alle offenen Platzhalter an einem Ort.</p>
      </header>
      <Cockpit slogans={val(brand.slogans).map((s) => s.lines.join(' '))} />
    </section>
  );
}
