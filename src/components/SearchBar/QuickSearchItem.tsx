import useCoverArt from '@/hooks/useCoverArt';
import { cn } from '@/lib/utils';

export type QuickSearchItemProps = {
  coverArtId?: string;
  title: string;
  subtitle: string;
  shape: 'square' | 'circle';
  onClick: () => void;
  badge?: string;
  highlight?: boolean;
};

export default function QuickSearchItem({
  coverArtId,
  title,
  subtitle,
  shape,
  onClick,
  badge,
  highlight,
}: QuickSearchItemProps) {
  const src = useCoverArt(coverArtId, 60);

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'grid w-full grid-cols-[28px_1fr_auto] items-center gap-2.5 rounded-lg px-2 py-1.75 text-left transition-colors hover:bg-white/5',
        highlight && 'bg-white/[0.035]'
      )}
    >
      <span
        className={cn(
          'h-7 w-7 shrink-0 overflow-hidden bg-panel-2',
          shape === 'circle' ? 'rounded-full' : 'rounded-md'
        )}
      >
        {src && <img src={src} alt="" className="h-full w-full object-cover" />}
      </span>
      <span className="min-w-0">
        <span className="block truncate text-[12.5px] font-medium text-foreground">{title}</span>
        <span className="mt-px block truncate text-[11px] text-muted-strong">{subtitle}</span>
      </span>
      {badge && (
        <span className="shrink-0 rounded-full border border-hairline-2 px-1.75 py-0.75 text-[10px] text-muted-strong">
          {badge}
        </span>
      )}
    </button>
  );
}
