import { useEffect, useState } from 'react';
import { Home, Search, BookOpen, Users, ListMusic } from 'lucide-react';
import useNavidromeRequest from '@/hooks/useNavidromeRequest';
import type { Playlist } from '@/@types/types';
import PlaylistNavItem from './PlaylistNavItem/PlaylistNavItem';

type NavItem = {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

const NAV_ITEMS: NavItem[] = [
  {
    label: 'Home',
    icon: Home,
  },
  {
    label: 'Search',
    icon: Search,
  },
  {
    label: 'Library',
    icon: BookOpen,
  },
  {
    label: 'Artists',
    icon: Users,
  },
  {
    label: 'Playlists',
    icon: ListMusic,
  },
];

type SidebarProps = {
  activeItem?: string;
  onNavClick?: (item: string) => void;
  onLogout?: () => void;
  username?: string;
};

type PlaylistsResponse = {
  'subsonic-response': {
    status: 'ok' | 'failed';
    playlists?: {
      playlist?: Playlist[];
    };
  };
};

export default function Sidebar({
  activeItem = 'Home',
  onNavClick,
  onLogout,
  username,
}: SidebarProps) {
  const { data } = useNavidromeRequest<PlaylistsResponse>('/rest/getPlaylists.view');
  const [playlists, setPlaylists] = useState<Playlist[]>([]);

  useEffect(() => {
    if (data?.['subsonic-response']?.playlists?.playlist) {
      setPlaylists(data['subsonic-response'].playlists.playlist);
    }
  }, [data]);

  return (
    <aside className="flex h-screen w-[232px] flex-col border-r border-hairline bg-background sticky">
      {/* Brand */}
      <div className="border-b border-hairline px-6 py-8">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-wider text-muted-strong">Crosswalk</p>
          {username && <p className="text-sm text-ink-2">{username}</p>}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {NAV_ITEMS.map((item) => (
            <li key={item.label}>
              <button
                onClick={() => onNavClick?.(item.label)}
                className={`relative flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                  activeItem === item.label
                    ? 'bg-panel-3 text-accent-gold before:absolute before:left-0 before:h-full before:w-0.5 before:bg-accent-gold before:rounded-r'
                    : 'text-ink-2 hover:text-foreground hover:bg-panel-3'
                }`}
                type="button"
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>

        {/* Playlists Section */}
        {playlists.length > 0 && (
          <div className="mt-8 space-y-2">
            <div className="px-3 py-2">
              <p className="text-xs uppercase tracking-wider text-muted-strong">Playlists</p>
            </div>
            <ul className="space-y-1">
              {playlists.map((playlist) => (
                <PlaylistNavItem key={playlist.id} playlist={playlist} />
              ))}
            </ul>
          </div>
        )}
      </nav>

      {/* Sign out */}
      <div className="border-t border-hairline px-3 py-4">
        <button
          onClick={onLogout}
          className="w-full rounded-md px-3 py-2 text-sm font-medium text-ink-2 transition-colors hover:bg-panel-3 hover:text-foreground"
          type="button"
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}
