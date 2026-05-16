import { Volume2 } from 'lucide-react';
import usePlayer from '@/hooks/usePlayer';

export default function VolumeSlider() {
  const { volume, setVolume } = usePlayer();

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setVolume(Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)));
  };

  return (
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
        onClick={handleClick}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') setVolume(Math.min(1, volume + 0.05));
          if (e.key === 'ArrowLeft') setVolume(Math.max(0, volume - 0.05));
        }}
      >
        <div className="h-full rounded-sm bg-ink-2" style={{ width: `${volume * 100}%` }} />
      </div>
    </div>
  );
}
