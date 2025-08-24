/**
 * LocalStorage Adapter
 *
 * Purpose: Browser localStorage implementation of the StorageAdapter interface
 * for development and testing without Chrome extension APIs.
 *
 * SRS Reference:
 * - Data Layer: Storage abstraction layer architecture
 * - Development Mode: Web-based testing environment
 */

import {
  Competition,
  SpinnerSettings,
  ColumnMapping,
  SavedMapping,
} from "./types";
import { StorageAdapter } from "./storage-adapter";

const STORAGE_KEYS = {
  COMPETITIONS: "drawday_competitions",
  SETTINGS: "drawday_settings",
  COLUMN_MAPPING: "drawday_column_mapping",
  SAVED_MAPPINGS: "drawday_saved_mappings",
  DEFAULT_MAPPING_ID: "drawday_default_mapping_id",
} as const;

export class LocalStorageAdapter implements StorageAdapter {
  private getItem<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      // Error reading from localStorage
      return null;
    }
  }

  private setItem<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  async getCompetitions(): Promise<Competition[]> {
    const competitions = this.getItem<Competition[]>(STORAGE_KEYS.COMPETITIONS);
    return competitions || [];
  }

  async getCompetition(id: string): Promise<Competition | null> {
    const competitions = await this.getCompetitions();
    return competitions.find((c) => c.id === id) || null;
  }

  async saveCompetition(competition: Competition): Promise<void> {
    const competitions = await this.getCompetitions();
    const index = competitions.findIndex((c) => c.id === competition.id);

    if (index >= 0) {
      competitions[index] = competition;
    } else {
      competitions.push(competition);
    }

    this.setItem(STORAGE_KEYS.COMPETITIONS, competitions);
  }

  async deleteCompetition(id: string): Promise<void> {
    const competitions = await this.getCompetitions();
    const filtered = competitions.filter((c) => c.id !== id);
    this.setItem(STORAGE_KEYS.COMPETITIONS, filtered);
  }

  async getSettings(): Promise<SpinnerSettings> {
    const settings = this.getItem<SpinnerSettings>(STORAGE_KEYS.SETTINGS);

    // Return default settings if none exist
    return (
      settings || {
        minSpinDuration: 3,
        decelerationRate: "medium",
      }
    );
  }

  async saveSettings(settings: SpinnerSettings): Promise<void> {
    this.setItem(STORAGE_KEYS.SETTINGS, settings);
  }

  async getColumnMapping(): Promise<ColumnMapping | null> {
    return this.getItem<ColumnMapping>(STORAGE_KEYS.COLUMN_MAPPING);
  }

  async saveColumnMapping(mapping: ColumnMapping): Promise<void> {
    this.setItem(STORAGE_KEYS.COLUMN_MAPPING, mapping);
  }

  async getSavedMappings(): Promise<SavedMapping[]> {
    const mappings = this.getItem<SavedMapping[]>(STORAGE_KEYS.SAVED_MAPPINGS);
    return mappings || [];
  }

  async getSavedMapping(id: string): Promise<SavedMapping | null> {
    const mappings = await this.getSavedMappings();
    return mappings.find((m) => m.id === id) || null;
  }

  async saveSavedMapping(mapping: SavedMapping): Promise<void> {
    const mappings = await this.getSavedMappings();
    const index = mappings.findIndex((m) => m.id === mapping.id);

    if (index >= 0) {
      mappings[index] = mapping;
    } else {
      mappings.push(mapping);
    }

    this.setItem(STORAGE_KEYS.SAVED_MAPPINGS, mappings);
  }

  async deleteSavedMapping(id: string): Promise<void> {
    const mappings = await this.getSavedMappings();
    const filtered = mappings.filter((m) => m.id !== id);
    this.setItem(STORAGE_KEYS.SAVED_MAPPINGS, filtered);
  }

  async getDefaultMapping(): Promise<SavedMapping | null> {
    const defaultId = this.getItem<string>(STORAGE_KEYS.DEFAULT_MAPPING_ID);
    if (!defaultId) return null;

    return this.getSavedMapping(defaultId);
  }

  async setDefaultMapping(id: string | null): Promise<void> {
    if (id === null) {
      localStorage.removeItem(STORAGE_KEYS.DEFAULT_MAPPING_ID);
    } else {
      this.setItem(STORAGE_KEYS.DEFAULT_MAPPING_ID, id);
    }
  }

  async clear(): Promise<void> {
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
  }
}
