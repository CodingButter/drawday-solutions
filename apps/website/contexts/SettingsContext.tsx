'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { directusSettings, type UserSettings } from '@/lib/directus-settings';
import { getStoredUser, isAuthenticated } from '@/lib/directus-auth';
import type { ColumnMapping, SavedMapping } from '@raffle-spinner/types';

interface SpinnerSettings {
  spinDuration?: 'short' | 'medium' | 'long';
  decelerationSpeed?: 'slow' | 'medium' | 'fast';
  spinnerType?: string;
}

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

const defaultSettings: SpinnerSettings = {
  spinDuration: 'medium',
  decelerationSpeed: 'medium',
  spinnerType: 'slot_machine',
};

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SpinnerSettings>(defaultSettings);
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
          const userSettings = await directusSettings.getSettings();
          if (userSettings) {
            // Load spinner settings
            if (userSettings.spinner_settings) {
              setSettings({
                ...defaultSettings,
                ...userSettings.spinner_settings,
              });
            }

            // Load column mapping
            if (userSettings.column_mapping) {
              setColumnMapping(userSettings.column_mapping as ColumnMapping);
            }

            // Load saved mappings
            if (userSettings.saved_mappings) {
              const mappings = userSettings.saved_mappings.map((m: any) => ({
                id: m.id,
                name: m.name,
                mapping: m.mapping,
                createdAt: m.createdAt || Date.now(),
                updatedAt: m.updatedAt || Date.now(),
                usageCount: m.usageCount || 0,
                isDefault: m.isDefault || false,
              }));
              setSavedMappings(mappings);
            }
          }
        } catch (error) {
          console.error('Error loading settings from Directus:', error);
        }
      } else {
        setUserId(null);
        setSettings(defaultSettings);
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
        const userSettings = await directusSettings.getSettings();
        if (userSettings) {
          // Load spinner settings
          if (userSettings.spinner_settings) {
            const newSettings = {
              ...defaultSettings,
              ...userSettings.spinner_settings,
            };
            setSettings(newSettings);
            localStorage.setItem('settings', JSON.stringify(newSettings));
          }

          // Load column mapping
          if (userSettings.column_mapping) {
            setColumnMapping(userSettings.column_mapping as ColumnMapping);
            localStorage.setItem('columnMapping', JSON.stringify(userSettings.column_mapping));
          }

          // Load saved mappings
          if (userSettings.saved_mappings) {
            const mappings = userSettings.saved_mappings.map((m: any) => ({
              id: m.id,
              name: m.name,
              mapping: m.mapping,
              createdAt: m.createdAt || Date.now(),
              updatedAt: m.updatedAt || Date.now(),
              usageCount: m.usageCount || 0,
              isDefault: m.isDefault || false,
            }));
            setSavedMappings(mappings);
          }
        }
      } catch (error) {
        console.error('Error refreshing settings from Directus:', error);
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
      // Save to Directus
      await directusSettings.updateSpinnerSettings(updates);
    } catch (error) {
      console.error('Error updating settings in Directus:', error);
    }
  };

  const updateColumnMapping = (mapping: ColumnMapping) => {
    setColumnMapping(mapping);

    // Save to Directus if user is authenticated
    if (userId) {
      directusSettings.updateColumnMapping(mapping).catch(console.error);
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
      usageCount: 0,
    };

    const updatedMappings = [...savedMappings, newMapping];
    setSavedMappings(updatedMappings);

    // Save to Directus if user is authenticated
    if (userId) {
      directusSettings.addSavedMapping(newMapping).catch(console.error);
    }
  };

  const deleteMappingTemplate = (id: string) => {
    const updatedMappings = savedMappings.filter((m) => m.id !== id);
    setSavedMappings(updatedMappings);

    // Save to Directus if user is authenticated
    if (userId) {
      directusSettings.deleteSavedMapping(id).catch(console.error);
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
        refreshSettings,
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
