import { useMemo } from 'react';
import LibraryCard from '@/components/LibraryCard/LibraryCard';
import useNavidromeRequest from '@/hooks/useNavidromeRequest';
import type { ArtistsResponse, ArtistRecord } from '@/@types/types';

export default function Artists() {
  const { data, isLoading } = useNavidromeRequest<ArtistsResponse>('/rest/getArtists.view');

  const artists = useMemo<ArtistRecord[]>(() => {
    const indexes = data?.['subsonic-response']?.artists?.index ?? [];
    return indexes.flatMap((idx) => idx.artist ?? []);
  }, [data]);

  return (
    <section>
      <div className="flex flex-col items-baseline justify-between gap-6 mx-9 mt-9 pb-3 border-b border-hairline">
        <h1 className="font-display text-[38px] font-normal leading-none tracking-[-0.02em]">
          Artists
        </h1>
        <h2 className="flex items-baseline gap-2.5 font-display text-[18px] font-medium tracking-[-0.01em] text-ink-3">
          {artists.length} {artists.length === 1 ? 'artist' : 'artists'}
        </h2>
      </div>
      <div className="px-9 pt-5 pb-15">
        {artists.length > 0 && (
          <div className="grid grid-cols-2 gap-5.5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
            {artists.map((artist) => (
              <LibraryCard
                key={artist.id}
                coverArtId={artist.coverArt}
                title={artist.name}
                meta={
                  artist.albumCount != null
                    ? `${artist.albumCount} ${artist.albumCount === 1 ? 'album' : 'albums'}`
                    : undefined
                }
                variant="artist"
                to={`/artist/${artist.id}`}
              />
            ))}
          </div>
        )}
        {isLoading && <p className="text-center text-ink-3 text-sm py-4">Loading…</p>}
      </div>
    </section>
  );
}
