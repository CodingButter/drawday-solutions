'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { getUserCompetitions, updateCompetition as updateCompetitionInDb, deleteCompetition as deleteCompetitionFromDb } from '@/lib/firebase-service';

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
  createdAt?: Date;
  updatedAt?: Date;
}

interface CompetitionContextType {
  competitions: Competition[];
  selectedCompetition: Competition | null;
  addCompetition: (competition: Competition) => Promise<void>;
  updateCompetition: (id: string, updates: Partial<Competition>) => Promise<void>;
  deleteCompetition: (id: string) => Promise<void>;
  selectCompetition: (competition: Competition) => void;
  updateCompetitionBanner: (id: string, bannerImage: string) => Promise<void>;
  refreshCompetitions: () => Promise<void>;
}

const CompetitionContext = createContext<CompetitionContextType | null>(null);

export function CompetitionProvider({ children }: { children: React.ReactNode }) {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [selectedCompetition, setSelectedCompetition] = useState<Competition | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // Load competitions from Firestore when user is authenticated
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        try {
          const userCompetitions = await getUserCompetitions(user.uid);
          setCompetitions(userCompetitions);
          
          // Restore selected competition from localStorage
          const savedSelectedId = localStorage.getItem('selectedCompetitionId');
          if (savedSelectedId) {
            const selected = userCompetitions.find(c => c.id === savedSelectedId);
            if (selected) {
              setSelectedCompetition(selected);
            }
          }
        } catch (error) {
          console.error('Error loading competitions:', error);
        }
      } else {
        setUserId(null);
        setCompetitions([]);
        setSelectedCompetition(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const refreshCompetitions = useCallback(async () => {
    if (userId) {
      try {
        const userCompetitions = await getUserCompetitions(userId);
        setCompetitions(userCompetitions);
      } catch (error) {
        console.error('Error refreshing competitions:', error);
      }
    }
  }, [userId]);

  const addCompetition = async (competition: Competition) => {
    // This is handled by firebase-service.ts createCompetition
    // Just refresh the list after adding
    await refreshCompetitions();
  };

  const updateCompetition = async (id: string, updates: Partial<Competition>) => {
    if (!userId) return;
    
    try {
      await updateCompetitionInDb(id, updates);
      await refreshCompetitions();
      
      // Update selected competition if it's the one being updated
      if (selectedCompetition?.id === id) {
        setSelectedCompetition(prev => prev ? { ...prev, ...updates } : null);
      }
    } catch (error) {
      console.error('Error updating competition:', error);
    }
  };

  const deleteCompetition = async (id: string) => {
    if (!userId) return;
    
    try {
      await deleteCompetitionFromDb(id);
      await refreshCompetitions();
      
      // Clear selection if deleted competition was selected
      if (selectedCompetition?.id === id) {
        setSelectedCompetition(null);
        localStorage.removeItem('selectedCompetitionId');
      }
    } catch (error) {
      console.error('Error deleting competition:', error);
    }
  };

  const selectCompetition = (competition: Competition) => {
    setSelectedCompetition(competition);
    localStorage.setItem('selectedCompetitionId', competition.id);
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