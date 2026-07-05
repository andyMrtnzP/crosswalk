import { useEffect, useMemo, useRef } from 'react';
import type { ParsedLyricLine } from '@/hooks/useLyrics';
import { cn } from '@/lib/utils';

type LyricsViewProps = {
  lines: ParsedLyricLine[];
  synced: boolean;
  currentTime: number;
  onSeek?: (time: number) => void;
};

function activeLineIndex(lines: ParsedLyricLine[], currentTime: number): number {
  let idx = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i]!.time <= currentTime) idx = i;
    else break;
  }
  return idx;
}

// How long to stop auto-following after the user scrolls the lyrics themselves.
const MANUAL_SCROLL_PAUSE_MS = 2500;

export default function LyricsView({ lines, synced, currentTime, onSeek }: LyricsViewProps) {
  const activeIndex = useMemo(
    () => (synced ? activeLineIndex(lines, currentTime) : -1),
    [lines, synced, currentTime]
  );

  const containerRef = useRef<HTMLDivElement | null>(null);
  const activeRef = useRef<HTMLParagraphElement | null>(null);
  const pauseUntilRef = useRef(0);
  const resumeTimerRef = useRef<number | undefined>(undefined);

  const centerActive = () =>
    activeRef.current?.scrollIntoView({ block: 'center', behavior: 'smooth' });

  // New song → jump back to the top.
  useEffect(() => {
    containerRef.current?.scrollTo({ top: 0 });
  }, [lines]);

  // Follow the active line, unless the user scrolled recently.
  useEffect(() => {
    if (Date.now() < pauseUntilRef.current) return;
    centerActive();
  }, [activeIndex]);

  useEffect(() => () => clearTimeout(resumeTimerRef.current), []);

  // A wheel/touch scroll is the user taking over: pause following, then snap
  // back to the current line once they've had a few seconds to look around.
  const onManualScroll = () => {
    pauseUntilRef.current = Date.now() + MANUAL_SCROLL_PAUSE_MS;
    clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = window.setTimeout(centerActive, MANUAL_SCROLL_PAUSE_MS);
  };

  // Fade top and bottom so lines ease in/out instead of hard-clipping.
  const fade = 'linear-gradient(to bottom, transparent, #000 18%, #000 82%, transparent)';

  return (
    <div
      ref={containerRef}
      onWheel={onManualScroll}
      onTouchMove={onManualScroll}
      className="h-full overflow-y-auto px-1 py-[38vh]"
      style={{ scrollbarWidth: 'none', maskImage: fade, WebkitMaskImage: fade }}
    >
      {lines.map((line, i) => {
        const active = synced && i === activeIndex;
        const seekable = synced && !!onSeek;
        return (
          <p
            key={i}
            ref={active ? activeRef : null}
            onClick={seekable ? () => onSeek!(line.time) : undefined}
            className={cn(
              'max-w-3xl origin-left py-2 font-serif tracking-[-0.02em] transition-all duration-300 ease-out',
              active
                ? 'text-[38px] font-semibold leading-[1.15] text-foreground'
                : cn(
                    'text-[25px] font-medium leading-[1.28]',
                    synced ? 'text-ink-3/40' : 'text-ink-2'
                  ),
              seekable && 'cursor-pointer hover:text-ink-2'
            )}
          >
            {line.text || '♪'}
          </p>
        );
      })}
    </div>
  );
}
