import { Heart, Play } from 'lucide-react';
import type { Song } from '@/@types/types';
import { formatTrackDuration } from '@/lib/utils';

export const TRACK_COLS = '28px 1fr 1fr 72px 36px';

type AlbumTrackRowProps = {
  song: Song;
  index: number;
};

export default function AlbumTrackRow({ song, index }: AlbumTrackRowProps) {
  return (
    <div
      className="group relative grid cursor-pointer items-center gap-4 rounded-md px-3 py-[9px] transition-colors hover:bg-panel-2"
      style={{ gridTemplateColumns: TRACK_COLS }}
    >
      {/* Index */}
      <div className="relative h-4 text-center text-[12.5px] tabular-nums text-ink-3">
        <span className="group-hover:hidden">{index}</span>
        <span className="hidden items-center justify-center group-hover:flex">
          <Play className="h-3 w-3 fill-current text-foreground" />
        </span>
      </div>

      {/* Title */}
      <p className="truncate text-[13px] font-medium text-foreground">{song.title}</p>

      {/* Artist */}
      <p className="truncate text-[12px] text-ink-3">{song.artist}</p>

      {/* Duration */}
      <p className="text-right text-[12px] tabular-nums text-ink-3">
        {formatTrackDuration(song.duration)}
      </p>

      {/* Heart */}
      <button
        type="button"
        aria-label={`Like ${song.title}`}
        className="grid place-items-center rounded p-1 text-ink-3 opacity-0 transition hover:text-accent-gold group-hover:opacity-100"
      >
        <Heart className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}