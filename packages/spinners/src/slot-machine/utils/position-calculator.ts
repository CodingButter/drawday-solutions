/**
 * Position Calculator for Slot Machine Wheel
 * 
 * Functions for calculating wheel positions and rotations
 */

import {
  UNIT_ANGLE,
  WHEEL_RADIUS,
  VIEWPORT_CENTER,
  VELOCITY_THRESHOLDS
} from "../constants/physics";
import { ITEM_HEIGHT_PX } from "../constants/visual";
import { WheelPosition } from "../types/slot-machine";

/**
 * Calculate the x,y position of a ticket on the wheel
 */
export function getTicketPosition(index: number, rotation: number): { x: number; y: number } {
  const angle = (index * UNIT_ANGLE) + rotation;
  return {
    x: WHEEL_RADIUS * Math.cos(angle),
    y: WHEEL_RADIUS * Math.sin(angle)
  };
}

/**
 * Calculate normalized wheel position
 */
export function calculateWheelPosition(
  currentPosition: number,
  subsetLength: number
): WheelPosition {
  const wheelCircumference = subsetLength * ITEM_HEIGHT_PX;
  const normalizedPos = ((currentPosition % wheelCircumference) + wheelCircumference) % wheelCircumference;
  
  const topParticipantIndex = Math.floor(normalizedPos / ITEM_HEIGHT_PX);
  const pixelOffset = normalizedPos % ITEM_HEIGHT_PX;
  const centerParticipantIndex = (topParticipantIndex + VIEWPORT_CENTER) % subsetLength;
  
  return {
    topParticipantIndex,
    pixelOffset,
    centerParticipantIndex,
    normalizedPosition: normalizedPos
  };
}

/**
 * Get the participant index at the center of the viewport
 */
export function getCenterParticipantIndex(
  topIndex: number,
  subsetLength: number
): number {
  return (topIndex + VIEWPORT_CENTER) % subsetLength;
}

/**
 * Calculate the final resting position for the winner to be centered
 * Winner should be at index 0 after swap, and we want it centered in viewport
 */
export function calculateFinalPosition(itemHeight: number = ITEM_HEIGHT_PX): number {
  // After swap, winner is at index 0
  // To center it (at viewport position 2), we need a negative offset
  // Position = -2 * itemHeight means index 0 will be at center
  // We handle negative positions by adding the full wheel circumference
  const wheelCircumference = 100 * itemHeight;
  const targetPosition = -VIEWPORT_CENTER * itemHeight;
  
  // Convert negative position to positive equivalent
  if (targetPosition < 0) {
    return wheelCircumference + targetPosition;
  }
  return targetPosition;
}

/**
 * Calculate dynamic velocity based on distance to target
 */
export function calculateVelocity(
  distance: number,
  decelerationFactor: number
): number {
  const absDistance = Math.abs(distance);
  
  // Determine minimum velocity based on distance
  let minVelocity: number;
  if (absDistance > VELOCITY_THRESHOLDS.FAR.distance) {
    minVelocity = VELOCITY_THRESHOLDS.FAR.velocity;
  } else if (absDistance > VELOCITY_THRESHOLDS.MEDIUM.distance) {
    minVelocity = VELOCITY_THRESHOLDS.MEDIUM.velocity;
  } else if (absDistance > VELOCITY_THRESHOLDS.NEAR.distance) {
    minVelocity = VELOCITY_THRESHOLDS.NEAR.velocity;
  } else {
    minVelocity = VELOCITY_THRESHOLDS.VERY_NEAR.velocity;
  }
  
  // Calculate velocity with deceleration
  const velocity = distance * decelerationFactor;
  
  // Apply minimum velocity threshold
  if (Math.abs(velocity) < minVelocity) {
    return velocity > 0 ? minVelocity : -minVelocity;
  }
  
  return velocity;
}