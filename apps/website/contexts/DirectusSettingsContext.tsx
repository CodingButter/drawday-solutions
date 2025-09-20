'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { unifiedSettings, UnifiedUserSettings } from '@/lib/unified-settings-service';
import type { SpinnerSettings, ColumnMapping, SavedMapping, ThemeSettings, BrandingSettings } from '@raffle-spinner/types';
// UserContext not available - using local auth check

interface DirectusSettingsContextType {
  settings: UnifiedUserSettings | null;
  isLoading: boolean;
  error: string | null;

  // Update methods
  updateSpinnerSettings: (settings: Partial<SpinnerSettings>) => Promise<void>;
  updateThemeSettings: (theme: Partial<ThemeSettings>) => Promise<void>;
  updateBrandingSettings: (branding: Partial<BrandingSettings>) => Promise<void>;
  updateColumnMapping: (mapping: ColumnMapping) => Promise<void>;
  addSavedMapping: (mapping: SavedMapping) => Promise<void>;
  deleteSavedMapping: (mappingId: string) => Promise<void>;
  setDefaultMapping: (mappingId: string) => Promise<void>;
  uploadLogo: (imageData: string) => Promise<void>;
  uploadBanner: (imageData: string) => Promise<void>;
  clearLogo: () => Promise<void>;
  clearBanner: () => Promise<void>;

  // Helper methods
  getAssetUrl: (fileId: string) => string;
  refreshSettings: () => Promise<void>;
}

const DirectusSettingsContext = createContext<DirectusSettingsContextType | undefined>(undefined);

export function DirectusSettingsProvider({ children }: { children: React.ReactNode }) {
  // Check authentication locally
  const [settings, setSettings] = useState<UnifiedUserSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load settings when authenticated
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('directus_access_token') : null;
    if (token) {
      loadSettings('current-user');
    } else {
      setSettings(null);
      setIsLoading(false);
    }
  }, []);

  // Listen for settings changes from other tabs/windows
  useEffect(() => {
    if (!settings) return;

    const unsubscribe = unifiedSettings.listenForChanges((updatedSettings) => {
      setSettings(updatedSettings);
    });

    return unsubscribe;
  }, [settings?.userId]);

  const loadSettings = async (userId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await unifiedSettings.initialize(userId);
      const loadedSettings = await unifiedSettings.loadSettings();
      setSettings(loadedSettings);
    } catch (err) {
      console.error('Failed to load settings:', err);
      setError('Failed to load settings');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshSettings = useCallback(async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('directus_access_token') : null;
    if (!token) return;
    await loadSettings('current-user');
  }, []);

  // Update methods with error handling
  const updateSpinnerSettings = useCallback(async (spinnerSettings: Partial<SpinnerSettings>) => {
    try {
      await unifiedSettings.updateSpinnerSettings(spinnerSettings);
      const updated = unifiedSettings.getSettings();
      if (updated) setSettings(updated);
    } catch (err) {
      console.error('Failed to update spinner settings:', err);
      throw err;
    }
  }, []);

  const updateThemeSettings = useCallback(async (theme: Partial<ThemeSettings>) => {
    try {
      await unifiedSettings.updateThemeSettings(theme);
      const updated = unifiedSettings.getSettings();
      if (updated) setSettings(updated);
    } catch (err) {
      console.error('Failed to update theme settings:', err);
      throw err;
    }
  }, []);

  const updateBrandingSettings = useCallback(async (branding: Partial<BrandingSettings>) => {
    try {
      await unifiedSettings.updateBrandingSettings(branding);
      const updated = unifiedSettings.getSettings();
      if (updated) setSettings(updated);
    } catch (err) {
      console.error('Failed to update branding settings:', err);
      throw err;
    }
  }, []);

  const updateColumnMapping = useCallback(async (mapping: ColumnMapping) => {
    try {
      await unifiedSettings.updateColumnMapping(mapping);
      const updated = unifiedSettings.getSettings();
      if (updated) setSettings(updated);
    } catch (err) {
      console.error('Failed to update column mapping:', err);
      throw err;
    }
  }, []);

  const addSavedMapping = useCallback(async (mapping: SavedMapping) => {
    try {
      await unifiedSettings.addSavedMapping(mapping);
      const updated = unifiedSettings.getSettings();
      if (updated) setSettings(updated);
    } catch (err) {
      console.error('Failed to add saved mapping:', err);
      throw err;
    }
  }, []);

  const deleteSavedMapping = useCallback(async (mappingId: string) => {
    try {
      await unifiedSettings.deleteSavedMapping(mappingId);
      const updated = unifiedSettings.getSettings();
      if (updated) setSettings(updated);
    } catch (err) {
      console.error('Failed to delete saved mapping:', err);
      throw err;
    }
  }, []);

  const setDefaultMapping = useCallback(async (mappingId: string) => {
    try {
      await unifiedSettings.setDefaultMapping(mappingId);
      const updated = unifiedSettings.getSettings();
      if (updated) setSettings(updated);
    } catch (err) {
      console.error('Failed to set default mapping:', err);
      throw err;
    }
  }, []);

  const uploadLogo = useCallback(async (imageData: string) => {
    try {
      await unifiedSettings.uploadLogo(imageData);
      await refreshSettings();
    } catch (err) {
      console.error('Failed to upload logo:', err);
      throw err;
    }
  }, [refreshSettings]);

  const uploadBanner = useCallback(async (imageData: string) => {
    try {
      await unifiedSettings.uploadBanner(imageData);
      await refreshSettings();
    } catch (err) {
      console.error('Failed to upload banner:', err);
      throw err;
    }
  }, [refreshSettings]);

  const clearLogo = useCallback(async () => {
    try {
      await unifiedSettings.clearLogo();
      await refreshSettings();
    } catch (err) {
      console.error('Failed to clear logo:', err);
      throw err;
    }
  }, [refreshSettings]);

  const clearBanner = useCallback(async () => {
    try {
      await unifiedSettings.clearBanner();
      await refreshSettings();
    } catch (err) {
      console.error('Failed to clear banner:', err);
      throw err;
    }
  }, [refreshSettings]);

  const getAssetUrl = useCallback((fileId: string) => {
    return unifiedSettings.getAssetUrl(fileId);
  }, []);

  const value: DirectusSettingsContextType = {
    settings,
    isLoading,
    error,
    updateSpinnerSettings,
    updateThemeSettings,
    updateBrandingSettings,
    updateColumnMapping,
    addSavedMapping,
    deleteSavedMapping,
    setDefaultMapping,
    uploadLogo,
    uploadBanner,
    clearLogo,
    clearBanner,
    getAssetUrl,
    refreshSettings,
  };

  return (
    <DirectusSettingsContext.Provider value={value}>
      {children}
    </DirectusSettingsContext.Provider>
  );
}

export function useDirectusSettings() {
  const context = useContext(DirectusSettingsContext);
  if (!context) {
    throw new Error('useDirectusSettings must be used within DirectusSettingsProvider');
  }
  return context;
}