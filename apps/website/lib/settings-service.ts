import type { 
  ColumnMapping, 
  SavedMapping,
  SpinnerSettings 
} from '@raffle-spinner/types';

// Re-export SpinnerSettings from types package
export type { SpinnerSettings };

const DIRECTUS_URL = 'https://db.drawday.app';
const DIRECTUS_PROJECT = 'drawday';

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
  columnMapping?: ColumnMapping;
  savedMappings?: SavedMapping[];
  updatedAt?: string;
}

// Default settings
export const defaultSettings: Omit<UserSettings, 'userId' | 'updatedAt'> = {
  spinner: {
    spinDuration: 'medium',
    decelerationSpeed: 'medium',
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

// Get auth token from localStorage or session
const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('directus_token') || sessionStorage.getItem('directus_token');
};

// API helper
const directusApi = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${DIRECTUS_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`Directus API error: ${response.statusText}`);
  }

  return response.json();
};

// Get user settings
export const getUserSettings = async (userId: string): Promise<UserSettings> => {
  try {
    // For now, use localStorage as the primary storage
    // This will be replaced with Directus once permissions are set up
    const stored = localStorage.getItem(`user_settings_${userId}`);
    if (stored) {
      const data = JSON.parse(stored);

      // Merge with defaults to ensure all fields are present
      return {
        userId,
        ...defaultSettings,
        ...data,
        // Ensure spinner settings exist
        spinner: data.spinner || defaultSettings.spinner,
        // Ensure theme exists with all required fields
        theme: {
          ...defaultSettings.theme,
          ...(data.theme || {}),
          spinnerStyle: {
            ...defaultSettings.theme.spinnerStyle,
            ...(data.theme?.spinnerStyle || {}),
          },
          branding: {
            ...defaultSettings.theme.branding,
            ...(data.theme?.branding || {}),
          },
        },
      } as UserSettings;
    }

    // Try Directus as fallback (will work once permissions are set)
    // Commented out temporarily due to Directus permissions issue (403 error)
    /*
    try {
      // Query user settings by user_id field instead of using the ID directly
      const { data } = await directusApi(`/items/user_settings?filter[user_id][_eq]=${userId}&limit=1`);

      if (data && data.length > 0) {
        const settings = data[0];

        // Save to localStorage for future use
        localStorage.setItem(`user_settings_${userId}`, JSON.stringify(settings));

        // Merge with defaults to ensure all fields are present
        return {
          userId,
          ...defaultSettings,
          ...settings,
          // Ensure spinner settings exist and migrate old format
          spinner: (() => {
            const spinnerData = settings.spinner || {};
            // Check if it's the old format
            if ('minSpinDuration' in spinnerData && typeof spinnerData.minSpinDuration === 'number') {
              // Migrate from old format to new format
              const duration = spinnerData.minSpinDuration;
              return {
                spinDuration: duration <= 2 ? 'short' : duration <= 3 ? 'medium' : 'long',
                decelerationSpeed: (spinnerData as any).decelerationRate || 'medium',
              };
            }
            // Return new format or default
            return spinnerData.spinDuration ? spinnerData : defaultSettings.spinner;
          })(),
          // Ensure theme exists with all required fields
          theme: {
            ...defaultSettings.theme,
            ...(data.theme || {}),
            spinnerStyle: {
              ...defaultSettings.theme.spinnerStyle,
              ...(data.theme?.spinnerStyle || {}),
            },
            branding: {
              ...defaultSettings.theme.branding,
              ...(data.theme?.branding || {}),
            },
          },
        } as UserSettings;
      }
    } catch (directusError) {
    }
    */

    // Return default settings if none exist
    return {
      userId,
      ...defaultSettings,
    };
  } catch (error) {
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
    // Get current settings
    const current = await getUserSettings(userId);

    // Merge updates
    const updated = {
      ...current,
      ...updates,
      userId,
      updatedAt: new Date().toISOString(),
    };

    // Save to localStorage
    localStorage.setItem(`user_settings_${userId}`, JSON.stringify(updated));

    // Try to save to Directus (will work once permissions are set)
    // Commented out temporarily due to Directus permissions issue (403 error)
    /*
    try {
      await directusApi(`/items/user_settings/${userId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          ...updates,
          userId,
          updatedAt: new Date().toISOString(),
        }),
      });
    } catch (directusError) {
      // Don't throw, localStorage save was successful
    }
    */
  } catch (error) {
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