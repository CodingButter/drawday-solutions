/**
 * Settings Sync Service
 *
 * Synchronizes settings between the Chrome Extension and Directus backend
 * through the website's iframe communication.
 */

import { storage } from '@raffle-spinner/storage';
import type { SpinnerSettings, ColumnMapping, SavedMapping, ThemeSettings } from '@raffle-spinner/types';

interface DirectusSettingsMessage {
  type: 'SETTINGS_UPDATE' | 'SETTINGS_REQUEST' | 'SETTINGS_RESPONSE';
  payload?: {
    spinner?: SpinnerSettings;
    theme?: ThemeSettings;
    columnMapping?: ColumnMapping | null;
    savedMappings?: SavedMapping[];
    defaultMappingId?: string;
  };
}

class SettingsSyncService {
  private iframe: HTMLIFrameElement | null = null;
  private syncEnabled: boolean = false;
  private pendingRequests: Map<string, (data: any) => void> = new Map();

  /**
   * Initialize the sync service with the iframe reference
   */
  initialize(iframe: HTMLIFrameElement) {
    this.iframe = iframe;
    this.setupMessageListener();
    this.syncEnabled = true;

    // Request initial settings from website
    this.requestSettings();
  }

  /**
   * Disable sync (when user logs out)
   */
  disable() {
    this.syncEnabled = false;
    this.iframe = null;
    this.pendingRequests.clear();
  }

  /**
   * Setup message listener for iframe communication
   */
  private setupMessageListener() {
    window.addEventListener('message', this.handleMessage);
  }

  /**
   * Handle messages from iframe
   */
  private handleMessage = async (event: MessageEvent) => {
    // Only accept messages from our website
    if (event.origin !== 'http://localhost:3000' && event.origin !== 'https://drawday.app') {
      return;
    }

    const message = event.data as DirectusSettingsMessage;

    switch (message.type) {
      case 'SETTINGS_UPDATE':
        // Website is notifying us of settings changes
        await this.handleSettingsUpdate(message.payload);
        break;

      case 'SETTINGS_RESPONSE':
        // Website is responding to our settings request
        await this.handleSettingsResponse(message.payload);
        break;
    }
  };

  /**
   * Request current settings from website
   */
  private requestSettings() {
    if (!this.iframe || !this.syncEnabled) return;

    const message: DirectusSettingsMessage = {
      type: 'SETTINGS_REQUEST',
    };

    this.iframe.contentWindow?.postMessage(message, '*');
  }

  /**
   * Handle settings update from website
   */
  private async handleSettingsUpdate(payload?: DirectusSettingsMessage['payload']) {
    if (!payload || !this.syncEnabled) return;

    // Update local storage with new settings
    const promises: Promise<void>[] = [];

    if (payload.spinner) {
      promises.push(storage.saveSettings(payload.spinner));
    }

    if (payload.theme && 'saveTheme' in storage) {
      promises.push((storage as any).saveTheme(payload.theme));
    }

    if (payload.columnMapping !== undefined && payload.columnMapping !== null) {
      promises.push(storage.saveColumnMapping(payload.columnMapping));
    }

    if (payload.savedMappings !== undefined && 'saveSavedMappings' in storage) {
      promises.push((storage as any).saveSavedMappings(payload.savedMappings));
    }

    if (payload.defaultMappingId !== undefined && 'saveDefaultMappingId' in storage) {
      promises.push((storage as any).saveDefaultMappingId(payload.defaultMappingId));
    }

    await Promise.all(promises);
  }

  /**
   * Handle settings response from website
   */
  private async handleSettingsResponse(payload?: DirectusSettingsMessage['payload']) {
    if (!payload) return;

    // Process the response
    await this.handleSettingsUpdate(payload);

    // Resolve any pending requests
    const requestId = 'initial-settings';
    const resolver = this.pendingRequests.get(requestId);
    if (resolver) {
      resolver(payload);
      this.pendingRequests.delete(requestId);
    }
  }

  /**
   * Send settings update to website
   */
  async updateSettings(updates: Partial<{
    spinner: SpinnerSettings;
    theme: ThemeSettings;
    columnMapping: ColumnMapping | null;
    savedMappings: SavedMapping[];
    defaultMappingId: string;
  }>) {
    if (!this.iframe || !this.syncEnabled) {
      // If sync is disabled, just save locally
      const promises: Promise<void>[] = [];

      if (updates.spinner) {
        promises.push(storage.saveSettings(updates.spinner));
      }

      if (updates.theme && 'saveTheme' in storage) {
        promises.push((storage as any).saveTheme(updates.theme));
      }

      if (updates.columnMapping !== undefined && updates.columnMapping !== null) {
        promises.push(storage.saveColumnMapping(updates.columnMapping));
      }

      if (updates.savedMappings !== undefined && 'saveSavedMappings' in storage) {
        promises.push((storage as any).saveSavedMappings(updates.savedMappings));
      }

      if (updates.defaultMappingId !== undefined && 'saveDefaultMappingId' in storage) {
        promises.push((storage as any).saveDefaultMappingId(updates.defaultMappingId));
      }

      await Promise.all(promises);
      return;
    }

    // Save locally first
    await this.saveLocally(updates);

    // Then sync to Directus through website
    const message: DirectusSettingsMessage = {
      type: 'SETTINGS_UPDATE',
      payload: updates,
    };

    this.iframe.contentWindow?.postMessage(message, '*');
  }

  /**
   * Save settings locally
   */
  private async saveLocally(updates: Partial<{
    spinner: SpinnerSettings;
    theme: ThemeSettings;
    columnMapping: ColumnMapping | null;
    savedMappings: SavedMapping[];
    defaultMappingId: string;
  }>) {
    const promises: Promise<void>[] = [];

    if (updates.spinner) {
      promises.push(storage.saveSettings(updates.spinner));
    }

    if (updates.theme && 'saveTheme' in storage) {
      promises.push((storage as any).saveTheme(updates.theme));
    }

    if (updates.columnMapping !== undefined && updates.columnMapping !== null) {
      promises.push(storage.saveColumnMapping(updates.columnMapping));
    }

    if (updates.savedMappings !== undefined && 'saveSavedMappings' in storage) {
      promises.push((storage as any).saveSavedMappings(updates.savedMappings));
    }

    if (updates.defaultMappingId !== undefined && 'saveDefaultMappingId' in storage) {
      promises.push((storage as any).saveDefaultMappingId(updates.defaultMappingId));
    }

    await Promise.all(promises);
  }

  /**
   * Sync all current local settings to Directus
   */
  async syncAllToDirectus() {
    if (!this.syncEnabled) return;

    const [spinner, theme, columnMapping, savedMappings, defaultMappingId] = await Promise.all([
      storage.getSettings(),
      'getTheme' in storage ? (storage as any).getTheme() : undefined,
      storage.getColumnMapping(),
      storage.getSavedMappings(),
      'getDefaultMappingId' in storage ? (storage as any).getDefaultMappingId() : undefined,
    ]);

    await this.updateSettings({
      spinner,
      theme,
      columnMapping,
      savedMappings,
      defaultMappingId,
    });
  }

  /**
   * Pull latest settings from Directus
   */
  async pullFromDirectus(): Promise<void> {
    if (!this.syncEnabled) return;

    return new Promise((resolve) => {
      // Store resolver for when response comes back
      this.pendingRequests.set('initial-settings', resolve);

      // Request settings
      this.requestSettings();

      // Timeout after 5 seconds
      setTimeout(() => {
        if (this.pendingRequests.has('initial-settings')) {
          this.pendingRequests.delete('initial-settings');
          resolve(undefined);
        }
      }, 5000);
    });
  }

  /**
   * Check if sync is enabled
   */
  isSyncEnabled(): boolean {
    return this.syncEnabled;
  }
}

// Export singleton instance
export const settingsSync = new SettingsSyncService();