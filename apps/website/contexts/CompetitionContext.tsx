'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import {
  competitionStorage,
  type Competition as StoredCompetition,
} from '@/lib/competition-storage';
import { getStoredUser } from '@/lib/directus-auth';
import { getExtensionBridge } from '@/lib/extension-bridge';
// Now using local storage for competitions, Directus only for banners
type Participant = {
  firstName: string;
  lastName: string;
  ticketNumber: string;
};

type Winner = {
  participant: Participant;
  timestamp: number;
};

// Use the Competition interface from storage service (with Date objects)
export interface Competition {
  id: string;
  name: string;
  participants: Participant[];
  winners?: Winner[];
  bannerImageId?: string;
  createdAt: Date;
  updatedAt?: Date;
  userId?: string;
}

export type { Participant, Winner };

interface CompetitionContextType {
  competitions: Competition[];
  selectedCompetition: Competition | null;
  addCompetition: (competition: Omit<Competition, 'id' | 'createdAt'>) => Promise<Competition>;
  updateCompetition: (id: string, updates: Partial<Competition>) => Promise<void>;
  deleteCompetition: (id: string) => Promise<void>;
  clearAllCompetitions: () => Promise<void>;
  selectCompetition: (competition: Competition) => void;
  updateCompetitionBanner: (id: string, bannerImage: string) => Promise<void>;
  getBannerImage: (imageId: string | undefined) => Promise<string | null>;
  refreshCompetitions: () => Promise<void>;
}

const CompetitionContext = createContext<CompetitionContextType | null>(null);

// Helper functions for local storage operations
const fetchCompetitionsFromStorage = async (userId?: string): Promise<Competition[]> => {
  try {
    const competitions = await competitionStorage.getAll(userId);
    return competitions;
  } catch (error) {
    console.error('Error loading competitions from storage:', error);
    return [];
  }
};

const saveCompetitionToStorage = async (
  competition: Omit<Competition, 'id' | 'createdAt'>
): Promise<Competition | null> => {
  try {
    // Add the current user ID to the competition
    const user = getStoredUser();
    const competitionWithUser = {
      ...competition,
      userId: user?.id,
    };

    const savedCompetition = await competitionStorage.create(competitionWithUser);
    return savedCompetition;
  } catch (error) {
    console.error('Error saving competition to storage:', error);
    return null;
  }
};

const updateCompetitionInStorage = async (
  id: string,
  updates: Partial<Competition>
): Promise<boolean> => {
  try {
    const success = await competitionStorage.update(id, updates);
    return success;
  } catch (error) {
    console.error('Error updating competition in storage:', error);
    return false;
  }
};

const deleteCompetitionFromStorage = async (id: string, userId?: string): Promise<boolean> => {
  try {
    const success = await competitionStorage.delete(id, userId);
    return success;
  } catch (error) {
    console.error('Error deleting competition from storage:', error);
    return false;
  }
};

export const CompetitionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [selectedCompetition, setSelectedCompetition] = useState<Competition | null>(null);
  const [loading, setLoading] = useState(true);
  const hasLoadedInitialRef = useRef(false);

  // Load competitions from local storage
  useEffect(() => {
    const loadCompetitions = async () => {
      try {
        const user = getStoredUser();
        const userId = user?.id;
        const comps = await fetchCompetitionsFromStorage(userId);
        setCompetitions(comps);
        hasLoadedInitialRef.current = true;

        // Load selected competition ID from localStorage and find in loaded competitions
        if (typeof window !== 'undefined' && window.localStorage) {
          const storedId = localStorage.getItem('selectedCompetitionId');
          if (storedId && comps.length > 0) {
            const selectedComp = comps.find((c) => c.id === storedId);
            if (selectedComp) {
              setSelectedCompetition(selectedComp);
            } else {
              // Competition not found, clean up localStorage
              localStorage.removeItem('selectedCompetitionId');
            }
          }

          // Clean up old selectedCompetition key if it exists
          if (localStorage.getItem('selectedCompetition')) {
            localStorage.removeItem('selectedCompetition');
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
      if (e.key === 'selectedCompetitionId' && e.newValue) {
        // Find the competition by ID in current competitions list
        const competitionId = e.newValue;
        const selectedComp = competitions.find((c) => c.id === competitionId);
        if (selectedComp) {
          setSelectedCompetition(selectedComp);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [competitions]);

  // Sync selected competition ID to localStorage (not the full object!)
  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      if (selectedCompetition) {
        // Only store the ID, not the entire competition object with participants
        localStorage.setItem('selectedCompetitionId', selectedCompetition.id);
      } else {
        localStorage.removeItem('selectedCompetitionId');
      }
    }
  }, [selectedCompetition]);

  const refreshCompetitions = useCallback(async (): Promise<void> => {
    try {
      const user = getStoredUser();
      const userId = user?.id;
      const comps = await fetchCompetitionsFromStorage(userId);
      if (comps) {
        setCompetitions(comps);
        hasLoadedInitialRef.current = true;

        // Update selected competition if it exists in the refreshed list
        // This ensures banner updates and other changes are reflected in the selected competition
        setSelectedCompetition((current) => {
          if (current) {
            const updatedSelected = comps.find((c) => c.id === current.id);
            if (updatedSelected) {
              return updatedSelected;
            }
          }
          return current;
        });
      }
    } catch (error) {
      console.error('Failed to refresh competitions:', error);
    }
  }, []); // Remove selectedCompetition dependency to break the loop

  const addCompetition = useCallback(
    async (competition: Omit<Competition, 'id' | 'createdAt'>): Promise<Competition> => {
      // Save to local storage
      const saved = await saveCompetitionToStorage(competition);
      if (saved) {
        setCompetitions((prev) => [...prev, saved]);

        // Trigger update in extension bridge to sync with spinner
        // Add a small delay to ensure localStorage write is complete
        setTimeout(() => {
          const bridge = getExtensionBridge();
          bridge.triggerSettingsUpdate({
            type: 'competition-added',
            competitionId: saved.id,
            timestamp: Date.now(),
          });
        }, 50);

        return saved;
      } else {
        throw new Error('Failed to save competition');
      }
    },
    []
  );

  const updateCompetition = useCallback(
    async (id: string, updates: Partial<Competition>) => {
      // Update in local storage
      const success = await updateCompetitionInStorage(id, updates);

      if (success) {
        // Update locally immediately
        setCompetitions((prev) =>
          prev.map((comp) =>
            comp.id === id ? { ...comp, ...updates, updatedAt: new Date() } : comp
          )
        );

        // Update selected if it's the one being updated
        if (selectedCompetition?.id === id) {
          setSelectedCompetition((prev) =>
            prev ? { ...prev, ...updates, updatedAt: new Date() } : null
          );
        }

        // Trigger update in extension bridge to sync with spinner
        // Add a small delay to ensure localStorage write is complete
        setTimeout(() => {
          const bridge = getExtensionBridge();
          bridge.triggerSettingsUpdate({
            type: 'competition-updated',
            competitionId: id,
            timestamp: Date.now(),
          });
        }, 50);
      } else {
        throw new Error('Failed to update competition');
      }
    },
    [selectedCompetition]
  );

  const deleteCompetition = useCallback(
    async (id: string) => {
      // Get the current user ID
      const user = getStoredUser();
      const userId = user?.id;

      // Delete from local storage
      const success = await deleteCompetitionFromStorage(id, userId);

      if (success) {
        // Remove locally immediately
        setCompetitions((prev) => prev.filter((comp) => comp.id !== id));

        // Clear selection if it's the one being deleted
        if (selectedCompetition?.id === id) {
          setSelectedCompetition(null);
        }

        // Trigger update in extension bridge to sync with spinner
        // Add a small delay to ensure localStorage write is complete
        setTimeout(() => {
          const bridge = getExtensionBridge();
          bridge.triggerSettingsUpdate({
            type: 'competition-deleted',
            competitionId: id,
            timestamp: Date.now(),
          });
        }, 50);
      } else {
        throw new Error('Failed to delete competition');
      }
    },
    [selectedCompetition]
  );

  const clearAllCompetitions = useCallback(async () => {
    // Clear all competitions from local storage
    await competitionStorage.clearAll();

    setCompetitions([]);
    setSelectedCompetition(null);
  }, [competitions]);

  const selectCompetition = useCallback((competition: Competition) => {
    setSelectedCompetition(competition);
  }, []);

  const updateCompetitionBanner = useCallback(
    async (id: string, bannerImage: string) => {
      if (bannerImage) {
        // Update the competition with the banner data URL directly
        // The competitionStorage service will handle uploading to Directus
        await updateCompetition(id, { bannerImageId: bannerImage });
      } else {
        // Clear the banner
        await updateCompetition(id, { bannerImageId: undefined });
      }
    },
    [updateCompetition]
  );

  const getBannerImage = useCallback(
    async (imageId: string | undefined): Promise<string | null> => {
      if (!imageId) return null;

      // If it's already a data URL, return it directly
      if (imageId.startsWith('data:')) {
        return imageId;
      }

      // If it's a Directus file ID, use our proxy endpoint
      // This avoids CORS/permission issues when accessed from extension iframes
      return `/api/assets/${imageId}`;
    },
    []
  );

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

  return <CompetitionContext.Provider value={value}>{children}</CompetitionContext.Provider>;
};

export const useCompetitions = () => {
  const context = useContext(CompetitionContext);
  if (!context) {
    throw new Error('useCompetitions must be used within a CompetitionProvider');
  }
  return context;
};
