import { arcade, inquiryHref } from '@c-event/content';
import { Cabinet } from '@/components/arcade/Cabinet';
import { Btn } from '@/components/Btn';
import { Split } from '@/components/Split';
import { pageMeta } from '@/lib/seo';

export const metadata = pageMeta({ ...arcade.seo, path: '/arcade', image: 'dj-mixer' });

export default function ArcadePage() {
  return (
    <>
      <header className="page-head page-head--ink arcade-head">
        <span className="micro">
          <i className="live-dot" /> {arcade.kicker}
        </span>
        <Split as="h1" className="page-head__title" text={arcade.h1} />
        <p className="page-head__lead">{arcade.lead}</p>
      </header>
      <section className="arcade">
        {arcade.games.map((g) => (
          <Cabinet key={g.id} copy={{ ...g, ...arcade.ui }} />
        ))}
      </section>
      <section className="arcade-outro">
        <h2 className="display-l">{arcade.outro.title}</h2>
        <Btn href={inquiryHref()} variant="signal" label="Booking">
          {arcade.outro.cta}
        </Btn>
      </section>
    </>
  );
}
