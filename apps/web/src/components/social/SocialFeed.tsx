import { getMedia, home } from '@c-event/content';
import type { SocialFeed as Feed } from '@c-event/core';
import { Media } from '@/components/Media';
import { TicketLink } from '@/components/ui/Ticket';

/** Kompakter Instagram-Feed (eine Reihe, wischbar) – der Account hat erst ~12 Beiträge, deshalb kein großes Raster. */
export function SocialFeed({ feed }: { feed: Feed }) {
  const isDemo = feed.source === 'demo';
  return (
    <div className="feed">
      <div className="feed__head">
        <span className="eyebrow">
          {home.voices.feedTitle} · @{feed.handle}
          {isDemo && <span className="badge">Demo</span>}
        </span>
        <TicketLink href={feed.profileUrl} external tone="outline" size="sm">
          {home.voices.follow}
        </TicketLink>
      </div>
      <ul className="feed__row" data-lenis-prevent>
        {feed.posts.map((p) => {
          const local = isDemo || !/^https?:/.test(p.image);
          return (
            <li key={p.id}>
              <a href={p.permalink} target="_blank" rel="noopener noreferrer" className="feed__post" aria-label={p.caption || 'Instagram-Beitrag'}>
                {local ? (
                  <Media id={p.image} sizes="240px" />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.image} alt={p.caption} loading="lazy" />
                )}
                {p.kind !== 'image' && <span className="feed__kind">{p.kind === 'video' ? '▶' : '❐'}</span>}
                <span className="feed__cap">{p.caption || getMedia(p.image).alt}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
