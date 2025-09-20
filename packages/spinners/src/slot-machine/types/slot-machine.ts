/**
 * Type Definitions for Slot Machine Wheel
 */

import { Participant } from "@raffle-spinner/storage";
import { SpinDuration, DecelerationSpeed } from "../constants/physics";

/**
 * Dual array structure for managing the wheel display
 */
export interface WheelArrays {
  topArray: Participant[];    // 50 tickets currently in top half
  bottomArray: Participant[]; // 50 tickets currently in bottom half  
  hasSwapped: boolean;        // Whether arrays have been swapped for winner
  swapPoint: number;          // Progress point to swap (0.5 = 50%)
}

/**
 * Combined display subset for rendering
 */
export interface DisplaySubset {
  participants: Participant[]; // Combined 100-entry array
  winnerIndex: number;        // Index of winner in the array (-1 if not present)
}

/**
 * Animation state tracking
 */
export interface AnimationState {
  isSpinning: boolean;
  currentPosition: number;    // Current wheel position in units
  targetPosition: number;     // Final target position
  startTime: number;         // Animation start timestamp
  progress: number;          // 0 to 1 progress indicator
}

/**
 * Physics calculation state
 */
export interface PhysicsState {
  totalRotations: number;      // Total rotations to perform
  spinDuration: number;        // Duration in seconds
  currentRotation: number;     // Current rotation progress
  targetRotation: number;      // Final rotation target
  velocity: number;            // Current velocity
  maxVelocity: number;         // Maximum rotation speed
  decelerationFactor: number;  // Deceleration rate factor
  wheelCircumference: number;  // Total circumference in units
}

/**
 * Settings for the slot machine system
 */
export interface SlotMachineSettings {
  spinDuration: SpinDuration;
  decelerationSpeed: DecelerationSpeed;
}

/**
 * Callbacks for animation events
 */
export interface AnimationCallbacks {
  onSpinComplete: (winner: Participant) => void;
  onError?: (error: string) => void;
  onPositionUpdate: (position: number) => void;
  onArraySwap?: (arrays: WheelArrays) => void;
}

/**
 * Position calculation result
 */
export interface WheelPosition {
  topParticipantIndex: number;
  pixelOffset: number;
  centerParticipantIndex: number;
  normalizedPosition: number;
}