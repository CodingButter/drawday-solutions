'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { imageStore } from '@/lib/image-utils';
import { authenticatedFetch } from '@/lib/directus-auth';
// Firebase imports removed - using Directus instead
type Participant = {
  firstName: string;
  lastName: string;
  ticketNumber: string;
};

type Winner = {
  participant: Participant;
  timestamp: number;
};

export interface Competition {
  id: string;
  name: string;
  participants: Participant[];
  winners?: Winner[];
  bannerImageId?: string; // Store ID reference instead of actual image
  createdAt: number;
  updatedAt: number;
  userId?: string; // User ID for ownership
}

export type { Participant, Winner };

interface CompetitionContextType {
  competitions: Competition[];
  selectedCompetition: Competition | null;
  addCompetition: (competition: Competition) => Promise<void>;
  updateCompetition: (id: string, updates: Partial<Competition>) => Promise<void>;
  deleteCompetition: (id: string) => Promise<void>;
  clearAllCompetitions: () => Promise<void>;
  selectCompetition: (competition: Competition) => void;
  updateCompetitionBanner: (id: string, bannerImage: string) => Promise<void>;
  getBannerImage: (imageId: string | undefined) => Promise<string | null>;
  refreshCompetitions: () => void;
}

const CompetitionContext = createContext<CompetitionContextType | null>(null);

// Helper functions for Directus operations
const fetchCompetitionsFromDirectus = async (): Promise<Competition[]> => {
  try {

    const response = await authenticatedFetch('/api/v1/competitions', {
      credentials: 'include', // Include cookies for auth
    });

    if (!response.ok) {
      const errorText = await response.text();

      // If unauthorized, just return empty array instead of throwing
      if (response.status === 401) {
        return [];
      }

      throw new Error('Failed to fetch competitions');
    }

    const data = await response.json();
    const competitions = data.competitions || [];
    return competitions;
  } catch (error) {
    return [];
  }
};

const saveCompetitionToDirectus = async (competition: Competition): Promise<Competition | null> => {
  try {

    const response = await authenticatedFetch('/api/v1/competitions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include cookies for auth
      body: JSON.stringify(competition),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error('Failed to save competition');
    }

    const data = await response.json();
    const savedCompetition = data.competition || data;
    return savedCompetition;
  } catch (error) {
    return null;
  }
};

const updateCompetitionInDirectus = async (id: string, updates: Partial<Competition>): Promise<boolean> => {
  try {
    const response = await authenticatedFetch(`/api/competitions/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include cookies for auth
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      throw new Error('Failed to update competition');
    }

    return true;
  } catch (error) {
    return false;
  }
};

const deleteCompetitionFromDirectus = async (id: string): Promise<boolean> => {
  try {
    const response = await authenticatedFetch(`/api/competitions/${id}`, {
      method: 'DELETE',
      credentials: 'include', // Include cookies for auth
    });

    if (!response.ok) {
      throw new Error('Failed to delete competition');
    }

    return true;
  } catch (error) {
    return false;
  }
};

export const CompetitionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [selectedCompetition, setSelectedCompetition] = useState<Competition | null>(null);
  const [loading, setLoading] = useState(true);
  const hasLoadedInitialRef = useRef(false);

  // Check for Directus auth and load competitions
  useEffect(() => {
    const loadCompetitions = async () => {
      try {
        // Check if user is authenticated by trying to fetch competitions
        const comps = await fetchCompetitionsFromDirectus();
        setCompetitions(comps);
        hasLoadedInitialRef.current = true;
        
        // Load selected competition from localStorage (temporary storage)
        if (typeof window !== 'undefined' && window.localStorage) {
          const stored = localStorage.getItem('selectedCompetition');
          if (stored) {
            try {
              const selected = JSON.parse(stored);
              setSelectedCompetition(selected);
            } catch (e) {
            }
          }
        }
      } catch (error) {
        setCompetitions([]);
        setSelectedCompetition(null);
      }
      setLoading(false);
    };

    loadCompetitions();
  }, []); // Keep empty to only run once
  
  // Listen for changes from other tabs/windows (for selected competition only)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'selectedCompetition' && e.newValue) {
        try {
          const newSelected = JSON.parse(e.newValue);
          setSelectedCompetition(newSelected);
        } catch (error) {
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Sync selected competition to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      if (selectedCompetition) {
        localStorage.setItem('selectedCompetition', JSON.stringify(selectedCompetition));
      } else {
        localStorage.removeItem('selectedCompetition');
      }
    }
  }, [selectedCompetition]);

  const refreshCompetitions = useCallback(async () => {
    try {
      const comps = await fetchCompetitionsFromDirectus();
      if (comps) {
        setCompetitions(comps);
        hasLoadedInitialRef.current = true;
      }
    } catch (error) {
    }
  }, []);

  const addCompetition = useCallback(async (competition: Competition) => {
    // Save to Directus
    const saved = await saveCompetitionToDirectus(competition);
    if (saved) {
      setCompetitions(prev => [...prev, saved]);
    } else {
      // If save failed, still add locally for now
      setCompetitions(prev => [...prev, competition]);
    }
  }, []);

  const updateCompetition = useCallback(async (id: string, updates: Partial<Competition>) => {
    // Update locally immediately
    setCompetitions(prev => 
      prev.map(comp => comp.id === id ? { ...comp, ...updates, updatedAt: Date.now() } : comp)
    );
    
    // Update selected if it's the one being updated
    if (selectedCompetition?.id === id) {
      setSelectedCompetition(prev => prev ? { ...prev, ...updates, updatedAt: Date.now() } : null);
    }
    
    // Save to Directus
    await updateCompetitionInDirectus(id, updates);
  }, [selectedCompetition]);

  const deleteCompetition = useCallback(async (id: string) => {
    // Remove locally immediately
    setCompetitions(prev => prev.filter(comp => comp.id !== id));
    
    // Clear selection if it's the one being deleted
    if (selectedCompetition?.id === id) {
      setSelectedCompetition(null);
    }
    
    // Delete from Directus
    await deleteCompetitionFromDirectus(id);
  }, [selectedCompetition]);

  const clearAllCompetitions = useCallback(async () => {
    // Clear all competitions from Directus one by one
    const deletePromises = competitions.map(comp => deleteCompetitionFromDirectus(comp.id));
    await Promise.all(deletePromises);
    
    setCompetitions([]);
    setSelectedCompetition(null);
  }, [competitions]);

  const selectCompetition = useCallback((competition: Competition) => {
    setSelectedCompetition(competition);
  }, []);

  const updateCompetitionBanner = useCallback(async (id: string, bannerImage: string) => {
    // Store the image and get its ID
    const imageId = await imageStore.storeImage(bannerImage);
    
    // Update the competition with the new banner image ID
    await updateCompetition(id, { bannerImageId: imageId });
  }, [updateCompetition]);

  const getBannerImage = useCallback(async (imageId: string | undefined): Promise<string | null> => {
    if (!imageId) return null;
    return await imageStore.getImageUrl(imageId);
  }, []);

  const value = {
    competitions,
    selectedCompetition,
    addCompetition,
    updateCompetition,
    deleteCompetition,
    clearAllCompetitions,
    selectCompetition,
    updateCompetitionBanner,
    getBannerImage,
    refreshCompetitions,
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <CompetitionContext.Provider value={value}>
      {children}
    </CompetitionContext.Provider>
  );
};

export const useCompetitions = () => {
  const context = useContext(CompetitionContext);
  if (!context) {
    throw new Error('useCompetitions must be used within a CompetitionProvider');
  }
  return context;
};