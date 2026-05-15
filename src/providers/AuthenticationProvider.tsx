import { useCallback, useMemo, useState, type ReactNode, createContext } from 'react';
import type { AuthContextValue, AuthCredentials, SubsonicEnvelope } from '@/@types/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';

const AUTH_STORAGE_KEY = 'crosswalk.auth';
export const AuthenticationContext = createContext<AuthContextValue | null>(null);

type AuthenticationProviderProps = {
  children: ReactNode;
};

const AuthenticationProvider = ({ children }: AuthenticationProviderProps) => {
  const { get: getCredentials, set: setCredentials, del: deleteCredentials } = useLocalStorage<AuthCredentials>(AUTH_STORAGE_KEY);
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

      setCredentials(nextCredentials);
      setError(null);
      return true;
    } catch (caughtError) {
      deleteCredentials();
      setError(caughtError instanceof Error ? caughtError.message : 'Unable to authenticate.');
      return false;
    } finally {
      setIsAuthenticating(false);
    }
  }, []);

  const logout = useCallback(() => {
    deleteCredentials();
    setError(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      credentials: getCredentials(),
      isAuthenticated: getCredentials() !== null,
      isAuthenticating,
      error,
      login,
      logout,
    }),
    [isAuthenticating, error, login, logout]
  );

  return <AuthenticationContext.Provider value={value}>{children}</AuthenticationContext.Provider>;
}

export { AuthenticationProvider };
