import { createContext, ReactNode, useState, useMemo, useCallback } from 'react';

interface ModalsDispatchContextType {
  open: (Component: ReactNode, props?: any) => void;
  close: (Component: ReactNode) => void;
}

type ModalsStateContextType = { Component: ReactNode; props: any }[];

export const ModalsDispatchContext = createContext<ModalsDispatchContextType>({
  open: () => {},
  close: () => {},
});

export const ModalsStateContext = createContext<ModalsStateContextType>([]);

export const ModalsProvider = ({ children }: { children: ReactNode }) => {
  const [openedModals, setOpenedModals] = useState<ModalsStateContextType>([]);

  const open = useCallback((Component: ReactNode, props?: any) => {
    setOpenedModals((modals) => [...modals, { Component, props }]);
  }, []);

  const close = useCallback((Component: ReactNode) => {
    setOpenedModals((modals) => modals.filter((modal) => modal.Component !== Component));
  }, []);

  const dispatch = useMemo(() => ({ open, close }), [open, close]);

  return (
    <ModalsStateContext.Provider value={openedModals}>
      <ModalsDispatchContext.Provider value={dispatch}>{children}</ModalsDispatchContext.Provider>
    </ModalsStateContext.Provider>
  );
};
