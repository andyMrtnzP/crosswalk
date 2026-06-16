import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { ChevronLeft, ChevronRight, Settings } from 'lucide-react';
import SearchBar from '@/components/SearchBar/SearchBar';

const btnStyles =
  'grid h-7 w-7 cursor-pointer place-items-center rounded-full border border-border bg-panel-2 text-ink-3 transition-colors duration-150 hover:border-hairline-2 hover:text-foreground focus:outline-none focus:ring-2 focus:ring-accent-gold/20 p-0';

export default function Topbar() {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-10 grid grid-cols-[auto_1fr_auto] items-center gap-6 border-b border-border bg-[rgba(10,10,10,0.85)] px-9 py-3.5 backdrop-blur-md">
      {/* Left */}
      <div className="flex gap-1">
        <Button aria-label="Go back" onClick={() => navigate(-1)} className={btnStyles}>
          <ChevronLeft className="h-3.25 w-3.25" />
        </Button>
        <Button aria-label="Go forward" onClick={() => navigate(1)} className={btnStyles}>
          <ChevronRight className="h-3.25 w-3.25" />
        </Button>
      </div>

      {/* Center — search */}
      <SearchBar />

      {/* Right */}
      <div className="flex items-center gap-3">
        <Button aria-label="Settings" variant="icon-transparent">
          <Settings className="h-4.25 w-4.25" />
        </Button>
      </div>
    </header>
  );
}
