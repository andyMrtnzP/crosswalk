import { useContext } from 'react';
import type { StarType } from '@/providers/StarContext';
import { StarContext } from '@/providers/StarContext';

export default function useStarred(id: string, initialStarred = false, type: StarType = 'song') {
  const ctx = useContext(StarContext);
  if (!ctx) {
    throw new Error('useStarred must be used within a StarProvider');
  }
  return {
    starred: ctx.isStarred(id, initialStarred),
    toggle: () => ctx.toggleStar(id, initialStarred, type),
  };
}
