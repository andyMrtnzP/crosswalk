import { useCallback, useEffect, useRef, useState } from 'react';
import type { ComponentType, MouseEvent } from 'react';
import { createPortal } from 'react-dom';
import {
  ChevronRight,
  ListMusic,
  ListPlus,
  ListStart,
  Music,
  Play,
  Shuffle,
  Trash2,
} from 'lucide-react';
import type { Playlist, PlaylistDetailResponse, Song } from '@/@types/types';
import usePlayer from '@/hooks/usePlayer';
import useAuth from '@/hooks/useAuth';
import useCoverArt from '@/hooks/useCoverArt';
import { buildRestUrl } from '@/lib/auth';
import { recordRecentlyPlayed } from '@/lib/crosswalkApi';
import usePlaylists, { notifyPlaylistsChanged } from '@/hooks/usePlaylists';
import { cn } from '@/lib/utils';
import { ContextMenuContext, type PlaylistTarget } from './ContextMenuContext';

type MenuItem = {
  label: string;
  icon: ComponentType<{ className?: string }>;
  onSelect: () => void;
  danger?: boolean;
  addToPlaylist?: boolean; // renders a playlist flyout instead of a plain action
};

type MenuState = { x: number; y: number; items: MenuItem[]; song?: Song };

// ponytail: sort-random is slightly biased; imperceptible for track shuffle.
const shuffle = <T,>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);

const MENU_WIDTH = 190;
const MENU_ITEM_H = 37;
const MARGIN = 8;
const SUBMENU_LIMIT = 8;

function PlaylistPickerRow({ playlist, onSelect }: { playlist: Playlist; onSelect: () => void }) {
  const cover = useCoverArt(playlist.coverArt, 48);
  return (
    <button
      type="button"
      onClick={onSelect}
      className="flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-left text-[12.5px] text-ink-2 transition-colors hover:bg-white/6 hover:text-foreground"
    >
      {cover ? (
        <img src={cover} alt="" className="h-6 w-6 shrink-0 rounded-[3px] object-cover" />
      ) : (
        <span className="grid h-6 w-6 shrink-0 place-items-center rounded-[3px] bg-panel-3 text-ink-3">
          <Music className="h-3 w-3" />
        </span>
      )}
      <span className="truncate">{playlist.name}</span>
    </button>
  );
}

export default function ContextMenuProvider({ children }: { children: React.ReactNode }) {
  const { playQueue, playNext, addToQueue } = usePlayer();
  const { credentials } = useAuth();
  const { playlists } = usePlaylists();
  const [menu, setMenu] = useState<MenuState | null>(null);
  const [confirm, setConfirm] = useState<PlaylistTarget | null>(null);
  const [pickerSong, setPickerSong] = useState<Song | null>(null);
  const [query, setQuery] = useState('');
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!pickerSong) setQuery('');
  }, [pickerSong]);

  const close = useCallback(() => setMenu(null), []);

  const fetchEntries = useCallback(
    async (id: string): Promise<Song[]> => {
      if (!credentials) return [];
      const url = buildRestUrl('getPlaylist.view', credentials.username, credentials.password, {
        id,
        f: 'json',
      });
      const res = await fetch(url);
      const data = (await res.json()) as PlaylistDetailResponse;
      return data['subsonic-response']?.playlist?.entry ?? [];
    },
    [credentials]
  );

  const openSongMenu = useCallback(
    (event: MouseEvent, song: Song, onPlay: () => void) => {
      event.preventDefault();
      setMenu({
        x: event.clientX,
        y: event.clientY,
        song,
        items: [
          { label: 'Play', icon: Play, onSelect: onPlay },
          { label: 'Play Next', icon: ListStart, onSelect: () => playNext(song) },
          { label: 'Add to Queue', icon: ListPlus, onSelect: () => addToQueue(song) },
          { label: 'Add to Playlist', icon: ListMusic, onSelect: () => {}, addToPlaylist: true },
        ],
      });
    },
    [playNext, addToQueue]
  );

  const addToPlaylist = useCallback(
    async (playlistId: string, song: Song) => {
      if (!credentials) return;
      const url = buildRestUrl('updatePlaylist.view', credentials.username, credentials.password, {
        playlistId,
        songIdToAdd: song.id,
      });
      await fetch(url);
      notifyPlaylistsChanged();
    },
    [credentials]
  );

  const openPlaylistMenu = useCallback(
    (event: MouseEvent, target: PlaylistTarget) => {
      event.preventDefault();
      const play = async (order: (s: Song[]) => Song[]) => {
        const entries = order(await fetchEntries(target.id));
        if (entries.length === 0) return;
        playQueue(entries, 0);
        recordRecentlyPlayed('playlist', target.id).catch(() => {});
      };
      setMenu({
        x: event.clientX,
        y: event.clientY,
        items: [
          { label: 'Play', icon: Play, onSelect: () => void play((s) => s) },
          { label: 'Shuffle', icon: Shuffle, onSelect: () => void play(shuffle) },
          {
            label: 'Play Next',
            icon: ListStart,
            // Reverse so repeated insert-after-current lands them in order.
            onSelect: () =>
              void fetchEntries(target.id).then((s) => [...s].reverse().forEach(playNext)),
          },
          {
            label: 'Add to Queue',
            icon: ListPlus,
            onSelect: () => void fetchEntries(target.id).then((s) => s.forEach(addToQueue)),
          },
          {
            label: 'Delete',
            icon: Trash2,
            danger: true,
            onSelect: () => setConfirm(target),
          },
        ],
      });
    },
    [fetchEntries, playQueue, playNext, addToQueue]
  );

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

  const deletePlaylist = useCallback(async () => {
    if (!confirm || !credentials) return;
    const url = buildRestUrl('deletePlaylist.view', credentials.username, credentials.password, {
      id: confirm.id,
    });
    await fetch(url);
    notifyPlaylistsChanged();
    setConfirm(null);
  }, [confirm, credentials]);

  const items = menu?.items ?? [];
  const menuHeight = items.length * MENU_ITEM_H + 12;
  const left = Math.max(MARGIN, Math.min(menu?.x ?? 0, window.innerWidth - MENU_WIDTH - MARGIN));
  const top = Math.max(MARGIN, Math.min(menu?.y ?? 0, window.innerHeight - menuHeight - MARGIN));
  // Flip the flyout to the left when the menu sits in the right half of the screen.
  const subLeft = left > window.innerWidth / 2;
  const menuSong = menu?.song;

  return (
    <ContextMenuContext.Provider value={{ openSongMenu, openPlaylistMenu }}>
      {children}
      {menu &&
        createPortal(
          <div
            ref={menuRef}
            role="menu"
            className="fixed z-100 rounded-[12px] border border-hairline bg-[rgba(15,15,15,0.94)] p-1.5 shadow-2xl backdrop-blur-[18px]"
            style={{ left, top, width: MENU_WIDTH }}
          >
            {items.map(({ label, icon: Icon, onSelect, danger, addToPlaylist: hasFlyout }) =>
              hasFlyout && menuSong ? (
                <div key={label} className="group/sub relative">
                  <button
                    type="button"
                    role="menuitem"
                    className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-[12.5px] text-ink-2 transition-colors group-hover/sub:bg-white/6 group-hover/sub:text-foreground"
                  >
                    <Icon className="h-3.75 w-3.75 shrink-0" />
                    <span className="flex-1">{label}</span>
                    <ChevronRight className="h-3.5 w-3.5 shrink-0" />
                  </button>
                  <div
                    className={cn(
                      'invisible absolute top-0 w-56 rounded-[12px] border border-hairline bg-[rgba(15,15,15,0.98)] p-1.5 opacity-0 shadow-2xl backdrop-blur-[18px] transition-opacity group-hover/sub:visible group-hover/sub:opacity-100',
                      subLeft ? 'right-full mr-1' : 'left-full ml-1'
                    )}
                  >
                    <div className="flex max-h-72 flex-col gap-px overflow-y-auto">
                      {playlists.length === 0 && (
                        <p className="px-2 py-2 text-[12px] text-ink-3">No playlists yet.</p>
                      )}
                      {playlists.slice(0, SUBMENU_LIMIT).map((pl) => (
                        <PlaylistPickerRow
                          key={pl.id}
                          playlist={pl}
                          onSelect={() => {
                            void addToPlaylist(pl.id, menuSong);
                            close();
                          }}
                        />
                      ))}
                    </div>
                    {playlists.length > SUBMENU_LIMIT && (
                      <button
                        type="button"
                        onClick={() => {
                          setPickerSong(menuSong);
                          close();
                        }}
                        className="mt-1 w-full border-t border-hairline px-2 pb-1 pt-2 text-left text-[12px] font-medium text-accent-gold transition-colors hover:text-accent-deep"
                      >
                        View all…
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <button
                  key={label}
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    onSelect();
                    close();
                  }}
                  className={
                    danger
                      ? 'mt-1 flex w-full items-center gap-2.5 rounded-md border-t border-hairline px-2.5 py-2 pt-2.5 text-left text-[12.5px] text-destructive transition-colors hover:bg-destructive/10'
                      : 'flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-[12.5px] text-ink-2 transition-colors hover:bg-white/6 hover:text-foreground'
                  }
                >
                  <Icon className="h-3.75 w-3.75 shrink-0" />
                  {label}
                </button>
              )
            )}
          </div>,
          document.body
        )}
      {confirm &&
        createPortal(
          <div
            className="fixed inset-0 z-100 grid place-items-center bg-black/60 backdrop-blur-[2px]"
            onClick={() => setConfirm(null)}
          >
            <div
              role="dialog"
              aria-modal="true"
              onClick={(e) => e.stopPropagation()}
              className="w-85 rounded-xl border border-hairline bg-[rgba(20,20,20,0.98)] p-5 shadow-2xl"
            >
              <h2 className="text-[15px] font-semibold text-foreground">Delete playlist?</h2>
              <p className="mt-2 text-[13px] leading-normal text-ink-2">
                “{confirm.name}” will be permanently deleted. This can’t be undone.
              </p>
              <div className="mt-5 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setConfirm(null)}
                  className="rounded-md px-3.5 py-2 text-[13px] font-medium text-ink-2 transition-colors hover:bg-white/6 hover:text-foreground"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => void deletePlaylist()}
                  className="rounded-md bg-destructive px-3.5 py-2 text-[13px] font-semibold text-white transition-colors hover:brightness-110"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
      {pickerSong &&
        createPortal(
          <div
            className="fixed inset-0 z-100 grid place-items-center bg-black/60 backdrop-blur-[2px]"
            onClick={() => setPickerSong(null)}
          >
            <div
              role="dialog"
              aria-modal="true"
              onClick={(e) => e.stopPropagation()}
              className="flex max-h-[70vh] w-85 flex-col rounded-xl border border-hairline bg-[rgba(20,20,20,0.98)] p-4 shadow-2xl"
            >
              <h2 className="px-1.5 pb-2 text-[15px] font-semibold text-foreground">
                Add to playlist
              </h2>
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search playlists"
                className="mb-2 w-full rounded-md bg-panel-2 px-2.5 py-1.5 text-[13px] text-foreground outline-none placeholder:text-muted-strong"
              />
              <div className="flex flex-col gap-px overflow-y-auto">
                {(() => {
                  const filtered = playlists.filter((pl) =>
                    pl.name.toLowerCase().includes(query.trim().toLowerCase())
                  );
                  if (filtered.length === 0)
                    return (
                      <p className="px-1.5 py-3 text-[13px] text-ink-3">
                        {playlists.length === 0 ? 'No playlists yet.' : 'No matches.'}
                      </p>
                    );
                  return filtered.map((pl) => (
                    <PlaylistPickerRow
                      key={pl.id}
                      playlist={pl}
                      onSelect={() => {
                        void addToPlaylist(pl.id, pickerSong);
                        setPickerSong(null);
                      }}
                    />
                  ));
                })()}
              </div>
            </div>
          </div>,
          document.body
        )}
    </ContextMenuContext.Provider>
  );
}
