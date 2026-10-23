import { gallery, services } from '@c-event/content';
import { GalleryGrid } from '@/components/gallery/GalleryGrid';
import { Split } from '@/components/Split';
import { pageMeta } from '@/lib/seo';

export const metadata = pageMeta({ ...gallery.seo, path: '/galerie', image: 'konfetti-blau-crowd' });

export default function GalleryPage() {
  return (
    <>
      <header className="page-head page-head--ink">
        <span className="eyebrow">{gallery.kicker}</span>
        <Split as="h1" className="page-head__title" text={gallery.h1} />
        <p className="page-head__lead">{gallery.lead}</p>
      </header>
      <section className="sec sec--ink sec--tight">
        <GalleryGrid items={gallery.items} services={services.map((s) => ({ slug: s.slug, name: s.name }))} occasions={gallery.occasions} />
      </section>
    </>
  );
}
