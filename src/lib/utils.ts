import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import type { AlbumRecord, ArtistRecord, Playlist } from '@/@types/types';

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const formatDuration = (seconds?: number): string | null => {
  if (!seconds || seconds <= 0) return null;
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
};

export const sortByDateDesc = <T extends { created?: string }>(arr: T[]): T[] => {
  return arr.sort((a, b) => (b.created ?? '').localeCompare(a.created ?? ''));
};

export const formatTrackDuration = (seconds?: number): string => {
  if (!seconds) return '—';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
};

export const formatPlayingTime = (secs: number | undefined): string => {
  if (secs == null || !isFinite(secs) || isNaN(secs)) return '0:00';

  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
};

export const formatAlbumDuration = (seconds?: number): string => {
  if (!seconds) return '';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return h > 0 ? `${h} hr ${m} min` : `${m} min`;
};

export const getAlbumMetadata = (album: AlbumRecord): string | undefined => {
  const parts: string[] = [];
  if (album.artist) parts.push(album.artist);
  if (album.year) parts.push(String(album.year));
  return parts.length > 0 ? parts.join(' · ') : undefined;
};

export const getPlaylistMetadata = (playlist: Playlist): string | undefined => {
  const parts: string[] = [];
  if (playlist.songCount != null) {
    parts.push(`${playlist.songCount} ${playlist.songCount === 1 ? 'track' : 'tracks'}`);
  }
  const duration = formatDuration(playlist.duration);
  if (duration) parts.push(duration);
  return parts.length > 0 ? parts.join(' · ') : undefined;
};

export const getArtistMetadata = (artist: ArtistRecord): string | undefined => {
  if (artist.albumCount == null) return undefined;
  return `${artist.albumCount} ${artist.albumCount === 1 ? 'album' : 'albums'}`;
};

/** Strip HTML tags from Last.fm biography strings to avoid XSS. */
export const sanitizeHTML = (html: string): string => {
  return html.replace(/<[^>]*>/g, '');
};
