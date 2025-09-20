/**
 * Physics Constants for Slot Machine Wheel
 * 
 * Mathematical constants and settings for wheel rotation physics
 */

// Wheel geometry constants
export const WHEEL_RADIUS = 50; // units
export const TICKETS_COUNT = 100; // Always display exactly 100 tickets
export const CIRCUMFERENCE = 2 * Math.PI * WHEEL_RADIUS; // ~314.159 units
export const UNIT_ANGLE = (2 * Math.PI) / TICKETS_COUNT; // radians per ticket
export const ITEM_HEIGHT = CIRCUMFERENCE / TICKETS_COUNT; // ~3.14159 units per ticket

// Animation constants
export const MAX_ROTATION_SPEED = 5; // Constant max rotations per second
export const VISIBLE_ITEMS = 5; // Number of visible items in viewport
export const VIEWPORT_CENTER = 2; // Center item index (0-based)

// User-configurable spin durations (in seconds)
export const SPIN_DURATIONS = {
  short: 2,    // 2 seconds = 10 total rotations at max speed
  medium: 3,   // 3 seconds = 15 total rotations at max speed  
  long: 5      // 5 seconds = 25 total rotations at max speed
} as const;

// Deceleration rates for easing
export const DECELERATION_RATES = {
  slow: 0.95,   // Gradual slowdown - takes longer to stop
  medium: 0.90, // Moderate slowdown - balanced
  fast: 0.85    // Quick stop - rapid deceleration
} as const;

// Array management constants
export const SUBSET_SIZE = 100; // Total entries to show in the wheel
export const SUBSET_HALF = 50;  // Half of the subset size
export const SWAP_POINT = 0.5;  // Swap arrays at 50% of rotation progress

// Minimum velocity thresholds for smooth animation
export const VELOCITY_THRESHOLDS = {
  FAR: { distance: 500, velocity: 20 },
  MEDIUM: { distance: 100, velocity: 5 },
  NEAR: { distance: 10, velocity: 0.5 },
  VERY_NEAR: { distance: 0, velocity: 0.05 }
} as const;

// Animation completion threshold
export const COMPLETION_THRESHOLD = 0.5; // Stop when within 0.5 units of target (more generous for quicker stop)

export type SpinDuration = keyof typeof SPIN_DURATIONS;
export type DecelerationSpeed = keyof typeof DECELERATION_RATES;