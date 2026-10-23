import { Suspense } from 'react';
import { catalog, shopPage } from '@c-event/content';
import { PackageCard } from '@/components/shop/ProductCard';
import { ShopBrowser } from '@/components/shop/ShopBrowser';
import { Split } from '@/components/Split';
import { pageMeta } from '@/lib/seo';

export const metadata = pageMeta({ ...shopPage.seo, path: '/shop', image: 'bar-lichter' });

export default function ShopPage() {
  return (
    <>
      <header className="page-head">
        <span className="eyebrow">{shopPage.kicker}</span>
        <Split as="h1" className="page-head__title" text={shopPage.h1} />
        <p className="page-head__lead">{shopPage.lead}</p>
      </header>
      <section className="sec sec--tight">
        <h2 className="h-m">{shopPage.packagesTitle}</h2>
        <div className="products products--pkgs">
          {catalog.packages.map((p, i) => (
            <PackageCard key={p.id} pkg={p} index={i} />
          ))}
        </div>
      </section>
      <section className="sec sec--cream sec--tight">
        <h2 className="h-m">{shopPage.itemsTitle}</h2>
        <Suspense fallback={null}>
          <ShopBrowser />
        </Suspense>
      </section>
    </>
  );
}
