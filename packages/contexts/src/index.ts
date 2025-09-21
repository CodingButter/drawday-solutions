/**
 * Shared React Contexts Package
 *
 * Collection of reusable React contexts for Raffle Spinner applications.
 * Provides centralized state management for common features.
 */

// Unified Theme Context (new version with full features)
export { ThemeProvider, useTheme } from "./ThemeContext";

// Competition Context
export { CompetitionProvider, useCompetitions } from "./CompetitionContext";

// Settings Context
export { SettingsProvider, useSettings } from "./SettingsContext";

// Collapsible State Context
export {
  CollapsibleStateProvider,
  useCollapsibleState,
} from "./CollapsibleStateContext";
