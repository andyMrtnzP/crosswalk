type LibrarySectionHeaderProps = {
  title: string;
  count?: string;
  action?: string;
  onAction?: () => void;
};

export default function LibrarySectionHeader({ title, count, action, onAction }: LibrarySectionHeaderProps) {
  return (
    <div className="mb-[18px] flex items-baseline justify-between border-b border-hairline pb-3">
      <h2 className="flex items-baseline gap-2.5 font-display text-[18px] font-medium tracking-[-0.01em]">
        {title}
        {count && (
          <span className="font-sans text-[11px] font-medium tracking-[0.04em] tabular-nums text-muted-strong">
            {count}
          </span>
        )}
      </h2>
      {action && (
        <button
          type="button"
          onClick={onAction}
          className="bg-transparent text-[11.5px] uppercase tracking-[0.08em] text-ink-3 transition-colors hover:text-accent-gold"
        >
          {action}
        </button>
      )}
    </div>
  );
}