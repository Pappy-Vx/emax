'use client';
import { createContext, useContext, useState, useCallback } from 'react';

const Ctx = createContext(null);

export function DashProvider({ children }) {
  const [toast, setToast] = useState('');
  const [requestOpen, setRequestOpen] = useState(false);

  const notify = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2600);
  }, []);

  const openRequest = useCallback(() => setRequestOpen(true), []);

  return (
    <Ctx.Provider value={{ toast, notify, requestOpen, setRequestOpen, openRequest }}>
      {children}
    </Ctx.Provider>
  );
}

export function useDashCtx() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useDashCtx must be used inside DashProvider');
  return ctx;
}
