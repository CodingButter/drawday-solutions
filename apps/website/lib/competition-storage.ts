/**
 * Competition Storage Service
 *
 * Handles local storage of competitions to bypass Directus payload limits.
 * Uses Chrome storage API in extension context, localStorage in web context.
 * Data is compressed using LZ-String to handle large participant datasets.
 * Only banner images are stored in Directus.
 */

import { authenticatedFetch } from './directus-auth';
import LZString from 'lz-string';

export interface Competition {
  id: string;
  name: string;
  participants: Array<{
    firstName: string;
    lastName: string;
    ticketNumber: string;
  }>;
  winners?: Array<{
    participant: {
      firstName: string;
      lastName: string;
      ticketNumber: string;
    };
    timestamp: number;
  }>;
  bannerImageId?: string; // Stored in Directus
  createdAt: Date;
  updatedAt?: Date;
  userId?: string;
}

export interface CompetitionMetadata {
  id: string;
  name: string;
  participantCount: number;
  bannerImageId?: string;
  createdAt: Date;
  updatedAt?: Date;
  userId?: string;
}

class CompetitionStorageService {
  private readonly STORAGE_KEY = 'competitions';
  private readonly METADATA_KEY = 'competition_metadata';
  private readonly isExtension = typeof chrome !== 'undefined' && chrome?.storage?.local;

  /**
   * Compress data using LZ-String
   */
  private compress(data: string): string {
    try {
      const compressed = LZString.compress(data);
      if (!compressed) {
        console.warn('[CompetitionStorage] Compression failed, storing uncompressed');
        return data;
      }
      const originalSize = data.length;
      const compressedSize = compressed.length;
      const ratio = (((originalSize - compressedSize) / originalSize) * 100).toFixed(1);
      console.log(
        `[CompetitionStorage] Compressed ${originalSize} → ${compressedSize} chars (${ratio}% reduction)`
      );
      return compressed;
    } catch (error) {
      console.error('[CompetitionStorage] Compression failed:', error);
      return data; // Fallback to uncompressed
    }
  }

  /**
   * Decompress data using LZ-String
   */
  private decompress(compressedData: string): string {
    const decompressed = LZString.decompress(compressedData);
    if (decompressed === null) {
      throw new Error('Failed to decompress data - data may be corrupted');
    }
    return decompressed;
  }

  /**
   * Get all competitions for the current user
   */
  async getAll(userId?: string, bypassFilter = false): Promise<Competition[]> {
    try {
      if (this.isExtension) {
        // Use Chrome storage API
        return new Promise((resolve) => {
          chrome.storage.local.get([this.STORAGE_KEY], (result) => {
            try {
              const compressedData = result[this.STORAGE_KEY];
              if (!compressedData) {
                resolve([]);
                return;
              }

              // Handle both compressed and uncompressed data for backward compatibility
              let competitions: Competition[];
              if (typeof compressedData === 'string') {
                // Try to decompress first
                try {
                  const decompressed = this.decompress(compressedData);
                  competitions = JSON.parse(decompressed);
                  console.log(
                    '[CompetitionStorage] Decompressed and parsed competitions:',
                    competitions.length
                  );
                } catch {
                  // If decompression fails, assume it's already uncompressed JSON
                  competitions = JSON.parse(compressedData);
                  console.log(
                    '[CompetitionStorage] Parsed uncompressed competitions:',
                    competitions.length
                  );
                }
              } else {
                // Already an object/array
                competitions = compressedData;
                console.log(
                  '[CompetitionStorage] Used existing object competitions:',
                  competitions.length
                );
              }

              // Filter by userId if provided (include competitions with no userId if user is not authenticated)
              if (userId) {
                const filtered = competitions.filter((c: Competition) => c.userId === userId);
                console.log(
                  `[CompetitionStorage] Filtered ${competitions.length} → ${filtered.length} for userId:`,
                  userId
                );
                resolve(filtered);
              } else {
                // When no userId provided, return competitions that have no userId (anonymous) or all if user wants to see everything
                const filtered = competitions.filter((c: Competition) => !c.userId);
                console.log(
                  `[CompetitionStorage] Returning ${filtered.length} anonymous competitions (total: ${competitions.length})`
                );
                resolve(filtered);
              }
            } catch (error) {
              console.error('[CompetitionStorage] Error parsing stored competitions:', error);
              resolve([]);
            }
          });
        });
      } else {
        // Use localStorage
        const stored = localStorage.getItem(this.STORAGE_KEY);
        console.log('[CompetitionStorage] localStorage item exists:', !!stored);
        if (!stored) return [];

        // Handle both compressed and uncompressed data for backward compatibility
        let competitions: Competition[];
        try {
          // Try to decompress first
          const decompressed = this.decompress(stored);
          competitions = JSON.parse(decompressed);
          console.log(
            '[CompetitionStorage] Decompressed and parsed competitions:',
            competitions.length
          );
        } catch {
          // If decompression fails, assume it's already uncompressed JSON
          competitions = JSON.parse(stored);
          console.log(
            '[CompetitionStorage] Parsed uncompressed competitions:',
            competitions.length
          );
        }

        // Filter by userId if provided and bypassFilter is false
        if (bypassFilter) {
          console.log(
            `[CompetitionStorage] Bypassing filter, returning all ${competitions.length} competitions`
          );
          return competitions;
        } else if (userId) {
          const filtered = competitions.filter((c) => c.userId === userId);
          console.log(
            `[CompetitionStorage] Filtered ${competitions.length} → ${filtered.length} for userId:`,
            userId
          );
          return filtered;
        } else {
          // When no userId provided, return competitions that have no userId (anonymous)
          const filtered = competitions.filter((c) => !c.userId);
          console.log(
            `[CompetitionStorage] Returning ${filtered.length} anonymous competitions (total: ${competitions.length})`
          );
          return filtered;
        }
      }
    } catch (error) {
      console.error('[CompetitionStorage] Error loading competitions:', error);
      return [];
    }
  }

  /**
   * Get competition metadata (lightweight info for listing)
   */
  async getMetadata(userId?: string): Promise<CompetitionMetadata[]> {
    try {
      if (this.isExtension) {
        return new Promise((resolve) => {
          chrome.storage.local.get([this.METADATA_KEY], (result) => {
            const metadata = result[this.METADATA_KEY] || [];
            if (userId) {
              resolve(metadata.filter((m: CompetitionMetadata) => m.userId === userId));
            } else {
              resolve(metadata);
            }
          });
        });
      } else {
        const stored = localStorage.getItem(this.METADATA_KEY);
        if (!stored) return [];

        const metadata = JSON.parse(stored) as CompetitionMetadata[];
        if (userId) {
          return metadata.filter((m) => m.userId === userId);
        }
        return metadata;
      }
    } catch (error) {
      console.error('Error loading competition metadata:', error);
      return [];
    }
  }

  /**
   * Get a single competition by ID
   */
  async getById(id: string): Promise<Competition | null> {
    try {
      const competitions = await this.getAll(undefined, true);
      return competitions.find((c) => c.id === id) || null;
    } catch (error) {
      console.error('Error loading competition:', error);
      return null;
    }
  }

  /**
   * Save a new competition
   */
  async create(competition: Omit<Competition, 'id' | 'createdAt'>): Promise<Competition> {
    try {
      const newCompetition: Competition = {
        ...competition,
        id: `comp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Save competition data locally
      const existingCompetitions = await this.getAll(undefined, true);
      const allCompetitions = [...existingCompetitions, newCompetition];
      await this.saveCompetitions(allCompetitions);

      // Update metadata for fast listing
      const existingMetadata = await this.getMetadata();
      const newMetadata = [
        ...existingMetadata,
        {
          id: newCompetition.id,
          name: newCompetition.name,
          participantCount: newCompetition.participants.length,
          bannerImageId: newCompetition.bannerImageId,
          createdAt: newCompetition.createdAt,
          updatedAt: newCompetition.updatedAt,
          userId: newCompetition.userId,
        },
      ];
      await this.saveMetadata(newMetadata);

      // If there's a banner, ensure it's uploaded to Directus
      if (newCompetition.bannerImageId && newCompetition.bannerImageId.startsWith('data:')) {
        console.log('[CompetitionStorage] Uploading banner to Directus...');
        const uploadedId = await this.uploadBannerToDirectus(newCompetition.bannerImageId);
        if (uploadedId) {
          newCompetition.bannerImageId = uploadedId;
          // Update the saved competition with the Directus ID
          await this.update(newCompetition.id, { bannerImageId: uploadedId });
          console.log(
            '[CompetitionStorage] Banner uploaded, updated with Directus ID:',
            uploadedId
          );
        }
      }

      console.log(
        `[CompetitionStorage] Successfully created competition ${newCompetition.id} with ${newCompetition.participants.length} participants`
      );
      return newCompetition;
    } catch (error) {
      console.error('[CompetitionStorage] Error creating competition:', error);
      throw error;
    }
  }

  /**
   * Update an existing competition
   */
  async update(id: string, updates: Partial<Competition>): Promise<boolean> {
    try {
      const competitions = await this.getAll(undefined, true);
      const index = competitions.findIndex((c) => c.id === id);

      if (index === -1) {
        console.error('Competition not found:', id);
        return false;
      }

      // Handle banner upload if it's a data URL
      if (updates.bannerImageId && updates.bannerImageId.startsWith('data:')) {
        console.log(
          '[CompetitionStorage] UPDATE: Detected data URL banner, uploading to Directus...'
        );
        const uploadedId = await this.uploadBannerToDirectus(updates.bannerImageId);
        if (uploadedId) {
          console.log(
            '[CompetitionStorage] UPDATE: Banner uploaded successfully, replacing data URL with fileId:',
            uploadedId
          );
          updates.bannerImageId = uploadedId;
        } else {
          console.error(
            '[CompetitionStorage] UPDATE: Banner upload failed, keeping original data URL'
          );
        }
      }

      // Update competition
      competitions[index] = {
        ...competitions[index],
        ...updates,
        updatedAt: new Date(),
      };

      await this.saveCompetitions(competitions);

      // Update metadata
      const metadata = await this.getMetadata();
      const metaIndex = metadata.findIndex((m) => m.id === id);
      if (metaIndex !== -1) {
        metadata[metaIndex] = {
          ...metadata[metaIndex],
          name: competitions[index].name,
          participantCount: competitions[index].participants.length,
          bannerImageId: competitions[index].bannerImageId,
          updatedAt: competitions[index].updatedAt,
        };
        await this.saveMetadata(metadata);
      }

      console.log(`Updated competition ${id}`);
      return true;
    } catch (error) {
      console.error('Error updating competition:', error);
      return false;
    }
  }

  /**
   * Delete a competition
   */
  async delete(id: string, userId?: string): Promise<boolean> {
    try {
      console.log(
        `[CompetitionStorage] DELETE: Attempting to delete competition ${id} for userId: ${userId}`
      );

      // Get ALL competitions (without user filter) to preserve other users' data
      const allCompetitions = await this.getAll(undefined, true);
      console.log(
        `[CompetitionStorage] DELETE: Found ${allCompetitions.length} total competitions`
      );
      console.log(
        `[CompetitionStorage] DELETE: All competition IDs:`,
        allCompetitions.map((c) => c.id)
      );

      // Check if the competition exists for this user
      const userCompetitions = userId
        ? allCompetitions.filter((c) => c.userId === userId)
        : allCompetitions.filter((c) => !c.userId);
      console.log(
        `[CompetitionStorage] DELETE: Found ${userCompetitions.length} competitions for user ${userId}`
      );
      console.log(
        `[CompetitionStorage] DELETE: User competition IDs:`,
        userCompetitions.map((c) => c.id)
      );

      const competitionExists = userCompetitions.some((c) => c.id === id);
      console.log(
        `[CompetitionStorage] DELETE: Competition ${id} exists for user: ${competitionExists}`
      );

      if (!competitionExists) {
        console.error('[CompetitionStorage] DELETE: Competition not found:', id);
        return false;
      }

      // Filter out the competition to delete from ALL competitions
      const filtered = allCompetitions.filter((c) => c.id !== id);
      console.log(
        `[CompetitionStorage] DELETE: Filtered ${allCompetitions.length} -> ${filtered.length} competitions`
      );

      await this.saveCompetitions(filtered);

      // Update metadata - get all metadata and filter
      const allMetadata = await this.getMetadata();
      const filteredMeta = allMetadata.filter((m) => m.id !== id);
      await this.saveMetadata(filteredMeta);

      console.log(`[CompetitionStorage] DELETE: Successfully deleted competition ${id}`);
      return true;
    } catch (error) {
      console.error('[CompetitionStorage] DELETE: Error deleting competition:', error);
      return false;
    }
  }

  /**
   * Upload banner image to Directus
   */
  private async uploadBannerToDirectus(dataUrl: string): Promise<string | null> {
    try {
      console.log('[CompetitionStorage] Starting banner upload to Directus');

      // Convert data URL to blob
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      console.log('[CompetitionStorage] Converted data URL to blob, size:', blob.size, 'bytes');

      // Create form data
      const formData = new FormData();
      formData.append('file', blob, 'banner.png');

      // Upload to Directus
      console.log('[CompetitionStorage] Uploading to /api/upload-file...');
      const uploadResponse = await authenticatedFetch('/api/upload-file', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        console.error('[CompetitionStorage] Upload failed:', uploadResponse.status, errorText);
        return null;
      }

      const result = await uploadResponse.json();
      console.log('[CompetitionStorage] Upload response:', result);

      const fileId = result?.data?.fileId;
      if (fileId) {
        console.log('[CompetitionStorage] Successfully uploaded banner, fileId:', fileId);
        return fileId;
      } else {
        console.error('[CompetitionStorage] No fileId in response:', result);
        return null;
      }
    } catch (error) {
      console.error('[CompetitionStorage] Error uploading banner to Directus:', error);
      return null;
    }
  }

  /**
   * Save competitions to storage
   */
  private async saveCompetitions(competitions: Competition[]): Promise<void> {
    console.log(
      `[CompetitionStorage] Saving ${competitions.length} competitions to ${this.isExtension ? 'chrome.storage' : 'localStorage'}`
    );

    const jsonData = JSON.stringify(competitions);
    const compressedData = this.compress(jsonData);

    if (this.isExtension) {
      return new Promise((resolve, reject) => {
        chrome.storage.local.set({ [this.STORAGE_KEY]: compressedData }, () => {
          if (chrome.runtime.lastError) {
            console.error('[CompetitionStorage] Chrome storage error:', chrome.runtime.lastError);
            reject(chrome.runtime.lastError);
          } else {
            console.log('[CompetitionStorage] Successfully saved to chrome.storage.local');
            resolve();
          }
        });
      });
    } else {
      try {
        localStorage.setItem(this.STORAGE_KEY, compressedData);
        console.log('[CompetitionStorage] Successfully saved to localStorage');
      } catch (error) {
        console.error('[CompetitionStorage] localStorage error:', error);
        throw error;
      }
    }
  }

  /**
   * Save metadata to storage
   */
  private async saveMetadata(metadata: CompetitionMetadata[]): Promise<void> {
    if (this.isExtension) {
      return new Promise((resolve, reject) => {
        chrome.storage.local.set({ [this.METADATA_KEY]: metadata }, () => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve();
          }
        });
      });
    } else {
      localStorage.setItem(this.METADATA_KEY, JSON.stringify(metadata));
    }
  }

  /**
   * Clear all competitions (use with caution!)
   */
  async clearAll(): Promise<void> {
    if (this.isExtension) {
      return new Promise((resolve) => {
        chrome.storage.local.remove([this.STORAGE_KEY, this.METADATA_KEY], () => {
          resolve();
        });
      });
    } else {
      localStorage.removeItem(this.STORAGE_KEY);
      localStorage.removeItem(this.METADATA_KEY);
    }
  }

  /**
   * Get storage usage statistics
   */
  async getStorageStats(): Promise<{
    competitionCount: number;
    totalParticipants: number;
    storageSize: number;
  }> {
    const competitions = await this.getAll(undefined, true);
    const totalParticipants = competitions.reduce((sum, c) => sum + c.participants.length, 0);

    let storageSize = 0;
    if (this.isExtension) {
      await new Promise((resolve) => {
        chrome.storage.local.getBytesInUse([this.STORAGE_KEY, this.METADATA_KEY], (bytes) => {
          storageSize = bytes;
          resolve(undefined);
        });
      });
    } else {
      const competitionsStr = localStorage.getItem(this.STORAGE_KEY) || '[]';
      const metadataStr = localStorage.getItem(this.METADATA_KEY) || '[]';
      storageSize = new Blob([competitionsStr, metadataStr]).size;
    }

    return {
      competitionCount: competitions.length,
      totalParticipants,
      storageSize,
    };
  }
}

// Export singleton instance
export const competitionStorage = new CompetitionStorageService();
