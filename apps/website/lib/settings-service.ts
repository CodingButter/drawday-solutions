import { 
  doc, 
  getDoc, 
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';

export interface SpinnerSettings {
  minSpinDuration: number;
  decelerationRate: 'slow' | 'medium' | 'fast';
  soundEnabled: boolean;
}

export interface ThemeSettings {
  // Spinner Style
  spinnerStyle: {
    nameColor: string;
    ticketColor: string;
    backgroundColor: string;
    canvasBackground: string;
    borderColor: string;
    highlightColor: string;
    nameSize: "small" | "medium" | "large" | "extra-large";
    ticketSize: "small" | "medium" | "large" | "extra-large";
    fontFamily: string;
    topShadowOpacity: number;
    bottomShadowOpacity: number;
    shadowSize: number;
    shadowColor: string;
  };
  
  // Branding
  branding: {
    logoImage?: string;
    logoPosition: 'left' | 'center' | 'right';
    bannerImage?: string;
    companyName?: string;
    showCompanyName: boolean;
  };
}

export interface UserSettings {
  userId: string;
  spinner: SpinnerSettings;
  theme: ThemeSettings;
  columnMapping?: {
    firstName: string | null;
    lastName: string | null;
    fullName: string | null;
    ticketNumber: string | null;
  };
  savedMappings?: Array<{
    id: string;
    name: string;
    mapping: {
      firstName: string | null;
      lastName: string | null;
      fullName: string | null;
      ticketNumber: string | null;
    };
  }>;
  updatedAt?: any;
}

// Default settings
export const defaultSettings: Omit<UserSettings, 'userId' | 'updatedAt'> = {
  spinner: {
    minSpinDuration: 3,
    decelerationRate: 'medium',
    soundEnabled: false,
  },
  theme: {
    spinnerStyle: {
      nameColor: '#ffffff',
      ticketColor: '#a0a0a0',
      backgroundColor: '#1a1a1a',
      canvasBackground: '#0a0a0a',
      borderColor: '#333333',
      highlightColor: '#ffd700',
      nameSize: 'large',
      ticketSize: 'medium',
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
};

// Get user settings
export const getUserSettings = async (userId: string): Promise<UserSettings> => {
  try {
    const settingsRef = doc(db, 'userSettings', userId);
    const settingsSnap = await getDoc(settingsRef);
    
    if (settingsSnap.exists()) {
      return settingsSnap.data() as UserSettings;
    }
    
    // Return default settings if none exist
    return {
      userId,
      ...defaultSettings,
    };
  } catch (error) {
    console.error('Error getting user settings:', error);
    return {
      userId,
      ...defaultSettings,
    };
  }
};

// Update user settings
export const updateUserSettings = async (
  userId: string, 
  updates: Partial<UserSettings>
): Promise<void> => {
  try {
    const settingsRef = doc(db, 'userSettings', userId);
    await setDoc(settingsRef, {
      ...updates,
      userId,
      updatedAt: serverTimestamp(),
    }, { merge: true });
  } catch (error) {
    console.error('Error updating user settings:', error);
    throw error;
  }
};

// Update spinner settings
export const updateSpinnerSettings = async (
  userId: string,
  spinnerSettings: Partial<SpinnerSettings>
): Promise<void> => {
  const current = await getUserSettings(userId);
  await updateUserSettings(userId, {
    spinner: {
      ...current.spinner,
      ...spinnerSettings,
    },
  });
};

// Update theme settings
export const updateThemeSettings = async (
  userId: string,
  themeSettings: Partial<ThemeSettings>
): Promise<void> => {
  const current = await getUserSettings(userId);
  await updateUserSettings(userId, {
    theme: {
      ...current.theme,
      ...themeSettings,
    },
  });
};

// Update branding
export const updateBranding = async (
  userId: string,
  branding: Partial<ThemeSettings['branding']>
): Promise<void> => {
  const current = await getUserSettings(userId);
  await updateUserSettings(userId, {
    theme: {
      ...current.theme,
      branding: {
        ...current.theme.branding,
        ...branding,
      },
    },
  });
};

// Update spinner style
export const updateSpinnerStyle = async (
  userId: string,
  style: Partial<ThemeSettings['spinnerStyle']>
): Promise<void> => {
  const current = await getUserSettings(userId);
  await updateUserSettings(userId, {
    theme: {
      ...current.theme,
      spinnerStyle: {
        ...current.theme.spinnerStyle,
        ...style,
      },
    },
  });
};