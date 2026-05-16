import { useState } from 'react';
import {
  ChevronUp,
  Heart,
  ListMusic,
  Pause,
  Play,
  Repeat,
  Repeat1,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume2,
} from 'lucide-react';
import usePlayer from '@/hooks/usePlayer';
import useNavidromeRequest from '@/hooks/useNavidromeRequest';
import Queue from '@/components/Queue/Queue';
import NowPlayingView from '@/components/NowPlayingView/NowPlayingView';
import { Button } from '../ui/button';

export default function Player() {
  const {
    queue,
    currentIndex,
    currentSong,
    isPlaying,
    volume,
    shuffle,
    repeat,
    currentTime,
    duration,
    togglePlay,
    next,
    prev,
    seek,
    setVolume,
    toggleShuffle,
    cycleRepeat,
  } = usePlayer();

  const [queueOpen, setQueueOpen] = useState(false);
  const [nowPlayingOpen, setNowPlayingOpen] = useState(false);

  const { data: coverArtSrc } = useNavidromeRequest<string>(
    '/rest/getCoverArt.view',
    { id: currentSong?.coverArt, size: 96 },
    { responseType: 'blobUrl', skip: !currentSong?.coverArt }
  );

  const progress = duration > 0
    ? (currentTime / duration) * 100
    : 0;

  const formatTime = (secs: number): string => {
    if (!isFinite(secs) || isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (duration <= 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    seek(Math.max(0, Math.min(duration, ratio * duration)));
  }

  const handleVolumeClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    setVolume(Math.max(0, Math.min(1, ratio)));
  }

  if (!currentSong) {
    return <></>;
  }

  return (
    <>
      <div
        className="fixed inset-x-0 bottom-0 z-50 flex h-19 items-center border-t border-hairline bg-panel px-6 controls-wrapper"
      >
        {/* Left (now playing) */}
        <div className="flex min-w-0 items-center gap-3">
          <Button
            type="button"
            aria-label="Open now playing view"
            onClick={() => setNowPlayingOpen(true)}
            variant='icon-transparent'
            className="group flex min-w-0 items-center gap-3 rounded-md p-0.5 transition-opacity hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-(--accent-soft)"
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
          <Button
            type="button"
            aria-label="Like"
            variant="icon"
            className='border-0'
          >
            <Heart className="h-3.75 w-3.75 fill-current" />
          </Button>
        </div>

        {/* Center (controls + progress) */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2.5">
            <Button
              type="button"
              aria-label="Shuffle"
              onClick={toggleShuffle}
              variant="icon-transparent"
              className={`${shuffle ? 'text-accent-gold' : 'text-ink-3'}`}
            >
              <Shuffle className="h-3.75 w-3.75" />
            </Button>

            <Button
              type="button"
              aria-label="Previous"
              onClick={prev}
              variant="icon-transparent"
            >
              <SkipBack className="h-3.75 w-3.75 fill-current" />
            </Button>

            <Button
              type="button"
              aria-label={isPlaying ? 'Pause' : 'Play'}
              onClick={togglePlay}
              className="grid h-8.5 w-8.5 place-items-center rounded-full bg-foreground text-background transition hover:scale-105 hover:bg-accent-gold"
            >
              {isPlaying ? (
                <Pause className="h-3 w-3 fill-current" />
              ) : (
                <Play className="h-3 w-3 fill-current" />
              )}
            </Button>

            <Button
              type="button"
              aria-label="Next"
              onClick={next}
              variant="icon-transparent"
            >
              <SkipForward className="h-3.75 w-3.75 fill-current" />
            </Button>

            <Button
              type="button"
              aria-label="Repeat"
              onClick={cycleRepeat}
              variant="icon-transparent"
              className={`${repeat !== 'none' ? 'text-accent-gold' : 'text-ink-3'}`}
            >
              {repeat === 'one' ? (
                <Repeat1 className="h-3.75 w-3.75" />
              ) : (
                <Repeat className="h-3.75 w-3.75" />
              )}
            </Button>
          </div>

          {/* Progress bar */}
          <div
            className="grid w-full max-w-135 items-center gap-2.5 progress-bar-wrapper"
          >
            <span className="text-center text-[10.5px] tabular-nums text-muted-strong">
              {formatTime(currentTime)}
            </span>

            <div
              role="slider"
              aria-label="Seek"
              aria-valuenow={Math.round(currentTime)}
              aria-valuemin={0}
              aria-valuemax={Math.round(duration)}
              tabIndex={0}
              className="relative h-0.75 cursor-pointer overflow-hidden rounded-sm bg-hairline-2"
              onClick={handleProgressClick}
            >
              <div
                className="h-full rounded-sm bg-accent-gold transition-none"
                style={{ width: `${progress}%` }}
              />
            </div>

            <span className="text-center text-[10.5px] tabular-nums text-muted-strong">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Right (volume + queue) */}
        <div className="flex items-center justify-end gap-3.5">
          <div className="flex min-w-25 items-center gap-2">
            <Volume2 className="h-3.5 w-3.5 shrink-0 text-ink-3" />
            <div
              role="slider"
              aria-label="Volume"
              aria-valuenow={Math.round(volume * 100)}
              aria-valuemin={0}
              aria-valuemax={100}
              tabIndex={0}
              className="h-0.75 flex-1 cursor-pointer overflow-hidden rounded-sm bg-hairline-2"
              onClick={handleVolumeClick}
            >
              <div className="h-full rounded-sm bg-ink-2" style={{ width: `${volume * 100}%` }} />
            </div>
          </div>

          <Button
            type="button"
            aria-label="Queue"
            aria-pressed={queueOpen}
            onClick={() => setQueueOpen((o) => !o)}
            variant="icon-transparent"
            className={
              queueOpen ? 'text-accent-gold' : 'text-ink-3 hover:text-foreground'
            }
          >
            <ListMusic className="h-3.75 w-3.75" />
          </Button>
        </div>
      </div>

      <Queue
        queue={queue}
        currentIndex={currentIndex}
        isOpen={queueOpen}
        onClose={() => setQueueOpen(false)}
      />

      <NowPlayingView isOpen={nowPlayingOpen} onClose={() => setNowPlayingOpen(false)} />
    </>
  );
}
