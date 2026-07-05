import { createContext } from 'react';
import type { MouseEvent } from 'react';
import type { Song } from '@/@types/types';

export type ContextMenuValue = {
  openSongMenu: (event: MouseEvent, song: Song, onPlay: () => void) => void;
};

export const ContextMenuContext = createContext<ContextMenuValue | null>(null);
