'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { directusSettings, type UserSettings } from '@/lib/directus-settings';
import { getStoredUser } from '@/lib/directus-auth';

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

        // Try to load from Directus (but it's commented out for now)
        const settings = await directusSettings.getSettings();
        if (settings) {
          setUserSettings(settings);

          // Map Directus settings to theme
          const newTheme: ThemeSettings = {
            colors: { ...defaultTheme.colors, ...(settings.theme_settings?.colors || {}) },
            spinnerStyle: {
              ...defaultTheme.spinnerStyle,
              ...(settings.theme_settings?.spinnerStyle || {}),
              // Ensure nameSize and ticketSize are valid values
              nameSize: (settings.theme_settings?.spinnerStyle?.nameSize &&
                ['small', 'medium', 'large'].includes(settings.theme_settings.spinnerStyle.nameSize as string))
                ? settings.theme_settings.spinnerStyle.nameSize as 'small' | 'medium' | 'large'
                : defaultTheme.spinnerStyle.nameSize,
              ticketSize: (settings.theme_settings?.spinnerStyle?.ticketSize &&
                ['small', 'medium', 'large'].includes(settings.theme_settings.spinnerStyle.ticketSize as string))
                ? settings.theme_settings.spinnerStyle.ticketSize as 'small' | 'medium' | 'large'
                : defaultTheme.spinnerStyle.ticketSize
            },
            branding: {
              logoPosition: settings.theme_settings?.branding?.logoPosition || 'center',
              showCompanyName: settings.theme_settings?.branding?.showCompanyName ?? false,
              logoImage: settings.logo_image ? directusSettings.getAssetUrl(settings.logo_image) : undefined,
              bannerImage: settings.banner_image ? directusSettings.getAssetUrl(settings.banner_image) : undefined,
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

  const saveTheme = async (newTheme: ThemeSettings) => {
    setTheme(newTheme);
    // Save to localStorage as backup
    localStorage.setItem('theme', JSON.stringify(newTheme));
  };

  const updateColors = async (colors: Partial<ThemeColors>) => {
    const newTheme = {
      ...theme,
      colors: { ...theme.colors, ...colors },
    };
    await saveTheme(newTheme);

    // Save to Directus - commented out due to permissions
    // await directusSettings.updateThemeSettings({
    //   colors: newTheme.colors,
    // });
  };

  const updateSpinnerStyle = async (style: Partial<SpinnerStyle>) => {
    const newTheme = {
      ...theme,
      spinnerStyle: { ...theme.spinnerStyle, ...style },
    };
    await saveTheme(newTheme);

    // Save to Directus - commented out due to permissions
    // await directusSettings.updateThemeSettings({
    //   spinnerStyle: newTheme.spinnerStyle,
    // });
  };

  const updateBranding = async (branding: Partial<BrandingConfig>) => {
    try {
      setIsLoading(true);

      // Handle image uploads - store locally for now due to Directus permissions
      if (branding.logoImage !== undefined) {
        try {
          if (branding.logoImage) {
            // For now, just store in localStorage due to Directus permission issues
            // await directusSettings.updateLogo(branding.logoImage);
            console.log('Logo stored locally (Directus permissions pending)');
          } else {
            // await directusSettings.clearLogo();
            console.log('Logo cleared locally');
          }
        } catch (error: any) {
          console.error('Logo upload error:', error);
          // Don't throw error for now, just store locally
        }
      }

      if (branding.bannerImage !== undefined) {
        try {
          if (branding.bannerImage) {
            // For now, just store in localStorage due to Directus permission issues
            // await directusSettings.updateBanner(branding.bannerImage);
            console.log('Banner stored locally (Directus permissions pending)');
          } else {
            // await directusSettings.clearBanner();
            console.log('Banner cleared locally');
          }
        } catch (error: any) {
          console.error('Banner upload error:', error);
          // Don't throw error for now, just store locally
        }
      }

      // Update company name if provided
      if (branding.companyName !== undefined) {
        // Commented out due to Directus permissions issue
        // await directusSettings.updateCompanyName(branding.companyName);
        console.log('Company name stored locally');
      }

      // Update branding settings
      const brandingSettings: any = {};
      if (branding.logoPosition) brandingSettings.logoPosition = branding.logoPosition;
      if (branding.showCompanyName !== undefined) brandingSettings.showCompanyName = branding.showCompanyName;

      if (Object.keys(brandingSettings).length > 0) {
        // Commented out due to Directus permissions issue
        // await directusSettings.updateBranding(brandingSettings);
        console.log('Branding settings stored locally');
      }

      // Update local theme immediately - this prevents page refresh
      const newTheme = {
        ...theme,
        branding: { ...theme.branding, ...branding },
      };

      // Update state immediately for instant UI feedback
      setTheme(newTheme);

      // Save to localStorage in background
      await saveTheme(newTheme);

      setIsLoading(false);
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