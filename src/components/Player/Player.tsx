import { Heart, Pause, Play, Repeat, Repeat1, Shuffle, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import usePlayer from '@/hooks/usePlayer';
import useNavidromeRequest from '@/hooks/useNavidromeRequest';

function formatTime(secs: number): string {
  if (!isFinite(secs) || isNaN(secs)) return '0:00';
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function Player() {
  const { currentSong, isPlaying, volume, shuffle, repeat, currentTime, duration, togglePlay, next, prev, seek, setVolume, toggleShuffle, cycleRepeat } = usePlayer();

  const { data: coverArtSrc } = useNavidromeRequest<string>(
    '/rest/getCoverArt.view',
    { id: currentSong?.coverArt, size: 96 },
    { responseType: 'blobUrl', skip: !currentSong?.coverArt }
  );

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  function handleProgressClick(e: React.MouseEvent<HTMLDivElement>) {
    if (duration <= 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    seek(Math.max(0, Math.min(duration, ratio * duration)));
  }

  function handleVolumeClick(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    setVolume(Math.max(0, Math.min(1, ratio)));
  }

  if (!currentSong) {
    return (
      <></>
    );
  }

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-50 flex h-[76px] items-center border-t border-hairline bg-panel px-6"
      style={{ display: 'grid', gridTemplateColumns: 'minmax(220px,1fr) minmax(360px,2fr) minmax(220px,1fr)' }}
    >
      {/* Left — now playing */}
      <div className="flex min-w-0 items-center gap-3">
        <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-[4px] bg-panel-2">
          {coverArtSrc && (
            <img src={coverArtSrc} alt={currentSong.title} className="h-full w-full object-cover" />
          )}
        </div>
        <div className="min-w-0">
          <p className="truncate text-[13px] font-medium text-foreground">{currentSong.title}</p>
          <p className="mt-0.5 truncate text-[11.5px] text-ink-3">{currentSong.artist}</p>
        </div>
        <button
          type="button"
          aria-label="Like"
          className="ml-2 grid flex-shrink-0 place-items-center text-accent-gold"
        >
          <Heart className="h-[15px] w-[15px] fill-current" />
        </button>
      </div>

      {/* Center — controls + progress */}
      <div className="flex flex-col items-center gap-2">
        {/* Transport controls */}
        <div className="flex items-center gap-[18px]">
          <button
            type="button"
            aria-label="Shuffle"
            onClick={toggleShuffle}
            className={`grid place-items-center transition-colors hover:text-foreground ${shuffle ? 'text-accent-gold' : 'text-ink-3'}`}
          >
            <Shuffle className="h-[15px] w-[15px]" />
          </button>

          <button
            type="button"
            aria-label="Previous"
            onClick={prev}
            className="grid place-items-center text-ink-3 transition-colors hover:text-foreground"
          >
            <SkipBack className="h-[15px] w-[15px] fill-current" />
          </button>

          <button
            type="button"
            aria-label={isPlaying ? 'Pause' : 'Play'}
            onClick={togglePlay}
            className="grid h-[34px] w-[34px] place-items-center rounded-full bg-foreground text-background transition hover:scale-105 hover:bg-accent-gold"
          >
            {isPlaying ? (
              <Pause className="h-3 w-3 fill-current" />
            ) : (
              <Play className="h-3 w-3 fill-current" />
            )}
          </button>

          <button
            type="button"
            aria-label="Next"
            onClick={next}
            className="grid place-items-center text-ink-3 transition-colors hover:text-foreground"
          >
            <SkipForward className="h-[15px] w-[15px] fill-current" />
          </button>

          <button
            type="button"
            aria-label="Repeat"
            onClick={cycleRepeat}
            className={`grid place-items-center transition-colors hover:text-foreground ${repeat !== 'none' ? 'text-accent-gold' : 'text-ink-3'}`}
          >
            {repeat === 'one' ? (
              <Repeat1 className="h-[15px] w-[15px]" />
            ) : (
              <Repeat className="h-[15px] w-[15px]" />
            )}
          </button>
        </div>

        {/* Progress bar */}
        <div className="grid w-full max-w-[540px] items-center gap-[10px]" style={{ gridTemplateColumns: '32px 1fr 32px' }}>
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
            className="relative h-[3px] cursor-pointer overflow-hidden rounded-sm bg-hairline-2"
            onClick={handleProgressClick}
            onKeyDown={e => {
              if (e.key === 'ArrowRight') seek(Math.min(duration, currentTime + 5));
              if (e.key === 'ArrowLeft') seek(Math.max(0, currentTime - 5));
            }}
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

      {/* Right — volume */}
      <div className="flex items-center justify-end gap-[14px]">
        <div className="flex min-w-[100px] items-center gap-2">
          <Volume2 className="h-[14px] w-[14px] flex-shrink-0 text-ink-3" />
          <div
            role="slider"
            aria-label="Volume"
            aria-valuenow={Math.round(volume * 100)}
            aria-valuemin={0}
            aria-valuemax={100}
            tabIndex={0}
            className="h-[3px] flex-1 cursor-pointer overflow-hidden rounded-sm bg-hairline-2"
            onClick={handleVolumeClick}
            onKeyDown={e => {
              if (e.key === 'ArrowRight') setVolume(Math.min(1, volume + 0.05));
              if (e.key === 'ArrowLeft') setVolume(Math.max(0, volume - 0.05));
            }}
          >
            <div
              className="h-full rounded-sm bg-ink-2"
              style={{ width: `${volume * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
