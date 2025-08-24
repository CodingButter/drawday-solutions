/**
 * Unified Theme Context
 *
 * Purpose: Provides theme settings and customization options throughout the application,
 * including colors, spinner styles, and branding configuration.
 * Works in both Chrome Extension and Website environments.
 */

import React, { createContext, useContext, useEffect, useState } from "react";
import type {
  ThemeSettings,
  ThemeColors,
  SpinnerStyle,
  BrandingSettings,
} from "@raffle-spinner/types";

// Default theme configuration
const DEFAULT_COLORS: ThemeColors = {
  primary: "#0b1e3a", // DrawDay Navy - Primary brand color
  secondary: "#e6b540", // DrawDay Gold - Brand accent
  accent: "#e6b540", // DrawDay Gold - Highlight
  background: "#fdfeff", // White - Light mode background
  foreground: "#161b21", // Rich Black - Text on light
  card: "#fdfeff", // White - Card backgrounds
  cardForeground: "#161b21", // Rich Black - Card text
  winner: "#e6b540", // DrawDay Gold for winner highlight
  winnerGlow: "#e6b540", // DrawDay Gold glow
};

const DEFAULT_SPINNER_STYLE: SpinnerStyle = {
  type: "slotMachine",
  nameSize: "large",
  ticketSize: "extra-large",
  nameColor: "#fdfeff", // White - Names on dark background
  ticketColor: "#e6b540", // DrawDay Gold - Ticket numbers
  backgroundColor: "#1e1f23", // Raisin black - Panel background
  canvasBackground: "#0c0e11", // Night - Slot machine canvas background
  topShadowOpacity: 0.3, // Top shadow opacity
  bottomShadowOpacity: 0.3, // Bottom shadow opacity
  shadowSize: 30, // Shadow size as percentage
  shadowColor: undefined, // Use panel background by default
  borderColor: "#e6b540", // DrawDay Gold - Borders
  highlightColor: "#e6b540", // DrawDay Gold - Highlights
  fontFamily: "system-ui",
};

const DEFAULT_BRANDING: BrandingSettings = {
  logoPosition: "center",
  showCompanyName: true,
};

const DEFAULT_THEME: ThemeSettings = {
  colors: DEFAULT_COLORS,
  spinnerStyle: DEFAULT_SPINNER_STYLE,
  branding: DEFAULT_BRANDING,
};

interface ThemeContextType {
  theme: ThemeSettings;
  updateColors: (colors: Partial<ThemeColors>) => Promise<void>;
  updateSpinnerStyle: (style: Partial<SpinnerStyle>) => Promise<void>;
  updateBranding: (branding: Partial<BrandingSettings>) => Promise<void>;
  resetTheme: () => Promise<void>;
  applyCustomCSS: (css: string) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeSettings>(DEFAULT_THEME);

  useEffect(() => {
    loadTheme();

    // For Chrome extension environment, listen to storage changes
    if (typeof chrome !== "undefined" && chrome.storage) {
      const handleStorageChange = (changes: {
        [key: string]: chrome.storage.StorageChange;
      }) => {
        if (changes.theme) {
          const newTheme = changes.theme.newValue;
          if (newTheme) {
            setTheme(newTheme);
          }
        }
      };

      chrome.storage.local.onChanged.addListener(handleStorageChange);
      return () => {
        chrome.storage.local.onChanged.removeListener(handleStorageChange);
      };
    }
  }, []);

  // Apply theme colors to CSS variables whenever theme changes
  useEffect(() => {
    applyThemeToDOM(theme);
  }, [theme]);

  const loadTheme = async () => {
    // Get the current theme from storage
    try {
      if (typeof chrome !== "undefined" && chrome.storage) {
        const result = await chrome.storage.local.get("theme");
        if (result.theme) {
          const loadedTheme = {
            colors: { ...DEFAULT_COLORS, ...result.theme.colors },
            spinnerStyle: {
              ...DEFAULT_SPINNER_STYLE,
              ...result.theme.spinnerStyle,
            },
            branding: { ...DEFAULT_BRANDING, ...result.theme.branding },
            customCSS: result.theme.customCSS,
          };
          setTheme(loadedTheme);
        }
      } else if (typeof window !== "undefined" && window.localStorage) {
        const stored = localStorage.getItem("raffle-spinner-theme");
        if (stored) {
          const parsedTheme = JSON.parse(stored);
          const loadedTheme = {
            colors: { ...DEFAULT_COLORS, ...parsedTheme.colors },
            spinnerStyle: {
              ...DEFAULT_SPINNER_STYLE,
              ...parsedTheme.spinnerStyle,
            },
            branding: { ...DEFAULT_BRANDING, ...parsedTheme.branding },
            customCSS: parsedTheme.customCSS,
          };
          setTheme(loadedTheme);
        }
      }
    } catch (error) {
      console.error("Failed to load theme:", error);
    }
  };

  const applyThemeToDOM = (theme: ThemeSettings) => {
    const root = document.documentElement;

    // Apply color variables
    root.style.setProperty("--theme-primary", theme.colors.primary);
    root.style.setProperty("--theme-secondary", theme.colors.secondary);
    root.style.setProperty("--theme-accent", theme.colors.accent);
    root.style.setProperty("--theme-background", theme.colors.background);
    root.style.setProperty("--theme-foreground", theme.colors.foreground);
    root.style.setProperty("--theme-card", theme.colors.card);
    root.style.setProperty(
      "--theme-card-foreground",
      theme.colors.cardForeground,
    );
    root.style.setProperty("--theme-winner", theme.colors.winner);
    root.style.setProperty("--theme-winner-glow", theme.colors.winnerGlow);

    // Apply spinner style variables
    root.style.setProperty(
      "--spinner-name-color",
      theme.spinnerStyle.nameColor,
    );
    root.style.setProperty(
      "--spinner-ticket-color",
      theme.spinnerStyle.ticketColor,
    );
    root.style.setProperty(
      "--spinner-bg-color",
      theme.spinnerStyle.backgroundColor,
    );
    root.style.setProperty(
      "--spinner-border-color",
      theme.spinnerStyle.borderColor,
    );
    root.style.setProperty(
      "--spinner-highlight-color",
      theme.spinnerStyle.highlightColor,
    );

    // Apply font sizes
    const nameSizes: Record<string, string> = {
      small: "14px",
      medium: "16px",
      large: "20px",
      "extra-large": "24px",
    };
    const ticketSizes: Record<string, string> = {
      small: "18px",
      medium: "24px",
      large: "32px",
      "extra-large": "40px",
    };

    root.style.setProperty(
      "--spinner-name-size",
      nameSizes[theme.spinnerStyle.nameSize],
    );
    root.style.setProperty(
      "--spinner-ticket-size",
      ticketSizes[theme.spinnerStyle.ticketSize],
    );

    if (theme.spinnerStyle.fontFamily) {
      root.style.setProperty(
        "--spinner-font-family",
        theme.spinnerStyle.fontFamily,
      );
    }

    // Apply custom CSS if provided
    if (theme.customCSS) {
      let styleElement = document.getElementById("custom-theme-styles");
      if (!styleElement) {
        styleElement = document.createElement("style");
        styleElement.id = "custom-theme-styles";
        document.head.appendChild(styleElement);
      }
      styleElement.textContent = theme.customCSS;
    }
  };

  const updateColors = async (colors: Partial<ThemeColors>) => {
    const newTheme = {
      ...theme,
      colors: { ...theme.colors, ...colors },
    };
    setTheme(newTheme);
    await saveTheme(newTheme);
  };

  const updateSpinnerStyle = async (style: Partial<SpinnerStyle>) => {
    const newTheme = {
      ...theme,
      spinnerStyle: { ...theme.spinnerStyle, ...style },
    };
    setTheme(newTheme);
    await saveTheme(newTheme);
  };

  const updateBranding = async (branding: Partial<BrandingSettings>) => {
    const newTheme = {
      ...theme,
      branding: { ...theme.branding, ...branding },
    };
    setTheme(newTheme);
    await saveTheme(newTheme);
  };

  const resetTheme = async () => {
    setTheme(DEFAULT_THEME);
    await saveTheme(DEFAULT_THEME);
  };

  const applyCustomCSS = async (css: string) => {
    const newTheme = { ...theme, customCSS: css };
    setTheme(newTheme);
    await saveTheme(newTheme);
  };

  const saveTheme = async (themeToSave: ThemeSettings) => {
    try {
      if (typeof chrome !== "undefined" && chrome.storage) {
        await chrome.storage.local.set({ theme: themeToSave });
      } else if (typeof window !== "undefined" && window.localStorage) {
        localStorage.setItem(
          "raffle-spinner-theme",
          JSON.stringify(themeToSave),
        );
      }
    } catch (error) {
      console.error("Failed to save theme:", error);
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        updateColors,
        updateSpinnerStyle,
        updateBranding,
        resetTheme,
        applyCustomCSS,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
