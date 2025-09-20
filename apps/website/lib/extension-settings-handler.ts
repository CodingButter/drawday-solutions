'use client';

import { unifiedSettings } from './unified-settings-service';
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

class ExtensionSettingsHandler {
  private initialized = false;
  private parentOrigin: string | null = null;

  /**
   * Initialize the handler - should be called when running in iframe
   */
  initialize() {
    if (this.initialized) return;

    // Check if we're in an iframe
    if (window.self === window.top) {
      console.log('Not running in iframe, extension settings handler disabled');
      return;
    }

    // Get parent origin
    this.parentOrigin = document.referrer ? new URL(document.referrer).origin : null;

    // Setup message listener
    window.addEventListener('message', this.handleMessage);
    this.initialized = true;

    console.log('Extension settings handler initialized');
  }

  /**
   * Handle messages from parent (extension)
   */
  private handleMessage = async (event: MessageEvent) => {
    // Security check - only accept from extension origins
    const validOrigins = [
      'chrome-extension://', // Will match any chrome extension
    ];

    const isValidOrigin = validOrigins.some(origin => event.origin.startsWith(origin));
    if (!isValidOrigin && event.origin !== this.parentOrigin) {
      return;
    }

    const message = event.data as DirectusSettingsMessage;
    if (!message.type) return;

    switch (message.type) {
      case 'SETTINGS_REQUEST':
        await this.handleSettingsRequest(event.source as Window);
        break;

      case 'SETTINGS_UPDATE':
        await this.handleSettingsUpdate(message.payload, event.source as Window);
        break;
    }
  };

  /**
   * Handle request for current settings
   */
  private async handleSettingsRequest(source: Window) {
    try {
      const settings = unifiedSettings.getSettings();
      if (!settings) {
        console.warn('No settings available to send to extension');
        return;
      }

      const response: DirectusSettingsMessage = {
        type: 'SETTINGS_RESPONSE',
        payload: {
          spinner: settings.spinner,
          theme: settings.theme,
          columnMapping: settings.columnMapping,
          savedMappings: settings.savedMappings,
          defaultMappingId: settings.defaultMappingId,
        },
      };

      source.postMessage(response, '*');
    } catch (error) {
      console.error('Failed to send settings to extension:', error);
    }
  }

  /**
   * Handle settings update from extension
   */
  private async handleSettingsUpdate(
    payload: DirectusSettingsMessage['payload'],
    source: Window
  ) {
    if (!payload) return;

    try {
      // Update settings in Directus
      const promises: Promise<void>[] = [];

      if (payload.spinner) {
        promises.push(unifiedSettings.updateSpinnerSettings(payload.spinner));
      }

      if (payload.theme) {
        promises.push(unifiedSettings.updateThemeSettings(payload.theme));
      }

      if (payload.columnMapping !== undefined) {
        promises.push(unifiedSettings.updateColumnMapping(payload.columnMapping));
      }

      if (payload.savedMappings) {
        // Replace all saved mappings
        const currentSettings = unifiedSettings.getSettings();
        if (currentSettings) {
          // Clear existing and add new
          for (const mapping of payload.savedMappings) {
            promises.push(unifiedSettings.addSavedMapping(mapping));
          }
        }
      }

      if (payload.defaultMappingId !== undefined) {
        promises.push(unifiedSettings.setDefaultMapping(payload.defaultMappingId));
      }

      await Promise.all(promises);

      // Send acknowledgment back
      const response: DirectusSettingsMessage = {
        type: 'SETTINGS_RESPONSE',
        payload: unifiedSettings.getSettings() || undefined,
      };

      source.postMessage(response, '*');
    } catch (error) {
      console.error('Failed to update settings from extension:', error);
    }
  }

  /**
   * Send settings update to extension
   */
  sendSettingsUpdate() {
    if (!this.initialized || window.self === window.top) return;

    const settings = unifiedSettings.getSettings();
    if (!settings) return;

    const message: DirectusSettingsMessage = {
      type: 'SETTINGS_UPDATE',
      payload: {
        spinner: settings.spinner,
        theme: settings.theme,
        columnMapping: settings.columnMapping,
        savedMappings: settings.savedMappings,
        defaultMappingId: settings.defaultMappingId,
      },
    };

    // Send to parent window (extension)
    window.parent.postMessage(message, '*');
  }

  /**
   * Clean up
   */
  destroy() {
    if (this.initialized) {
      window.removeEventListener('message', this.handleMessage);
      this.initialized = false;
    }
  }
}

// Export singleton instance
export const extensionSettingsHandler = new ExtensionSettingsHandler();