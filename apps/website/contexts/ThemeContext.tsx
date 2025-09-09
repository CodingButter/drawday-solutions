'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { 
  getUserSettings,
  getUserSettingsTimestamp,
  updateThemeColors,
  updateSpinnerStyle as updateSpinnerStyleInDb,
  updateBranding as updateBrandingInDb,
  fileToBase64,
  type ThemeColors,
  type SpinnerStyle,
  type BrandingConfig,
  type UserSettings
} from '@/lib/firebase-service';
import { compressImage } from '@/lib/image-utils';

interface ThemeSettings {
  colors: ThemeColors;
  spinnerStyle: SpinnerStyle;
  branding: BrandingConfig;
}

interface ThemeContextType {
  theme: ThemeSettings;
  updateColors: (colors: Partial<ThemeColors>) => Promise<void>;
  updateSpinnerStyle: (style: Partial<SpinnerStyle>) => Promise<void>;
  updateBranding: (branding: Partial<BrandingConfig>) => Promise<void>;
  uploadImage: (file: File) => Promise<string>;
  resetTheme: () => Promise<void>;
  isLoading: boolean;
}

const defaultTheme: ThemeSettings = {
  colors: {
    primary: '#007BFF',
    secondary: '#FF1493',
    accent: '#FFD700',
    background: '#09090b',
    foreground: '#fafafa',
    card: '#09090b',
    cardForeground: '#fafafa',
    winner: '#FFD700',
    winnerGlow: '#FFD700',
  },
  spinnerStyle: {
    type: 'slotMachine',
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
  // Theme is loaded from Firebase only - no localStorage
  // This prevents quota exceeded errors with large images
  const [theme, setTheme] = useState<ThemeSettings>(defaultTheme);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastTimestamp, setLastTimestamp] = useState<number | null>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Poll for timestamp updates
  useEffect(() => {
    if (!userId) return;

    const checkForUpdates = async () => {
      try {
        const timestamp = await getUserSettingsTimestamp(userId);
        
        // If timestamp changed, fetch full settings
        if (timestamp && timestamp !== lastTimestamp) {
          console.log('Theme timestamp changed, fetching new theme:', {
            oldTimestamp: lastTimestamp,
            newTimestamp: timestamp,
          });
          const settings = await getUserSettings(userId);
          if (settings) {
            console.log('New theme fetched from Firebase:', settings.theme.spinnerStyle);
            setTheme(settings.theme);
            setLastTimestamp(timestamp);
          }
        }
      } catch (error) {
        console.error('Error polling for updates:', error);
      }
    };

    // Initial check
    checkForUpdates();

    // Set up polling interval (every 1 second)
    pollingIntervalRef.current = setInterval(checkForUpdates, 1000);

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [userId, lastTimestamp]);

  // Load theme from Firestore when user is authenticated
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setIsLoading(true);
      
      if (user) {
        setUserId(user.uid);
        try {
          const userSettings = await getUserSettings(user.uid);
          if (userSettings) {
            setTheme(userSettings.theme);
            const timestamp = userSettings.lastUpdated?.toMillis?.() || null;
            setLastTimestamp(timestamp);
          }
        } catch (error) {
          console.error('Error loading theme:', error);
        }
      } else {
        setUserId(null);
        setTheme(defaultTheme);
        setLastTimestamp(null);
      }
      
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const updateColors = async (colors: Partial<ThemeColors>) => {
    if (!userId) return;
    
    const newTheme = {
      ...theme,
      colors: { ...theme.colors, ...colors }
    };
    setTheme(newTheme);
    
    // Update database only - no localStorage
    try {
      await updateThemeColors(userId, colors);
      // Update timestamp after successful update
      const timestamp = await getUserSettingsTimestamp(userId);
      setLastTimestamp(timestamp);
    } catch (error) {
      console.error('Error updating theme colors:', error);
      throw error;
    }
  };

  const updateSpinnerStyle = async (style: Partial<SpinnerStyle>) => {
    if (!userId) return;
    
    const newTheme = {
      ...theme,
      spinnerStyle: { ...theme.spinnerStyle, ...style }
    };
    setTheme(newTheme);
    
    // Update database only - no localStorage
    try {
      await updateSpinnerStyleInDb(userId, style);
      // Update timestamp after successful update
      const timestamp = await getUserSettingsTimestamp(userId);
      setLastTimestamp(timestamp);
    } catch (error) {
      console.error('Error updating spinner style:', error);
      throw error;
    }
  };

  const updateBranding = async (branding: Partial<BrandingConfig>) => {
    console.log('updateBranding called with:', branding, 'userId:', userId);
    console.log('Current theme.branding before update:', theme.branding);
    console.log('showCompanyName value:', branding.showCompanyName, 'type:', typeof branding.showCompanyName);
    
    if (!userId) {
      console.warn('No user ID available for branding update');
      return;
    }
    
    // Compress images before saving
    let processedBranding = { ...branding };
    
    if (branding.logoImage && branding.logoImage.startsWith('data:image')) {
      console.log('Compressing logo image...');
      processedBranding.logoImage = await compressImage(branding.logoImage, 'logo');
    }
    
    if (branding.bannerImage && branding.bannerImage.startsWith('data:image')) {
      console.log('Compressing banner image...');
      processedBranding.bannerImage = await compressImage(branding.bannerImage, 'banner');
    }
    
    const newTheme = {
      ...theme,
      branding: { ...theme.branding, ...processedBranding }
    };
    console.log('New theme.branding after update:', newTheme.branding);
    console.log('New showCompanyName value:', newTheme.branding.showCompanyName);
    setTheme(newTheme);
    
    // Don't store images in localStorage - only in Firebase
    // This prevents quota exceeded errors
    console.log('Theme updated in state');
    
    // Update database with compressed images
    try {
      await updateBrandingInDb(userId, processedBranding);
      // Update timestamp after successful update
      const timestamp = await getUserSettingsTimestamp(userId);
      setLastTimestamp(timestamp);
      console.log('Branding updated in database');
    } catch (error) {
      console.error('Error updating branding in database:', error);
      throw error;
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    try {
      const base64 = await fileToBase64(file);
      return base64;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  const resetTheme = async () => {
    if (!userId) return;
    
    setTheme(defaultTheme);
    
    try {
      await updateThemeColors(userId, defaultTheme.colors);
      await updateSpinnerStyleInDb(userId, defaultTheme.spinnerStyle);
      await updateBrandingInDb(userId, defaultTheme.branding);
      
      // Update timestamp after successful reset
      const timestamp = await getUserSettingsTimestamp(userId);
      setLastTimestamp(timestamp);
    } catch (error) {
      console.error('Error resetting theme:', error);
      throw error;
    }
  };

  return (
    <ThemeContext.Provider 
      value={{ 
        theme,
        updateColors,
        updateSpinnerStyle,
        updateBranding,
        uploadImage,
        resetTheme,
        isLoading
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

// Export types for use in components
export type { ThemeSettings, ThemeColors, SpinnerStyle, BrandingConfig };