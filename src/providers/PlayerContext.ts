import { createContext } from 'react';
import type { PlayerContextValue } from '@/@types/types';

export const PlayerContext = createContext<PlayerContextValue | null>(null);
