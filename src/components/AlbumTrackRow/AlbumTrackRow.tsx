import { Heart, Play } from 'lucide-react';
import type { Song } from '@/@types/types';
import { cn, formatTimecode } from '@/lib/utils';
import useContextMenu from '@/hooks/useContextMenu';
import AnimatedEqBars from '../AnimatedEqBars/AnimatedEqBars';
import { Button } from '../ui/button';

export const TRACK_COLS = '28px 1fr 1fr 72px 36px';

type AlbumTrackRowProps = {
  song: Song;
  index: number;
  onPlay: () => void;
  isCurrentlyPlaying?: boolean;
};

export default function AlbumTrackRow({
  song,
  index,
  onPlay,
  isCurrentlyPlaying = false,
}: AlbumTrackRowProps) {
  const { openSongMenu } = useContextMenu();
  return (
    <div
      className={`group relative grid cursor-pointer items-center gap-4 rounded-md px-3 py-2.25 transition-colors hover:bg-panel-2 ${isCurrentlyPlaying ? 'bg-panel-2' : ''}`}
      style={{ gridTemplateColumns: TRACK_COLS }}
      onClick={onPlay}
      onContextMenu={(e) => openSongMenu(e, song, onPlay)}
    >
      {isCurrentlyPlaying && (
        <span className="absolute bottom-2 left-0 top-2 w-0.5 rounded-sm bg-accent-gold" />
      )}

      <div className="relative h-4 text-center text-[12.5px] tabular-nums text-ink-3">
        {isCurrentlyPlaying && <AnimatedEqBars />}

        {!isCurrentlyPlaying && (
          <>
            <span className="group-hover:hidden">{index}</span>
            <span className="hidden items-center justify-center group-hover:flex">
              <Play className="h-3 w-3 fill-current text-foreground" />
            </span>
          </>
        )}
      </div>

      {/* Title */}
      <p
        className={cn(
          'truncate text-[12px]',
          isCurrentlyPlaying ? 'text-accent-gold' : 'text-foreground'
        )}
      >
        {song.title}
      </p>

      {/* Artist */}
      <p className="truncate text-[12px] text-ink-3">{song.artist}</p>

      {/* Duration */}
      <p className="text-right text-[12px] tabular-nums text-ink-3">
        {formatTimecode(song.duration)}
      </p>

      {/* Heart */}
      <Button
        type="button"
        aria-label={`Like ${song.title}`}
        onClick={(e) => e.stopPropagation()}
        variant="icon-invisible"
      >
        <Heart className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
