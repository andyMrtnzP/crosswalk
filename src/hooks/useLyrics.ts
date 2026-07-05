import { useMemo } from 'react';
import type { LyricsResponse } from '@/@types/types';
import useNavidromeRequest from './useNavidromeRequest';

export type ParsedLyricLine = { time: number; text: string };

export type Lyrics = {
  lines: ParsedLyricLine[];
  synced: boolean; // lines carry timestamps → can follow playback
  hasLyrics: boolean;
};

// Fetches lyrics for a song via Navidrome's songLyrics extension. Prefers a
// synced track; `time` is in seconds so it lines up with the audio clock.
export default function useLyrics(songId: string | undefined): Lyrics {
  const { data } = useNavidromeRequest<LyricsResponse>(
    '/rest/getLyricsBySongId.view',
    { id: songId },
    { skip: !songId }
  );

  return useMemo(() => {
    const structured = data?.['subsonic-response']?.lyricsList?.structuredLyrics ?? [];
    const chosen = structured.find((s) => s.synced) ?? structured[0];
    const lines = (chosen?.line ?? []).map((l) => ({
      time: (l.start ?? 0) / 1000,
      text: l.value,
    }));
    return { lines, synced: !!chosen?.synced, hasLyrics: lines.length > 0 };
  }, [data]);
}
