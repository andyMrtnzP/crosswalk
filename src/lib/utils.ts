import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import type { AlbumRecord, ArtistRecord, Playlist } from '@/@types/types';

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

/** Formats a duration in seconds as "m:ss"
 * formatTimecode(125) => "2:05"
 * formatTimecode(3600) => "60:00"
 * formatTimecode(-5) => "0:00"
 * formatTimecode(NaN) => "0:00"
 */
export const formatTimecode = (seconds?: number): string => {
  if (seconds == null || !isFinite(seconds) || isNaN(seconds) || seconds < 0) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
};

/** Formats a duration in seconds as "Xh Ym" or "Ym"
 * formatRuntime(125) => "2m"
 * formatRuntime(3600) => "1h 0m"
 * formatRuntime(3665) => "1h 1m"
 * formatRuntime(-5) => null
 * formatRuntime(NaN) => null
 */
export const formatRuntime = (seconds?: number): string | null => {
  if (!seconds || seconds <= 0) return null;
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
};

export const sortByDateDesc = <T extends { created?: string }>(arr: T[]): T[] => {
  return arr.sort((a, b) => (b.created ?? '').localeCompare(a.created ?? ''));
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
  const duration = formatRuntime(playlist.duration);
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
