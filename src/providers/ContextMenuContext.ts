import { createContext } from 'react';
import type { MouseEvent } from 'react';
import type { Song } from '@/@types/types';

export type PlaylistTarget = { id: string; name: string };

export type ContextMenuValue = {
  openSongMenu: (event: MouseEvent, song: Song, onPlay: () => void) => void;
  openPlaylistMenu: (event: MouseEvent, target: PlaylistTarget) => void;
};

export const ContextMenuContext = createContext<ContextMenuValue | null>(null);
