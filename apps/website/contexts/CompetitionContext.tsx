'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { imageStore } from '@/lib/image-utils';
import { api } from '@/lib/api-client';
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
    const response = await api.competitions.list();

    if (!response.ok) {
      // If unauthorized, just return empty array instead of throwing
      if (response.status === 401) {
        return [];
      }
      throw new Error('Failed to fetch competitions');
    }

    const competitions = response.data?.competitions || [];
    return competitions;
  } catch (error) {
    return [];
  }
};

const saveCompetitionToDirectus = async (competition: Competition): Promise<Competition | null> => {
  try {
    const response = await api.competitions.create(competition);

    if (!response.ok) {
      throw new Error('Failed to save competition');
    }

    // Check for warning about truncated participants
    if (response.data?.warning) {
      console.warn('Competition warning:', response.data.warning);
      // Show user-friendly alert
      if (typeof window !== 'undefined') {
        alert(`⚠️ Competition created with limitations:\n\n${response.data.warning}\n\nNote: Directus has a maximum payload size of ~1.8MB which limits competitions to approximately 10,000 participants.`);
      }
    }

    const savedCompetition = response.data?.competition || response.data;
    return savedCompetition;
  } catch (error) {
    console.error('Error saving competition:', error);

    // Check if it's a payload size error
    if (error?.message?.includes('request entity too large') ||
        error?.message?.includes('payload too large')) {
      if (typeof window !== 'undefined') {
        alert('❌ Competition is too large to save.\n\nThe maximum supported size is approximately 10,000 participants due to database limitations.\n\nPlease reduce the number of participants and try again.');
      }
    }

    return null;
  }
};

const updateCompetitionInDirectus = async (
  id: string,
  updates: Partial<Competition>
): Promise<boolean> => {
  try {
    // Convert bannerImageId to banner_image_id for Directus
    const directusUpdates: any = {};
    if (updates.name !== undefined) directusUpdates.name = updates.name;
    if (updates.participants !== undefined)
      directusUpdates.participants_data = JSON.stringify(updates.participants);
    if (updates.winners !== undefined)
      directusUpdates.winners_data = JSON.stringify(updates.winners);
    // Status field removed - not part of Competition type
    if (updates.bannerImageId !== undefined)
      directusUpdates.banner_image_id = updates.bannerImageId;
    if (updates.updatedAt !== undefined)
      directusUpdates.updated_at = new Date(updates.updatedAt).toISOString();

    // Use API client for updating
    const response = await api.competitions.update(id, updates);

    if (!response.ok) {
      console.error('Failed to update competition:', response.error);
      throw new Error('Failed to update competition');
    }

    return true;
  } catch (error) {
    console.error('Error updating competition in Directus:', error);
    return false;
  }
};

const deleteCompetitionFromDirectus = async (id: string): Promise<boolean> => {
  try {
    const response = await api.competitions.delete(id);

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
            } catch (e) {}
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
        } catch (error) {}
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
      console.log('Refreshed competitions:', comps);
      if (comps) {
        setCompetitions(comps);
        hasLoadedInitialRef.current = true;
        // DON'T automatically update selected competition during refresh
        // This prevents the flipping issue when user manually selects a competition
        // The selected competition will be updated when user explicitly selects one
      }
    } catch (error) {
      console.error('Failed to refresh competitions:', error);
    }
  }, []); // Remove selectedCompetition dependency to prevent unnecessary re-renders

  const addCompetition = useCallback(async (competition: Competition) => {
    // Save to Directus
    const saved = await saveCompetitionToDirectus(competition);
    if (saved) {
      setCompetitions((prev) => [...prev, saved]);
    } else {
      // If save failed, still add locally for now
      setCompetitions((prev) => [...prev, competition]);
    }
  }, []);

  const updateCompetition = useCallback(
    async (id: string, updates: Partial<Competition>) => {
      // Update locally immediately
      setCompetitions((prev) =>
        prev.map((comp) => (comp.id === id ? { ...comp, ...updates, updatedAt: Date.now() } : comp))
      );

      // Update selected if it's the one being updated
      if (selectedCompetition?.id === id) {
        setSelectedCompetition((prev) =>
          prev ? { ...prev, ...updates, updatedAt: Date.now() } : null
        );
      }

      // Save to Directus
      await updateCompetitionInDirectus(id, updates);
    },
    [selectedCompetition]
  );

  const deleteCompetition = useCallback(
    async (id: string) => {
      // Remove locally immediately
      setCompetitions((prev) => prev.filter((comp) => comp.id !== id));

      // Clear selection if it's the one being deleted
      if (selectedCompetition?.id === id) {
        setSelectedCompetition(null);
      }

      // Delete from Directus
      await deleteCompetitionFromDirectus(id);
    },
    [selectedCompetition]
  );

  const clearAllCompetitions = useCallback(async () => {
    // Clear all competitions from Directus one by one
    const deletePromises = competitions.map((comp) => deleteCompetitionFromDirectus(comp.id));
    await Promise.all(deletePromises);

    setCompetitions([]);
    setSelectedCompetition(null);
  }, [competitions]);

  const selectCompetition = useCallback((competition: Competition) => {
    setSelectedCompetition(competition);
  }, []);

  const updateCompetitionBanner = useCallback(
    async (id: string, bannerImage: string) => {
      console.log('updateCompetitionBanner called:', { id, hasImage: !!bannerImage });

      if (bannerImage) {
        try {
          // Convert base64 to blob
          const base64Response = await fetch(bannerImage);
          const blob = await base64Response.blob();
          const file = new File([blob], `competition-${id}-banner.png`, { type: blob.type });

          // Upload via API client
          const uploadResponse = await api.files.upload(file);

          if (!uploadResponse.ok) {
            throw new Error(`Failed to upload: ${uploadResponse.error}`);
          }

          const { fileId } = uploadResponse.data || {};
          console.log('Uploaded to Directus with ID:', fileId);

          // Update the competition with the Directus file ID
          await updateCompetition(id, { bannerImageId: fileId });
        } catch (error) {
          console.error('Failed to upload banner to Directus:', error);
          // Fallback to IndexedDB if Directus upload fails
          const imageId = await imageStore.storeImage(bannerImage);
          console.log('Fallback: Stored in IndexedDB with ID:', imageId);
          await updateCompetition(id, { bannerImageId: imageId });
        }
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
      return await imageStore.getImageUrl(imageId);
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
