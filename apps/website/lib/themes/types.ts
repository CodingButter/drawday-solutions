/**
 * Theme System Types
 * Defines the structure for raffle website themes
 */

export interface ThemeColors {
  // Primary brand colors
  primary: string;
  primaryDark: string;
  primaryLight: string;

  // Secondary/accent colors
  secondary: string;
  secondaryDark: string;
  secondaryLight: string;

  // Backgrounds
  background: string;
  backgroundAlt: string;
  surface: string;
  surfaceHover: string;

  // Text colors
  text: string;
  textSecondary: string;
  textMuted: string;
  textInverse: string;

  // UI states
  success: string;
  warning: string;
  error: string;
  info: string;

  // Borders
  border: string;
  borderLight: string;
  borderHeavy: string;
}

export interface ThemeTypography {
  fontFamily: {
    heading: string;
    body: string;
    mono: string;
  };
  fontSize: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
    '5xl': string;
  };
  fontWeight: {
    normal: number;
    medium: number;
    semibold: number;
    bold: number;
    extrabold: number;
  };
  lineHeight: {
    tight: number;
    normal: number;
    relaxed: number;
  };
}

export interface ThemeSpacing {
  containerWidth: string;
  sectionPadding: string;
  cardPadding: string;
  buttonPadding: string;
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    full: string;
  };
}

export interface ThemeComponents {
  header: {
    background: string;
    height: string;
    sticky: boolean;
    transparent: boolean;
  };
  button: {
    primary: {
      background: string;
      text: string;
      border: string;
      hover: string;
    };
    secondary: {
      background: string;
      text: string;
      border: string;
      hover: string;
    };
    rounded: boolean;
    shadow: boolean;
  };
  card: {
    background: string;
    border: string;
    shadow: string;
    hover: string;
  };
  badge: {
    style: 'filled' | 'outline' | 'subtle';
    rounded: boolean;
  };
}

export interface ThemeEffects {
  animations: {
    enabled: boolean;
    speed: 'slow' | 'normal' | 'fast';
  };
  shadows: {
    enabled: boolean;
    intensity: 'light' | 'medium' | 'heavy';
  };
  gradients: {
    enabled: boolean;
    primary: string;
    secondary: string;
  };
  blur: {
    enabled: boolean;
    amount: string;
  };
}

export interface Theme {
  id: string;
  name: string;
  description: string;
  style: 'modern' | 'classic' | 'minimal' | 'bold' | 'elegant';
  mood: 'professional' | 'exciting' | 'trustworthy' | 'luxurious' | 'energetic';
  bestFor: string[];

  colors: ThemeColors;
  typography: ThemeTypography;
  spacing: ThemeSpacing;
  components: ThemeComponents;
  effects: ThemeEffects;

  preview: {
    thumbnail: string; // emoji or icon
    screenshot?: string; // URL to screenshot
  };
}

export type ThemeId = string;
