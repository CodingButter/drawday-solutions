/**
 * Settings Context
 *
 * Purpose: React context for managing global application settings including
 * spinner physics configuration and CSV column mapping preferences with persistence.
 * Works in both Chrome Extension and Website environments.
 */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { storage } from "@raffle-spinner/storage";
import type { SpinnerSettings, ColumnMapping } from "@raffle-spinner/types";

interface SettingsContextType {
  settings: SpinnerSettings;
  columnMapping: ColumnMapping | null;
  updateSettings: (settings: Partial<SpinnerSettings>) => Promise<void>;
  updateColumnMapping: (mapping: ColumnMapping) => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined,
);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SpinnerSettings>({
    spinDuration: "medium",
    decelerationSpeed: "medium",
  });
  const [columnMapping, setColumnMapping] = useState<ColumnMapping | null>(
    null,
  );

  useEffect(() => {
    loadSettings();

    // For Chrome extension environment, listen to storage changes
    if (typeof chrome !== "undefined" && chrome.storage) {
      const handleStorageChange = (changes: {
        [key: string]: chrome.storage.StorageChange;
      }) => {
        if (changes.data) {
          const newData = changes.data.newValue;
          if (newData?.settings) {
            setSettings(newData.settings);
          }
          if (newData?.columnMapping !== undefined) {
            setColumnMapping(newData.columnMapping);
          }
        }
      };

      chrome.storage.local.onChanged.addListener(handleStorageChange);
      return () => {
        chrome.storage.local.onChanged.removeListener(handleStorageChange);
      };
    }
  }, []);

  const loadSettings = async () => {
    const [loadedSettings, loadedMapping] = await Promise.all([
      storage.getSettings(),
      storage.getColumnMapping(),
    ]);
    setSettings(loadedSettings);
    setColumnMapping(loadedMapping);
  };

  const updateSettings = async (newSettings: Partial<SpinnerSettings>) => {
    const updated = { ...settings, ...newSettings };
    await storage.saveSettings(updated);
    setSettings(updated);
  };

  const updateColumnMapping = async (mapping: ColumnMapping) => {
    await storage.saveColumnMapping(mapping);
    setColumnMapping(mapping);
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        columnMapping,
        updateSettings,
        updateColumnMapping,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within SettingsProvider");
  }
  return context;
}
