'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { 
  getUserSettings, 
  updateThemeSettings,
  updateBranding as updateBrandingInDb,
  updateSpinnerStyle as updateSpinnerStyleInDb,
  type ThemeSettings,
  defaultSettings 
} from '@/lib/settings-service';

interface ThemeContextType {
  theme: ThemeSettings;
  spinnerStyle: ThemeSettings['spinnerStyle'];
  branding: ThemeSettings['branding'];
  updateTheme: (theme: Partial<ThemeSettings>) => Promise<void>;
  updateSpinnerStyle: (style: Partial<ThemeSettings['spinnerStyle']>) => Promise<void>;
  updateBranding: (branding: Partial<ThemeSettings['branding']>) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeSettings>(defaultSettings.theme);
  const [userId, setUserId] = useState<string | null>(null);

  // Load theme from Firestore when user is authenticated
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        try {
          const userSettings = await getUserSettings(user.uid);
          setTheme(userSettings.theme);
        } catch (error) {
          console.error('Error loading theme:', error);
        }
      } else {
        setUserId(null);
        setTheme(defaultSettings.theme);
      }
    });

    return () => unsubscribe();
  }, []);

  const updateTheme = async (updates: Partial<ThemeSettings>) => {
    if (!userId) return;
    
    const newTheme = { ...theme, ...updates };
    setTheme(newTheme);
    
    try {
      await updateThemeSettings(userId, updates);
    } catch (error) {
      console.error('Error updating theme:', error);
    }
  };

  const updateSpinnerStyle = async (style: Partial<ThemeSettings['spinnerStyle']>) => {
    if (!userId) return;
    
    const newTheme = {
      ...theme,
      spinnerStyle: { ...theme.spinnerStyle, ...style }
    };
    setTheme(newTheme);
    
    try {
      await updateSpinnerStyleInDb(userId, style);
    } catch (error) {
      console.error('Error updating spinner style:', error);
    }
  };

  const updateBranding = async (branding: Partial<ThemeSettings['branding']>) => {
    if (!userId) return;
    
    const newTheme = {
      ...theme,
      branding: { ...theme.branding, ...branding }
    };
    setTheme(newTheme);
    
    try {
      await updateBrandingInDb(userId, branding);
    } catch (error) {
      console.error('Error updating branding:', error);
    }
  };

  return (
    <ThemeContext.Provider 
      value={{ 
        theme,
        spinnerStyle: theme.spinnerStyle,
        branding: theme.branding,
        updateTheme,
        updateSpinnerStyle,
        updateBranding
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