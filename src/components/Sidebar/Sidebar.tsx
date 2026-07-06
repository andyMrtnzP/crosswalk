import { useEffect, useMemo, useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ChevronRight, Plus } from 'lucide-react';
import usePlaylists, { notifyPlaylistsChanged } from '@/hooks/usePlaylists';
import usePlayer from '@/hooks/usePlayer';
import useAuth from '@/hooks/useAuth';
import PlaylistNavItem from './PlaylistNavItem/PlaylistNavItem';
import { NAV_ITEMS, type PlaylistDetailResponse } from '@/@types/types';
import { Button } from '../ui/button';
import { buildRestUrl } from '@/lib/auth';
import { cn } from '@/lib/utils';

type SidebarProps = {
  onLogout?: () => void;
  username?: string;
};

export default function Sidebar({ onLogout, username }: SidebarProps) {
  const { playlists } = usePlaylists();
  const { currentSong } = usePlayer();
  const { credentials } = useAuth();
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState('');
  // ponytail: PlaylistNavItem is 24px art + 12px padding + 1px gap ≈ 37px. Bump if row styling changes.
  const PLAYLIST_ROW_H = 37;
  const listRef = useRef<HTMLUListElement>(null);
  const [maxItems, setMaxItems] = useState(0);
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setMaxItems(Math.floor(el.clientHeight / PLAYLIST_ROW_H)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const visible = playlists.slice(0, maxItems);

  const cancelAdd = () => {
    setAdding(false);
    setName('');
  };

  const createPlaylist = async () => {
    const trimmed = name.trim();
    if (!trimmed || !credentials) return cancelAdd();
    const url = buildRestUrl('createPlaylist.view', credentials.username, credentials.password, {
      name: trimmed,
      f: 'json',
    });
    const res = await fetch(url);
    const payload = (await res.json()) as PlaylistDetailResponse;
    cancelAdd();
    notifyPlaylistsChanged();
    const id = payload['subsonic-response']?.playlist?.id;
    if (id) navigate(`/playlist/${id}`);
  };

  const initials = useMemo(() => (username ? username.slice(0, 2).toUpperCase() : '?'), [username]);

  const baseClass =
    'flex items-center gap-[11px] rounded-md px-2.5 py-2 text-[13px] font-[450] transition-colors';
  const inactiveClass = `${baseClass} text-ink-2 hover:bg-panel-2 hover:text-foreground`;
  const activeClass = `${baseClass} bg-panel-3 text-foreground before:-ml-2.5 before:mr-2 before:block before:h-[14px] before:w-[2px] before:flex-shrink-0 before:rounded-[1px] before:bg-accent-gold before:content-['']`;

  return (
    <aside
      className={cn(
        `sticky top-0 flex flex-col gap-6.5 overflow-hidden border-r border-hairline bg-background px-4.5 pt-7 pb-6`,
        currentSong ? 'h-[calc(100vh-76px)]' : 'h-screen'
      )}
    >
      <div className="mb-1 flex items-center gap-2.5 px-2">
        <span className="brand-mark">
          <img src="/logo.svg" alt="Crosswalk logo" className="h-6 w-6" />
        </span>
        <span className="font-display text-[18px] font-medium tracking-[-0.01em]">Crosswalk</span>
      </div>

      <nav className="flex flex-col gap-px">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) => (isActive ? activeClass : inactiveClass)}
          >
            <item.icon className="h-3.75 w-3.75 shrink-0" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="flex min-h-0 flex-1 flex-col">
        <div className="mb-2 flex items-center justify-between px-2.5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-strong">
            Playlists
          </p>
          <Button
            type="button"
            aria-label="Add playlist"
            variant="icon-transparent"
            onClick={() => setAdding((v) => !v)}
          >
            <Plus className="h-2.75 w-2.75" strokeWidth={2.5} />
          </Button>
        </div>
        {adding && (
          <div className="mb-1 flex items-center gap-1.5 pb-2">
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={cancelAdd}
              onKeyDown={(e) => {
                if (e.key === 'Enter') void createPlaylist();
                if (e.key === 'Escape') cancelAdd();
              }}
              placeholder="New Playlist Name"
              className="min-w-0 flex-1 rounded-md bg-panel-2 px-2.5 py-1.5 text-[13px] text-foreground outline-none placeholder:text-muted-strong"
            />
            <Button
              type="button"
              aria-label="Create playlist"
              variant="pill"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => void createPlaylist()}
              className="h-8 w-8 shrink-0 rounded-full p-0"
            >
              <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
            </Button>
          </div>
        )}
        <ul ref={listRef} className="flex min-h-0 flex-1 flex-col gap-px overflow-hidden">
          {visible.map((playlist) => (
            <PlaylistNavItem key={playlist.id} playlist={playlist} />
          ))}
        </ul>
        {playlists.length > visible.length && (
          <NavLink
            to="/playlists"
            className="mt-1.5 block px-2.5 text-[11px] font-medium text-ink-3 transition-colors hover:text-foreground"
          >
            View all
          </NavLink>
        )}
      </div>

      <Button
        type="button"
        onClick={onLogout}
        aria-label="Sign out"
        title="Sign out"
        variant="icon-transparent"
        className="mt-auto flex w-full items-center gap-2.5 rounded-lg border border-hairline p-2.5 text-left transition-colors hover:border-hairline-2 py-6 cursor-pointer"
      >
        <span className="grid h-7.5 w-7.5 shrink-0 place-items-center rounded-full text-[11px] font-bold text-on-accent username-gradient">
          {initials}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[12.5px] font-medium text-foreground">
            {username ?? 'Guest'}
          </span>
          <span className="mt-px block text-[10.5px] uppercase tracking-[0.04em] text-muted-strong">
            Sign out
          </span>
        </span>
        <ChevronRight className="h-3.25 w-3.25 shrink-0 text-muted-strong" strokeWidth={2} />
      </Button>
    </aside>
  );
}
