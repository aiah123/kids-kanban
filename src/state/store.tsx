import { createContext, useContext, type ReactNode } from 'react';
import type { Action } from './actions';
import { makeDefaultState } from './defaults';
import { reducer } from './reducer';
import { useLocalStorage } from './useLocalStorage';

const STORAGE_KEY = 'kids-kanban-state';

interface StoreContextValue {
  state: ReturnType<typeof makeDefaultState>;
  dispatch: (action: Action) => void;
  restoreState: (state: ReturnType<typeof makeDefaultState>) => void;
}

const StoreContext = createContext<StoreContextValue | null>(null);

function StoreBridge({ children }: { children: ReactNode }) {
  const [state, setState, restoreState] = useLocalStorage(STORAGE_KEY, makeDefaultState);

  const dispatch = (action: Action) => {
    setState((prev) => reducer(prev, action));
  };

  const value = { state, dispatch, restoreState };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function StoreProvider({ children }: { children: ReactNode }) {
  return <StoreBridge>{children}</StoreBridge>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
