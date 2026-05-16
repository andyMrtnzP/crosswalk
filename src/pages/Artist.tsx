import { useParams } from 'react-router-dom';
import { MoreVertical, Play, Shuffle } from 'lucide-react';
import useNavidromeRequest from '@/hooks/useNavidromeRequest';
import usePlayer from '@/hooks/usePlayer';
import LibraryCard from '@/components/LibraryCard/LibraryCard';
import type {
  ArtistDetailResponse,
  ArtistInfo2Response,
  TopSongsResponse,
} from '@/@types/types';
import { sanitizeHTML } from '@/lib/utils';
import ArtistHero from '@/components/ArtistHero/ArtistHero';
import { Button } from '@/components/ui/button';
import PopularTrackRow from '@/components/PopularTrackRow/PopularTrackRow';

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
  const albums = artist?.album ?? [];
  const sortedAlbums = [...albums].sort((a, b) => (b.year ?? 0) - (a.year ?? 0));

  const playTopSongs = (startIndex = 0) => {
    if (topSongs.length > 0) {
      player.playQueue(topSongs, startIndex);
    }
  }

  const biography = artistInfo?.biography ? sanitizeHTML(artistInfo.biography) : null;

  if (!artist) {
    return <></>;
  }

  return (
    <section>
      <ArtistHero {...artist} />

      {/* Action bar */}
      <div className="flex items-center gap-4 border-b border-hairline px-9 py-5.5">
        <Button
          type="button"
          onClick={() => playTopSongs(0)}
          variant='main'
          size='hero'
        >
          <Play className="h-3.25 w-3.25 fill-current" />
          Play
        </Button>

        <Button
          type="button"
          onClick={() => {
            player.toggleShuffle();
            playTopSongs(0);
          }}
          variant='icon'
          size='hero'
        >
          <Shuffle className="h-3.5 w-3.5" />
          Shuffle
        </Button>

        <Button
          type="button"
          aria-label="More options"
          variant='icon'
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="px-9 pb-15 pt-9">
        <div className="mb-13 grid gap-10" style={{ gridTemplateColumns: '1.4fr 1fr' }}>
          {/* Popular tracks */}
          <div>
            <div className="mb-4.5 flex items-baseline justify-between border-b border-hairline pb-3">
              <h2 className="font-display text-[22px] font-medium tracking-[-0.015em]">
                Top Songs
              </h2>
            </div>
            <div className="flex flex-col">
              {topSongs.map((song, i) => (
                <PopularTrackRow
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

          {/* About */}
          <div>
            {biography && (
              <div className="sticky top-20 rounded-lg border border-hairline bg-panel-2 p-6">
                <p className="mb-3.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-strong">
                  About
                </p>
                <p className="mb-4.5 text-[13px] leading-[1.65] text-ink-2">{biography}</p>
              </div>
            )}
          </div>
        </div>

        {/* Discography */}
        {sortedAlbums.length > 0 && (
          <div>
            <div className="mb-4.5 flex items-baseline justify-between border-b border-hairline pb-3">
              <h2 className="font-display text-[22px] font-medium tracking-[-0.015em]">
                Discography
                <span className="ml-2.5 font-sans text-[11px] font-medium tracking-[0.04em] text-muted-strong">
                  {albums.length} {albums.length === 1 ? 'album' : 'albums'}
                </span>
              </h2>
            </div>

            <div className="grid grid-cols-6 gap-5.5">
              {sortedAlbums.map((album) => {
                const metaParts = [
                  album.year?.toString(),
                  album.songCount ? `${album.songCount} tracks` : undefined,
                ]
                  .filter(Boolean)
                  .join(' · ');

                return <LibraryCard
                  key={album.id}
                  coverArtId={album.coverArt}
                  title={album.name}
                  meta={metaParts}
                  to={`/album/${album.id}`}
                  onPlay={() => { }}
                />
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
