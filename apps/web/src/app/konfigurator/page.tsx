import { catalog, configuratorPage } from '@c-event/content';
import { PackageCard } from '@/components/catalog/ItemCard';
import { Configurator } from '@/components/catalog/Configurator';
import { Split } from '@/components/Split';
import { pageMeta } from '@/lib/seo';
import { getSettings } from '@/server/services';

export const metadata = pageMeta({ ...configuratorPage.seo, path: '/konfigurator', image: 'bar-lichter' });

export default async function ConfiguratorPage() {
  const settings = await getSettings();
  return (
    <>
      <header className="page-head page-head--ink">
        <span className="micro">
          <i className="live-dot" /> {configuratorPage.kicker}
        </span>
        <Split as="h1" className="page-head__title" text={configuratorPage.h1} />
        <p className="page-head__lead" data-reveal="up">
          {configuratorPage.lead}
        </p>
      </header>
      <section className="sec sec--night sec--tight">
        <Split as="h2" className="display-m" text={configuratorPage.packagesTitle} />
        <div className="pkgs">
          {catalog.packages.map((p, i) => (
            <PackageCard key={p.id} pkg={p} index={i} showPrices={settings.showPrices} />
          ))}
        </div>
      </section>
      <section className="sec sec--cream sec--tight">
        <Configurator showPrices={settings.showPrices} />
      </section>
    </>
  );
}
