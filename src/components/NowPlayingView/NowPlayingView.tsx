import {
  ChevronDown,
  Heart,
  ListPlus,
  MoreHorizontal,
  Pause,
  Play,
  Repeat,
  Repeat1,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume2,
} from 'lucide-react';
import useAuth from '@/hooks/useAuth';
import usePlayer from '@/hooks/usePlayer';
import type { Song } from '@/@types/types';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

function formatTime(secs: number): string {
  if (!isFinite(secs) || isNaN(secs)) return '0:00';
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function buildCoverUrl(
  coverArt: string | undefined,
  username: string,
  password: string,
  size = 64,
): string | null {
  if (!coverArt) return null;
  const params = new URLSearchParams({
    id: coverArt,
    size: String(size),
    u: username,
    p: password,
    v: '1.16.1',
    c: 'crosswalk-web',
  });
  return `/rest/getCoverArt.view?${params.toString()}`;
}

type QueueRowProps = {
  song: Song;
  isActive?: boolean;
  coverUrl: string | null;
  onClick?: () => void;
};

function QueueRow({ song, isActive = false, coverUrl, onClick }: QueueRowProps) {
  return (
    <div
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') onClick();
            }
          : undefined
      }
      className={`grid items-center gap-2.5 rounded-[10px] p-2 transition-colors ${
        isActive
          ? 'bg-[color:var(--accent-soft)] text-foreground outline outline-1 outline-[rgba(232,182,90,0.18)]'
          : onClick
            ? 'cursor-pointer text-ink-2 hover:bg-white/[0.04]'
            : 'text-ink-2'
      }`}
      style={{ gridTemplateColumns: '34px 1fr auto' }}
    >
      <div className="h-[34px] w-[34px] shrink-0 overflow-hidden rounded-[5px] bg-panel-2">
        {coverUrl && <img src={coverUrl} alt="" className="h-full w-full object-cover" />}
      </div>
      <div className="min-w-0">
        <p className="truncate text-[12.5px] font-[550]">
          {isActive && (
            <span
              className="mr-1.5 inline-block h-1.5 w-1.5 -translate-y-px rounded-full bg-accent-gold"
              style={{ boxShadow: '0 0 14px rgba(232,182,90,0.8)' }}
              aria-hidden
            />
          )}
          {song.title}
        </p>
        <p className="mt-0.5 truncate text-[11px] text-ink-3">{song.artist}</p>
      </div>
      <span className="shrink-0 text-[10.5px] tabular-nums text-muted-strong">
        {song.duration ? formatTime(song.duration) : ''}
      </span>
    </div>
  );
}

export default function NowPlayingView({ isOpen, onClose }: Props) {
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
    playQueue,
  } = usePlayer();

  const { credentials } = useAuth();

  const largeCoverSrc = credentials
    ? buildCoverUrl(currentSong?.coverArt, credentials.username, credentials.password, 800)
    : null;

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  function handleProgressClick(e: React.MouseEvent<HTMLDivElement>) {
    if (duration <= 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    seek(Math.max(0, Math.min(duration, ((e.clientX - rect.left) / rect.width) * duration)));
  }

  function handleVolumeClick(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    setVolume(Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)));
  }

  if (!currentSong) return null;

  const playedSongs = queue.slice(0, currentIndex);
  const upcomingSongs = queue.slice(currentIndex + 1);
  const nextSong = upcomingSongs[0] ?? null;

  return (
    <div
      className={`fixed inset-0 z-[60] transition-all duration-300 ${
        isOpen
          ? 'pointer-events-auto translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-4 opacity-0'
      }`}
      style={{
        background: `
          radial-gradient(circle at 22% 18%, rgba(232,182,90,0.14), transparent 30%),
          radial-gradient(circle at 78% 8%, rgba(255,255,255,0.055), transparent 24%),
          linear-gradient(180deg, #101010 0%, var(--background) 58%)
        `,
      }}
    >
      {/* Blurred album art backdrop */}
      {largeCoverSrc && (
        <div
          aria-hidden
          className="pointer-events-none absolute"
          style={{
            inset: '-20%',
            backgroundImage: `url(${largeCoverSrc})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(54px) saturate(1.15)',
            opacity: 0.085,
            transform: 'scale(1.1)',
          }}
        />
      )}

      {/* Content grid: top-bar / stage / controls */}
      <div
        className="relative z-10 grid h-full overflow-hidden"
        style={{ gridTemplateRows: 'auto 1fr auto', padding: '26px 42px 30px', gap: '24px' }}
      >
        {/* ── Top bar ── */}
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-2.5 rounded-full border border-hairline bg-[rgba(15,15,15,0.72)] px-3 py-2 text-[12px] font-medium text-ink-2 transition-colors hover:border-hairline-2 hover:text-foreground focus:outline-none focus:ring-2 focus:ring-[color:var(--accent-soft)]"
          >
            <ChevronDown className="h-4 w-4" />
            <span>Back</span>
          </button>

          <p className="text-[11px] font-[650] uppercase tracking-[0.14em] text-ink-3">
            Now Playing
          </p>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-muted-strong">
              {currentIndex + 1} / {queue.length}
            </span>
          </div>
        </div>

        {/* ── Stage: cover + info | queue ── */}
        <div
          className="grid min-h-0 items-center"
          style={{
            gridTemplateColumns: '1fr 350px',
            gap: 'clamp(24px, 3vw, 48px)',
          }}
        >
          {/* Left: cover art + track details */}
          <div
            className="grid min-h-0 items-center"
            style={{
              gridTemplateColumns: 'min(40vh, 320px) 1fr',
              gap: 'clamp(22px, 3vw, 34px)',
            }}
          >
            {/* Cover art */}
            <div className="relative w-full justify-self-center">
              {/* Gold glow */}
              <div
                aria-hidden
                className="pointer-events-none absolute"
                style={{
                  inset: '12%',
                  borderRadius: '50%',
                  background: 'var(--accent-gold)',
                  filter: 'blur(70px)',
                  opacity: 0.18,
                  transform: 'translateY(24px)',
                  zIndex: -1,
                }}
              />
              <div
                className="relative aspect-square overflow-hidden bg-panel-2"
                style={{
                  borderRadius: '18px',
                  border: '1px solid rgba(255,255,255,0.08)',
                  boxShadow:
                    '0 34px 90px rgba(0,0,0,0.52), 0 1px 0 rgba(255,255,255,0.08) inset',
                }}
              >
                {largeCoverSrc && (
                  <img
                    src={largeCoverSrc}
                    alt={`${currentSong.album ?? currentSong.title} artwork`}
                    className="h-full w-full object-cover"
                  />
                )}
                {/* Gloss overlay */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(255,255,255,0.11), transparent 34%, rgba(0,0,0,0.12))',
                  }}
                />
              </div>
            </div>

            {/* Track info */}
            <div className="flex flex-col gap-3.5">
              <div className="flex items-center gap-2.5">
                <span
                  className="h-1.5 w-1.5 rounded-full bg-accent-gold"
                  style={{ boxShadow: '0 0 18px rgba(232,182,90,0.9)' }}
                  aria-hidden
                />
                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-accent-gold">
                  Now playing
                </span>
              </div>

              <h1
                className="font-serif font-normal leading-[0.9] tracking-[-0.045em] text-foreground"
                style={{ fontSize: 'clamp(36px, 4.5vw, 64px)' }}
              >
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
                        {formatTime(currentSong.duration)}
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
                <button
                  type="button"
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                  onClick={togglePlay}
                  className="grid h-[46px] w-[46px] place-items-center rounded-full bg-accent-gold text-[color:var(--on-accent)] transition hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[color:var(--accent-soft)]"
                  style={{ boxShadow: '0 16px 36px rgba(232,182,90,0.16)' }}
                >
                  {isPlaying ? (
                    <Pause className="h-4 w-4 fill-current" />
                  ) : (
                    <Play className="h-4 w-4 fill-current" />
                  )}
                </button>

                <button
                  type="button"
                  className="inline-flex h-[34px] items-center gap-1.5 rounded-full border border-hairline bg-[rgba(15,15,15,0.42)] px-3 text-[12px] text-ink-2 transition hover:border-hairline-2 hover:text-foreground focus:outline-none focus:ring-2 focus:ring-[color:var(--accent-soft)]"
                >
                  <Heart className="h-3.5 w-3.5 fill-current text-accent-gold" />
                  Liked
                </button>

                <button
                  type="button"
                  className="inline-flex h-[34px] items-center gap-1.5 rounded-full border border-hairline bg-[rgba(15,15,15,0.42)] px-3 text-[12px] text-ink-2 transition hover:border-hairline-2 hover:text-foreground focus:outline-none focus:ring-2 focus:ring-[color:var(--accent-soft)]"
                >
                  <ListPlus className="h-3.5 w-3.5" />
                  Add to playlist
                </button>

                <button
                  type="button"
                  aria-label="More options"
                  className="inline-flex h-[34px] w-[34px] items-center justify-center rounded-full border border-hairline bg-[rgba(15,15,15,0.42)] text-[12px] text-ink-2 transition hover:border-hairline-2 hover:text-foreground focus:outline-none focus:ring-2 focus:ring-[color:var(--accent-soft)]"
                >
                  <MoreHorizontal className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Right: Queue panel */}
          <div
            className="flex min-h-0 flex-col rounded-[18px] border border-hairline bg-[rgba(15,15,15,0.66)] p-[18px] shadow-2xl backdrop-blur-[18px]"
            style={{ alignSelf: 'stretch' }}
          >
            <div className="mb-2 flex shrink-0 items-baseline justify-between border-b border-hairline pb-3">
              <h2 className="font-serif text-2xl font-normal tracking-[-0.02em]">Queue</h2>
              <span className="text-[11.5px] tabular-nums text-ink-3">{queue.length} tracks</span>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto pr-0.5" style={{ scrollbarWidth: 'none' }}>
              {/* Played */}
              {playedSongs.length > 0 && (
                <>
                  <p className="px-2 pb-2 pt-3 text-[10px] font-bold uppercase tracking-[0.15em] text-muted-strong">
                    Played
                  </p>
                  {playedSongs.map((song, i) => (
                    <div key={song.id} className="opacity-40">
                      <QueueRow
                        song={song}
                        coverUrl={
                          credentials
                            ? buildCoverUrl(song.coverArt, credentials.username, credentials.password)
                            : null
                        }
                        onClick={() => playQueue(queue, i)}
                      />
                    </div>
                  ))}
                </>
              )}

              {/* Now playing */}
              <p className="px-2 pb-2 pt-3 text-[10px] font-bold uppercase tracking-[0.15em] text-muted-strong">
                Now playing
              </p>
              <QueueRow
                song={currentSong}
                isActive
                coverUrl={
                  credentials
                    ? buildCoverUrl(
                        currentSong.coverArt,
                        credentials.username,
                        credentials.password,
                      )
                    : null
                }
              />

              {/* Up next */}
              {upcomingSongs.length > 0 && (
                <>
                  <p className="px-2 pb-2 pt-3 text-[10px] font-bold uppercase tracking-[0.15em] text-muted-strong">
                    Up next
                  </p>
                  {upcomingSongs.map((song, i) => (
                    <QueueRow
                      key={song.id}
                      song={song}
                      coverUrl={
                        credentials
                          ? buildCoverUrl(song.coverArt, credentials.username, credentials.password)
                          : null
                      }
                      onClick={() => playQueue(queue, currentIndex + 1 + i)}
                    />
                  ))}
                </>
              )}

              {upcomingSongs.length === 0 && (
                <p className="px-2 py-4 text-[12px] text-ink-3">End of queue</p>
              )}
            </div>
          </div>
        </div>

        {/* ── Expanded controls ── */}
        <div
          className="grid items-center gap-7 rounded-[18px] border border-hairline bg-[rgba(15,15,15,0.76)] px-[22px] py-[18px] shadow-2xl backdrop-blur-[16px]"
          style={{ gridTemplateColumns: '1fr auto 1fr' }}
        >
          {/* Left: next track preview */}
          <div className="flex min-w-0 items-center gap-3">
            {nextSong ? (
              <>
                <div className="h-[42px] w-[42px] shrink-0 overflow-hidden rounded-[5px] bg-panel-2">
                  {credentials && nextSong.coverArt && (
                    <img
                      src={
                        buildCoverUrl(
                          nextSong.coverArt,
                          credentials.username,
                          credentials.password,
                        ) ?? undefined
                      }
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-muted-strong">
                    Up next
                  </p>
                  <p className="mt-0.5 truncate text-[13px] text-ink-2">
                    {nextSong.title}
                    {nextSong.artist && (
                      <span className="text-ink-3"> — {nextSong.artist}</span>
                    )}
                  </p>
                </div>
              </>
            ) : (
              <span className="text-[12px] text-ink-3">End of queue</span>
            )}
          </div>

          {/* Center: transport + progress */}
          <div
            className="flex flex-col items-center gap-3"
            style={{ minWidth: 'min(540px, 42vw)' }}
          >
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
                className="grid h-[34px] w-[34px] place-items-center rounded-full bg-foreground text-background transition hover:scale-105 hover:bg-accent-gold focus:outline-none"
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

            <div
              className="grid w-full items-center gap-2.5"
              style={{ gridTemplateColumns: '32px 1fr 32px' }}
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
                className="relative h-[3px] cursor-pointer overflow-hidden rounded-sm bg-hairline-2"
                onClick={handleProgressClick}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowRight') seek(Math.min(duration, currentTime + 5));
                  if (e.key === 'ArrowLeft') seek(Math.max(0, currentTime - 5));
                }}
              >
                <div
                  className="h-full rounded-sm bg-accent-gold"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <span className="text-center text-[10.5px] tabular-nums text-muted-strong">
                {formatTime(duration)}
              </span>
            </div>
          </div>

          {/* Right: volume */}
          <div className="flex items-center justify-end gap-3.5">
            <div className="flex min-w-[100px] items-center gap-2">
              <Volume2 className="h-3.5 w-3.5 shrink-0 text-ink-3" />
              <div
                role="slider"
                aria-label="Volume"
                aria-valuenow={Math.round(volume * 100)}
                aria-valuemin={0}
                aria-valuemax={100}
                tabIndex={0}
                className="h-[3px] flex-1 cursor-pointer overflow-hidden rounded-sm bg-hairline-2"
                onClick={handleVolumeClick}
                onKeyDown={(e) => {
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
      </div>
    </div>
  );
}
