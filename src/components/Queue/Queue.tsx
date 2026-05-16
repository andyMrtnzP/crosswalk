import usePlayer from '@/hooks/usePlayer';
import { X } from 'lucide-react';
import { Button } from '../ui/button';
import { QueueRow } from './QueueRow';

type QueuePopoverProps = {
  variant?: 'popover';
  isOpen: boolean;
  onClose: () => void;
};

type QueuePanelProps = {
  variant: 'panel';
  isOpen?: never;
  onClose?: never;
};

type QueueProps = QueuePopoverProps | QueuePanelProps;

export default function Queue({ variant = 'popover', isOpen, onClose }: QueueProps) {
  const { queue, currentIndex, playQueue } = usePlayer();

  if (variant === 'popover' && !isOpen) return null;

  const currentSong = queue[currentIndex] ?? null;
  const played = queue.slice(0, currentIndex);
  const upcoming = queue.slice(currentIndex + 1);

  const listBody = (
    <>
      {queue.length === 0 && (
        <p className="px-2 py-8 text-center text-[13px] text-ink-3">Queue is empty</p>
      )}

      {played.length > 0 && (
        <>
          <p className="px-2 pb-2 pt-3 text-[10px] font-bold uppercase tracking-[0.15em] text-muted-strong">
            Played
          </p>
          {played.map((song, i) => (
            <div key={song.id} className="opacity-40">
              <QueueRow song={song} onClick={() => playQueue(queue, i)} />
            </div>
          ))}
        </>
      )}

      {currentSong && (
        <>
          <p className="px-2 pb-2 pt-3 text-[10px] font-bold uppercase tracking-[0.15em] text-muted-strong">
            Now playing
          </p>
          <QueueRow song={currentSong} onClick={() => playQueue(queue, currentIndex)} isPlaying />
        </>
      )}

      {upcoming.length > 0 && (
        <>
          <p className="px-2 pb-2 pt-3 text-[10px] font-bold uppercase tracking-[0.15em] text-muted-strong">
            Up next
          </p>
          {upcoming.map((song, i) => (
            <QueueRow
              key={song.id}
              song={song}
              onClick={() => playQueue(queue, currentIndex + 1 + i)}
            />
          ))}
        </>
      )}
    </>
  );

  if (variant === 'panel') {
    return (
      <div
        className="flex min-h-0 flex-col rounded-[18px] border border-hairline bg-[rgba(15,15,15,0.66)] p-4.5 shadow-2xl backdrop-blur-[18px]"
        style={{ alignSelf: 'stretch' }}
      >
        <div className="mb-2 flex shrink-0 items-baseline justify-between border-b border-hairline pb-3">
          <h2 className="font-serif text-2xl font-normal tracking-[-0.02em]">Queue</h2>
          <span className="text-[11.5px] tabular-nums text-ink-3">{queue.length} tracks</span>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto pr-0.5" style={{ scrollbarWidth: 'none' }}>
          {listBody}
          {upcoming.length === 0 && currentSong && (
            <p className="px-2 py-4 text-[12px] text-ink-3">End of queue</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed bottom-21 right-4 z-50 flex w-[320px] flex-col overflow-hidden rounded-[18px] border border-hairline bg-[rgba(15,15,15,0.92)] shadow-2xl backdrop-blur-[18px]"
      style={{ maxHeight: 'calc(100vh - 104px)' }}
    >
      <div className="flex shrink-0 items-center justify-between border-b border-hairline px-4.5 pb-3 pt-4.5">
        <h2 className="font-serif text-2xl font-normal tracking-[-0.02em] text-foreground">
          Queue
        </h2>
        <Button type="button" aria-label="Close queue" onClick={onClose} variant="icon-transparent">
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto px-2.5 pb-4">{listBody}</div>
    </div>
  );
}
