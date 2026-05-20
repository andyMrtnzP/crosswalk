import { useParams } from 'react-router-dom';
import { Clock, Download, Heart, MoreVertical, Play } from 'lucide-react';

import useNavidromeRequest from '@/hooks/useNavidromeRequest';
import usePlayer from '@/hooks/usePlayer';
import type { PlaylistDetailResponse, Song } from '@/@types/types';
import { formatRuntime } from '@/lib/utils';
import { recordRecentlyPlayed } from '@/lib/crosswalkApi';
import AlbumTrackRow, { TRACK_COLS } from '@/components/AlbumTrackRow/AlbumTrackRow';
import { Button } from '@/components/ui/button';

export default function Playlist() {
  const { id } = useParams<{ id: string }>();
  const player = usePlayer();

  const { data: playlistData } = useNavidromeRequest<PlaylistDetailResponse>(
    '/rest/getPlaylist.view',
    { id },
    { skip: !id }
  );

  const playlist = playlistData?.['subsonic-response']?.playlist;

  const { data: coverArtSrc } = useNavidromeRequest<string>(
    '/rest/getCoverArt.view',
    { id: playlist?.coverArt, size: 400 },
    { responseType: 'blobUrl', skip: !playlist?.coverArt }
  );

  const songs = playlist?.entry ?? [];

  const playPlaylist = (queueSongs: Song[], startIndex: number) => {
    if (queueSongs.length === 0) return;
    player.playQueue(queueSongs, startIndex);
    if (playlist?.id) {
      recordRecentlyPlayed('playlist', playlist.id).catch(() => {});
    }
  };

  return (
    <section>
      {/* Playlist header */}
      <div
        className="grid items-center gap-7 border-b border-hairline px-9 py-8"
        style={{ gridTemplateColumns: '160px 1fr auto' }}
      >
        {/* Cover */}
        <div className="relative h-40 w-40 overflow-hidden rounded-lg bg-panel-2">
          {coverArtSrc && (
            <img
              src={coverArtSrc}
              alt={playlist?.name ?? ''}
              className="h-full w-full object-cover brightness-90"
            />
          )}
          <div className="absolute inset-0 record-page-cover-gradient" />
        </div>

        {/* Meta */}
        <div className="flex min-w-0 flex-col gap-2.5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-accent-gold">
            Playlist{playlist?.public ? ' · Public' : ''}
          </p>
          <h1 className="font-display text-[44px] font-medium leading-none tracking-tight">
            {playlist?.name ?? ''}
          </h1>
          {playlist?.comment && (
            <p className="text-[13px] leading-[1.55] text-ink-2">{playlist.comment}</p>
          )}
          <div className="mt-1 flex flex-wrap items-center gap-3 text-[12px] text-ink-3">
            {playlist?.owner && (
              <span className="font-medium text-ink-2">{playlist.owner}</span>
            )}
            {playlist?.owner && <span className="h-0.75 w-0.75 rounded-full bg-muted-deep" />}
            {playlist?.songCount != null && (
              <span>
                {playlist.songCount} {playlist.songCount === 1 ? 'track' : 'tracks'}
              </span>
            )}
            {playlist?.duration != null && (
              <>
                <span className="h-0.75 w-0.75 rounded-full bg-muted-deep" />
                <span>{formatRuntime(playlist.duration)}</span>
              </>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2.5 self-end">
          <Button
            type="button"
            onClick={() => playPlaylist(songs, 0)}
            variant="main"
          >
            <Play className="h-3 w-3 fill-current" />
            Play
          </Button>
          <Button type="button" aria-label="Like playlist" variant="icon">
            <Heart className="h-4 w-4" />
          </Button>
          <Button type="button" aria-label="Download" variant="icon">
            <Download className="h-4 w-4" />
          </Button>
          <Button type="button" aria-label="More options" variant="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Track table */}
      <div className="pb-15 pt-2">
        <div
          className="mb-1 grid items-center gap-4 border-b border-hairline px-3 pb-2.5 pt-2.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-strong"
          style={{ gridTemplateColumns: TRACK_COLS }}
        >
          <div className="text-center">#</div>
          <div>Title</div>
          <div>Artist</div>
          <div className="flex items-center justify-end">
            <Clock className="h-3.25 w-3.25" />
          </div>
          <div />
        </div>

        {songs.map((song, i) => (
          <AlbumTrackRow
            key={`${song.id}-${i}`}
            song={song}
            index={i + 1}
            onPlay={() => playPlaylist(songs, i)}
            isCurrentlyPlaying={player.currentSong?.id === song.id}
          />
        ))}
      </div>
    </section>
  );
}
