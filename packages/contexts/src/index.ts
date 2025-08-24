/**
 * Shared React Contexts Package
 *
 * Collection of reusable React contexts for Raffle Spinner applications.
 * Provides centralized state management for common features.
 */

// Theme Context (old version - kept for backward compatibility)
export {
  ThemeProvider as LegacyThemeProvider,
  useTheme as useLegacyTheme,
  type Theme,
  type ThemeMode,
  type ThemeColors as LegacyThemeColors,
} from "./theme-context";

// Notification Context
export {
  NotificationProvider,
  useNotifications,
  type Notification,
  type NotificationType,
} from "./notification-context";

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
