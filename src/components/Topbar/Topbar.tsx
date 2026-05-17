import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { ChevronLeft, ChevronRight, Search, Settings } from 'lucide-react';
const btnStyles = 'grid h-7 w-7 cursor-pointer place-items-center rounded-full border border-border bg-panel-2 text-ink-3 transition-colors duration-150 hover:border-hairline-2 hover:text-foreground focus:outline-none focus:ring-2 focus:ring-accent-gold/20 p-0';

export default function Topbar() {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-10 grid grid-cols-[auto_1fr_auto] items-center gap-6 border-b border-border bg-[rgba(10,10,10,0.85)] px-9 py-3.5 backdrop-blur-md">
      {/* Left (nav arrows) */}
      <div className="flex gap-1">
        <Button
          aria-label="Go back"
          onClick={() => navigate(-1)}
          className={btnStyles}
        >
          <ChevronLeft className="h-3.25 w-3.25" />
        </Button>
        <Button
          aria-label="Go forward"
          onClick={() => navigate(1)}
          className={btnStyles}
        >
          <ChevronRight className="h-3.25 w-3.25" />
        </Button>
      </div>

      {/* Center (search) */}
      <div className="relative w-full max-w-95 justify-self-center">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-3.25 w-3.25 -translate-y-1/2 text-muted-strong"
        />
        <input
          type="search"
          placeholder="Search songs, artists, albums…"
          className="w-full rounded-(--radius) border border-border bg-panel-2 py-2 pl-9 pr-10 text-[13px] text-foreground placeholder:text-muted-strong focus:border-hairline-2 focus:outline-none focus:ring-0"
        />
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10.5px] tracking-[0.04em] text-muted-strong">
          ⌘K
        </span>
      </div>

      {/* Right — settings */}
      <div className="flex items-center gap-3">
        <Button
          aria-label="Settings"
          variant='icon-transparent'
        >
          <Settings className="h-4.25 w-4.25" />
        </Button>
      </div>
    </header>
  );
}
