import { useCallback, useEffect, useRef, useState } from 'react';
import useAuth from '@/hooks/useAuth';
import { buildRestUrl } from '@/lib/auth';
import type { StarType } from './StarContext';
import { StarContext } from './StarContext';

export default function StarProvider({ children }: { children: React.ReactNode }) {
  const { credentials } = useAuth();
  // Only ids the user toggled this session; everything else uses the song's
  // own `starred` field as the fallback.
  const [overrides, setOverrides] = useState<Record<string, boolean>>({});
  const overridesRef = useRef(overrides);
  useEffect(() => {
    overridesRef.current = overrides;
  }, [overrides]);

  const isStarred = useCallback(
    (id: string, fallback = false) => overrides[id] ?? fallback,
    [overrides]
  );

  const toggleStar = useCallback(
    (id: string, fallback = false, type: StarType = 'song') => {
      if (!credentials) return;
      const current = overridesRef.current[id] ?? fallback;
      const next = !current;
      setOverrides((prev) => ({ ...prev, [id]: next })); // optimistic

      const idKey = type === 'album' ? 'albumId' : type === 'artist' ? 'artistId' : 'id';
      const url = buildRestUrl(
        `${next ? 'star' : 'unstar'}.view`,
        credentials.username,
        credentials.password,
        {
          [idKey]: id,
        }
      );
      fetch(url)
        .then((res) => {
          if (!res.ok) throw new Error(`star failed: ${res.status}`);
        })
        .catch(() => setOverrides((prev) => ({ ...prev, [id]: current }))); // revert
    },
    [credentials]
  );

  return <StarContext.Provider value={{ isStarred, toggleStar }}>{children}</StarContext.Provider>;
}
