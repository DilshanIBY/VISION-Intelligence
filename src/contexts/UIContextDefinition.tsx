import { createContext, useContext } from 'react';

export interface UIContextType {
  isDashboardEditing: boolean;
  setDashboardEditing: (value: boolean) => void;
  isPresentationMode: boolean;
  setPresentationMode: (value: boolean) => void;
  isSidebarExpanded: boolean;
  setSidebarExpanded: (value: boolean) => void;
  toggleDashboardEditing: () => void;
  togglePresentationMode: () => void;
  toggleSidebar: () => void;
}

export const UIContext = createContext<UIContextType | undefined>(undefined);

export function useUI() {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
}
