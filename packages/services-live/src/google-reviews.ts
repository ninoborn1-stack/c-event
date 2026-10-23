import type { Review, ReviewSummary, ReviewsService } from '@c-event/core';
import { ttlCache } from './cache';

/**
 * Google Places API (New): maximal 5 Rezensionen.
 * Regeln: Autor nennen, Link zur Originalrezension, Hinweis auf Sortierung. Inhalte NICHT speichern –
 * deshalb hier bewusst kein Cache, gespeichert wird nur die Place-ID (in der Config).
 */
export interface PlacesConfig {
  apiKey: string;
  placeId: string;
}

interface PlacesReview {
  name: string;
  rating: number;
  text?: { text: string };
  originalText?: { text: string };
  relativePublishTimeDescription: string;
  authorAttribution: { displayName: string; uri?: string };
  googleMapsUri?: string;
}

export function createPlacesReviews(cfg: PlacesConfig): ReviewsService {
  return {
    async getSummary(): Promise<ReviewSummary> {
      const res = await fetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(cfg.placeId)}`, {
        headers: {
          'X-Goog-Api-Key': cfg.apiKey,
          'X-Goog-FieldMask': 'rating,userRatingCount,reviews,googleMapsUri',
          'Accept-Language': 'de',
        },
        cache: 'no-store',
      });
      if (!res.ok) throw new Error(`Places API ${res.status}`);
      const p = (await res.json()) as { rating?: number; userRatingCount?: number; reviews?: PlacesReview[]; googleMapsUri?: string };
      const reviews: Review[] = (p.reviews ?? []).slice(0, 5).map((r) => ({
        id: r.name,
        author: r.authorAttribution.displayName,
        authorUrl: r.authorAttribution.uri,
        rating: r.rating,
        text: r.text?.text ?? r.originalText?.text ?? '',
        when: r.relativePublishTimeDescription,
        url: r.googleMapsUri,
      }));
      return {
        source: 'google-places',
        rating: p.rating ?? 0,
        count: p.userRatingCount ?? 0,
        reviews,
        allUrl: p.googleMapsUri ?? `https://www.google.com/maps/place/?q=place_id:${cfg.placeId}`,
        notice: 'Auswahl von Google („relevanteste“ Rezensionen), max. 5.',
      };
    },
  };
}

/**
 * Google Business Profile API: alle Rezensionen, braucht die OAuth-Freigabe des verifizierten Inhabers.
 * Ablauf: einmalig OAuth (Scope business.manage) → Refresh-Token sicher speichern → hier Access-Token holen.
 */
export interface BusinessProfileConfig {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
  accountId: string;
  locationId: string;
  mapsUrl: string;
  ttlMs?: number;
}

const STARS: Record<string, number> = { ONE: 1, TWO: 2, THREE: 3, FOUR: 4, FIVE: 5 };

export function createBusinessProfileReviews(cfg: BusinessProfileConfig): ReviewsService {
  const token = async () => {
    const res = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ client_id: cfg.clientId, client_secret: cfg.clientSecret, refresh_token: cfg.refreshToken, grant_type: 'refresh_token' }),
    });
    if (!res.ok) throw new Error(`OAuth ${res.status}`);
    return ((await res.json()) as { access_token: string }).access_token;
  };
  const load = ttlCache(cfg.ttlMs ?? 60 * 60e3, async (): Promise<ReviewSummary> => {
    const at = await token();
    const res = await fetch(`https://mybusiness.googleapis.com/v4/accounts/${cfg.accountId}/locations/${cfg.locationId}/reviews?pageSize=50`, {
      headers: { Authorization: `Bearer ${at}` },
    });
    if (!res.ok) throw new Error(`Business Profile API ${res.status}`);
    const j = (await res.json()) as {
      averageRating?: number;
      totalReviewCount?: number;
      reviews?: { reviewId: string; reviewer: { displayName: string }; starRating: string; comment?: string; createTime: string }[];
    };
    return {
      source: 'google-business',
      rating: j.averageRating ?? 0,
      count: j.totalReviewCount ?? 0,
      allUrl: cfg.mapsUrl,
      reviews: (j.reviews ?? []).map((r) => ({
        id: r.reviewId,
        author: r.reviewer.displayName,
        rating: STARS[r.starRating] ?? 0,
        text: r.comment ?? '',
        when: new Date(r.createTime).toLocaleDateString('de-DE', { month: 'long', year: 'numeric' }),
        url: cfg.mapsUrl,
      })),
    };
  });
  return { getSummary: load };
}
