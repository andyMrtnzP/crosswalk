import useNavidromeRequest from '@/hooks/useNavidromeRequest';
import { cn } from '@/lib/utils';

type SearchResultRowProps = {
  coverArtId?: string;
  title: string;
  subtitle: string;
  shape: 'square' | 'circle';
  isPlaying?: boolean;
  onClick: () => void;
};

export default function SearchResultRow({
  coverArtId,
  title,
  subtitle,
  shape,
  isPlaying,
  onClick,
}: SearchResultRowProps) {
  const { data: src } = useNavidromeRequest<string>(
    '/rest/getCoverArt.view',
    { id: coverArtId, size: 80 },
    { responseType: 'blobUrl', skip: !coverArtId }
  );
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'relative grid w-full grid-cols-[40px_1fr] items-center gap-3.5 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-panel-2',
        isPlaying && 'bg-panel-2'
      )}
    >
      {isPlaying && (
        <span className="absolute bottom-2 left-0 top-2 w-0.5 rounded-sm bg-accent-gold" />
      )}
      <span
        className={cn(
          'h-10 w-10 shrink-0 overflow-hidden bg-panel-3',
          shape === 'circle' ? 'rounded-full' : 'rounded-md'
        )}
      >
        {src && <img src={src} alt="" className="h-full w-full object-cover" />}
      </span>
      <span className="min-w-0">
        <span
          className={cn(
            'block truncate text-[13px] font-medium',
            isPlaying ? 'text-accent-gold' : 'text-foreground'
          )}
        >
          {title}
        </span>
        <span className="mt-0.5 block truncate text-[11.5px] text-ink-3">{subtitle}</span>
      </span>
    </button>
  );
}
