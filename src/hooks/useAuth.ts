import { AuthenticationContext } from '@/providers/AuthenticationProvider';
import { useContext } from 'react';

function useAuth() {
  const context = useContext(AuthenticationContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthenticationProvider.');
  }

  return context;
}

export default useAuth;
