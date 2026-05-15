import { useNavigate } from 'react-router-dom';

export default function Topbar() {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-10 grid grid-cols-[auto_1fr_auto] items-center gap-6 border-b border-border bg-[rgba(10,10,10,0.85)] px-9 py-[14px] backdrop-blur-[12px]">
      {/* Left — nav arrows */}
      <div className="flex gap-1">
        <button
          aria-label="Go back"
          onClick={() => navigate(-1)}
          className="grid h-7 w-7 cursor-pointer place-items-center rounded-full border border-border bg-panel-2 text-ink-3 transition-colors duration-150 hover:border-hairline-2 hover:text-foreground focus:outline-none focus:ring-2 focus:ring-accent-gold/20"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="h-[13px] w-[13px]"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <button
          aria-label="Go forward"
          onClick={() => navigate(1)}
          className="grid h-7 w-7 cursor-pointer place-items-center rounded-full border border-border bg-panel-2 text-ink-3 transition-colors duration-150 hover:border-hairline-2 hover:text-foreground focus:outline-none focus:ring-2 focus:ring-accent-gold/20"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="h-[13px] w-[13px]"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      {/* Center — search */}
      <div className="relative w-full max-w-[380px] justify-self-center">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="pointer-events-none absolute left-3 top-1/2 h-[13px] w-[13px] -translate-y-1/2 text-muted-strong"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <input
          type="search"
          placeholder="Search songs, artists, albums…"
          className="w-full rounded-[var(--radius)] border border-border bg-panel-2 py-2 pl-9 pr-10 text-[13px] text-foreground placeholder:text-muted-strong focus:border-hairline-2 focus:outline-none focus:ring-0"
        />
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10.5px] tracking-[0.04em] text-muted-strong">
          ⌘K
        </span>
      </div>

      {/* Right — settings */}
      <div className="flex items-center gap-3">
        <button
          aria-label="Settings"
          className="grid h-8 w-8 cursor-pointer place-items-center rounded-full border-none bg-transparent text-ink-3 transition-colors duration-150 hover:bg-panel-2 hover:text-foreground focus:outline-none focus:ring-2 focus:ring-accent-gold/20"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </button>
      </div>
    </header>
  );
}
