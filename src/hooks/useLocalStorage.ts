import { useCallback } from 'react';

export function useLocalStorage<T>(key: string) {
  const get = useCallback(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : null;
    } catch (error) {
      console.error(`Error reading from localStorage key "${key}":`, error);
      return null;
    }
  }, [key]);

  const set = useCallback(
    (value: T) => {
      try {
        window.localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error(`Error writing to localStorage key "${key}":`, error);
      }
    },
    [key]
  );

  const del = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error deleting from localStorage key "${key}":`, error);
    }
  }, [key]);

  return { get, set, del };
}
