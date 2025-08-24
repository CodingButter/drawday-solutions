'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { 
  getUserSettings, 
  updateUserSettings,
  updateSpinnerSettings as updateSpinnerSettingsInDb,
  type UserSettings,
  type SpinnerSettings,
  defaultSettings 
} from '@/lib/settings-service';

interface ColumnMapping {
  firstName: string | null;
  lastName: string | null;
  fullName: string | null;
  ticketNumber: string | null;
}

interface SettingsContextType {
  settings: SpinnerSettings;
  columnMapping: ColumnMapping | null;
  savedMappings: Array<{
    id: string;
    name: string;
    mapping: ColumnMapping;
  }>;
  updateSettings: (settings: Partial<SpinnerSettings>) => Promise<void>;
  updateColumnMapping: (mapping: ColumnMapping) => void;
  saveMappingTemplate: (name: string, mapping: ColumnMapping) => void;
  deleteMappingTemplate: (id: string) => void;
}

const SettingsContext = createContext<SettingsContextType | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SpinnerSettings>(defaultSettings.spinner);
  const [columnMapping, setColumnMapping] = useState<ColumnMapping | null>(null);
  const [savedMappings, setSavedMappings] = useState<Array<{
    id: string;
    name: string;
    mapping: ColumnMapping;
  }>>([]);
  const [userId, setUserId] = useState<string | null>(null);

  // Load settings from Firestore when user is authenticated
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        try {
          const userSettings = await getUserSettings(user.uid);
          setSettings(userSettings.spinner);
          
          if (userSettings.columnMapping) {
            setColumnMapping(userSettings.columnMapping);
          }
          
          if (userSettings.savedMappings) {
            setSavedMappings(userSettings.savedMappings);
          }
        } catch (error) {
          console.error('Error loading settings:', error);
        }
      } else {
        setUserId(null);
        setSettings(defaultSettings.spinner);
        setColumnMapping(null);
        setSavedMappings([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const updateSettings = async (updates: Partial<SpinnerSettings>) => {
    if (!userId) return;
    
    const newSettings = { ...settings, ...updates };
    setSettings(newSettings);
    
    try {
      await updateSpinnerSettingsInDb(userId, updates);
    } catch (error) {
      console.error('Error updating settings:', error);
    }
  };

  const updateColumnMapping = (mapping: ColumnMapping) => {
    setColumnMapping(mapping);
    
    // Save to Firestore if user is authenticated
    if (userId) {
      updateUserSettings(userId, { columnMapping: mapping }).catch(console.error);
    }
  };

  const saveMappingTemplate = (name: string, mapping: ColumnMapping) => {
    const newMapping = {
      id: Date.now().toString(),
      name,
      mapping
    };
    
    const updatedMappings = [...savedMappings, newMapping];
    setSavedMappings(updatedMappings);
    
    // Save to Firestore if user is authenticated
    if (userId) {
      updateUserSettings(userId, { savedMappings: updatedMappings }).catch(console.error);
    }
  };

  const deleteMappingTemplate = (id: string) => {
    const updatedMappings = savedMappings.filter(m => m.id !== id);
    setSavedMappings(updatedMappings);
    
    // Save to Firestore if user is authenticated
    if (userId) {
      updateUserSettings(userId, { savedMappings: updatedMappings }).catch(console.error);
    }
  };

  return (
    <SettingsContext.Provider 
      value={{ 
        settings, 
        columnMapping,
        savedMappings,
        updateSettings,
        updateColumnMapping,
        saveMappingTemplate,
        deleteMappingTemplate
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}