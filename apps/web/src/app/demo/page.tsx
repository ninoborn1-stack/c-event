import Link from 'next/link';
import { asset } from '@/lib/env';

/** Alte Adresse aus der ersten Demo: Das Cockpit ist jetzt Teil von /admin (Tab „Demo“). */
export const metadata = { title: 'Weiterleitung', robots: { index: false } };

export default function OldCockpit() {
  return (
    <section className="page-head page-head--small">
      <meta httpEquiv="refresh" content={`0;url=${asset('/admin')}`} />
      <p className="page-head__lead">
        Das Demo-Cockpit ist jetzt im <Link href="/admin">Admin-Bereich</Link>.
      </p>
    </section>
  );
}
