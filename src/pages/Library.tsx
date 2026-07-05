import LibraryCard from '@/components/LibraryCard/LibraryCard';
import useNavidromeRequest from '@/hooks/useNavidromeRequest';
import type { AlbumList2Response, ArtistsResponse, PlaylistsResponse } from '@/@types/types';
import {
  getAlbumMetadata,
  getArtistMetadata,
  getPlaylistMetadata,
  sortByDateDesc,
} from '@/lib/utils';
import LibrarySectionHeader from '@/components/LibrarySectionHeader/LibrarySectionHeader';

export default function Library() {
  const { data: playlistsData } = useNavidromeRequest<PlaylistsResponse>('/rest/getPlaylists.view');
  const { data: artistsData } = useNavidromeRequest<ArtistsResponse>('/rest/getArtists.view');
  const { data: albumData } = useNavidromeRequest<AlbumList2Response>('/rest/getAlbumList2.view', {
    type: 'newest',
    size: 12,
  });

  const allPlaylists = sortByDateDesc(
    playlistsData?.['subsonic-response']?.playlists?.playlist ?? []
  );
  const allArtists = (artistsData?.['subsonic-response']?.artists?.index ?? []).flatMap(
    (group) => group.artist ?? []
  );
  const allAlbums = albumData?.['subsonic-response']?.albumList2?.album ?? [];
  const albumTotal = allArtists.reduce((sum, artist) => sum + (artist.albumCount ?? 0), 0);
  const playlists = allPlaylists.slice(0, 12);
  const artists = allArtists.slice(0, 12);
  const albums = allAlbums.slice(0, 12);

  return (
    <section>
      <div className="flex flex-wrap items-baseline justify-between gap-6 px-9 pt-9 pb-6">
        <h1 className="font-display text-[38px] font-normal leading-none tracking-[-0.02em]">
          Your Library
        </h1>
        <div className="text-[12px] tracking-[0.04em] tabular-nums text-ink-3">
          <span className="text-ink-2">
            {allPlaylists.length + allArtists.length}{' '}
            {allPlaylists.length + allArtists.length === 1 ? 'item' : 'items'}
          </span>
          {' · '}
          {allPlaylists.length} {allPlaylists.length === 1 ? 'playlist' : 'playlists'} ·{' '}
          {allArtists.length} {allArtists.length === 1 ? 'artist' : 'artists'}
        </div>
      </div>

      <div className="px-9 pb-15">
        {playlists.length > 0 && (
          <div className="mb-12">
            <LibrarySectionHeader
              title="Playlists"
              count={`${allPlaylists.length} total`}
              action="View All"
              to="/playlists"
            />
            <div className="library-grid">
              {playlists.map((playlist) => (
                <LibraryCard
                  key={playlist.id}
                  coverArtId={playlist.coverArt}
                  title={playlist.name}
                  meta={getPlaylistMetadata(playlist)}
                  to={`/playlist/${playlist.id}`}
                />
              ))}
            </div>
          </div>
        )}

        {albums.length > 0 && (
          <div className="mb-12">
            <LibrarySectionHeader
              title="Albums"
              count={`${albumTotal} total`}
              action="View All"
              to="/albums"
            />
            <div className="library-grid">
              {albums.map((album) => (
                <LibraryCard
                  key={album.id}
                  coverArtId={album.coverArt}
                  title={album.name}
                  meta={getAlbumMetadata(album)}
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
              count={`${allArtists.length} total`}
              action="View All"
            />
            <div className="library-grid">
              {artists.map((artist) => (
                <LibraryCard
                  key={artist.id}
                  coverArtId={artist.coverArt}
                  title={artist.name}
                  meta={getArtistMetadata(artist)}
                  variant="artist"
                  to={`/artist/${artist.id}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
