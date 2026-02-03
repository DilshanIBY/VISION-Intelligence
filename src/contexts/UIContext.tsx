import { createContext, useContext, useState, ReactNode } from 'react';

interface UIContextType {
    isDashboardEditing: boolean;
    setDashboardEditing: (value: boolean) => void;
    isPresentationMode: boolean;
    setPresentationMode: (value: boolean) => void;
    toggleDashboardEditing: () => void;
    togglePresentationMode: () => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: ReactNode }) {
    const [isDashboardEditing, setDashboardEditing] = useState(false);
    const [isPresentationMode, setPresentationMode] = useState(false);

    const toggleDashboardEditing = () => setDashboardEditing(prev => !prev);
    const togglePresentationMode = () => setPresentationMode(prev => !prev);

    return (
        <UIContext.Provider value={{
            isDashboardEditing,
            setDashboardEditing,
            isPresentationMode,
            setPresentationMode,
            toggleDashboardEditing,
            togglePresentationMode
        }}>
            {children}
        </UIContext.Provider>
    );
}

export function useUI() {
    const context = useContext(UIContext);
    if (context === undefined) {
        throw new Error('useUI must be used within a UIProvider');
    }
    return context;
}
