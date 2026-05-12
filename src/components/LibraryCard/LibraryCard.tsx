import { Play, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import useNavidromeRequest from '@/hooks/useNavidromeRequest';

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
  const { data: src } = useNavidromeRequest<string>(
    '/rest/getCoverArt.view',
    { id: coverArtId, size: 400 },
    { responseType: 'blobUrl', skip: !coverArtId },
  );

  const isArtist = variant === 'artist';

  const inner = (
    <div className="group min-w-0 cursor-pointer">
      <div
        className={`relative aspect-square overflow-hidden bg-panel-2 ${isArtist ? 'rounded-full' : 'rounded-[10px]'}`}
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
        <button
          type="button"
          aria-label={`Play ${title}`}
          onClick={(e) => {
            e.stopPropagation();
            onPlay?.();
          }}
          className={`absolute grid h-9 w-9 place-items-center rounded-full bg-accent-gold text-on-accent opacity-0 transition duration-200 ease-out group-hover:opacity-100 ${
            isArtist
              ? 'bottom-1/2 right-1/2 translate-x-1/2 translate-y-1/2'
              : 'bottom-2.5 right-2.5 translate-y-2 group-hover:translate-y-0'
          }`}
          style={{ boxShadow: '0 12px 28px rgba(0,0,0,0.4)' }}
        >
          <Play className="ml-0.5 h-3.5 w-3.5 fill-current" />
        </button>
      </div>
      <div
        className={`mt-3 truncate text-[13.5px] font-medium leading-[1.3] text-foreground ${isArtist ? 'text-center' : ''}`}
      >
        {title}
      </div>
      {meta && (
        <div className={`mt-0.5 truncate text-[11.5px] text-ink-3 ${isArtist ? 'text-center' : ''}`}>
          {meta}
        </div>
      )}
    </div>
  );

  return to ? <Link to={to}>{inner}</Link> : inner;
}
