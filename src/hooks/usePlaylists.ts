import { useEffect } from 'react';
import type { PlaylistsResponse } from '@/@types/types';
import useNavidromeRequest from './useNavidromeRequest';

// Every getPlaylists consumer subscribes; a create/delete calls notify so they
// all refetch. Otherwise each hook holds its own copy and drifts out of sync.
const listeners = new Set<() => void>();
export const notifyPlaylistsChanged = () => listeners.forEach((fn) => fn());

export default function usePlaylists() {
  const { data, isLoading, refetch } =
    useNavidromeRequest<PlaylistsResponse>('/rest/getPlaylists.view');
  useEffect(() => {
    const fn = () => void refetch();
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
    };
  }, [refetch]);
  // Newest first. `created` is ISO, so lexicographic compare == chronological.
  const playlists = [...(data?.['subsonic-response']?.playlists?.playlist ?? [])].sort((a, b) =>
    (b.created ?? '').localeCompare(a.created ?? '')
  );
  return { playlists, isLoading };
}
