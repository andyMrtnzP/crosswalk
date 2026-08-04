import { useCallback, useState } from 'react';
import { createPortal } from 'react-dom';
import usePlayer from '@/hooks/usePlayer';
import { cn } from '@/lib/utils';
import { ToastContext } from './ToastContext';

type Toast = { id: number; message: string };
const DURATION = 3000;

export default function ToastProvider({ children }: { children: React.ReactNode }) {
  const { currentSong } = usePlayer();
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), DURATION);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {createPortal(
        <div
          className={cn(
            'pointer-events-none fixed right-6 z-200 flex flex-col gap-2',
            currentSong ? 'bottom-[92px]' : 'bottom-6'
          )}
        >
          {toasts.map((t) => (
            <div
              key={t.id}
              className="toast-in rounded-lg border border-hairline bg-[rgba(20,20,20,0.98)] px-4 py-2.5 text-[13px] font-medium text-foreground shadow-2xl backdrop-blur-[18px]"
            >
              {t.message}
            </div>
          ))}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
}
