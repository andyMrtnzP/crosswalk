import type { AlbumRecord } from '@/@types/types';

type AlbumProps = {
  album: AlbumRecord;
};

function Album({ album }: AlbumProps) {
  return (
    <article className="rounded-xl p-4 shadow-sm ring-1 ring-slate-200/20 bg-secondary">
      <h2 className="text-base font-semibold text-card-foreground">{album.name}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{album.artist || 'Unknown artist'}</p>
      {album.year ? <p className="mt-2 text-xs font-medium text-primary">{album.year}</p> : null}
    </article>
  );
}

export default Album;
