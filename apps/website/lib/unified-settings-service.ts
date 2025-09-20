import { directusSettings, UserSettings as DirectusUserSettings } from './directus-settings';
import type {
  SpinnerSettings,
  ColumnMapping,
  SavedMapping,
  ThemeSettings as TypesThemeSettings,
  BrandingSettings
} from '@raffle-spinner/types';

// Unified settings interface that combines all settings
export interface UnifiedUserSettings {
  // User identification
  userId: string;

  // Spinner physics settings
  spinner: SpinnerSettings;

  // Theme and styling
  theme: TypesThemeSettings;

  // CSV import settings
  columnMapping: ColumnMapping | null;
  savedMappings: SavedMapping[];
  defaultMappingId?: string;

  // Metadata
  updatedAt?: string;
}

// Convert from Directus format to unified format
function fromDirectusFormat(directusData: DirectusUserSettings | null, userId: string): UnifiedUserSettings {
  const defaultSettings: UnifiedUserSettings = {
    userId,
    spinner: {
      spinDuration: 'medium',
      decelerationSpeed: 'medium',
    },
    theme: {
      colors: {
        primary: '#3b82f6',
        secondary: '#8b5cf6',
        accent: '#f59e0b',
        background: '#ffffff',
        foreground: '#000000',
        card: '#f3f4f6',
        cardForeground: '#1f2937',
        winner: '#ffd700',
        winnerGlow: '#ffed4e',
      },
      spinnerStyle: {
        type: 'slotMachine',
        nameSize: 'large',
        ticketSize: 'medium',
        nameColor: '#ffffff',
        ticketColor: '#a0a0a0',
        backgroundColor: '#1a1a1a',
        canvasBackground: '#0a0a0a',
        borderColor: '#333333',
        highlightColor: '#ffd700',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        topShadowOpacity: 0.8,
        bottomShadowOpacity: 0.8,
        shadowSize: 60,
        shadowColor: '#000000',
      },
      branding: {
        logoPosition: 'center',
        showCompanyName: true,
      },
    },
    columnMapping: null,
    savedMappings: [],
  };

  if (!directusData) {
    return defaultSettings;
  }

  return {
    userId,
    spinner: directusData.spinner_settings || defaultSettings.spinner,
    theme: {
      colors: directusData.theme_settings?.colors || defaultSettings.theme.colors,
      spinnerStyle: {
        ...defaultSettings.theme.spinnerStyle,
        ...(directusData.theme_settings?.spinnerStyle || {}),
        type: 'slotMachine', // Always use slotMachine for now
      },
      branding: {
        ...defaultSettings.theme.branding,
        ...(directusData.theme_settings?.branding || {}),
        logoImage: directusData.logo_image,
        bannerImage: directusData.banner_image,
        companyName: directusData.company_name,
      },
    },
    columnMapping: directusData.column_mapping || null,
    savedMappings: directusData.saved_mappings || [],
    defaultMappingId: directusData.default_mapping_id,
    updatedAt: directusData.updated_at,
  };
}

// Convert from unified format to Directus format
function toDirectusFormat(unified: Partial<UnifiedUserSettings>): Partial<DirectusUserSettings> {
  const directus: Partial<DirectusUserSettings> = {};

  if (unified.spinner) {
    directus.spinner_settings = unified.spinner;
  }

  if (unified.theme) {
    directus.theme_settings = {
      colors: unified.theme.colors,
      spinnerStyle: unified.theme.spinnerStyle && {
        backgroundColor: unified.theme.spinnerStyle.backgroundColor,
        nameColor: unified.theme.spinnerStyle.nameColor,
        ticketColor: unified.theme.spinnerStyle.ticketColor,
        borderColor: unified.theme.spinnerStyle.borderColor,
        highlightColor: unified.theme.spinnerStyle.highlightColor,
        nameSize: unified.theme.spinnerStyle.nameSize,
        ticketSize: unified.theme.spinnerStyle.ticketSize,
        fontFamily: unified.theme.spinnerStyle.fontFamily,
        canvasBackground: unified.theme.spinnerStyle.canvasBackground,
        topShadowOpacity: unified.theme.spinnerStyle.topShadowOpacity,
        bottomShadowOpacity: unified.theme.spinnerStyle.bottomShadowOpacity,
        shadowSize: unified.theme.spinnerStyle.shadowSize,
        shadowColor: unified.theme.spinnerStyle.shadowColor,
      },
      branding: unified.theme.branding && {
        logoPosition: unified.theme.branding.logoPosition,
        showCompanyName: unified.theme.branding.showCompanyName,
      },
    };

    if (unified.theme.branding?.logoImage) {
      directus.logo_image = unified.theme.branding.logoImage;
    }
    if (unified.theme.branding?.bannerImage) {
      directus.banner_image = unified.theme.branding.bannerImage;
    }
    if (unified.theme.branding?.companyName !== undefined) {
      directus.company_name = unified.theme.branding.companyName;
    }
  }

  if (unified.columnMapping !== undefined) {
    directus.column_mapping = unified.columnMapping;
  }

  if (unified.savedMappings !== undefined) {
    directus.saved_mappings = unified.savedMappings;
  }

  if (unified.defaultMappingId !== undefined) {
    directus.default_mapping_id = unified.defaultMappingId;
  }

  return directus;
}

class UnifiedSettingsService {
  private cache: UnifiedUserSettings | null = null;
  private userId: string | null = null;

  // Initialize with user ID
  async initialize(userId: string): Promise<void> {
    this.userId = userId;
    await this.loadSettings();
  }

  // Load all settings from Directus
  async loadSettings(): Promise<UnifiedUserSettings | null> {
    if (!this.userId) {
      throw new Error('Settings service not initialized with user ID');
    }

    try {
      const directusData = await directusSettings.getSettings();
      this.cache = fromDirectusFormat(directusData, this.userId);

      // Also sync to localStorage for offline access
      this.syncToLocalStorage(this.cache);

      return this.cache;
    } catch (error) {
      console.error('Failed to load settings from Directus:', error);

      // Try to load from localStorage as fallback
      const localData = this.loadFromLocalStorage();
      if (localData) {
        this.cache = localData;
        return localData;
      }

      // Return defaults if all else fails
      this.cache = fromDirectusFormat(null, this.userId);
      return this.cache;
    }
  }

  // Get current settings (from cache)
  getSettings(): UnifiedUserSettings | null {
    return this.cache;
  }

  // Update spinner settings
  async updateSpinnerSettings(settings: Partial<SpinnerSettings>): Promise<void> {
    if (!this.cache) {
      throw new Error('Settings not loaded');
    }

    this.cache.spinner = { ...this.cache.spinner, ...settings };
    await this.saveToDirectus({ spinner: this.cache.spinner });
    this.syncToLocalStorage(this.cache);
  }

  // Update theme settings
  async updateThemeSettings(theme: Partial<TypesThemeSettings>): Promise<void> {
    if (!this.cache) {
      throw new Error('Settings not loaded');
    }

    this.cache.theme = { ...this.cache.theme, ...theme };
    await this.saveToDirectus({ theme: this.cache.theme });
    this.syncToLocalStorage(this.cache);
  }

  // Update branding settings
  async updateBrandingSettings(branding: Partial<BrandingSettings>): Promise<void> {
    if (!this.cache) {
      throw new Error('Settings not loaded');
    }

    this.cache.theme.branding = { ...this.cache.theme.branding, ...branding };
    await this.saveToDirectus({ theme: this.cache.theme });
    this.syncToLocalStorage(this.cache);
  }

  // Update column mapping
  async updateColumnMapping(mapping: ColumnMapping): Promise<void> {
    if (!this.cache) {
      throw new Error('Settings not loaded');
    }

    this.cache.columnMapping = mapping;
    await this.saveToDirectus({ columnMapping: mapping });
    this.syncToLocalStorage(this.cache);
  }

  // Add a saved mapping
  async addSavedMapping(mapping: SavedMapping): Promise<void> {
    if (!this.cache) {
      throw new Error('Settings not loaded');
    }

    const exists = this.cache.savedMappings.some(m => m.id === mapping.id);
    if (!exists) {
      this.cache.savedMappings.push(mapping);
      await this.saveToDirectus({ savedMappings: this.cache.savedMappings });
      this.syncToLocalStorage(this.cache);
    }
  }

  // Delete a saved mapping
  async deleteSavedMapping(mappingId: string): Promise<void> {
    if (!this.cache) {
      throw new Error('Settings not loaded');
    }

    this.cache.savedMappings = this.cache.savedMappings.filter(m => m.id !== mappingId);
    await this.saveToDirectus({ savedMappings: this.cache.savedMappings });
    this.syncToLocalStorage(this.cache);
  }

  // Set default mapping
  async setDefaultMapping(mappingId: string): Promise<void> {
    if (!this.cache) {
      throw new Error('Settings not loaded');
    }

    this.cache.defaultMappingId = mappingId;
    await this.saveToDirectus({ defaultMappingId: mappingId });
    this.syncToLocalStorage(this.cache);
  }

  // Upload logo image
  async uploadLogo(imageData: string): Promise<void> {
    await directusSettings.updateLogo(imageData);
    await this.loadSettings(); // Reload to get updated data
  }

  // Upload banner image
  async uploadBanner(imageData: string): Promise<void> {
    await directusSettings.updateBanner(imageData);
    await this.loadSettings(); // Reload to get updated data
  }

  // Clear logo
  async clearLogo(): Promise<void> {
    await directusSettings.clearLogo();
    await this.loadSettings();
  }

  // Clear banner
  async clearBanner(): Promise<void> {
    await directusSettings.clearBanner();
    await this.loadSettings();
  }

  // Get asset URL
  getAssetUrl(fileId: string): string {
    return directusSettings.getAssetUrl(fileId);
  }

  // Private: Save to Directus
  private async saveToDirectus(updates: Partial<UnifiedUserSettings>): Promise<void> {
    const directusData = toDirectusFormat(updates);
    await directusSettings.saveSettings(directusData, false);
  }

  // Private: Sync to localStorage
  private syncToLocalStorage(settings: UnifiedUserSettings): void {
    if (typeof window === 'undefined') return;

    const key = `unified_settings_${settings.userId}`;
    localStorage.setItem(key, JSON.stringify(settings));

    // Also broadcast change event for other tabs/windows
    window.dispatchEvent(new CustomEvent('settings-updated', { detail: settings }));
  }

  // Private: Load from localStorage
  private loadFromLocalStorage(): UnifiedUserSettings | null {
    if (typeof window === 'undefined' || !this.userId) return null;

    const key = `unified_settings_${this.userId}`;
    const stored = localStorage.getItem(key);

    if (!stored) return null;

    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }

  // Listen for settings changes from other tabs/windows
  listenForChanges(callback: (settings: UnifiedUserSettings) => void): () => void {
    if (typeof window === 'undefined') return () => {};

    const handler = (event: CustomEvent) => {
      if (event.detail && event.detail.userId === this.userId) {
        this.cache = event.detail;
        callback(event.detail);
      }
    };

    window.addEventListener('settings-updated' as any, handler);
    return () => window.removeEventListener('settings-updated' as any, handler);
  }
}

// Export singleton instance
export const unifiedSettings = new UnifiedSettingsService();

// Export types
export type { UnifiedUserSettings };