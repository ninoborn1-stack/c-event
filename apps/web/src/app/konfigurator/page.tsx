import Link from 'next/link';
import { shop } from '@c-event/content';
import { asset } from '@/lib/env';

/** Alte Adresse aus der ersten Demo: leitet auf den Shop weiter. */
export const metadata = { title: 'Weiterleitung', robots: { index: false } };

export default function OldConfigurator() {
  return (
    <section className="page-head page-head--small">
      <meta httpEquiv="refresh" content={`0;url=${asset(shop.path)}`} />
      <p className="page-head__lead">
        Der Konfigurator heißt jetzt <Link href={shop.path}>Shop</Link>.
      </p>
    </section>
  );
}
