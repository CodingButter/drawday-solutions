'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface Participant {
  firstName: string;
  lastName: string;
  ticketNumber: string;
}

export interface Competition {
  id: string;
  name: string;
  participants: Participant[];
  winners?: Participant[];
  bannerImage?: string;
  createdAt: number;
  updatedAt: number;
}

interface CompetitionContextType {
  competitions: Competition[];
  selectedCompetition: Competition | null;
  addCompetition: (competition: Competition) => Promise<void>;
  updateCompetition: (id: string, updates: Partial<Competition>) => Promise<void>;
  deleteCompetition: (id: string) => Promise<void>;
  selectCompetition: (competition: Competition) => void;
  updateCompetitionBanner: (id: string, bannerImage: string) => Promise<void>;
  refreshCompetitions: () => void;
}

const CompetitionContext = createContext<CompetitionContextType | null>(null);

// Helper functions for localStorage operations
const loadCompetitionsFromStorage = (): Competition[] => {
  try {
    const stored = localStorage.getItem('competitions');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading competitions from localStorage:', error);
    return [];
  }
};

const saveCompetitionsToStorage = (competitions: Competition[]) => {
  try {
    localStorage.setItem('competitions', JSON.stringify(competitions));
    // Dispatch a custom event to notify other tabs/windows
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'competitions',
      newValue: JSON.stringify(competitions),
      storageArea: localStorage
    }));
  } catch (error) {
    console.error('Error saving competitions to localStorage:', error);
  }
};

export function CompetitionProvider({ children }: { children: React.ReactNode }) {
  const [competitions, setCompetitions] = useState<Competition[]>(() => loadCompetitionsFromStorage());
  const [selectedCompetition, setSelectedCompetition] = useState<Competition | null>(() => {
    try {
      const stored = localStorage.getItem('selectedCompetition');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Listen for changes from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'competitions' && e.newValue) {
        try {
          const newCompetitions = JSON.parse(e.newValue);
          setCompetitions(newCompetitions);
        } catch (error) {
          console.error('Error parsing competitions from storage event:', error);
        }
      } else if (e.key === 'selectedCompetition' && e.newValue) {
        try {
          const newSelected = JSON.parse(e.newValue);
          setSelectedCompetition(newSelected);
        } catch (error) {
          console.error('Error parsing selected competition from storage event:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Sync selected competition to localStorage
  useEffect(() => {
    if (selectedCompetition) {
      localStorage.setItem('selectedCompetition', JSON.stringify(selectedCompetition));
    } else {
      localStorage.removeItem('selectedCompetition');
    }
  }, [selectedCompetition]);

  const refreshCompetitions = useCallback(() => {
    const comps = loadCompetitionsFromStorage();
    setCompetitions(comps);
  }, []);

  const addCompetition = async (competition: Competition) => {
    const newCompetition: Competition = {
      ...competition,
      id: competition.id || `comp-${Date.now()}`,
      createdAt: competition.createdAt || Date.now(),
      updatedAt: Date.now()
    };
    
    const updatedCompetitions = [...competitions, newCompetition];
    setCompetitions(updatedCompetitions);
    saveCompetitionsToStorage(updatedCompetitions);
    
    // Auto-select the newly created competition
    selectCompetition(newCompetition);
  };

  const updateCompetition = async (id: string, updates: Partial<Competition>) => {
    const updatedCompetitions = competitions.map(comp => 
      comp.id === id 
        ? { ...comp, ...updates, updatedAt: Date.now() }
        : comp
    );
    
    setCompetitions(updatedCompetitions);
    saveCompetitionsToStorage(updatedCompetitions);
    
    // Update selected competition if it's the one being updated
    if (selectedCompetition?.id === id) {
      const updated = updatedCompetitions.find(c => c.id === id);
      if (updated) {
        setSelectedCompetition(updated);
      }
    }
  };

  const deleteCompetition = async (id: string) => {
    const updatedCompetitions = competitions.filter(comp => comp.id !== id);
    setCompetitions(updatedCompetitions);
    saveCompetitionsToStorage(updatedCompetitions);
    
    // Clear selection if deleted competition was selected
    if (selectedCompetition?.id === id) {
      setSelectedCompetition(null);
      localStorage.removeItem('selectedCompetition');
    }
  };

  const selectCompetition = (competition: Competition) => {
    setSelectedCompetition(competition);
    localStorage.setItem('selectedCompetition', JSON.stringify(competition));
    
    // Dispatch custom event for immediate updates
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'selectedCompetition',
      newValue: JSON.stringify(competition),
      storageArea: localStorage
    }));
  };

  const updateCompetitionBanner = async (id: string, bannerImage: string) => {
    await updateCompetition(id, { bannerImage });
  };

  return (
    <CompetitionContext.Provider 
      value={{ 
        competitions, 
        selectedCompetition, 
        addCompetition, 
        updateCompetition, 
        deleteCompetition, 
        selectCompetition,
        updateCompetitionBanner,
        refreshCompetitions
      }}
    >
      {children}
    </CompetitionContext.Provider>
  );
}

export function useCompetitions() {
  const context = useContext(CompetitionContext);
  if (!context) {
    throw new Error('useCompetitions must be used within a CompetitionProvider');
  }
  return context;
}