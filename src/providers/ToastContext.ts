import { createContext } from 'react';

export type ToastValue = { toast: (message: string) => void };

export const ToastContext = createContext<ToastValue | null>(null);
