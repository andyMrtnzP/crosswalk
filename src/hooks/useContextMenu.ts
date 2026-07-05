import { useContext } from 'react';
import type { ContextMenuValue } from '@/providers/ContextMenuContext';
import { ContextMenuContext } from '@/providers/ContextMenuContext';

export default function useContextMenu(): ContextMenuValue {
  const ctx = useContext(ContextMenuContext);
  if (!ctx) {
    throw new Error('useContextMenu must be used within a ContextMenuProvider');
  }
  return ctx;
}
