import { Music } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import type { Playlist } from '@/@types/types';
import useNavidromeRequest from '@/hooks/useNavidromeRequest';

export type PlaylistNavItemProps = {
  playlist: Playlist;
};

export default function PlaylistNavItem({ playlist }: PlaylistNavItemProps) {
  const { data: coverArtUrl } = useNavidromeRequest<string>(
    '/rest/getCoverArt.view',
    { id: playlist.coverArt, size: 48 },
    { responseType: 'blobUrl' }
  );

  const baseClass =
    'grid w-full grid-cols-[24px_1fr] items-center gap-2.5 rounded-md px-2.5 py-1.5 text-left text-[13px] transition-colors';
  const inactiveClass = `${baseClass} text-ink-2 hover:bg-panel-2 hover:text-foreground`;
  const activeClass = `${baseClass} bg-panel-3 text-foreground`;

  return (
    <li>
      <NavLink
        to={`/playlist/${playlist.id}`}
        title={playlist.name}
        className={({ isActive }) => (isActive ? activeClass : inactiveClass)}
      >
        {coverArtUrl ? (
          <img src={coverArtUrl} alt="" className="h-6 w-6 shrink-0 rounded-[3px] object-cover" />
        ) : (
          <span className="grid h-6 w-6 shrink-0 place-items-center rounded-[3px] bg-panel-3 text-ink-3">
            <Music className="h-3 w-3" />
          </span>
        )}
        <span className="truncate font-[450]">{playlist.name}</span>
      </NavLink>
    </li>
  );
}
