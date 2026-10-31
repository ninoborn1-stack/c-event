import { gallery, services } from '@c-event/content';
import { GalleryGrid } from '@/components/gallery/GalleryGrid';
import { Split } from '@/components/Split';
import { pageMeta } from '@/lib/seo';

export const metadata = pageMeta({ ...gallery.seo, path: '/galerie', image: 'konfetti-blau-crowd' });

export default function GalleryPage() {
  return (
    <>
      <header className="poster-head poster-head--light">
        <span className="eyebrow eyebrow--sq">{gallery.kicker}</span>
        <Split as="h1" className="poster-head__title" text={gallery.h1} />
        <div className="poster-head__foot">
          <p className="page-head__lead">{gallery.lead}</p>
          <span className="poster-head__count mono">
            <b>{String(gallery.items.length).padStart(2, '0')}</b> {gallery.countLabel}
          </span>
        </div>
      </header>
      <section className="sec sec--ink sec--tight">
        <GalleryGrid items={gallery.items} services={services.map((s) => ({ slug: s.slug, name: s.name }))} occasions={gallery.occasions} />
      </section>
    </>
  );
}
