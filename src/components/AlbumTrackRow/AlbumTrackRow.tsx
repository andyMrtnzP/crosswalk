import { Heart, Play } from 'lucide-react';
import type { Song } from '@/@types/types';
import { formatTrackDuration } from '@/lib/utils';

export const TRACK_COLS = '28px 1fr 1fr 72px 36px';

type AlbumTrackRowProps = {
  song: Song;
  index: number;
  onPlay: () => void;
  isCurrentlyPlaying?: boolean;
};

export default function AlbumTrackRow({ song, index, onPlay, isCurrentlyPlaying = false }: AlbumTrackRowProps) {
  return (
    <div
      className={`group relative grid cursor-pointer items-center gap-4 rounded-md px-3 py-[9px] transition-colors hover:bg-panel-2 ${isCurrentlyPlaying ? 'bg-panel-2' : ''}`}
      style={{ gridTemplateColumns: TRACK_COLS }}
      onClick={onPlay}
    >
      {/* Gold left rail when playing */}
      {isCurrentlyPlaying && (
        <span className="absolute bottom-2 left-0 top-2 w-0.5 rounded-sm bg-accent-gold" />
      )}

      {/* Index / eq / play-on-hover */}
      <div className="relative h-4 text-center text-[12.5px] tabular-nums text-ink-3">
        {isCurrentlyPlaying ? (
          /* Animated equalizer bars */
          <span className="flex h-full items-end justify-center gap-[2px]">
            <span className="w-[2px] rounded-sm bg-accent-gold" style={{ animation: 'eq 1s ease-in-out infinite', height: '40%' }} />
            <span className="w-[2px] rounded-sm bg-accent-gold" style={{ animation: 'eq 1s ease-in-out infinite', animationDelay: '0.2s', height: '100%' }} />
            <span className="w-[2px] rounded-sm bg-accent-gold" style={{ animation: 'eq 1s ease-in-out infinite', animationDelay: '0.4s', height: '60%' }} />
          </span>
        ) : (
          <>
            <span className="group-hover:hidden">{index}</span>
            <span className="hidden items-center justify-center group-hover:flex">
              <Play className="h-3 w-3 fill-current text-foreground" />
            </span>
          </>
        )}
      </div>

      {/* Title */}
      <p className={`truncate text-[13px] font-medium ${isCurrentlyPlaying ? 'text-accent-gold' : 'text-foreground'}`}>
        {song.title}
      </p>

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
        onClick={e => e.stopPropagation()}
        className="grid place-items-center rounded p-1 text-ink-3 opacity-0 transition hover:text-accent-gold group-hover:opacity-100"
      >
        <Heart className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
