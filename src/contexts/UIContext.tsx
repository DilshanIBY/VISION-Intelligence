import { useState, ReactNode } from 'react';
import { UIContext } from './UIContextDefinition';

export function UIProvider({ children }: { children: ReactNode }) {
  const [isDashboardEditing, setDashboardEditing] = useState(false);
  const [isPresentationMode, setPresentationMode] = useState(false);
  const [isSidebarExpanded, setSidebarExpanded] = useState(false);

  const toggleDashboardEditing = () => setDashboardEditing(prev => !prev);
  const togglePresentationMode = () => setPresentationMode(prev => !prev);
  const toggleSidebar = () => setSidebarExpanded(prev => !prev);

  return (
    <UIContext.Provider
      value={{
        isDashboardEditing,
        setDashboardEditing,
        isPresentationMode,
        setPresentationMode,
        isSidebarExpanded,
        setSidebarExpanded,
        toggleDashboardEditing,
        togglePresentationMode,
        toggleSidebar,
      }}
    >
      {children}
    </UIContext.Provider>
  );
}
