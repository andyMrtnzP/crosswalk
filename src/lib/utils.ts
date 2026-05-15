import type { AlbumRecord } from '@/@types/types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

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
