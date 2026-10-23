import { afterEach, describe, expect, it, vi } from 'vitest';
import { createInstagramFeed, createPlacesReviews, ttlCache } from './index';

afterEach(() => vi.unstubAllGlobals());

describe('Live-Adapter', () => {
  it('ttlCache lädt nur einmal innerhalb der Laufzeit', async () => {
    let n = 0;
    const get = ttlCache(1000, async () => ++n);
    expect(await get()).toBe(1);
    expect(await get()).toBe(1);
  });

  it('Instagram: mappt Medien auf Posts (Video → Thumbnail)', async () => {
    vi.stubGlobal('fetch', async () =>
      new Response(JSON.stringify({ data: [{ id: '1', media_type: 'VIDEO', thumbnail_url: 't.jpg', permalink: 'p', timestamp: '2026-01-01' }] })),
    );
    const f = await createInstagramFeed({ accessToken: 'x', handle: 'cneventagency' }).getFeed();
    expect(f.source).toBe('instagram');
    expect(f.posts[0]).toMatchObject({ image: 't.jpg', kind: 'video' });
  });

  it('Places: max. 5 Rezensionen mit Autor und Link', async () => {
    const reviews = Array.from({ length: 7 }, (_, i) => ({
      name: `r${i}`,
      rating: 5,
      text: { text: 'super' },
      relativePublishTimeDescription: 'vor 1 Woche',
      authorAttribution: { displayName: `A${i}`, uri: 'u' },
      googleMapsUri: 'g',
    }));
    vi.stubGlobal('fetch', async () => new Response(JSON.stringify({ rating: 4.8, userRatingCount: 30, reviews })));
    const s = await createPlacesReviews({ apiKey: 'k', placeId: 'p' }).getSummary();
    expect(s.reviews).toHaveLength(5);
    expect(s.reviews[0]).toMatchObject({ author: 'A0', url: 'g' });
    expect(s.source).toBe('google-places');
  });
});
