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
          const settings = await getUserSettings(userId);
          if (settings) {
            setTheme(settings.theme);
            setLastTimestamp(timestamp);
            
            // Also update localStorage for immediate local updates
            localStorage.setItem('theme', JSON.stringify(settings.theme));
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
            
            // Also update localStorage for immediate local updates
            localStorage.setItem('theme', JSON.stringify(userSettings.theme));
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
    // Check if we're in iframe context
    const isInIframe = window !== window.parent;
    const effectiveUserId = userId || (isInIframe ? 'extension-user' : null);
    
    if (!effectiveUserId) return;
    
    const newTheme = {
      ...theme,
      colors: { ...theme.colors, ...colors }
    };
    setTheme(newTheme);
    
    // Update localStorage immediately for local updates
    localStorage.setItem('theme', JSON.stringify(newTheme));
    
    // Only update database if we have a real userId (not in iframe)
    if (userId && !isInIframe) {
      try {
        await updateThemeColors(userId, colors);
        // Update timestamp after successful update
        const timestamp = await getUserSettingsTimestamp(userId);
        setLastTimestamp(timestamp);
      } catch (error) {
        console.error('Error updating theme colors:', error);
        if (!isInIframe) throw error;
      }
    }
  };

  const updateSpinnerStyle = async (style: Partial<SpinnerStyle>) => {
    // Check if we're in iframe context
    const isInIframe = window !== window.parent;
    const effectiveUserId = userId || (isInIframe ? 'extension-user' : null);
    
    if (!effectiveUserId) return;
    
    const newTheme = {
      ...theme,
      spinnerStyle: { ...theme.spinnerStyle, ...style }
    };
    setTheme(newTheme);
    
    // Update localStorage immediately for local updates
    localStorage.setItem('theme', JSON.stringify(newTheme));
    
    // Only update database if we have a real userId (not in iframe)
    if (userId && !isInIframe) {
      try {
        await updateSpinnerStyleInDb(userId, style);
        // Update timestamp after successful update
        const timestamp = await getUserSettingsTimestamp(userId);
        setLastTimestamp(timestamp);
      } catch (error) {
        console.error('Error updating spinner style:', error);
        if (!isInIframe) throw error;
      }
    }
  };

  const updateBranding = async (branding: Partial<BrandingConfig>) => {
    console.log('updateBranding called with:', branding, 'userId:', userId);
    
    // Check if we're in iframe context
    const isInIframe = window !== window.parent;
    
    // If no userId and in iframe, use a default extension user ID
    const effectiveUserId = userId || (isInIframe ? 'extension-user' : null);
    
    if (!effectiveUserId) {
      console.warn('No user ID available for branding update');
      return;
    }
    
    const newTheme = {
      ...theme,
      branding: { ...theme.branding, ...branding }
    };
    setTheme(newTheme);
    
    // Update localStorage immediately for local updates
    localStorage.setItem('theme', JSON.stringify(newTheme));
    console.log('Theme updated in localStorage');
    
    // Only update database if we have a real userId (not in iframe)
    if (userId && !isInIframe) {
      try {
        await updateBrandingInDb(userId, branding);
        // Update timestamp after successful update
        const timestamp = await getUserSettingsTimestamp(userId);
        setLastTimestamp(timestamp);
        console.log('Branding updated in database');
      } catch (error) {
        console.error('Error updating branding in database:', error);
        // Don't throw in iframe context
        if (!isInIframe) throw error;
      }
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
    localStorage.setItem('theme', JSON.stringify(defaultTheme));
    
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