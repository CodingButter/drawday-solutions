/**
 * Visual Constants for Slot Machine Wheel
 * 
 * Display and rendering constants
 */

// Canvas dimensions
export const CANVAS_WIDTH = 400;
export const CANVAS_HEIGHT = 500;

// Wheel display dimensions
export const WHEEL_WIDTH = 350;
export const ITEM_HEIGHT_PX = 80; // Height of each item in pixels
export const VISIBLE_ITEMS = 5;
export const VIEWPORT_HEIGHT = VISIBLE_ITEMS * ITEM_HEIGHT_PX;

// 3D perspective effect
export const PERSPECTIVE_SCALE = 0.15;

// Shadow defaults
export const DEFAULT_SHADOW_OPACITY = {
  TOP: 0.3,
  BOTTOM: 0.3
} as const;

export const DEFAULT_SHADOW_SIZE = 30; // Percentage of canvas height

// Debug mode settings
export const DEBUG_TEXT_COLOR = "rgba(255, 255, 255, 0.5)";
export const DEBUG_FONT = "10px monospace";
export const CENTER_MARKER_COLOR = "rgba(255, 0, 0, 0.8)";
export const WINNER_MARKER_COLOR = "rgba(0, 255, 0, 0.8)";