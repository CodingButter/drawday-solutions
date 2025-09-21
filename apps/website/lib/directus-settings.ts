import { authenticatedFetch } from './directus-auth';

const API_BASE = '/api/user-settings';

export interface UserSettings {
  id?: string;
  user_id: string;
  company_name?: string;
  logo_image?: string;
  banner_image?: string;
  theme_settings?: {
    colors?: {
      primary?: string;
      secondary?: string;
      background?: string;
      text?: string;
      accent?: string;
    };
    spinnerStyle?: {
      backgroundColor?: string;
      nameColor?: string;
      ticketColor?: string;
      borderColor?: string;
      highlightColor?: string;
      nameSize?: 'small' | 'medium' | 'large' | 'extra-large';
      ticketSize?: 'small' | 'medium' | 'large' | 'extra-large';
      fontFamily?: string;
      canvasBackground?: string;
      topShadowOpacity?: number;
      bottomShadowOpacity?: number;
      shadowSize?: number;
      shadowColor?: string;
    };
    branding?: {
      logoPosition?: 'left' | 'center' | 'right';
      showCompanyName?: boolean;
    };
  };
  spinner_settings?: {
    spinDuration?: 'short' | 'medium' | 'long';
    decelerationSpeed?: 'slow' | 'medium' | 'fast';
    spinnerType?: 'slot_machine' | 'wheel' | 'cards';
  };
  column_mapping?: {
    firstName?: string | null;
    lastName?: string | null;
    fullName?: string | null;
    ticketNumber?: string | null;
  };
  saved_mappings?: Array<{
    id: string;
    name: string;
    mapping: {
      firstName?: string | null;
      lastName?: string | null;
      fullName?: string | null;
      ticketNumber?: string | null;
    };
    createdAt: number;
    updatedAt: number;
    usageCount: number;
    isDefault?: boolean;
  }>;
  default_mapping_id?: string;
  created_at?: string;
  updated_at?: string;
}

class DirectusSettingsService {
  private cache: UserSettings | null = null;
  private saveTimeout: NodeJS.Timeout | null = null;
  private pendingUpdates: Partial<UserSettings> = {};

  // Fetch user settings
  async getSettings(): Promise<UserSettings | null> {
    try {
      const response = await authenticatedFetch(API_BASE);

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      this.cache = data.data;
      return data.data;
    } catch (error: any) {
      // Check if it's an authentication error
      if (error?.message?.includes('Authentication required')) {
        // Clear the cache
        this.cache = null;
        // The authenticatedFetch function will handle the redirect
        throw error;
      }

      return null;
    }
  }

  // Save user settings with debouncing
  async saveSettings(updates: Partial<UserSettings>, immediate = false): Promise<void> {
    // Merge with pending updates
    this.pendingUpdates = {
      ...this.pendingUpdates,
      ...updates,
    };

    // Clear existing timeout
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }

    if (immediate) {
      // Save immediately
      await this.performSave();
    } else {
      // Debounce save (wait 500ms)
      this.saveTimeout = setTimeout(async () => {
        await this.performSave();
      }, 500);
    }
  }

  // Perform the actual save
  private async performSave(): Promise<void> {
    if (Object.keys(this.pendingUpdates).length === 0) {
      return;
    }

    const updates = { ...this.pendingUpdates };
    this.pendingUpdates = {};

    try {
      const response = await authenticatedFetch(API_BASE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Save settings error:', response.status, errorText);
        throw new Error(`Failed to save settings: ${response.status}`);
      }

      const data = await response.json();
      this.cache = data.data;
    } catch (error: any) {
      // Check if it's an authentication error
      if (error?.message?.includes('Authentication required')) {
        // Clear the cache and pending updates
        this.cache = null;
        this.pendingUpdates = {};
        // The authenticatedFetch function will handle the redirect
        throw error;
      }

      // Restore pending updates on failure for other errors
      this.pendingUpdates = { ...this.pendingUpdates, ...updates };
      throw error;
    }
  }

  // Update company name
  async updateCompanyName(name: string): Promise<void> {
    await this.saveSettings({ company_name: name });
  }

  // Update theme settings
  async updateThemeSettings(theme: Partial<UserSettings['theme_settings']>): Promise<void> {
    const current = this.cache?.theme_settings || {};
    await this.saveSettings({
      theme_settings: {
        ...current,
        ...theme,
      },
    });
  }

  // Update branding
  async updateBranding(
    branding: Partial<NonNullable<UserSettings['theme_settings']>['branding']>
  ): Promise<void> {
    const current = this.cache?.theme_settings || {};
    await this.saveSettings({
      theme_settings: {
        ...current,
        branding: {
          ...current.branding,
          ...branding,
        },
      },
    });
  }

  // Update spinner settings
  async updateSpinnerSettings(
    spinnerSettings: Partial<UserSettings['spinner_settings']>
  ): Promise<void> {
    const current = this.cache?.spinner_settings || {};
    await this.saveSettings({
      spinner_settings: {
        ...current,
        ...spinnerSettings,
      },
    });
  }

  // Update spinner style
  async updateSpinnerStyle(
    style: Partial<NonNullable<UserSettings['theme_settings']>['spinnerStyle']>
  ): Promise<void> {
    const current = this.cache?.theme_settings || {};
    await this.saveSettings({
      theme_settings: {
        ...current,
        spinnerStyle: {
          ...current.spinnerStyle,
          ...style,
        },
      },
    });
  }

  // Update column mapping
  async updateColumnMapping(mapping: UserSettings['column_mapping']): Promise<void> {
    await this.saveSettings({ column_mapping: mapping });
  }

  // Update saved mappings
  async updateSavedMappings(mappings: UserSettings['saved_mappings']): Promise<void> {
    await this.saveSettings({ saved_mappings: mappings });
  }

  // Add a new saved mapping
  async addSavedMapping(mapping: UserSettings['saved_mappings'][0]): Promise<void> {
    const current = this.cache?.saved_mappings || [];
    const updated = [...current, mapping];
    await this.saveSettings({ saved_mappings: updated });
  }

  // Delete a saved mapping
  async deleteSavedMapping(mappingId: string): Promise<void> {
    const current = this.cache?.saved_mappings || [];
    const updated = current.filter((m) => m.id !== mappingId);
    await this.saveSettings({ saved_mappings: updated });
  }

  // Set default mapping
  async setDefaultMapping(mappingId: string): Promise<void> {
    await this.saveSettings({ default_mapping_id: mappingId });
  }

  // Upload and update logo
  async updateLogo(imageDataOrId: string): Promise<void> {
    // If it's a data URL, it will be uploaded in the API route
    await this.saveSettings({ logo_image: imageDataOrId }, true);
  }

  // Upload and update banner
  async updateBanner(imageDataOrId: string): Promise<void> {
    // If it's a data URL, it will be uploaded in the API route
    await this.saveSettings({ banner_image: imageDataOrId }, true);
  }

  // Get Directus asset URL
  getAssetUrl(fileId: string): string {
    if (!fileId) return '';
    if (fileId.startsWith('data:')) return fileId; // Return data URL as-is
    if (fileId.startsWith('http://') || fileId.startsWith('https://')) return fileId; // Already a full URL

    // Use our proxy endpoint to avoid CORS/permission issues in iframes
    // This handles authentication and works reliably from extension contexts
    return `/api/assets/${fileId}`;
  }

  // Clear logo
  async clearLogo(): Promise<void> {
    await this.saveSettings({ logo_image: null }, true);
  }

  // Clear banner
  async clearBanner(): Promise<void> {
    await this.saveSettings({ banner_image: null }, true);
  }
}

export const directusSettings = new DirectusSettingsService();
