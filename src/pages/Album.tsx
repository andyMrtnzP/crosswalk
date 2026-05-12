import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Clock, Download, Heart, MoreVertical, Play } from 'lucide-react';
import useNavidromeRequest from '@/hooks/useNavidromeRequest';
import usePlayer from '@/hooks/usePlayer';
import type { AlbumDetailResponse } from '@/@types/types';
import { formatAlbumDuration } from '@/lib/utils';
import AlbumTrackRow, { TRACK_COLS } from '@/components/AlbumTrackRow/AlbumTrackRow';

type Tab = 'tracks' | 'credits' | 'similar';

const TABS: { key: Tab; label: string }[] = [
  { key: 'tracks', label: 'Tracks' },
  { key: 'credits', label: 'Credits' },
  { key: 'similar', label: 'Similar Albums' },
];

export default function Album() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<Tab>('tracks');
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
        <div
          className="relative h-40 w-40 overflow-hidden rounded-[10px] bg-panel-2"
          style={{ boxShadow: '0 12px 32px rgba(0,0,0,0.4)' }}
        >
          {coverArtSrc && (
            <img
              src={coverArtSrc}
              alt={album?.name ?? ''}
              className="h-full w-full object-cover brightness-90"
            />
          )}
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(135deg, rgba(232,182,90,0.05), transparent 50%, rgba(0,0,0,0.4))',
            }}
          />
        </div>

        {/* Meta */}
        <div className="flex min-w-0 flex-col gap-2.5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-accent-gold">
            Album{album?.genre ? ` · ${album.genre}` : ''}
          </p>
          <h1 className="font-display text-[44px] font-medium leading-none tracking-[-0.025em]">
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
            {album?.artist && <span className="h-[3px] w-[3px] rounded-full bg-muted-deep" />}
            {album?.songCount != null && (
              <span>
                {album.songCount} {album.songCount === 1 ? 'song' : 'songs'}
              </span>
            )}
            {album?.duration != null && (
              <>
                <span className="h-[3px] w-[3px] rounded-full bg-muted-deep" />
                <span>{formatAlbumDuration(album.duration)}</span>
              </>
            )}
            {album?.year && (
              <>
                <span className="h-[3px] w-[3px] rounded-full bg-muted-deep" />
                <span>{album.year}</span>
              </>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2.5 self-end">
          <button
            type="button"
            onClick={() => songs.length > 0 && player.playQueue(songs, 0)}
            className="inline-flex h-10 items-center gap-2.5 rounded-full bg-accent-gold pl-[18px] pr-[22px] text-[13px] font-semibold tracking-[-0.005em] text-on-accent transition hover:-translate-y-px hover:bg-accent-deep"
          >
            <Play className="h-3 w-3 fill-current" />
            Play
          </button>
          <button
            type="button"
            aria-label="Like album"
            className="grid h-10 w-10 place-items-center rounded-full border border-hairline-2 text-ink-2 transition hover:border-ink-3 hover:text-foreground"
          >
            <Heart className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Download"
            className="grid h-10 w-10 place-items-center rounded-full border border-hairline-2 text-ink-2 transition hover:border-ink-3 hover:text-foreground"
          >
            <Download className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="More options"
            className="grid h-10 w-10 place-items-center rounded-full border border-hairline-2 text-ink-2 transition hover:border-ink-3 hover:text-foreground"
          >
            <MoreVertical className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Controls bar */}
      <div className="flex items-center justify-between gap-4 border-b border-hairline px-9 py-3.5">
        <div className="flex gap-1.5">
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveTab(key)}
              className={`rounded-full border px-3 py-[5px] text-[11.5px] font-medium transition ${
                activeTab === key
                  ? 'border-foreground bg-foreground text-background'
                  : 'border-hairline text-ink-3 hover:border-hairline-2 hover:text-foreground'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <span className="text-[11.5px] text-ink-3">Track order</span>
      </div>

      {/* Track table */}
      {activeTab === 'tracks' && (
        <div className="px-6 pb-[60px] pt-2">
          {/* Column headers */}
          <div
            className="mb-1 grid items-center gap-4 border-b border-hairline px-3 pb-2.5 pt-2.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-strong"
            style={{ gridTemplateColumns: TRACK_COLS }}
          >
            <div className="text-center">#</div>
            <div>Title</div>
            <div>Artist</div>
            <div className="flex items-center justify-end">
              <Clock className="h-[13px] w-[13px]" />
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
      )}
    </section>
  );
}
