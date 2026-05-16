import type { Song } from '@/@types/types';
import { cn, formatPlayingTime } from '@/lib/utils';
import useNavidromeRequest from '@/hooks/useNavidromeRequest';

type QueueRowProps = {
  song: Song;
  isPlaying?: boolean;
  onClick?: () => void;
};

export function QueueRow({ song, isPlaying = false, onClick }: QueueRowProps) {
  const { data: coverUrl } = useNavidromeRequest<string>(
    '/rest/getCoverArt.view',
    { id: song.coverArt, size: 64 },
    { responseType: 'blobUrl', skip: !song.coverArt }
  );

  return (
    <div
      role="button"
      onClick={onClick}
      className={cn(
        'grid items-center gap-2.5 rounded-lg p-2 transition-colors grid-cols-[34px_1fr_auto]',
        isPlaying
          ? 'bg-(--accent-soft) text-foreground outline-1 outline-[rgba(232,182,90,0.18)]'
          : 'cursor-pointer text-ink-2 hover:bg-white/4'
      )}
    >
      <div className="h-8.5 w-8.5 shrink-0 overflow-hidden rounded-[5px] bg-panel-2">
        {coverUrl && <img src={coverUrl} alt="" className="h-full w-full object-cover" />}
      </div>
      <div className="min-w-0">
        <p className="truncate text-[12.5px] font-semibold">
          {isPlaying && (
            <span className="mr-1.5 inline-block h-1.5 w-1.5 -translate-y-px rounded-full bg-accent-gold shadow-[0_0_14px_rgba(232,182,90,0.8)]" />
          )}
          {song.title}
        </p>
        <p className="mt-0.5 truncate text-[11px] text-ink-3">{song.artist}</p>
      </div>
      <span className="shrink-0 text-[10.5px] tabular-nums text-muted-strong">
        {formatPlayingTime(song.duration)}
      </span>
    </div>
  );
}
