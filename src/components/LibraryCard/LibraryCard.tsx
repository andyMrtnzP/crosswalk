import { Play, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import useCoverArt from '@/hooks/useCoverArt';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';

export type LibraryCardProps = {
  coverArtId?: string;
  title: string;
  meta?: string;
  variant?: 'default' | 'artist';
  to?: string;
  onPlay?: () => void;
};

export default function LibraryCard({
  coverArtId,
  title,
  meta,
  variant = 'default',
  to,
  onPlay,
}: LibraryCardProps) {
  const src = useCoverArt(coverArtId, 400);

  const isArtist = variant === 'artist';
  const styles = {
    default: {
      wrapper: 'rounded-lg',
      btn: 'bottom-2.5 right-2.5 translate-y-2 group-hover:translate-y-0',
    },
    artist: {
      wrapper: 'rounded-full',
      btn: 'bottom-1/2 right-1/2 translate-x-1/2 translate-y-1/2',
    },
  };

  const Comp = (
    <div className="group min-w-0 cursor-pointer">
      <div
        className={cn(`relative aspect-square overflow-hidden bg-panel-2`, styles[variant].wrapper)}
        style={{ boxShadow: '0 1px 0 var(--hairline)' }}
      >
        {src ? (
          <img
            src={src}
            alt=""
            className="h-full w-full object-cover transition duration-300 ease-out group-hover:scale-[1.04] group-hover:brightness-[.85]"
          />
        ) : (
          <span className="grid h-full w-full place-items-center text-ink-3">
            <User className="h-1/4 w-1/4" strokeWidth={1.5} />
          </span>
        )}
        <Button
          type="button"
          aria-label={`Play ${title}`}
          onClick={(e) => {
            e.stopPropagation();
            onPlay?.();
          }}
          className={cn(
            'absolute grid h-9 w-9 place-items-center rounded-full bg-accent-gold text-on-accent opacity-0 transition duration-200 ease-out group-hover:opacity-100',
            styles[variant].btn
          )}
          style={{ boxShadow: '0 12px 28px rgba(0,0,0,0.4)' }}
        >
          <Play className="ml-0.5 h-3.5 w-3.5 fill-current" />
        </Button>
      </div>
      <div
        className={cn(
          `mt-3 truncate text-[13.5px] font-medium leading-[1.3] text-foreground`,
          isArtist ? 'text-center' : ''
        )}
      >
        {title}
      </div>
      {meta && (
        <div
          className={cn(`mt-0.5 truncate text-[11.5px] text-ink-3`, isArtist ? 'text-center' : '')}
        >
          {meta}
        </div>
      )}
    </div>
  );

  return to ? <Link to={to}>{Comp}</Link> : Comp;
}
