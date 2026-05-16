import { Pause, Play, Repeat, Repeat1, Shuffle, SkipBack, SkipForward } from 'lucide-react';
import usePlayer from '@/hooks/usePlayer';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';

type TransportControlsProps = {
  compact?: boolean;
};

export default function TransportControls({ compact = false }: TransportControlsProps) {
  const { isPlaying, shuffle, repeat, togglePlay, next, prev, toggleShuffle, cycleRepeat } =
    usePlayer();

  return (
    <div className={cn('flex items-center', compact ? 'gap-2.5' : 'gap-4.5')}>
      <Button
        type="button"
        aria-label="Shuffle"
        onClick={toggleShuffle}
        variant="icon-transparent"
        className={shuffle ? 'text-accent-gold' : 'text-ink-3'}
      >
        <Shuffle className="h-3.75 w-3.75" />
      </Button>

      <Button type="button" aria-label="Previous" onClick={prev} variant="icon-transparent">
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

      <Button type="button" aria-label="Next" onClick={next} variant="icon-transparent">
        <SkipForward className="h-3.75 w-3.75 fill-current" />
      </Button>

      <Button
        type="button"
        aria-label="Repeat"
        onClick={cycleRepeat}
        variant="icon-transparent"
        className={repeat !== 'none' ? 'text-accent-gold' : 'text-ink-3'}
      >
        {repeat === 'one' ? (
          <Repeat1 className="h-3.75 w-3.75" />
        ) : (
          <Repeat className="h-3.75 w-3.75" />
        )}
      </Button>
    </div>
  );
}
