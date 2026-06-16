import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import useNavidromeRequest from '@/hooks/useNavidromeRequest';
import type { Search2Response } from '@/@types/types';
import { cn } from '@/lib/utils';
import QuickSearchItem from './QuickSearchItem';

export default function SearchBar() {
  const navigate = useNavigate();
  const location = useLocation();

  const urlQuery = new URLSearchParams(location.search).get('q') ?? '';
  const [value, setValue] = useState(urlQuery);
  const [isOpen, setIsOpen] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setValue(urlQuery); }, [urlQuery]);

  useEffect(() => {
    if (!value.trim()) { setDebouncedQuery(''); return; }
    const t = setTimeout(() => setDebouncedQuery(value.trim()), 350);
    return () => clearTimeout(t);
  }, [value]);

  const { data } = useNavidromeRequest<Search2Response>(
    '/rest/search2.view',
    { query: debouncedQuery, songCount: 3, albumCount: 2, artistCount: 2 },
    { skip: !debouncedQuery }
  );

  const results = data?.['subsonic-response']?.searchResult2;
  const songs = results?.song ?? [];
  const albums = results?.album ?? [];
  const artists = results?.artist ?? [];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const showFloat = isOpen && value.trim().length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = value.trim();
    if (q) { navigate(`/search?q=${encodeURIComponent(q)}`); setIsOpen(false); }
  };

  const goTo = (path: string) => { navigate(path); setIsOpen(false); };

  return (
    <form onSubmit={handleSubmit} className="w-full justify-self-center">
      <div ref={wrapRef} className={cn('relative mx-auto w-full max-w-130', showFloat && 'z-30')}>
        <Search className="pointer-events-none absolute left-3 top-1/2 z-10 h-3.25 w-3.25 -translate-y-1/2 text-muted-strong" />
        <input
          type="search"
          value={value}
          onChange={(e) => { setValue(e.target.value); if (e.target.value.trim()) setIsOpen(true); }}
          onFocus={() => { if (value.trim()) setIsOpen(true); }}
          onKeyDown={(e) => { if (e.key === 'Escape') { setIsOpen(false); (e.target as HTMLElement).blur(); } }}
          placeholder="Search songs, artists, albums…"
          className={cn(
            'relative z-10 w-full py-2 pl-9 pr-10 text-[13px] text-foreground placeholder:text-muted-strong focus:outline-none focus:ring-0 transition-colors duration-150',
            showFloat
              ? 'rounded-none border-0 border-b border-hairline-2 bg-transparent'
              : 'rounded-(--radius) border border-border bg-panel-2 focus:border-hairline-2'
          )}
        />
        {!showFloat && (
          <span className="pointer-events-none absolute right-3 top-1/2 z-10 -translate-y-1/2 text-[10.5px] tracking-[0.04em] text-muted-strong">
            ⌘K
          </span>
        )}

        {showFloat && (
          <div className="absolute left-1/2 top-1/2 z-0 w-[calc(100%+28px)] -translate-x-1/2 -translate-y-4.5 rounded-xl border border-accent-gold/15 bg-[rgba(15,15,15,0.92)] pt-13.5 px-3 pb-3 shadow-[0_22px_70px_rgba(0,0,0,0.52),0_0_0_1px_rgba(255,255,255,0.02)_inset] backdrop-blur-[18px]">

            {songs.map((song, i) => (
              <QuickSearchItem
                key={song.id}
                coverArtId={song.coverArt}
                title={song.title}
                subtitle={`Song · ${song.artist ?? ''}`}
                shape="square"
                onClick={() => song.albumId ? goTo(`/album/${song.albumId}`) : undefined}
                badge={i === 0 ? 'Enter' : undefined}
                highlight={i === 0}
              />
            ))}

            {albums.map((album) => (
              <QuickSearchItem
                key={album.id}
                coverArtId={album.coverArt}
                title={album.name}
                subtitle={`Album · ${album.artist ?? ''}`}
                shape="square"
                onClick={() => goTo(`/album/${album.id}`)}
              />
            ))}

            {artists.map((artist) => (
              <QuickSearchItem
                key={artist.id}
                coverArtId={artist.coverArt}
                title={artist.name}
                subtitle="Artist"
                shape="circle"
                onClick={() => goTo(`/artist/${artist.id}`)}
              />
            ))}

            <button
              type="submit"
              className="grid w-full grid-cols-[28px_1fr_auto] items-center gap-2.5 rounded-lg px-2 py-1.75 text-left transition-colors hover:bg-white/5"
            >
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-accent-soft text-accent-gold">
                <Search className="h-3.25 w-3.25" />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-[12.5px] font-medium text-foreground">
                  Search all for &ldquo;{value.trim()}&rdquo;
                </span>
                <span className="mt-px block text-[11px] text-muted-strong">Songs, albums, artists</span>
              </span>
              <span className="shrink-0 rounded-full border border-hairline-2 px-1.75 py-0.75 text-[10px] text-muted-strong">
                ⌘K
              </span>
            </button>

            <div className="mt-1 flex items-center justify-end border-t border-hairline px-2 pt-2">
              <span className="text-[10.5px] text-ink-3">Esc to close</span>
            </div>
          </div>
        )}
      </div>
    </form>
  );
}
