import { Link, useParams } from 'react-router-dom';
import { Clock, Download, Heart, MoreVertical, Play } from 'lucide-react';

import useNavidromeRequest from '@/hooks/useNavidromeRequest';
import usePlayer from '@/hooks/usePlayer';
import type { AlbumDetailResponse } from '@/@types/types';
import { formatAlbumDuration } from '@/lib/utils';
import AlbumTrackRow, { TRACK_COLS } from '@/components/AlbumTrackRow/AlbumTrackRow';
import { Button } from '@/components/ui/button';

export default function Album() {
  const { id } = useParams<{ id: string }>();
  const player = usePlayer();

  const { data: albumData } = useNavidromeRequest<AlbumDetailResponse>(
    '/rest/getAlbum.view',
    { id },
    { skip: !id }
  );

  const album = albumData?.['subsonic-response']?.album;

  const { data: coverArtSrc } = useNavidromeRequest<string>(
    '/rest/getCoverArt.view',
    { id: album?.coverArt, size: 400 },
    { responseType: 'blobUrl', skip: !album?.coverArt }
  );

  const songs = album?.song ?? [];

  return (
    <section>
      {/* Album header */}
      <div
        className="grid items-center gap-7 border-b border-hairline px-9 py-8"
        style={{ gridTemplateColumns: '160px 1fr auto' }}
      >
        {/* Cover */}
        <div className="relative h-40 w-40 overflow-hidden rounded-lg bg-panel-2">
          {coverArtSrc && (
            <img
              src={coverArtSrc}
              alt={album?.name ?? ''}
              className="h-full w-full object-cover brightness-90"
            />
          )}
          <div className="absolute inset-0 record-page-cover-gradient" />
        </div>

        {/* Meta */}
        <div className="flex min-w-0 flex-col gap-2.5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-accent-gold">
            Album{album?.genre ? ` · ${album.genre}` : ''}
          </p>
          <h1 className="font-display text-[44px] font-medium leading-none tracking-tight">
            {album?.name ?? ''}
          </h1>
          <div className="mt-1 flex flex-wrap items-center gap-3 text-[12px] text-ink-3">
            {album?.artist && (
              <Link
                to={`/artist/${album.artistId}`}
                className="font-medium text-ink-2 hover:underline"
              >
                {album.artist}
              </Link>
            )}
            {album?.artist && <span className="h-0.75 w-0.75 rounded-full bg-muted-deep" />}
            {album?.songCount != null && (
              <span>
                {album.songCount} {album.songCount === 1 ? 'song' : 'songs'}
              </span>
            )}
            {album?.duration != null && (
              <>
                <span className="h-0.75 w-0.75 rounded-full bg-muted-deep" />
                <span>{formatAlbumDuration(album.duration)}</span>
              </>
            )}
            {album?.year && (
              <>
                <span className="h-0.75 w-0.75 rounded-full bg-muted-deep" />
                <span>{album.year}</span>
              </>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2.5 self-end">
          <Button
            type="button"
            onClick={() => songs.length > 0 && player.playQueue(songs, 0)}
            variant="main"
          >
            <Play className="h-3 w-3 fill-current" />
            Play
          </Button>
          <Button type="button" aria-label="Like album" variant="icon">
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
            key={song.id}
            song={song}
            index={i + 1}
            onPlay={() => player.playQueue(songs, i)}
            isCurrentlyPlaying={player.currentSong?.id === song.id}
          />
        ))}
      </div>
    </section>
  );
}
