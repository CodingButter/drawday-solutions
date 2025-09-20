'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  getUserSettings,
  updateUserSettings,
  updateSpinnerSettings as updateSpinnerSettingsInDb,
  type UserSettings,
  type SpinnerSettings,
  defaultSettings
} from '@/lib/settings-service';
import { getStoredUser, isAuthenticated } from '@/lib/directus-auth';
import type { ColumnMapping, SavedMapping } from '@raffle-spinner/types';

interface SettingsContextType {
  settings: SpinnerSettings;
  columnMapping: ColumnMapping | null;
  savedMappings: SavedMapping[];
  updateSettings: (settings: Partial<SpinnerSettings>) => Promise<void>;
  updateColumnMapping: (mapping: ColumnMapping) => void;
  saveMappingTemplate: (name: string, mapping: ColumnMapping) => void;
  deleteMappingTemplate: (id: string) => void;
  refreshSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SpinnerSettings>(defaultSettings.spinner);
  const [columnMapping, setColumnMapping] = useState<ColumnMapping | null>(null);
  const [savedMappings, setSavedMappings] = useState<SavedMapping[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  // Sync settings to localStorage for polling
  useEffect(() => {
    localStorage.setItem('settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    if (columnMapping) {
      localStorage.setItem('columnMapping', JSON.stringify(columnMapping));
    }
  }, [columnMapping]);

  // Load settings from Directus when user is authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const user = getStoredUser();
      if (user && isAuthenticated()) {
        setUserId(user.id);
        try {
          const userSettings = await getUserSettings(user.id);
          setSettings(userSettings.spinner);

          if (userSettings.columnMapping) {
            setColumnMapping(userSettings.columnMapping);
          }

          if (userSettings.savedMappings) {
            // Convert legacy saved mappings to new format
            const mappings = userSettings.savedMappings.map((m: any) => ({
              id: m.id,
              name: m.name,
              mapping: m.mapping,
              createdAt: m.createdAt || Date.now(),
              updatedAt: m.updatedAt || Date.now(),
              usageCount: m.usageCount || 0,
              isDefault: m.isDefault || false
            }));
            setSavedMappings(mappings);
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
    };

    checkAuth();

    // Check auth state periodically
    const interval = setInterval(checkAuth, 5000);
    return () => clearInterval(interval);
  }, []);

  const refreshSettings = useCallback(async () => {
    if (userId) {
      try {
        const userSettings = await getUserSettings(userId);
        setSettings(userSettings.spinner);
        
        if (userSettings.columnMapping) {
          setColumnMapping(userSettings.columnMapping);
        }
        
        if (userSettings.savedMappings) {
          // Convert legacy saved mappings to new format
          const mappings = userSettings.savedMappings.map((m: any) => ({
            id: m.id,
            name: m.name,
            mapping: m.mapping,
            createdAt: m.createdAt || Date.now(),
            updatedAt: m.updatedAt || Date.now(),
            usageCount: m.usageCount || 0,
            isDefault: m.isDefault || false
          }));
          setSavedMappings(mappings);
        }
        
        // Update localStorage
        localStorage.setItem('settings', JSON.stringify(userSettings.spinner));
        if (userSettings.columnMapping) {
          localStorage.setItem('columnMapping', JSON.stringify(userSettings.columnMapping));
        }
      } catch (error) {
        console.error('Error refreshing settings:', error);
      }
    }
  }, [userId]);

  const updateSettings = async (updates: Partial<SpinnerSettings>) => {
    if (!userId) return;
    
    const newSettings = { ...settings, ...updates };
    setSettings(newSettings);
    // Sync to localStorage immediately
    localStorage.setItem('settings', JSON.stringify(newSettings));
    
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
    const now = Date.now();
    const newMapping: SavedMapping = {
      id: now.toString(),
      name,
      mapping,
      createdAt: now,
      updatedAt: now,
      usageCount: 0
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
        deleteMappingTemplate,
        refreshSettings
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