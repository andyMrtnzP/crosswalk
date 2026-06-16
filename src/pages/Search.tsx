import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search as SearchIcon } from 'lucide-react';
import useNavidromeRequest from '@/hooks/useNavidromeRequest';
import usePlayer from '@/hooks/usePlayer';
import type { Search2Response } from '@/@types/types';
import SearchResultRow from '@/components/SearchResultRow/SearchResultRow';

export default function Search() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') ?? '';
  const player = usePlayer();

  const { data, isLoading } = useNavidromeRequest<Search2Response>(
    '/rest/search2.view',
    { query, songCount: 20, albumCount: 10, artistCount: 8 },
    { skip: !query }
  );

  const results = data?.['subsonic-response']?.searchResult2;
  const songs = results?.song ?? [];
  const albums = results?.album ?? [];
  const artists = results?.artist ?? [];
  const hasResults = songs.length > 0 || albums.length > 0 || artists.length > 0;

  if (!query) {
    return (
      <section className="flex flex-col items-center justify-center gap-4 pt-32 text-center">
        <SearchIcon className="h-10 w-10 text-muted-deep" strokeWidth={1.5} />
        <p className="text-[15px] text-ink-3">Search for songs, artists, or albums</p>
      </section>
    );
  }

  return (
    <section>
      <div className="mx-9 mt-9 pb-3 border-b border-hairline">
        <h1 className="font-display text-[38px] font-normal leading-none tracking-[-0.02em]">
          Results for{' '}
          <span className="text-accent-gold italic">&ldquo;{query}&rdquo;</span>
        </h1>
      </div>

      {isLoading && <p className="py-10 text-center text-sm text-ink-3">Searching…</p>}
      {!isLoading && !hasResults && <p className="py-10 text-center text-sm text-ink-3">No results found.</p>}

      {hasResults && (
        <div className="px-6 pt-4 pb-15">
          {songs.map((song, i) => (
            <SearchResultRow
              key={song.id}
              coverArtId={song.coverArt}
              title={song.title}
              subtitle={`Song · ${song.artist ?? ''}`}
              shape="square"
              isPlaying={player.currentSong?.id === song.id}
              onClick={() => player.playQueue(songs, i)}
            />
          ))}
          {albums.map((album) => (
            <SearchResultRow
              key={album.id}
              coverArtId={album.coverArt}
              title={album.name}
              subtitle={`Album · ${album.artist ?? ''}`}
              shape="square"
              onClick={() => navigate(`/album/${album.id}`)}
            />
          ))}
          {artists.map((artist) => (
            <SearchResultRow
              key={artist.id}
              coverArtId={artist.coverArt}
              title={artist.name}
              subtitle="Artist"
              shape="circle"
              onClick={() => navigate(`/artist/${artist.id}`)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
