import LibraryCard from '@/components/LibraryCard/LibraryCard';
import usePlaylists from '@/hooks/usePlaylists';
import useContextMenu from '@/hooks/useContextMenu';
import { getPlaylistMetadata } from '@/lib/utils';

export default function Playlists() {
  const { playlists, isLoading } = usePlaylists();
  const { openPlaylistMenu } = useContextMenu();

  return (
    <section>
      <div className="flex flex-col items-baseline justify-between gap-6 mx-9 mt-9 pb-3 border-b border-hairline">
        <h1 className="font-display text-[38px] font-normal leading-none tracking-[-0.02em]">
          Playlists
        </h1>
        <h2 className="flex items-baseline gap-2.5 font-display text-[18px] font-medium tracking-[-0.01em] text-ink-3">
          {playlists.length} {playlists.length === 1 ? 'playlist' : 'playlists'}
        </h2>
      </div>
      <div className="px-9 pt-5 pb-15">
        {playlists.length > 0 && (
          <div className="grid grid-cols-2 gap-5.5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
            {playlists.map((playlist) => (
              <LibraryCard
                key={playlist.id}
                coverArtId={playlist.coverArt}
                title={playlist.name}
                meta={getPlaylistMetadata(playlist)}
                to={`/playlist/${playlist.id}`}
                onContextMenu={(e) =>
                  openPlaylistMenu(e, { id: playlist.id, name: playlist.name })
                }
              />
            ))}
          </div>
        )}
        {isLoading && <p className="text-center text-ink-3 text-sm py-4">Loading…</p>}
      </div>
    </section>
  );
}
