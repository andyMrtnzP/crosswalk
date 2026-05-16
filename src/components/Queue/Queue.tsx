import usePlayer from '@/hooks/usePlayer';
import type { Song } from '@/@types/types';
import { X } from 'lucide-react';
import { Button } from '../ui/button';
import { QueueRow } from './QueueRow';

type QueueProps = {
  queue: Song[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
};

export default function Queue({ queue, currentIndex, isOpen, onClose }: QueueProps) {
  const { playQueue } = usePlayer();

  if (!isOpen) return null;

  const currentSong = queue[currentIndex] ?? null;
  const played = queue.slice(0, currentIndex);
  const upcoming = queue.slice(currentIndex + 1);

  return (
    <>
      <div
        className="fixed bottom-21 right-4 z-50 flex w-[320px] flex-col overflow-hidden rounded-[18px] border border-hairline bg-[rgba(15,15,15,0.92)] shadow-2xl backdrop-blur-[18px]"
        style={{ maxHeight: 'calc(100vh - 104px)' }}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-hairline px-4.5 pb-3 pt-4.5">
          <h2 className="font-serif text-2xl font-normal tracking-[-0.02em] text-foreground">
            Queue
          </h2>
          <Button
            type="button"
            aria-label="Close queue"
            onClick={onClose}
            variant="icon-transparent"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-2.5 pb-4">
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
              <QueueRow
                song={currentSong}
                onClick={() => playQueue(queue, currentIndex)}
                isPlaying
              />
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
        </div>
      </div>
    </>
  );
}
