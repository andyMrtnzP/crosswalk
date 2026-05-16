import { createContext } from 'react';
import type { AuthContextValue } from '@/@types/types';

export const AuthenticationContext = createContext<AuthContextValue | null>(null);
