import { useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { ChevronRight, Plus } from 'lucide-react';
import useNavidromeRequest from '@/hooks/useNavidromeRequest';
import usePlayer from '@/hooks/usePlayer';
import PlaylistNavItem from './PlaylistNavItem/PlaylistNavItem';
import { NAV_ITEMS, type PlaylistsResponse } from '@/@types/types';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';

type SidebarProps = {
  onLogout?: () => void;
  username?: string;
};

export default function Sidebar({ onLogout, username }: SidebarProps) {
  const { data } = useNavidromeRequest<PlaylistsResponse>('/rest/getPlaylists.view');
  const { currentSong } = usePlayer();
  const playlists = data?.['subsonic-response']?.playlists?.playlist ?? [];

  const initials = useMemo(() => (username ? username.slice(0, 2).toUpperCase() : '?'), [username]);

  const baseClass =
    'flex items-center gap-[11px] rounded-md px-2.5 py-2 text-[13px] font-[450] transition-colors';
  const inactiveClass = `${baseClass} text-ink-2 hover:bg-panel-2 hover:text-foreground`;
  const activeClass = `${baseClass} bg-panel-3 text-foreground before:-ml-2.5 before:mr-2 before:block before:h-[14px] before:w-[2px] before:flex-shrink-0 before:rounded-[1px] before:bg-accent-gold before:content-['']`;

  return (
    <aside className={cn(
      `sticky top-0 flex flex-col gap-6.5 overflow-y-auto border-r border-hairline bg-background px-4.5 pt-7 pb-6 [&::-webkit-scrollbar]:hidden`,
      currentSong ? 'h-[calc(100vh-76px)]' : 'h-screen'
    )}>
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

      {playlists.length > 0 && (
        <div>
          <div className="mb-2 flex items-center justify-between px-2.5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-strong">
              Playlists
            </p>
            <Button
              type="button"
              aria-label="Add playlist"
              variant="icon-transparent"
            >
              <Plus className="h-2.75 w-2.75" strokeWidth={2.5} />
            </Button>
          </div>
          <ul className="flex flex-col gap-px">
            {playlists.map((playlist) => (
              <PlaylistNavItem key={playlist.id} playlist={playlist} />
            ))}
          </ul>
        </div>
      )}

      <Button
        type="button"
        onClick={onLogout}
        aria-label="Sign out"
        title="Sign out"
        variant="icon-transparent"
        className="mt-auto flex w-full items-center gap-2.5 rounded-lg border border-hairline p-2.5 text-left transition-colors hover:border-hairline-2 py-6 cursor-pointer"
      >
        <span
          className="grid h-7.5 w-7.5 shrink-0 place-items-center rounded-full text-[11px] font-bold text-on-accent username-gradient"
        >
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
        <ChevronRight
          className="h-3.25 w-3.25 shrink-0 text-muted-strong"
          strokeWidth={2}
        />
      </Button>
    </aside>
  );
}
