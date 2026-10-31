import { Suspense } from 'react';
import { catalog, shopPage } from '@c-event/content';
import { PackageCard } from '@/components/shop/ProductCard';
import { ShopBrowser } from '@/components/shop/ShopBrowser';
import { PageHero } from '@/components/layout/PageHero';
import { pageMeta } from '@/lib/seo';

export const metadata = pageMeta({ ...shopPage.seo, path: '/shop', image: 'bar-lichter' });

export default function ShopPage() {
  return (
    <>
      <PageHero media="bar-lichter" kicker={shopPage.kicker} title={shopPage.h1} lead={shopPage.lead} />
      <section className="sec sec--tight">
        <h2 className="h-m">{shopPage.packagesTitle}</h2>
        <div className="products products--pkgs">
          {catalog.packages.map((p, i) => (
            <PackageCard key={p.id} pkg={p} index={i} />
          ))}
        </div>
      </section>
      <section className="sec sec--cream sec--tight" id="artikel">
        <h2 className="h-m">{shopPage.itemsTitle}</h2>
        <Suspense fallback={null}>
          <ShopBrowser />
        </Suspense>
      </section>
    </>
  );
}
