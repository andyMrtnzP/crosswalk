import { Music } from 'lucide-react';
import type { Playlist } from '@/@types/types';
import useNavidromeRequest from '@/hooks/useNavidromeRequest';

export type PlaylistNavItemProps = {
  playlist: Playlist;
  isActive?: boolean;
  onClick?: (playlist: Playlist) => void;
};

export default function PlaylistNavItem({ playlist, isActive = false, onClick }: PlaylistNavItemProps) {
  const { data: coverArtUrl } = useNavidromeRequest<string>(
    '/rest/getCoverArt.view',
    { id: playlist.coverArt, size: 48 },
    { responseType: 'blobUrl' },
  );

  return (
    <li>
      <button
        type="button"
        onClick={() => onClick?.(playlist)}
        title={playlist.name}
        className={
          isActive
            ? 'grid w-full grid-cols-[24px_1fr] items-center gap-2.5 rounded-md bg-panel-3 px-2.5 py-1.5 text-left text-[13px] text-foreground transition-colors'
            : 'grid w-full grid-cols-[24px_1fr] items-center gap-2.5 rounded-md px-2.5 py-1.5 text-left text-[13px] text-ink-2 transition-colors hover:bg-panel-2 hover:text-foreground'
        }
      >
        {coverArtUrl ? (
          <img src={coverArtUrl} alt="" className="h-6 w-6 flex-shrink-0 rounded-[3px] object-cover" />
        ) : (
          <span className="grid h-6 w-6 flex-shrink-0 place-items-center rounded-[3px] bg-panel-3 text-ink-3">
            <Music className="h-3 w-3" />
          </span>
        )}
        <span className="truncate font-[450]">{playlist.name}</span>
      </button>
    </li>
  );
}
