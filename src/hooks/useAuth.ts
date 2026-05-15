import { AuthenticationContext } from '@/providers/AuthenticationProvider';
import { useContext } from 'react';

export default function useAuth() {
  const context = useContext(AuthenticationContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthenticationProvider.');
  }

  return context;
}
