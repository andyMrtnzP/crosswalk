import { useState } from 'react';
import { ChevronUp, Heart, ListMusic } from 'lucide-react';
import usePlayer from '@/hooks/usePlayer';
import useNavidromeRequest from '@/hooks/useNavidromeRequest';
import Queue from '@/components/Queue/Queue';
import NowPlayingView from '@/components/NowPlayingView/NowPlayingView';
import { Button } from '../ui/button';
import TransportControls from './TransportControls';
import ProgressBar from './ProgressBar';
import VolumeSlider from './VolumeSlider';

type PlayerProps = {
  variant?: 'bar' | 'expanded';
};

export default function Player({ variant = 'bar' }: PlayerProps) {
  const { queue, currentIndex, currentSong } = usePlayer();

  const [queueOpen, setQueueOpen] = useState(false);
  const [nowPlayingOpen, setNowPlayingOpen] = useState(false);

  const { data: coverArtSrc } = useNavidromeRequest<string>(
    '/rest/getCoverArt.view',
    { id: currentSong?.coverArt, size: 96 },
    { responseType: 'blobUrl', skip: !currentSong?.coverArt }
  );

  const nextSong = queue[currentIndex + 1] ?? null;
  const { data: nextCoverSrc } = useNavidromeRequest<string>(
    '/rest/getCoverArt.view',
    { id: nextSong?.coverArt, size: 64 },
    { responseType: 'blobUrl', skip: !nextSong?.coverArt }
  );

  if (!currentSong) {
    return <></>;
  }

  if (variant === 'expanded') {
    // Use a different layout for the "Now Playing" view
    // with different info
    return (
      <div className="grid items-center gap-7 rounded-[18px] border border-hairline bg-[rgba(15,15,15,0.76)] px-5.5 py-4.5 shadow-2xl backdrop-blur-lg grid-cols-[1fr_auto_1fr]">
        {/* Left (next track preview) */}
        <div className="flex min-w-0 items-center gap-3">
          {nextSong ? (
            <>
              <div className="h-10.5 w-10.5 shrink-0 overflow-hidden rounded-[5px] bg-panel-2">
                {nextCoverSrc && (
                  <img src={nextCoverSrc} alt="" className="h-full w-full object-cover" />
                )}
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-muted-strong">
                  Up next
                </p>
                <p className="mt-0.5 truncate text-[13px] text-ink-2">
                  {nextSong.title}
                  {nextSong.artist && (
                    <span className="text-ink-3"> &mdash; {nextSong.artist}</span>
                  )}
                </p>
              </div>
            </>
          ) : (
            <span className="text-[12px] text-ink-3">End of queue</span>
          )}
        </div>

        {/* Center (transport + progress) */}
        <div className="flex flex-col items-center gap-3" style={{ minWidth: 'min(540px, 42vw)' }}>
          <TransportControls />
          <ProgressBar />
        </div>

        {/* Right (volume) */}
        <div className="flex items-center justify-end gap-3.5">
          <VolumeSlider />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-50 flex h-19 items-center border-t border-hairline bg-panel px-6 controls-wrapper">
        {/* Left (now playing) */}
        <div className="flex min-w-0 items-center gap-3">
          <Button
            type="button"
            aria-label="Open now playing view"
            onClick={() => setNowPlayingOpen(true)}
            variant="icon-transparent"
            className="group flex min-w-0 items-center gap-3 rounded-md p-0.5 transition-opacity hover:opacity-80 focus:outline-none"
          >
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-sm bg-panel-2">
              {coverArtSrc && (
                <img
                  src={coverArtSrc}
                  alt={currentSong.title}
                  className="h-full w-full object-cover"
                />
              )}
              <div className="absolute inset-0 grid place-items-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                <ChevronUp className="h-4 w-4 text-white" />
              </div>
            </div>
            <div className="min-w-0 text-left">
              <p className="truncate text-[13px] font-medium text-foreground">
                {currentSong.title}
              </p>
              <p className="mt-0.5 truncate text-[11.5px] text-ink-3">{currentSong.artist}</p>
            </div>
          </Button>
          <Button type="button" aria-label="Like" variant="icon" className="border-0">
            <Heart className="h-3.75 w-3.75 fill-current" />
          </Button>
        </div>

        {/* Center (controls + progress) */}
        <div className="flex flex-col items-center gap-2">
          <TransportControls compact />
          <ProgressBar className="max-w-135" />
        </div>

        {/* Right (volume + queue) */}
        <div className="flex items-center justify-end gap-3.5">
          <VolumeSlider />
          <Button
            type="button"
            aria-label="Queue"
            aria-pressed={queueOpen}
            onClick={() => setQueueOpen((o) => !o)}
            variant="icon-transparent"
            className={queueOpen ? 'text-accent-gold' : 'text-ink-3 hover:text-foreground'}
          >
            <ListMusic className="h-3.75 w-3.75" />
          </Button>
        </div>
      </div>

      <Queue isOpen={queueOpen} onClose={() => setQueueOpen(false)} />

      <NowPlayingView isOpen={nowPlayingOpen} onClose={() => setNowPlayingOpen(false)} />
    </>
  );
}
