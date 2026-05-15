import useAuth from '@/hooks/useAuth';
import usePlayer from '@/hooks/usePlayer';
import type { Song } from '@/@types/types';

type QueueProps = {
  queue: Song[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
};

function buildCoverUrl(
  coverArt: string | undefined,
  username: string,
  password: string
): string | null {
  if (!coverArt) return null;
  const params = new URLSearchParams({
    id: coverArt,
    size: '64',
    u: username,
    p: password,
    v: '1.16.1',
    c: 'crosswalk-web',
  });
  return `/rest/getCoverArt.view?${params.toString()}`;
}

function formatTime(secs: number): string {
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

type QueueRowProps = {
  song: Song;
  isPlaying?: boolean;
  coverUrl: string | null;
  onClick?: () => void;
};

function QueueRow({ song, isPlaying = false, coverUrl, onClick }: QueueRowProps) {
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
      className={`grid items-center gap-[10px] rounded-[10px] p-2 transition-colors ${
        isPlaying
          ? 'bg-[color:var(--accent-soft)] text-foreground outline outline-1 outline-[rgba(232,182,90,0.18)]'
          : onClick
            ? 'cursor-pointer text-ink-2 hover:bg-white/[0.04]'
            : 'text-ink-2'
      }`}
      style={{ gridTemplateColumns: '34px 1fr auto' }}
    >
      <div className="h-[34px] w-[34px] flex-shrink-0 overflow-hidden rounded-[5px] bg-panel-2">
        {coverUrl && <img src={coverUrl} alt="" className="h-full w-full object-cover" />}
      </div>
      <div className="min-w-0">
        <p className="truncate text-[12.5px] font-semibold">
          {isPlaying && (
            <span className="mr-1.5 inline-block h-1.5 w-1.5 translate-y-[-1px] rounded-full bg-accent-gold shadow-[0_0_14px_rgba(232,182,90,0.8)]" />
          )}
          {song.title}
        </p>
        <p className="mt-0.5 truncate text-[11px] text-ink-3">{song.artist}</p>
      </div>
      <span className="flex-shrink-0 text-[10.5px] tabular-nums text-muted-strong">
        {song.duration ? formatTime(song.duration) : ''}
      </span>
    </div>
  );
}

export default function Queue({ queue, currentIndex, isOpen, onClose }: QueueProps) {
  const { credentials } = useAuth();
  const { playQueue } = usePlayer();

  if (!isOpen) return null;

  const currentSong = queue[currentIndex] ?? null;
  const played = queue.slice(0, currentIndex);
  const upcoming = queue.slice(currentIndex + 1);

  return (
    <>
      {/* Click-outside backdrop */}
      <div className="fixed inset-0 z-40" onClick={onClose} />

      <div
        className="fixed bottom-[84px] right-4 z-50 flex w-[320px] flex-col overflow-hidden rounded-[18px] border border-hairline bg-[rgba(15,15,15,0.92)] shadow-2xl backdrop-blur-[18px]"
        style={{ maxHeight: 'calc(100vh - 104px)' }}
      >
        {/* Header */}
        <div className="flex flex-shrink-0 items-baseline justify-between border-b border-hairline px-[18px] pb-3 pt-[18px]">
          <h2 className="font-serif text-2xl font-normal tracking-[-0.02em] text-foreground">
            Queue
          </h2>
          <span className="text-[11px] tabular-nums text-ink-3">
            {queue.length} {queue.length === 1 ? 'track' : 'tracks'}
          </span>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-[10px] pb-4" style={{ scrollbarWidth: 'none' }}>
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
                  <QueueRow
                    song={song}
                    onClick={() => playQueue(queue, i)}
                    coverUrl={
                      credentials
                        ? buildCoverUrl(song.coverArt, credentials.username, credentials.password)
                        : null
                    }
                  />
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
                isPlaying
                coverUrl={
                  credentials
                    ? buildCoverUrl(
                        currentSong.coverArt,
                        credentials.username,
                        credentials.password
                      )
                    : null
                }
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
                  coverUrl={
                    credentials
                      ? buildCoverUrl(song.coverArt, credentials.username, credentials.password)
                      : null
                  }
                />
              ))}
            </>
          )}
        </div>
      </div>
    </>
  );
}
