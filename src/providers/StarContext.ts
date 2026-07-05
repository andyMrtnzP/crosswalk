import { createContext } from 'react';

// Which Subsonic star param the id maps to: song → id, album → albumId, etc.
export type StarType = 'song' | 'album' | 'artist';

export type StarContextValue = {
  isStarred: (id: string, fallback?: boolean) => boolean;
  toggleStar: (id: string, fallback?: boolean, type?: StarType) => void;
};

export const StarContext = createContext<StarContextValue | null>(null);
