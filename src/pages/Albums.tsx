import LibraryCard from '@/components/LibraryCard/LibraryCard';
import useNavidromePagination from '@/hooks/useNavidromePagination';
import type { AlbumList2Response, AlbumRecord } from '@/@types/types';
import { getAlbumMetadata } from '@/lib/utils';

export default function Albums() {
  const {
    items: albums,
    isLoading,
    hasMore,
    sentinelRef,
  } = useNavidromePagination<AlbumList2Response, AlbumRecord>(
    '/rest/getAlbumList2.view',
    (response) => response['subsonic-response']?.albumList2?.album,
    { type: 'newest' }
  );

  return (
    <>
      <section>
        <div className="flex flex-col items-baseline justify-between gap-6 mx-9 mt-9 pb-3 border-b border-hairline">
          <h1 className="font-display text-[38px] font-normal leading-none tracking-[-0.02em]">
            Albums
          </h1>
          <h2 className="flex items-baseline gap-2.5 font-display text-[18px] font-medium tracking-[-0.01em] text-ink-3">
            {albums.length} {albums.length === 1 ? 'item' : 'items'}
            {hasMore && '+'}
          </h2>
        </div>

        <div className="px-9 pt-5 pb-15">
          {albums.length > 0 && (
            <div className="mb-12">
              <div className="grid grid-cols-2 gap-5.5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
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

          {hasMore && <div ref={sentinelRef} className="h-1" aria-hidden />}

          {isLoading && (
            <p className="text-center text-ink-3 text-sm py-4">Loading more…</p>
          )}
        </div>
      </section>
    </>
  );
}
