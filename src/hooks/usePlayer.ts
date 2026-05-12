import { useContext } from 'react';
import type { PlayerContextValue } from '@/@types/types';
import { PlayerContext } from '@/providers/PlayerContext';

export default function usePlayer(): PlayerContextValue {
  const ctx = useContext(PlayerContext);
  if (!ctx) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return ctx;
}
