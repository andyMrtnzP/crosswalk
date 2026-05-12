import { useCallback, useMemo, useState, type ReactNode } from 'react';
import type { AuthContextValue, AuthCredentials, SubsonicEnvelope } from '@/@types/types';
import AuthenticationContext from '@/providers/auth-context';

const AUTH_STORAGE_KEY = 'crosswalk.auth';

function readStoredCredentials(): AuthCredentials | null {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as AuthCredentials;
    if (!parsed.username || !parsed.password) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

type AuthenticationProviderProps = {
  children: ReactNode;
};

function AuthenticationProvider({ children }: AuthenticationProviderProps) {
  const [credentials, setCredentials] = useState<AuthCredentials | null>(() => {
    if (typeof window === 'undefined') {
      return null;
    }

    return readStoredCredentials();
  });
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const login = useCallback(async (nextCredentials: AuthCredentials) => {
    setError(null);
    setIsAuthenticating(true);

    try {
      const params = new URLSearchParams({
        v: '1.16.1',
        c: 'crosswalk-web',
        f: 'json',
        u: nextCredentials.username,
        p: nextCredentials.password,
      });

      const response = await fetch(`/rest/ping.view?${params.toString()}`);
      const payload = (await response.json()) as SubsonicEnvelope;
      const subsonic = payload['subsonic-response'];

      if (!response.ok || subsonic?.status !== 'ok') {
        throw new Error(subsonic?.error?.message ?? 'Invalid Navidrome credentials.');
      }

      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextCredentials));
      setCredentials(nextCredentials);
      setError(null);
      return true;
    } catch (caughtError) {
      setCredentials(null);
      setError(caughtError instanceof Error ? caughtError.message : 'Unable to authenticate.');
      return false;
    } finally {
      setIsAuthenticating(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setCredentials(null);
    setError(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      credentials,
      isAuthenticated: credentials !== null,
      isAuthenticating,
      error,
      login,
      logout,
    }),
    [credentials, isAuthenticating, error, login, logout]
  );

  return <AuthenticationContext.Provider value={value}>{children}</AuthenticationContext.Provider>;
}

export { AuthenticationProvider };
