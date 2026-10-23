import type { SocialFeed, SocialFeedService, SocialPost } from '@c-event/core';
import { ttlCache } from './cache';

/**
 * Instagram Graph API („Instagram API with Instagram Login“).
 * Die Basic Display API ist seit 4.12.2024 abgeschaltet – nötig ist ein Business- oder Creator-Account.
 * Token: langlebiges User-Token (60 Tage), vor Ablauf per refreshInstagramToken() verlängern.
 * Siehe docs/UEBERGABE.md, Abschnitt „Social Feed“.
 */
export interface InstagramConfig {
  accessToken: string;
  handle: string;
  /** Cache-Dauer, Standard 30 Minuten */
  ttlMs?: number;
  apiVersion?: string;
}

interface IgMedia {
  id: string;
  caption?: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  media_url?: string;
  thumbnail_url?: string;
  permalink: string;
  timestamp: string;
}

export function createInstagramFeed(cfg: InstagramConfig): SocialFeedService {
  const v = cfg.apiVersion ?? 'v21.0';
  const load = ttlCache(cfg.ttlMs ?? 30 * 60e3, async (): Promise<SocialFeed> => {
    const fields = 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp';
    const url = `https://graph.instagram.com/${v}/me/media?fields=${fields}&limit=12&access_token=${encodeURIComponent(cfg.accessToken)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Instagram API ${res.status}`);
    const json = (await res.json()) as { data: IgMedia[] };
    const posts: SocialPost[] = json.data.map((m) => ({
      id: m.id,
      image: (m.media_type === 'VIDEO' ? m.thumbnail_url : m.media_url) ?? '',
      caption: m.caption ?? '',
      permalink: m.permalink,
      postedAt: m.timestamp,
      kind: m.media_type === 'VIDEO' ? 'video' : m.media_type === 'CAROUSEL_ALBUM' ? 'carousel' : 'image',
    }));
    return { source: 'instagram', handle: cfg.handle, profileUrl: `https://www.instagram.com/${cfg.handle}/`, posts };
  });
  return {
    getFeed: async (limit = 9) => {
      const f = await load();
      return { ...f, posts: f.posts.slice(0, limit) };
    },
  };
}

/** Verlängert ein langlebiges Token um weitere 60 Tage (mind. 24 h alt, noch nicht abgelaufen). */
export async function refreshInstagramToken(token: string): Promise<{ accessToken: string; expiresIn: number }> {
  const res = await fetch(`https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${encodeURIComponent(token)}`);
  if (!res.ok) throw new Error(`Token-Refresh ${res.status}`);
  const j = (await res.json()) as { access_token: string; expires_in: number };
  return { accessToken: j.access_token, expiresIn: j.expires_in };
}
