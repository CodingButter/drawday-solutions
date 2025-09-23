/**
 * API Storage Adapter
 *
 * Purpose: Storage adapter that saves competition metadata to Directus API
 * while keeping participant data in local storage for performance.
 */

import {
  Competition,
  SpinnerSettings,
  ColumnMapping,
  SavedMapping,
  ThemeSettings,
} from "./types";
import { StorageAdapter } from "./storage-adapter";
import { LocalStorageAdapter } from "./local-storage-adapter";

export class ApiStorageAdapter implements StorageAdapter {
  private localAdapter: LocalStorageAdapter;
  private apiUrl: string;

  constructor(apiUrl: string = "") {
    this.localAdapter = new LocalStorageAdapter();
    // Get API URL from environment or use default
    this.apiUrl =
      apiUrl ||
      (typeof window !== "undefined"
        ? window.location.origin
        : "http://localhost:3004");
  }

  private async getAuthToken(): Promise<string | null> {
    if (typeof window === "undefined") return null;

    // Try to get token from localStorage first
    const token = localStorage.getItem("directus_auth_token");
    if (token) return token;

    // Try to get userId from chrome storage and use it to get token
    if (typeof chrome !== "undefined" && chrome.storage) {
      return new Promise((resolve) => {
        chrome.storage.sync.get(["userId"], (result) => {
          resolve(result.userId || null);
        });
      });
    }

    return null;
  }

  async getCompetitions(): Promise<Competition[]> {
    // Get competitions from local storage (includes participant data)
    const localCompetitions = await this.localAdapter.getCompetitions();

    // If we have auth, also sync metadata with API
    const token = await this.getAuthToken();
    if (token) {
      try {
        const response = await fetch(`${this.apiUrl}/api/competitions`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const { competitions: apiCompetitions } = (await response.json()) as {
            competitions: Array<{
              id: string;
              name: string;
              status: string;
              updatedAt?: number;
            }>;
          };

          // Merge API metadata with local participant data
          const merged = localCompetitions.map((local) => {
            const apiComp = apiCompetitions.find((api) => api.id === local.id);
            if (apiComp) {
              // Update local metadata from API but keep participant data
              return {
                ...local,
                name: apiComp.name,
                status: apiComp.status,
                updatedAt: apiComp.updatedAt || local.updatedAt,
              };
            }
            return local;
          });

          return merged;
        }
      } catch (error) {
        console.error("Failed to sync with API:", error);
      }
    }

    return localCompetitions;
  }

  async getCompetition(id: string): Promise<Competition | null> {
    // Always get full data from local storage
    return this.localAdapter.getCompetition(id);
  }

  async saveCompetition(competition: Competition): Promise<void> {
    // Save full data locally
    await this.localAdapter.saveCompetition(competition);

    // Save metadata to API if authenticated
    const token = await this.getAuthToken();
    if (token) {
      try {
        // Check if competition exists in API
        const checkResponse = await fetch(
          `${this.apiUrl}/api/competitions/${competition.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const metadata = {
          name: competition.name,
          participantCount: competition.participants.length,
          winnersCount: competition.winners?.length || 0,
          status: "active",
        };

        if (checkResponse.ok) {
          // Update existing competition
          await fetch(`${this.apiUrl}/api/competitions/${competition.id}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(metadata),
          });
        } else if (checkResponse.status === 404) {
          // Create new competition
          await fetch(`${this.apiUrl}/api/competitions`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              ...metadata,
              id: competition.id,
            }),
          });
        }
      } catch (error) {
        console.error("Failed to save to API:", error);
        // Continue even if API save fails - local data is saved
      }
    }
  }

  async deleteCompetition(id: string): Promise<void> {
    // Delete locally
    await this.localAdapter.deleteCompetition(id);

    // Delete from API if authenticated
    const token = await this.getAuthToken();
    if (token) {
      try {
        await fetch(`${this.apiUrl}/api/competitions/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (error) {
        console.error("Failed to delete from API:", error);
      }
    }
  }

  // Delegate all other methods to local adapter
  async getSettings(): Promise<SpinnerSettings> {
    return this.localAdapter.getSettings();
  }

  async saveSettings(settings: SpinnerSettings): Promise<void> {
    return this.localAdapter.saveSettings(settings);
  }

  async getColumnMapping(): Promise<ColumnMapping | null> {
    return this.localAdapter.getColumnMapping();
  }

  async saveColumnMapping(mapping: ColumnMapping | null): Promise<void> {
    return this.localAdapter.saveColumnMapping(mapping);
  }

  async getSavedMappings(): Promise<SavedMapping[]> {
    return this.localAdapter.getSavedMappings();
  }

  async getSavedMapping(id: string): Promise<SavedMapping | null> {
    return this.localAdapter.getSavedMapping(id);
  }

  async saveSavedMapping(mapping: SavedMapping): Promise<void> {
    return this.localAdapter.saveSavedMapping(mapping);
  }

  async deleteSavedMapping(id: string): Promise<void> {
    return this.localAdapter.deleteSavedMapping(id);
  }

  async getDefaultMapping(): Promise<SavedMapping | null> {
    return this.localAdapter.getDefaultMapping();
  }

  async setDefaultMapping(id: string | null): Promise<void> {
    return this.localAdapter.setDefaultMapping(id);
  }

  async saveSavedMappings(mappings: SavedMapping[]): Promise<void> {
    return this.localAdapter.saveSavedMappings(mappings);
  }

  async getDefaultMappingId(): Promise<string | undefined> {
    return this.localAdapter.getDefaultMappingId();
  }

  async saveDefaultMappingId(id: string | undefined): Promise<void> {
    return this.localAdapter.saveDefaultMappingId(id);
  }

  async getTheme(): Promise<ThemeSettings | undefined> {
    return this.localAdapter.getTheme();
  }

  async saveTheme(theme: ThemeSettings): Promise<void> {
    return this.localAdapter.saveTheme(theme);
  }

  async clear(): Promise<void> {
    // Only clear local data, not API data
    return this.localAdapter.clear();
  }
}
