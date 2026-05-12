import { useCallback, useEffect, useMemo, useState } from 'react';
import type { RequestParams, SubsonicEnvelope, UseNavidromeRequestResult } from '@/@types/types';
import useAuth from './useAuth';

function useNavidromeRequest<T>(url: string, params?: RequestParams): UseNavidromeRequestResult<T> {
  const { credentials } = useAuth();
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const serializedParams = useMemo(() => {
    const entries = Object.entries(params ?? {})
      .filter(([, value]) => value !== null && value !== undefined)
      .map(([key, value]) => [key, String(value)] as const)
      .sort(([left], [right]) => left.localeCompare(right));

    return JSON.stringify(entries);
  }, [params]);

  const refetch = useCallback(async () => {
    if (!credentials?.username || !credentials?.password) {
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const searchParams = new URLSearchParams({
        u: credentials.username,
        p: credentials.password,
        v: '1.16.1',
        c: 'crosswalk-web',
        f: 'json',
      });

      const parsedEntries = JSON.parse(serializedParams) as Array<[string, string]>;
      parsedEntries.forEach(([key, value]) => {
        searchParams.append(key, value);
      });

      const separator = url.includes('?') ? '&' : '?';
      const response = await fetch(`${url}${separator}${searchParams.toString()}`);
      const payload = (await response.json()) as T;

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}.`);
      }

      const subsonic = (payload as SubsonicEnvelope)['subsonic-response'];
      if (subsonic?.status === 'failed') {
        throw new Error(subsonic.error?.message ?? 'Navidrome returned an error.');
      }

      setData(payload);
      return payload;
    } catch (caughtError) {
      setData(null);
      const normalizedError =
        caughtError instanceof Error ? caughtError : new Error('Unexpected request error.');
      setError(normalizedError);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [credentials?.password, credentials?.username, serializedParams, url]);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return {
    error,
    data,
    isLoading,
    refetch,
  };
}

export default useNavidromeRequest;
