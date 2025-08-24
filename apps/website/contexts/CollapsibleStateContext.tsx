'use client';

import React, { createContext, useContext, useState } from 'react';

interface CollapsibleStateContextType {
  collapsedSections: Record<string, boolean>;
  toggleSection: (section: string) => void;
}

const CollapsibleStateContext = createContext<CollapsibleStateContextType | null>(null);

export function CollapsibleStateProvider({ children }: { children: React.ReactNode }) {
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});

  const toggleSection = (section: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <CollapsibleStateContext.Provider value={{ collapsedSections, toggleSection }}>
      {children}
    </CollapsibleStateContext.Provider>
  );
}

export function useCollapsibleState() {
  const context = useContext(CollapsibleStateContext);
  if (!context) {
    throw new Error('useCollapsibleState must be used within a CollapsibleStateProvider');
  }
  return context;
}