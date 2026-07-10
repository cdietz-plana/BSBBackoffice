import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';

/**
 * Tiny intent bus so the command palette can trigger an action inside a view
 * it doesn't own — e.g. "New Pit Location" navigates to that view and asks its
 * MaintenanceTable to open its create modal.
 */
interface IntentValue {
  createKey: string | null;
  requestCreate: (key: string) => void;
  clearCreate: () => void;
}

const IntentCtx = createContext<IntentValue>({
  createKey: null,
  requestCreate: () => {},
  clearCreate: () => {},
});

export const useIntent = () => useContext(IntentCtx);

export function IntentProvider({ children }: { children: ReactNode }) {
  const [createKey, setCreateKey] = useState<string | null>(null);
  const requestCreate = useCallback((key: string) => setCreateKey(key), []);
  const clearCreate = useCallback(() => setCreateKey(null), []);
  return (
    <IntentCtx.Provider value={{ createKey, requestCreate, clearCreate }}>
      {children}
    </IntentCtx.Provider>
  );
}
