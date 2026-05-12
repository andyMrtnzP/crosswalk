import { createContext } from 'react';
import type { AuthContextValue } from '@/@types/types';

const AuthenticationContext = createContext<AuthContextValue | null>(null);

export default AuthenticationContext;
