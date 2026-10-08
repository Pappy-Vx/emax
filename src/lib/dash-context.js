'use client';
import { createContext, useContext, useState, useCallback } from 'react';
import { toast } from 'sonner';

const Ctx = createContext(null);

export function DashProvider({ children }) {
  const [requestOpen, setRequestOpen] = useState(false);

  const notify = useCallback((msg, type = 'success') => {
    if (type === 'error')   return toast.error(msg);
    if (type === 'warning') return toast.warning(msg);
    if (type === 'info')    return toast.info(msg);
    toast.success(msg);
  }, []);

  const openRequest = useCallback(() => setRequestOpen(true), []);

  return (
    <Ctx.Provider value={{ notify, requestOpen, setRequestOpen, openRequest }}>
      {children}
    </Ctx.Provider>
  );
}

export function useDashCtx() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useDashCtx must be used inside DashProvider');
  return ctx;
}
