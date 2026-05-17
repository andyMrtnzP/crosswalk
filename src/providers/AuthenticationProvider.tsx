import { useCallback, useMemo, useState, type ReactNode } from 'react';
import type { AuthContextValue, AuthCredentials, SubsonicEnvelope } from '@/@types/types';
import { buildAuthParams } from '@/lib/auth';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { AuthenticationContext } from './auth-context';

const AUTH_STORAGE_KEY = 'crosswalk.auth';

type AuthenticationProviderProps = {
  children: ReactNode;
};

const AuthenticationProvider = ({ children }: AuthenticationProviderProps) => {
  const {
    get: readFromStorage,
    set: writeToStorage,
    del: removeFromStorage,
  } = useLocalStorage<AuthCredentials>(AUTH_STORAGE_KEY);
  const [credentials, setCredentials] = useState<AuthCredentials | null>(() => readFromStorage());
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const login = useCallback(
    async (nextCredentials: AuthCredentials) => {
      setError(null);
      setIsAuthenticating(true);

      try {
        const params = buildAuthParams(nextCredentials.username, nextCredentials.password);
        params.set('f', 'json');

        const response = await fetch(`/rest/ping.view?${params.toString()}`);
        const payload = (await response.json()) as SubsonicEnvelope;
        const subsonic = payload['subsonic-response'];

        if (!response.ok || subsonic?.status !== 'ok') {
          throw new Error(subsonic?.error?.message ?? 'Invalid Navidrome credentials.');
        }

        writeToStorage(nextCredentials);
        setCredentials(nextCredentials);
        setError(null);
        return true;
      } catch (caughtError) {
        removeFromStorage();
        setCredentials(null);
        setError(caughtError instanceof Error ? caughtError.message : 'Unable to authenticate.');
        return false;
      } finally {
        setIsAuthenticating(false);
      }
    },
    [writeToStorage, removeFromStorage]
  );

  const logout = useCallback(() => {
    removeFromStorage();
    setCredentials(null);
    setError(null);
  }, [removeFromStorage]);

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
};

export { AuthenticationProvider };
