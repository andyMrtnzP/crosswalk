import { useEffect, useState } from 'react';
import useAuth from '@/hooks/useAuth';
import { buildAuthParams } from '@/lib/auth';
import { getAlbumMetadata, getArtistMetadata, getPlaylistMetadata } from '@/lib/utils';
import { getRecentlyPlayed, type RecentlyPlayedItem } from '@/lib/crosswalkApi';
import type {
  AlbumDetailResponse,
  ArtistDetailResponse,
  AuthCredentials,
  PlaylistDetailResponse,
  SubsonicEnvelope,
} from '@/@types/types';

export type RecentlyPlayedCard = {
  key: string;
  type: RecentlyPlayedItem['type'];
  id: string;
  title: string;
  coverArt?: string;
  meta?: string;
  to?: string;
  variant: 'default' | 'artist';
};

async function fetchSubsonic<T>(
  url: string,
  params: Record<string, string>,
  credentials: AuthCredentials
): Promise<T> {
  const search = buildAuthParams(credentials.username, credentials.password);
  search.set('f', 'json');
  Object.entries(params).forEach(([key, value]) => search.append(key, value));

  const response = await fetch(`${url}?${search.toString()}`);
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}.`);
  }
  const payload = (await response.json()) as T;
  const subsonic = (payload as SubsonicEnvelope)['subsonic-response'];
  if (subsonic?.status === 'failed') {
    throw new Error(subsonic.error?.message ?? 'Navidrome returned an error.');
  }
  return payload;
}

async function resolveItem(
  item: RecentlyPlayedItem,
  credentials: AuthCredentials
): Promise<RecentlyPlayedCard | null> {
  const key = `${item.type}:${item.id}`;

  try {
    if (item.type === 'album') {
      const payload = await fetchSubsonic<AlbumDetailResponse>(
        '/rest/getAlbum.view',
        { id: item.id },
        credentials
      );
      const album = payload['subsonic-response']?.album;
      if (!album) return null;
      return {
        key,
        type: 'album',
        id: album.id,
        title: album.name,
        coverArt: album.coverArt,
        meta: getAlbumMetadata(album),
        to: `/album/${album.id}`,
        variant: 'default',
      };
    }

    if (item.type === 'artist') {
      const payload = await fetchSubsonic<ArtistDetailResponse>(
        '/rest/getArtist.view',
        { id: item.id },
        credentials
      );
      const artist = payload['subsonic-response']?.artist;
      if (!artist) return null;
      return {
        key,
        type: 'artist',
        id: artist.id,
        title: artist.name,
        coverArt: artist.coverArt,
        meta: getArtistMetadata(artist),
        to: `/artist/${artist.id}`,
        variant: 'artist',
      };
    }

    const payload = await fetchSubsonic<PlaylistDetailResponse>(
      '/rest/getPlaylist.view',
      { id: item.id },
      credentials
    );
    const playlist = payload['subsonic-response']?.playlist;
    if (!playlist) return null;
    return {
      key,
      type: 'playlist',
      id: playlist.id,
      title: playlist.name,
      coverArt: playlist.coverArt,
      meta: getPlaylistMetadata(playlist),
      to: `/playlist/${playlist.id}`,
      variant: 'default',
    };
  } catch {
    return null;
  }
}

export default function useRecentlyPlayed(limit = 6): {
  items: RecentlyPlayedCard[];
  isLoading: boolean;
} {
  const { credentials } = useAuth();
  const [items, setItems] = useState<RecentlyPlayedCard[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!credentials) {
      setItems([]);
      return;
    }

    let cancelled = false;
    setIsLoading(true);

    (async () => {
      try {
        const list = await getRecentlyPlayed();
        const resolved = await Promise.all(
          list.slice(0, limit).map((item) => resolveItem(item, credentials))
        );
        if (cancelled) return;
        setItems(resolved.filter((card): card is RecentlyPlayedCard => card !== null));
      } catch {
        if (!cancelled) setItems([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [credentials, limit]);

  return { items, isLoading };
}
