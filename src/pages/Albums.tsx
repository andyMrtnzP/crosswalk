import LibraryCard from '@/components/LibraryCard/LibraryCard';
import useNavidromeRequest from '@/hooks/useNavidromeRequest';
import type {
  AlbumList2Response,
} from '@/@types/types';
import { getAlbumMetadata } from '@/lib/utils';

export default function Albums() {
  const { data: albumData } = useNavidromeRequest<AlbumList2Response>('/rest/getAlbumList2.view', {
    type: 'newest',
  });

  const albums = (albumData?.['subsonic-response']?.albumList2?.album ?? [])

  return (<>
    <section>
      <div className="flex flex-col items-baseline justify-between gap-6 mx-9 mt-9 pb-3 border-b border-hairline">
        <h1 className="font-display text-[38px] font-normal leading-none tracking-[-0.02em]">
          Albums
        </h1>
        <h2 className="flex items-baseline gap-2.5 font-display text-[18px] font-medium tracking-[-0.01em] text-ink-3">
          {albums.length}{' '}
          {albums.length === 1 ? 'item' : 'items'}
        </h2>
      </div>

      <div className="px-9 pt-5 pb-[60px]">
        {albums.length > 0 && (
          <div className="mb-12">
            <div className="grid grid-cols-2 gap-[22px] sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
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
      </div>
    </section>
  </>)
}