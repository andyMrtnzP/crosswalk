import LibraryCard from '@/components/LibraryCard/LibraryCard';
import useNavidromeRequest from '@/hooks/useNavidromeRequest';
import type {
  AlbumList2Response,
  AlbumRecord,
  ArtistRecord,
  ArtistsResponse,
  Playlist,
  PlaylistsResponse,
} from '@/@types/types';
import { formatDuration, sortByDateDesc } from '@/lib/utils';
import LibrarySectionHeader from '@/components/LibrarySectionHeader/LibrarySectionHeader';

const playlistMeta = (playlist: Playlist): string | undefined => {
  const parts: string[] = [];
  if (playlist.songCount != null) {
    parts.push(`${playlist.songCount} ${playlist.songCount === 1 ? 'track' : 'tracks'}`);
  }
  const duration = formatDuration(playlist.duration);
  if (duration) parts.push(duration);
  return parts.length > 0 ? parts.join(' · ') : undefined;
};

const artistMeta = (artist: ArtistRecord): string | undefined => {
  if (artist.albumCount == null) return undefined;
  return `${artist.albumCount} ${artist.albumCount === 1 ? 'album' : 'albums'}`;
};

const albumMeta = (album: AlbumRecord): string | undefined => {
  const parts: string[] = [];
  if (album.artist) parts.push(album.artist);
  if (album.year) parts.push(String(album.year));
  return parts.length > 0 ? parts.join(' · ') : undefined;
};

export default function Library() {
  const { data: playlistsData } = useNavidromeRequest<PlaylistsResponse>('/rest/getPlaylists.view');
  const { data: artistsData } = useNavidromeRequest<ArtistsResponse>('/rest/getArtists.view');
  const { data: albumData } = useNavidromeRequest<AlbumList2Response>('/rest/getAlbumList2.view', {
    type: 'newest',
  });

  const playlists = sortByDateDesc(
    (playlistsData?.['subsonic-response']?.playlists?.playlist ?? []).slice(0, 6)
  );
  const artists = (artistsData?.['subsonic-response']?.artists?.index ?? [])
    .flatMap((group) => group.artist ?? [])
    .slice(0, 6);
  const albums = (albumData?.['subsonic-response']?.albumList2?.album ?? []).slice(0, 6);

  return (
    <section>
      <div className="flex flex-wrap items-baseline justify-between gap-6 px-9 pt-9 pb-6">
        <h1 className="font-display text-[38px] font-normal leading-none tracking-[-0.02em]">
          Your Library
        </h1>
        <div className="text-[12px] tracking-[0.04em] tabular-nums text-ink-3">
          <span className="text-ink-2">
            {playlists.length + artists.length}{' '}
            {playlists.length + artists.length === 1 ? 'item' : 'items'}
          </span>
          {' · '}
          {playlists.length} {playlists.length === 1 ? 'playlist' : 'playlists'} · {artists.length}{' '}
          {artists.length === 1 ? 'artist' : 'artists'}
        </div>
      </div>

      <div className="px-9 pb-[60px]">
        {playlists.length > 0 && (
          <div className="mb-12">
            <LibrarySectionHeader
              title="Playlists"
              count={`${playlists.length} total`}
              action="View All"
            />
            <div className="grid grid-cols-2 gap-[22px] sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
              {playlists.map((playlist) => (
                <LibraryCard
                  key={playlist.id}
                  coverArtId={playlist.coverArt}
                  title={playlist.name}
                  meta={playlistMeta(playlist)}
                />
              ))}
            </div>
          </div>
        )}

        {albums.length > 0 && (
          <div className="mb-12">
            <LibrarySectionHeader
              title="Albums"
              count={`${albums.length} total`}
              action="View All"
            />
            <div className="grid grid-cols-2 gap-[22px] sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
              {albums.map((album) => (
                <LibraryCard
                  key={album.id}
                  coverArtId={album.coverArt}
                  title={album.name}
                  meta={albumMeta(album)}
                  to={`/album/${album.id}`}
                />
              ))}
            </div>
          </div>
        )}

        {artists.length > 0 && (
          <div className="mb-12">
            <LibrarySectionHeader
              title="Artists"
              count={`${artists.length} total`}
              action="View All"
            />
            <div className="grid grid-cols-2 gap-[22px] sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
              {artists.map((artist) => (
                <LibraryCard
                  key={artist.id}
                  coverArtId={artist.coverArt}
                  title={artist.name}
                  meta={artistMeta(artist)}
                  variant="artist"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
