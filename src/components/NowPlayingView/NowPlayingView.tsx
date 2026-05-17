import { ChevronDown, Heart, ListPlus, MoreHorizontal, Pause, Play } from 'lucide-react';
import usePlayer from '@/hooks/usePlayer';
import useNavidromeRequest from '@/hooks/useNavidromeRequest';
import Queue from '@/components/Queue/Queue';
import Player from '@/components/Player/Player';
import { cn, formatPlayingTime } from '@/lib/utils';
import { Button } from '../ui/button';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function NowPlayingView({ isOpen, onClose }: Props) {
  const { queue, currentIndex, currentSong, isPlaying, togglePlay } = usePlayer();

  const { data: largeCoverSrc } = useNavidromeRequest<string>(
    '/rest/getCoverArt.view',
    { id: currentSong?.coverArt, size: 800 },
    { responseType: 'blobUrl', skip: !currentSong?.coverArt }
  );

  if (!currentSong) return null;

  return (
    <div
      className={cn(
        `fixed inset-0 z-66 transition-all duration-300 full-player-gradient`,
        isOpen && 'open'
      )}
    >
      {/* Blurred album art backdrop */}
      {largeCoverSrc && (
        <div
          aria-hidden
          className="pointer-events-none absolute playing-cover-backdrop"
          style={{ backgroundImage: `url(${largeCoverSrc})` }}
        />
      )}

      <div className="relative z-10 grid h-full overflow-hidden npv-content-grid">
        {/* Top bar with navigation and track info */}
        <div className="flex items-center justify-between gap-4">
          <Button type="button" onClick={onClose} variant="pill">
            <ChevronDown className="h-4 w-4" />
            <span>Back</span>
          </Button>

          <p className="text-[11px] font-[650] uppercase tracking-[0.14em] text-ink-3">
            Now Playing
          </p>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-muted-strong">
              {currentIndex + 1} / {queue.length}
            </span>
          </div>
        </div>

        <div className="grid min-h-0 items-center npv-stage-grid">
          {/* Left side (cover art + info)*/}
          <div className="grid min-h-0 items-center npv-left-grid">
            <div className="relative w-full justify-self-center">
              {/* glow */}
              <div aria-hidden className="pointer-events-none absolute npv-cover-glow" />
              <div className="relative aspect-square overflow-hidden bg-panel-2 npv-cover-art">
                {largeCoverSrc && (
                  <img
                    src={largeCoverSrc}
                    alt={`${currentSong.album ?? currentSong.title} artwork`}
                    className="h-full w-full object-cover"
                  />
                )}
                {/* Gloss overlay */}
                <div aria-hidden className="pointer-events-none absolute inset-0 npv-cover-gloss" />
              </div>
            </div>

            {/* Track info */}
            <div className="flex flex-col gap-3.5">
              <div className="flex items-center gap-2.5">
                <span
                  className="npv-now-playing-dot h-1.5 w-1.5 rounded-full bg-accent-gold"
                  aria-hidden
                />
                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-accent-gold">
                  Now playing
                </span>
              </div>

              <h1 className="npv-title font-serif font-normal leading-[0.9] tracking-[-0.045em] text-foreground">
                {currentSong.title}
              </h1>

              <p className="text-[14px] leading-[1.35] text-ink-2">
                {currentSong.artist}
                {currentSong.album && (
                  <>
                    <span className="mx-1.5 text-ink-3">·</span>
                    {currentSong.album}
                  </>
                )}
                {currentSong.year && (
                  <>
                    <span className="mx-1.5 text-ink-3">·</span>
                    <span className="text-ink-3">{currentSong.year}</span>
                  </>
                )}
              </p>

              {(currentSong.duration != null || currentSong.bitRate != null) && (
                <div className="flex flex-wrap gap-3 text-[11px] text-ink-3">
                  {currentSong.duration != null && (
                    <span>
                      <strong className="font-semibold text-ink-2">
                        {formatPlayingTime(currentSong.duration)}
                      </strong>{' '}
                      track length
                    </span>
                  )}
                  {currentSong.bitRate != null && currentSong.bitRate >= 900 && (
                    <span>
                      <span className="mr-1.5 text-muted-deep">•</span>
                      <strong className="font-semibold text-ink-2">Lossless</strong>
                    </span>
                  )}
                </div>
              )}

              <div className="flex flex-wrap items-center gap-2 pt-0.5">
                <Button
                  type="button"
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                  onClick={togglePlay}
                  className="npv-play-button h-11.5 w-11.5 rounded-full"
                >
                  {isPlaying ? (
                    <Pause className="h-4 w-4 fill-current" />
                  ) : (
                    <Play className="h-4 w-4 fill-current" />
                  )}
                </Button>

                <Button type="button" aria-label="Like" variant="pill">
                  <Heart className="h-3.5 w-3.5 fill-current text-accent-gold" />
                  Liked
                </Button>

                <Button type="button" variant="pill">
                  <ListPlus className="h-3.5 w-3.5" />
                  Add to playlist
                </Button>

                <Button type="button" aria-label="More options" variant="pill">
                  <MoreHorizontal className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Right side (queue) */}
          <Queue variant="panel" />
        </div>

        {/* Controls */}
        <Player variant="expanded" />
      </div>
    </div>
  );
}
