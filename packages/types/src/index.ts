/**
 * Shared Type Definitions
 *
 * @description
 * Centralized type definitions used across the DrawDay Spinner application.
 * These types ensure consistency and type safety throughout the monorepo.
 *
 * @module @raffle-spinner/types
 */

// ============================================================================
// Core Domain Types
// ============================================================================

/**
 * Represents a single participant in a competition
 */
export interface Participant {
  firstName: string;
  lastName: string;
  ticketNumber: string;
}

/**
 * Represents a winner in a competition
 */
export interface Winner {
  participant: Participant;
  timestamp: number;
}

/**
 * Represents a competition with participants
 */
export interface Competition {
  id: string;
  name: string;
  participants: Participant[];
  winners?: Winner[]; // List of winners for completed competitions
  bannerImage?: string; // Base64 encoded image for this specific competition
  bannerImageId?: string; // Directus file ID for banner image
  logoImageId?: string; // Directus file ID for logo image
  createdAt: number;
  updatedAt: number;
  userId?: string; // User ID (Firebase or other auth provider)
  participantCount?: number; // Total number of participants
  useSubcollection?: boolean; // Legacy: Whether participants are stored in subcollection
}

// ============================================================================
// Configuration Types
// ============================================================================

/**
 * Spinner settings with precise physics controls
 */
export interface SpinnerSettings {
  spinDuration: "short" | "medium" | "long"; // Duration presets (2s, 3s, 5s)
  decelerationSpeed: "slow" | "medium" | "fast"; // How quickly wheel slows down
  spinnerType?: string; // Type of spinner animation (e.g., 'slot_machine', 'wheel', etc.)
}

/**
 * CSV column mapping configuration
 */
export interface ColumnMapping {
  firstName?: string | null;
  lastName?: string | null;
  fullName?: string | null; // Single column containing both first and last name
  ticketNumber: string | null;
}

/**
 * Saved column mapping preset
 */
export interface SavedMapping {
  id: string;
  name: string;
  mapping: ColumnMapping;
  createdAt: number;
  updatedAt: number;
  usageCount: number; // Track how often this mapping is used
  isDefault?: boolean; // Mark one mapping as default
}

// ============================================================================
// Theme & Styling Types
// ============================================================================

/**
 * Available spinner visualization types
 */
export type SpinnerType = "slotMachine" | "wheel" | "cards";

/**
 * Size options for text display
 */
export type TextSize = "small" | "medium" | "large" | "extra-large";

/**
 * Position options for logo placement
 */
export type LogoPosition = "left" | "center" | "right";

/**
 * Theme color palette
 */
export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  winner: string;
  winnerGlow: string;
}

/**
 * Spinner visual style configuration
 */
export interface SpinnerStyle {
  type: SpinnerType;
  nameSize: TextSize;
  ticketSize: TextSize;
  nameColor: string;
  ticketColor: string;
  backgroundColor: string; // Panel background color
  canvasBackground?: string; // Slot machine canvas background
  topShadowOpacity?: number; // Top shadow opacity (0-1)
  bottomShadowOpacity?: number; // Bottom shadow opacity (0-1)
  shadowSize?: number; // Shadow size as percentage of viewport (0-50)
  shadowColor?: string; // Shadow gradient color (defaults to panel background)
  borderColor: string;
  highlightColor: string;
  fontFamily?: string;
}

/**
 * Branding configuration for the application
 */
export interface BrandingSettings {
  logoImage?: string; // Base64 encoded logo
  logoPosition: LogoPosition;
  bannerImage?: string; // Base64 encoded default banner
  companyName?: string;
  showCompanyName: boolean;
}

/**
 * Complete theme configuration
 */
export interface ThemeSettings {
  colors: ThemeColors;
  spinnerStyle: SpinnerStyle;
  branding: BrandingSettings;
  customCSS?: string; // Advanced users can add custom CSS
}

// ============================================================================
// Storage Types
// ============================================================================

/**
 * Main storage data structure
 */
export interface StorageData {
  competitions: Competition[];
  settings: SpinnerSettings;
  columnMapping: ColumnMapping | null;
  savedMappings?: SavedMapping[];
  defaultMappingId?: string;
  theme?: ThemeSettings;
}

// ============================================================================
// UI Component Props Types
// ============================================================================

/**
 * Common props for components that handle errors
 */
export interface ErrorHandler {
  onError?: (error: string) => void;
}

/**
 * Common props for components with loading states
 */
export interface LoadingState {
  isLoading?: boolean;
  loadingText?: string;
}

// ============================================================================
// Animation Types
// ============================================================================

/**
 * Animation state for spinners
 */
export interface AnimationState {
  isSpinning: boolean;
  currentPosition: number;
  velocity: number;
  targetIndex?: number;
}

/**
 * Animation configuration
 */
export interface AnimationConfig {
  duration: number;
  easing: "linear" | "ease-in" | "ease-out" | "ease-in-out" | "cubic-bezier";
  delay?: number;
}

// ============================================================================
// Utility Types
// ============================================================================

/**
 * Make all properties of T optional recursively
 */
export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

/**
 * Extract the type of array elements
 */
export type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

/**
 * Make specific keys required
 */
export type RequireKeys<T, K extends keyof T> = T & Required<Pick<T, K>>;

/**
 * Make specific keys optional
 */
export type OptionalKeys<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>;
