import type { Playlist } from '@/@types/types';

export type PlaylistNavItemProps = {
  playlist: Playlist;
  isActive?: boolean;
  onClick?: Function;
};

export default function PlaylistNavItem({
  playlist,
  isActive = false,
  onClick,
}: PlaylistNavItemProps) {
  return (
    <li key={playlist.id}>
      <button
        onClick={() => onClick?.(playlist)}
        className="w-full rounded-md px-3 py-2 text-left text-sm text-ink-2 transition-colors hover:bg-panel-3 hover:text-foreground truncate"
        type="button"
        title={playlist.name}
      >
        {playlist.name}
      </button>
    </li>
  );
}
