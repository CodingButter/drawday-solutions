'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { directusSettings, type UserSettings } from '@/lib/directus-settings';
import { getStoredUser } from '@/lib/directus-auth';
import { getSettingsSyncService } from '@/lib/settings-sync';
import { getExtensionBridge } from '@/lib/extension-bridge';

// Define types locally since firebase-service is removed
export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  text: string;
  accent: string;
}

export interface SpinnerStyle {
  backgroundColor: string;
  nameColor: string;
  ticketColor: string;
  borderColor: string;
  highlightColor: string;
  nameSize: 'small' | 'medium' | 'large';
  ticketSize: 'small' | 'medium' | 'large';
  fontFamily: string;
  canvasBackground: string;
  topShadowOpacity: number;
  bottomShadowOpacity: number;
  shadowSize: number;
  shadowColor?: string;
}

export interface BrandingConfig {
  logoPosition: 'left' | 'center' | 'right';
  showCompanyName: boolean;
  logoImage?: string;
  bannerImage?: string;
  companyName?: string;
}

export interface ThemeSettings {
  colors: ThemeColors;
  spinnerStyle: SpinnerStyle;
  branding: BrandingConfig;
}

interface ThemeContextType {
  theme: ThemeSettings;
  updateColors: (colors: Partial<ThemeColors>) => Promise<void>;
  updateSpinnerStyle: (style: Partial<SpinnerStyle>) => Promise<void>;
  updateBranding: (branding: Partial<BrandingConfig>) => Promise<void>;
  uploadLogo: (file: File) => Promise<void>;
  isLoading: boolean;
}

const defaultTheme: ThemeSettings = {
  colors: {
    primary: '#8B5CF6',
    secondary: '#EC4899',
    background: '#1a1a1a',
    text: '#ffffff',
    accent: '#FFD700',
  },
  spinnerStyle: {
    backgroundColor: '#1a1a1a',
    nameColor: '#ffffff',
    ticketColor: '#ffffff',
    borderColor: '#333333',
    highlightColor: '#FFD700',
    nameSize: 'large',
    ticketSize: 'medium',
    fontFamily: 'system-ui',
    canvasBackground: '#09090b',
    topShadowOpacity: 0.3,
    bottomShadowOpacity: 0.3,
    shadowSize: 30,
  },
  branding: {
    logoPosition: 'center',
    showCompanyName: false,
  },
};

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeSettings>(defaultTheme);
  const [isLoading, setIsLoading] = useState(true);
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null);
  const syncService = useRef<ReturnType<typeof getSettingsSyncService>>();

  // Load theme from localStorage first, then try Directus
  useEffect(() => {
    const loadSettings = async () => {
      try {
        // First, try to load from localStorage
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme) {
          try {
            const parsedTheme = JSON.parse(storedTheme);
            setTheme(parsedTheme);
          } catch (e) {
            console.error('Failed to parse stored theme:', e);
          }
        }

        const user = getStoredUser();
        if (!user) {
          setIsLoading(false);
          return;
        }

        // Try to load from Directus
        const settings = await directusSettings.getSettings();
        console.log('[ThemeContext] Loaded settings from Directus:', settings);
        if (settings) {
          setUserSettings(settings);

          // Map Directus settings to theme
          console.log('[ThemeContext] Logo image ID:', settings.logo_image);
          console.log('[ThemeContext] Banner image ID:', settings.banner_image);
          if (settings.logo_image) {
            console.log('[ThemeContext] Logo URL:', directusSettings.getAssetUrl(settings.logo_image));
          }
          if (settings.banner_image) {
            console.log('[ThemeContext] Banner URL:', directusSettings.getAssetUrl(settings.banner_image));
          }

          const newTheme: ThemeSettings = {
            colors: { ...defaultTheme.colors, ...(settings.theme_settings?.colors || {}) },
            spinnerStyle: {
              ...defaultTheme.spinnerStyle,
              ...(settings.theme_settings?.spinnerStyle || {}),
              // Ensure nameSize and ticketSize are valid values
              nameSize:
                settings.theme_settings?.spinnerStyle?.nameSize &&
                ['small', 'medium', 'large'].includes(
                  settings.theme_settings.spinnerStyle.nameSize as string
                )
                  ? (settings.theme_settings.spinnerStyle.nameSize as 'small' | 'medium' | 'large')
                  : defaultTheme.spinnerStyle.nameSize,
              ticketSize:
                settings.theme_settings?.spinnerStyle?.ticketSize &&
                ['small', 'medium', 'large'].includes(
                  settings.theme_settings.spinnerStyle.ticketSize as string
                )
                  ? (settings.theme_settings.spinnerStyle.ticketSize as
                      | 'small'
                      | 'medium'
                      | 'large')
                  : defaultTheme.spinnerStyle.ticketSize,
            },
            branding: {
              logoPosition: settings.theme_settings?.branding?.logoPosition || 'center',
              showCompanyName: settings.theme_settings?.branding?.showCompanyName ?? false,
              logoImage: settings.logo_image
                ? directusSettings.getAssetUrl(settings.logo_image)
                : undefined,
              bannerImage: settings.banner_image
                ? directusSettings.getAssetUrl(settings.banner_image)
                : undefined,
              companyName: settings.company_name || undefined,
            },
          };
          setTheme(newTheme);
        }
      } catch (error) {
        // Silently fail - user might not be logged in
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  // Subscribe to settings changes for live updates
  useEffect(() => {
    if (typeof window === 'undefined') return;

    syncService.current = getSettingsSyncService();

    // Subscribe to theme changes
    const unsubscribe = syncService.current.subscribe((event) => {
      if (event.type === 'theme') {
        // Reload theme from localStorage or server
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme) {
          try {
            const parsedTheme = JSON.parse(storedTheme);
            setTheme(parsedTheme);
          } catch (e) {
            console.error('Failed to parse updated theme:', e);
          }
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const saveTheme = async (newTheme: ThemeSettings) => {
    setTheme(newTheme);
    // Save to localStorage as backup
    localStorage.setItem('theme', JSON.stringify(newTheme));

    // Broadcast the change to other tabs/windows
    if (syncService.current) {
      syncService.current.broadcastChange({
        type: 'theme',
        data: newTheme,
        timestamp: Date.now(),
        source: 'theme-context'
      });
    }

    // Trigger extension update if available
    const bridge = getExtensionBridge();
    if (bridge.triggerSettingsUpdate) {
      bridge.triggerSettingsUpdate({ type: 'theme', data: newTheme });
    }
  };

  const updateColors = async (colors: Partial<ThemeColors>) => {
    const newTheme = {
      ...theme,
      colors: { ...theme.colors, ...colors },
    };
    await saveTheme(newTheme);

    // Save to Directus
    await directusSettings.updateThemeSettings({
      colors: newTheme.colors,
    });
  };

  const updateSpinnerStyle = async (style: Partial<SpinnerStyle>) => {
    const newTheme = {
      ...theme,
      spinnerStyle: { ...theme.spinnerStyle, ...style },
    };
    await saveTheme(newTheme);

    // Save to Directus
    await directusSettings.updateSpinnerStyle(style);
  };

  const updateBranding = async (branding: Partial<BrandingConfig>) => {
    // Update local theme immediately for instant UI feedback
    const newTheme = {
      ...theme,
      branding: { ...theme.branding, ...branding },
    };

    // Update state immediately
    setTheme(newTheme);

    // Save to localStorage immediately
    await saveTheme(newTheme);

    // Don't set loading for simple boolean toggles
    const isSimpleToggle = Object.keys(branding).length === 1 &&
      (branding.showCompanyName !== undefined || branding.logoPosition !== undefined);

    if (!isSimpleToggle) {
      setIsLoading(true);
    }

    try {
      // Handle logo upload to Directus
      if (branding.logoImage !== undefined) {
        try {
          if (branding.logoImage) {
            await directusSettings.updateLogo(branding.logoImage);
          } else {
            await directusSettings.clearLogo();
          }
        } catch (error: any) {
          console.error('Logo upload error:', error);
          throw error;
        }
      }

      // Handle banner upload to Directus
      if (branding.bannerImage !== undefined) {
        try {
          if (branding.bannerImage) {
            await directusSettings.updateBanner(branding.bannerImage);
          } else {
            await directusSettings.clearBanner();
          }
        } catch (error: any) {
          console.error('Banner upload error:', error);
          throw error;
        }
      }

      // Update company name in Directus
      if (branding.companyName !== undefined) {
        await directusSettings.updateCompanyName(branding.companyName);
      }

      // Update branding settings
      const brandingSettings: any = {};
      if (branding.logoPosition) brandingSettings.logoPosition = branding.logoPosition;
      if (branding.showCompanyName !== undefined)
        brandingSettings.showCompanyName = branding.showCompanyName;

      if (Object.keys(brandingSettings).length > 0) {
        await directusSettings.updateBranding(brandingSettings);
      }

      if (!isSimpleToggle) {
        setIsLoading(false);
      }
    } catch (error: any) {
      setIsLoading(false);

      // Check if it's an authentication error
      if (error?.message?.includes('Authentication required')) {
        // The authenticatedFetch function will handle the redirect
        return;
      }

      // For other errors, show a user-friendly message
      if (typeof window !== 'undefined' && 'alert' in window) {
        alert('Failed to save branding settings. Please try again.');
      }

      throw error;
    }
  };

  const uploadLogo = async (file: File) => {
    try {
      setIsLoading(true);

      // Convert file to base64 data URL
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const base64 = await base64Promise;

      // Update branding with the base64 image
      await updateBranding({ logoImage: base64 });
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        updateColors,
        updateSpinnerStyle,
        updateBranding,
        uploadLogo,
        isLoading,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
