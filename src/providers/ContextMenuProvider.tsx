import { useCallback, useEffect, useRef, useState } from 'react';
import type { MouseEvent } from 'react';
import { createPortal } from 'react-dom';
import { ListPlus, ListStart, Play } from 'lucide-react';
import type { Song } from '@/@types/types';
import usePlayer from '@/hooks/usePlayer';
import { ContextMenuContext } from './ContextMenuContext';

type MenuState = { x: number; y: number; song: Song; onPlay: () => void };

// Fixed size so we can clamp to the viewport without a measure pass (no flash).
const MENU_WIDTH = 190;
const MENU_HEIGHT = 122;
const MARGIN = 8;

export default function ContextMenuProvider({ children }: { children: React.ReactNode }) {
  const { playNext, addToQueue } = usePlayer();
  const [menu, setMenu] = useState<MenuState | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const openSongMenu = useCallback((event: MouseEvent, song: Song, onPlay: () => void) => {
    event.preventDefault();
    setMenu({ x: event.clientX, y: event.clientY, song, onPlay });
  }, []);

  const close = useCallback(() => setMenu(null), []);

  useEffect(() => {
    if (!menu) return;
    // A mousedown outside the menu closes it. Right-clicking another row also
    // fires mousedown (closing this) then contextmenu (opening the next).
    const onDown = (e: globalThis.MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) close();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('mousedown', onDown);
    window.addEventListener('keydown', onKey);
    window.addEventListener('scroll', close, true);
    window.addEventListener('resize', close);
    return () => {
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('scroll', close, true);
      window.removeEventListener('resize', close);
    };
  }, [menu, close]);

  const items = menu
    ? [
        { label: 'Play', icon: Play, onSelect: menu.onPlay },
        { label: 'Play Next', icon: ListStart, onSelect: () => playNext(menu.song) },
        { label: 'Add to Queue', icon: ListPlus, onSelect: () => addToQueue(menu.song) },
      ]
    : [];

  const left = Math.max(MARGIN, Math.min(menu?.x ?? 0, window.innerWidth - MENU_WIDTH - MARGIN));
  const top = Math.max(MARGIN, Math.min(menu?.y ?? 0, window.innerHeight - MENU_HEIGHT - MARGIN));

  return (
    <ContextMenuContext.Provider value={{ openSongMenu }}>
      {children}
      {menu &&
        createPortal(
          <div
            ref={menuRef}
            role="menu"
            className="fixed z-100 overflow-hidden rounded-[12px] border border-hairline bg-[rgba(15,15,15,0.94)] p-1.5 shadow-2xl backdrop-blur-[18px]"
            style={{ left, top, width: MENU_WIDTH }}
          >
            {items.map(({ label, icon: Icon, onSelect }) => (
              <button
                key={label}
                type="button"
                role="menuitem"
                onClick={() => {
                  onSelect();
                  close();
                }}
                className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-[12.5px] text-ink-2 transition-colors hover:bg-white/6 hover:text-foreground"
              >
                <Icon className="h-3.75 w-3.75 shrink-0" />
                {label}
              </button>
            ))}
          </div>,
          document.body
        )}
    </ContextMenuContext.Provider>
  );
}
