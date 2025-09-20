import { createContext, useContext, useState, ReactNode } from 'react';

type PageType = 'home' | 'login' | 'signup' | 'dashboard' | 'app';

interface AppContextType {
  currentPage: PageType;
  setCurrentPage: (page: PageType) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedFeature?: string;
  setSelectedFeature: (feature: string | undefined) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedFeature, setSelectedFeature] = useState<string | undefined>();

  const handleSetActiveTab = (tab: string) => {
    setActiveTab(tab);
    if (tab !== "tools") {
      setSelectedFeature(undefined);
    }
  };

  const value = {
    currentPage,
    setCurrentPage,
    activeTab,
    setActiveTab: handleSetActiveTab,
    selectedFeature,
    setSelectedFeature
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}