import type { ReviewSummary } from '@c-event/core';
import { home } from '@c-event/content';

function Stars({ value }: { value: number }) {
  return (
    <span className="stars" role="img" aria-label={`${value.toLocaleString('de-DE')} von 5 Sternen`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <i key={i} className={i <= Math.round(value) ? 'on' : ''} aria-hidden="true">
          ★
        </i>
      ))}
    </span>
  );
}

/**
 * Google-Rezensionen: Durchschnitt, Anzahl, Link „Alle Bewertungen“, Autor + Link je Rezension.
 * Demo-Daten sind sichtbar als Demo markiert; im Live-Modus kommen nur echte Daten (services-live).
 */
export function Reviews({ data, limit = 3 }: { data: ReviewSummary; limit?: number }) {
  const isDemo = data.source === 'demo';
  return (
    <div className={`reviews${isDemo ? ' reviews--demo' : ''}`}>
      <div className="reviews__score">
        <strong>{data.rating.toLocaleString('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</strong>
        <Stars value={data.rating} />
        <span>
          {data.count} {home.voices.reviewsOf} · Google
        </span>
        {isDemo && <span className="badge">Demo</span>}
        <a href={data.allUrl} target="_blank" rel="noopener noreferrer" className="reviews__all">
          {home.voices.allReviews} ↗
        </a>
      </div>
      <ul className="reviews__list">
        {data.reviews.slice(0, limit).map((r) => (
          <li key={r.id}>
            <Stars value={r.rating} />
            <blockquote>„{r.text}“</blockquote>
            <p className="reviews__by">
              {r.authorUrl ? (
                <a href={r.authorUrl} target="_blank" rel="noopener noreferrer">
                  {r.author}
                </a>
              ) : (
                r.author
              )}{' '}
              · {r.when}
              {r.url && (
                <>
                  {' '}
                  ·{' '}
                  <a href={r.url} target="_blank" rel="noopener noreferrer">
                    Original
                  </a>
                </>
              )}
            </p>
          </li>
        ))}
      </ul>
      {data.notice && <p className="reviews__notice">{data.notice}</p>}
    </div>
  );
}
