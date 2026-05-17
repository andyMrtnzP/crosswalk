import usePlayer from '@/hooks/usePlayer';
import { cn, formatTimecode } from '@/lib/utils';

type ProgressBarProps = {
  className?: string;
};

export default function ProgressBar({ className }: ProgressBarProps) {
  const { currentTime, duration, seek } = usePlayer();
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (duration <= 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    seek(Math.max(0, Math.min(duration, ((e.clientX - rect.left) / rect.width) * duration)));
  };

  return (
    <div className={cn('grid w-full items-center gap-2.5 progress-bar-wrapper', className)}>
      <span className="text-center text-[10.5px] tabular-nums text-muted-strong">
        {formatTimecode(currentTime)}
      </span>

      <div
        role="slider"
        aria-label="Seek"
        aria-valuenow={Math.round(currentTime)}
        aria-valuemin={0}
        aria-valuemax={Math.round(duration)}
        tabIndex={0}
        className="relative h-0.75 cursor-pointer overflow-hidden rounded-sm bg-hairline-2"
        onClick={handleClick}
        onKeyDown={(e) => {
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
        {formatTimecode(duration)}
      </span>
    </div>
  );
}
