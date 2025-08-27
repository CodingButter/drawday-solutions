export { CompetitionProvider, useCompetitions } from './CompetitionContext';
export { SettingsProvider, useSettings } from './SettingsContext';
export { ThemeProvider, useTheme } from './ThemeContext';
export { CollapsibleStateProvider, useCollapsibleState } from './CollapsibleStateContext';

// Re-export types
export type { Participant, Competition } from './CompetitionContext';
export type { 
  ThemeSettings, 
  ThemeColors, 
  SpinnerStyle, 
  BrandingConfig 
} from './ThemeContext';

// Re-export ColumnMapping from shared types
export type { ColumnMapping } from '@raffle-spinner/types';

// Type aliases for compatibility with existing components
export type ThemeColorsType = import('./ThemeContext').ThemeColors;
export type SpinnerType = 'slotMachine' | 'wheel' | 'cards';