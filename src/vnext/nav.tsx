import { createContext, useContext } from 'react';

/** Lets views request a view switch (e.g. clicking a KPI jumps to its screen). */
export const NavCtx = createContext<(key: string) => void>(() => {});
export const useVNav = () => useContext(NavCtx);
