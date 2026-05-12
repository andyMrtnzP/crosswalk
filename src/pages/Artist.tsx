import { useParams } from 'react-router-dom';
import { MoreVertical, Play, Shuffle } from 'lucide-react';
import useNavidromeRequest from '@/hooks/useNavidromeRequest';
import usePlayer from '@/hooks/usePlayer';
import LibraryCard from '@/components/LibraryCard/LibraryCard';
import type {
  ArtistDetailResponse,
  ArtistInfo2Response,
  TopSongsResponse,
  Song,
} from '@/@types/types';
import { formatTrackDuration } from '@/lib/utils';

/** Strip HTML tags from Last.fm biography strings to avoid XSS. */
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}

/** Fetches and renders a 40×40 song cover art thumbnail. */
function SongThumb({ coverArt }: { coverArt?: string }) {
  const { data: src } = useNavidromeRequest<string>(
    '/rest/getCoverArt.view',
    { id: coverArt, size: 80 },
    { responseType: 'blobUrl', skip: !coverArt }
  );

  return (
    <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded bg-panel-3">
      {src && <img src={src} alt="" className="h-full w-full object-cover" />}
    </div>
  );
}

type PopularRowProps = {
  song: Song;
  index: number;
  isCurrentlyPlaying: boolean;
  onPlay: () => void;
};

function PopularRow({ song, index, isCurrentlyPlaying, onPlay }: PopularRowProps) {
  return (
    <div
      className={`group grid cursor-pointer items-center gap-3.5 rounded-md px-2 py-[9px] transition-colors hover:bg-panel-2 ${isCurrentlyPlaying ? 'bg-panel-2' : ''}`}
      style={{ gridTemplateColumns: '24px 40px 1fr 60px' }}
      onClick={onPlay}
    >
      {/* Index / eq / play-on-hover */}
      <div className="relative h-4 text-center text-[12.5px] tabular-nums text-ink-3">
        {isCurrentlyPlaying ? (
          <span className="flex h-full items-end justify-center gap-[2px]">
            <span
              className="w-[2px] rounded-sm bg-accent-gold"
              style={{ animation: 'eq 1s ease-in-out infinite', height: '40%' }}
            />
            <span
              className="w-[2px] rounded-sm bg-accent-gold"
              style={{
                animation: 'eq 1s ease-in-out infinite',
                animationDelay: '0.2s',
                height: '100%',
              }}
            />
            <span
              className="w-[2px] rounded-sm bg-accent-gold"
              style={{
                animation: 'eq 1s ease-in-out infinite',
                animationDelay: '0.4s',
                height: '60%',
              }}
            />
          </span>
        ) : (
          <>
            <span className="group-hover:hidden">{index}</span>
            <span className="hidden items-center justify-center group-hover:flex">
              <Play className="h-3 w-3 fill-current text-foreground" />
            </span>
          </>
        )}
      </div>

      {/* Art */}
      <SongThumb coverArt={song.coverArt} />

      {/* Title + album */}
      <div className="min-w-0">
        <p
          className={`truncate text-[13px] font-medium ${isCurrentlyPlaying ? 'text-accent-gold' : 'text-foreground'}`}
        >
          {song.title}
        </p>
        {song.album && (
          <p className="mt-0.5 truncate text-[11.5px] text-ink-3">
            {song.album}
            {song.year ? ` · ${song.year}` : ''}
          </p>
        )}
      </div>

      {/* Duration */}
      <p className="text-right text-[11.5px] tabular-nums text-ink-3">
        {formatTrackDuration(song.duration)}
      </p>
    </div>
  );
}

export default function Artist() {
  const { id } = useParams<{ id: string }>();
  const player = usePlayer();

  const { data: artistData } = useNavidromeRequest<ArtistDetailResponse>(
    '/rest/getArtist.view',
    { id },
    { skip: !id }
  );
  const artist = artistData?.['subsonic-response']?.artist;

  const { data: artistInfoData } = useNavidromeRequest<ArtistInfo2Response>(
    '/rest/getArtistInfo2.view',
    { id },
    { skip: !id }
  );
  const artistInfo = artistInfoData?.['subsonic-response']?.artistInfo2;

  const { data: topSongsData } = useNavidromeRequest<TopSongsResponse>(
    '/rest/getTopSongs.view',
    { artist: artist?.name, count: 10 },
    { skip: !artist?.name }
  );
  const topSongs = topSongsData?.['subsonic-response']?.topSongs?.song ?? [];

  // Hero background: prefer Last.fm largeImageUrl, fall back to coverArt blob.
  const { data: heroBlobSrc } = useNavidromeRequest<string>(
    '/rest/getCoverArt.view',
    { id: artist?.coverArt, size: 800 },
    { responseType: 'blobUrl', skip: !artist?.coverArt }
  );
  const heroBgUrl = artistInfo?.largeImageUrl || heroBlobSrc || null;

  const albums = artist?.album ?? [];
  const sortedAlbums = [...albums].sort((a, b) => (b.year ?? 0) - (a.year ?? 0));

  function playTopSongs(startIndex = 0) {
    if (topSongs.length > 0) {
      player.playQueue(topSongs, startIndex);
    }
  }

  const biography = artistInfo?.biography ? stripHtml(artistInfo.biography) : null;

  return (
    <section>
      {/* ── Hero ── */}
      <div className="relative h-[360px] overflow-hidden border-b border-hairline">
        {heroBgUrl && (
          <div
            className="absolute inset-0 bg-cover"
            style={{
              backgroundImage: `url(${heroBgUrl})`,
              backgroundPosition: 'center 30%',
              filter: 'brightness(0.4) saturate(0.6) contrast(1.05)',
            }}
          />
        )}
        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to right, rgba(10,10,10,0.85) 0%, rgba(10,10,10,0.5) 50%, rgba(10,10,10,0.4) 100%), linear-gradient(to bottom, transparent 40%, #0a0a0a 100%)',
          }}
        />
        {/* Artist name + stats */}
        <div className="relative z-10 flex h-full flex-col justify-end px-9 pb-[30px]">
          <h1 className="font-display text-[84px] font-medium leading-[0.92] tracking-[-0.035em] text-foreground">
            {artist?.name ?? ''}
          </h1>
          {artist && (
            <div className="mt-[18px] flex items-center gap-3.5 text-[13px] text-ink-2">
              {artist.albumCount != null && (
                <span>
                  <span className="font-medium text-foreground">{artist.albumCount}</span>{' '}
                  {artist.albumCount === 1 ? 'album' : 'albums'}
                </span>
              )}
              {artist.albumCount != null && topSongs.length > 0 && (
                <span className="h-[3px] w-[3px] rounded-full bg-muted-deep" />
              )}
              {topSongs.length > 0 && (
                <span>
                  <span className="font-medium text-foreground">{topSongs.length}</span> top songs
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Action bar ── */}
      <div className="flex items-center gap-4 border-b border-hairline px-9 py-[22px]">
        <button
          type="button"
          onClick={() => playTopSongs(0)}
          className="inline-flex h-11 items-center gap-2.5 rounded-full bg-accent-gold pl-5 pr-6 text-[13px] font-semibold tracking-[-0.005em] text-on-accent transition hover:-translate-y-px hover:bg-accent-deep"
        >
          <Play className="h-[13px] w-[13px] fill-current" />
          Play
        </button>

        <button
          type="button"
          onClick={() => {
            player.toggleShuffle();
            playTopSongs(0);
          }}
          className="inline-flex h-11 items-center gap-2 rounded-full border border-hairline-2 px-[18px] text-[12.5px] font-medium text-ink-2 transition hover:border-ink-3 hover:text-foreground"
        >
          <Shuffle className="h-3.5 w-3.5" />
          Shuffle
        </button>

        <button
          type="button"
          aria-label="More options"
          className="grid h-10 w-10 place-items-center rounded-full border border-hairline-2 text-ink-2 transition hover:border-ink-3 hover:text-foreground"
        >
          <MoreVertical className="h-4 w-4" />
        </button>
      </div>

      {/* ── Content ── */}
      <div className="px-9 pb-[60px] pt-9">
        {/* Popular tracks + About */}
        <div className="mb-[52px] grid gap-10" style={{ gridTemplateColumns: '1.4fr 1fr' }}>
          {/* Popular tracks */}
          <div>
            <div className="mb-[18px] flex items-baseline justify-between border-b border-hairline pb-3">
              <h2 className="font-display text-[22px] font-medium tracking-[-0.015em]">
                Top Songs
              </h2>
            </div>
            <div className="flex flex-col">
              {topSongs.map((song, i) => (
                <PopularRow
                  key={song.id}
                  song={song}
                  index={i + 1}
                  isCurrentlyPlaying={player.currentSong?.id === song.id}
                  onPlay={() => playTopSongs(i)}
                />
              ))}
              {topSongs.length === 0 && !topSongsData && (
                <p className="py-4 text-[13px] text-ink-3">Loading…</p>
              )}
              {topSongs.length === 0 && topSongsData && (
                <p className="py-4 text-[13px] text-ink-3">No top songs found.</p>
              )}
            </div>
          </div>

          {/* About card */}
          <div>
            {(biography || artist?.albumCount != null) && (
              <div className="sticky top-20 rounded-[10px] border border-hairline bg-panel-2 p-6">
                <p className="mb-3.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-strong">
                  About
                </p>
                {biography && (
                  <p className="mb-[18px] text-[13px] leading-[1.65] text-ink-2">{biography}</p>
                )}
                {artist?.albumCount != null && (
                  <div
                    className="overflow-hidden rounded-md border border-hairline"
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '1px',
                      background: 'var(--hairline)',
                    }}
                  >
                    <div className="bg-panel-2 p-3.5">
                      <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-strong">
                        Albums
                      </p>
                      <p className="font-display text-[22px] font-normal tracking-[-0.015em] tabular-nums text-foreground">
                        {artist.albumCount}
                      </p>
                      <p className="mt-0.5 text-[11px] text-ink-3">Studio releases</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Discography */}
        {sortedAlbums.length > 0 && (
          <div>
            <div className="mb-[18px] flex items-baseline justify-between border-b border-hairline pb-3">
              <h2 className="font-display text-[22px] font-medium tracking-[-0.015em]">
                Discography
                {albums.length > 0 && (
                  <span className="ml-2.5 font-sans text-[11px] font-medium tracking-[0.04em] text-muted-strong">
                    {albums.length} {albums.length === 1 ? 'album' : 'albums'}
                  </span>
                )}
              </h2>
            </div>

            <div className="grid grid-cols-6 gap-[22px]">
              {sortedAlbums.map((album) => (
                <LibraryCard
                  key={album.id}
                  coverArtId={album.coverArt}
                  title={album.name}
                  meta={[
                    album.year?.toString(),
                    album.songCount ? `${album.songCount} tracks` : undefined,
                  ]
                    .filter(Boolean)
                    .join(' · ')}
                  to={`/album/${album.id}`}
                  onPlay={() => {}}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
