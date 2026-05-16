import { Link } from 'react-router-dom';
import { Button } from '../ui/button';

type LibrarySectionHeaderProps = {
  title: string;
  count?: string;
  action?: string;
  to?: string;
};

export default function LibrarySectionHeader({
  title,
  count,
  action,
  to,
}: LibrarySectionHeaderProps) {
  return (
    <div className="mb-4.5 flex items-baseline justify-between border-b border-hairline pb-3">
      <h2 className="flex items-baseline gap-2.5 font-display text-[18px] font-medium tracking-[-0.01em]">
        {title}
        {count && (
          <span className="font-sans text-[11px] font-medium tracking-[0.04em] tabular-nums text-muted-strong">
            {count}
          </span>
        )}
      </h2>
      {action && (
        <Link to={to || '#'}>
          <Button
            type="button"
            variant="link"
          >
            {action}
          </Button>
        </Link>
      )}
    </div>
  );
}
