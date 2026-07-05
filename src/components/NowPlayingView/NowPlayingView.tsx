import { useState } from 'react';
import { flushSync } from 'react-dom';
import { Link } from 'react-router-dom';
import {
  AlignLeft,
  ChevronDown,
  Disc3,
  Heart,
  Image as ImageIcon,
  ListPlus,
  MoreHorizontal,
  Pause,
  Play,
} from 'lucide-react';
import usePlayer from '@/hooks/usePlayer';
import useCoverArt from '@/hooks/useCoverArt';
import useStarred from '@/hooks/useStarred';
import useLyrics from '@/hooks/useLyrics';
import Queue from '@/components/Queue/Queue';
import Player from '@/components/Player/Player';
import LyricsView from '@/components/LyricsView/LyricsView';
import { cn, formatTimecode } from '@/lib/utils';
import { Button } from '../ui/button';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

type NpvView = 'player' | 'cover' | 'lyrics';

export default function NowPlayingView({ isOpen, onClose }: Props) {
  const { queue, currentIndex, currentSong, isPlaying, currentTime, togglePlay, seek } =
    usePlayer();
  const { starred, toggle: toggleStar } = useStarred(currentSong?.id ?? '', !!currentSong?.starred);
  const { lines, synced, hasLyrics } = useLyrics(currentSong?.id);

  const [view, setView] = useState<NpvView>('player');

  // animation
  const changeView = (next: NpvView) => {
    const doc = document as Document & {
      startViewTransition?: (cb: () => void) => void;
    };
    if (doc.startViewTransition) {
      doc.startViewTransition(() => flushSync(() => setView(next)));
    } else {
      setView(next);
    }
  };

  const largeCoverSrc = useCoverArt(currentSong?.coverArt, 800);

  if (!currentSong) return null;

  // Fall back to the player view if the current song has no lyrics.
  const activeView: NpvView = view === 'lyrics' && !hasLyrics ? 'player' : view;

  const coverEl = (
    <div className="relative w-full justify-self-center">
      <div aria-hidden className="pointer-events-none absolute npv-cover-glow" />
      <div className="relative aspect-square overflow-hidden bg-panel-2 npv-cover-art">
        {largeCoverSrc && (
          <img
            src={largeCoverSrc}
            alt={`${currentSong.album ?? currentSong.title} artwork`}
            className="h-full w-full object-cover"
          />
        )}
        <div aria-hidden className="pointer-events-none absolute inset-0 npv-cover-gloss" />
      </div>
    </div>
  );

  const makeInfo = (compact: boolean) => (
    <div className={cn('flex flex-col', compact ? 'gap-2.5' : 'gap-3.5')}>
      <div className="flex items-center gap-2.5">
        <span className="npv-now-playing-dot h-1.5 w-1.5 rounded-full bg-accent-gold" aria-hidden />
        <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-accent-gold">
          Now playing
        </span>
      </div>

      <h1
        className={cn(
          'font-serif font-normal leading-[0.9] tracking-[-0.045em] text-foreground',
          compact ? 'text-[30px] leading-[1.02]' : 'npv-title'
        )}
      >
        {currentSong.title}
      </h1>

      <p className="text-[14px] leading-[1.35] text-ink-2">
        {currentSong.artistId ? (
          <Link
            to={`/artist/${currentSong.artistId}`}
            onClick={onClose}
            className="hover:text-foreground hover:underline"
          >
            {currentSong.artist}
          </Link>
        ) : (
          currentSong.artist
        )}
        {currentSong.album && (
          <>
            <span className="mx-1.5 text-ink-3">·</span>
            {currentSong.albumId ? (
              <Link
                to={`/album/${currentSong.albumId}`}
                onClick={onClose}
                className="hover:text-foreground hover:underline"
              >
                {currentSong.album}
              </Link>
            ) : (
              currentSong.album
            )}
          </>
        )}
        {currentSong.year && (
          <>
            <span className="mx-1.5 text-ink-3">·</span>
            <span className="text-ink-3">{currentSong.year}</span>
          </>
        )}
      </p>

      {!compact && (currentSong.duration != null || currentSong.bitRate != null) && (
        <div className="flex flex-wrap gap-3 text-[11px] text-ink-3">
          {currentSong.duration != null && (
            <span>
              <strong className="font-semibold text-ink-2">
                {formatTimecode(currentSong.duration)}
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
        {!compact && (
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
        )}

        <Button
          type="button"
          aria-label={starred ? 'Unlike' : 'Like'}
          aria-pressed={starred}
          onClick={toggleStar}
          variant="pill"
        >
          <Heart className={cn('h-3.5 w-3.5', starred && 'fill-current text-accent-gold')} />
          {starred ? 'Liked' : 'Like'}
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
  );

  const tabs: { id: NpvView; label: string; icon: typeof Disc3; disabled?: boolean }[] = [
    { id: 'player', label: 'Player view', icon: Disc3 },
    { id: 'cover', label: 'Cover only', icon: ImageIcon },
    { id: 'lyrics', label: 'Lyrics', icon: AlignLeft, disabled: !hasLyrics },
  ];

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
        {/* Top bar: back / view toggle / position */}
        <div className="flex items-center justify-between gap-4">
          <Button type="button" onClick={onClose} variant="pill">
            <ChevronDown className="h-4 w-4" />
            <span>Back</span>
          </Button>

          <div className="flex items-center gap-1 rounded-full border border-hairline bg-black/25 p-1 text-[12px]">
            {tabs.map(({ id, label, icon: Icon, disabled }) => (
              <button
                key={id}
                type="button"
                disabled={disabled}
                onClick={() => changeView(id)}
                aria-pressed={activeView === id}
                className={cn(
                  'flex items-center gap-1.5 rounded-full px-3.5 py-1.5 transition-colors',
                  activeView === id
                    ? 'bg-(--accent-soft) text-accent-gold'
                    : 'text-ink-3 hover:text-ink-2',
                  disabled && 'cursor-not-allowed opacity-35 hover:text-ink-3'
                )}
              >
                <Icon className="h-3.25 w-3.25" />
                {label}
              </button>
            ))}
          </div>

          <span className="text-[11px] text-muted-strong">
            {currentIndex + 1} / {queue.length}
          </span>
        </div>

        {/* Single grid across views so the Queue node (and its scroll) is
            preserved when switching. Only the main column and the optional
            lyrics column change. */}
        <div
          className={cn(
            // grid-rows pins the single row to the stage height so columns can't
            // grow it to their content (the Queue would otherwise spill below).
            'grid min-h-0 grid-rows-[minmax(0,1fr)] items-center',
            activeView === 'lyrics' ? 'npv-stage-grid-lyrics' : 'npv-stage-grid'
          )}
        >
          {activeView === 'cover' && (
            <div key="main" className="flex min-h-0 items-center justify-center">
              <div className="w-[min(58vh,520px)]">{coverEl}</div>
            </div>
          )}

          {activeView === 'player' && (
            <div key="main" className="grid min-h-0 items-center npv-left-grid">
              {coverEl}
              {makeInfo(false)}
            </div>
          )}

          {activeView === 'lyrics' && (
            <div key="main" className="flex min-h-0 flex-col justify-center gap-5">
              <div className="w-[min(26vh,200px)]">{coverEl}</div>
              {makeInfo(true)}
            </div>
          )}

          {activeView === 'lyrics' && (
            <LyricsView
              key="lyrics"
              lines={lines}
              synced={synced}
              currentTime={currentTime}
              onSeek={(t) => {
                seek(t);
                if (!isPlaying) togglePlay();
              }}
            />
          )}

          <Queue key="queue" variant="panel" />
        </div>

        {/* Controls */}
        <Player variant="expanded" />
      </div>
    </div>
  );
}
