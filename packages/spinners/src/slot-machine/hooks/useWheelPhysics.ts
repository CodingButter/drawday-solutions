/**
 * useWheelPhysics Hook
 * 
 * Manages physics calculations for the slot machine wheel
 */

import { useMemo } from "react";
import { 
  MAX_ROTATION_SPEED, 
  SPIN_DURATIONS, 
  DECELERATION_RATES,
  SpinDuration,
  DecelerationSpeed,
  COMPLETION_THRESHOLD
} from "../constants/physics";
import { ITEM_HEIGHT_PX } from "../constants/visual";
import { calculateVelocity } from "../utils/position-calculator";
import { PhysicsState } from "../types/slot-machine";

interface UseWheelPhysicsProps {
  spinDuration: SpinDuration;
  decelerationSpeed: DecelerationSpeed;
}

interface UseWheelPhysicsReturn {
  duration: number;
  totalRotations: number;
  decelerationFactor: number;
  maxVelocity: number;
  calculateVelocity: (distance: number) => number;
  isComplete: (distance: number) => boolean;
  createInitialState: (wheelCircumference: number) => PhysicsState;
}

/**
 * Hook for managing wheel physics calculations
 */
export function useWheelPhysics({
  spinDuration,
  decelerationSpeed
}: UseWheelPhysicsProps): UseWheelPhysicsReturn {
  
  const duration = useMemo(
    () => SPIN_DURATIONS[spinDuration],
    [spinDuration]
  );
  
  const totalRotations = useMemo(
    () => duration * MAX_ROTATION_SPEED,
    [duration]
  );
  
  const decelerationFactor = useMemo(
    () => DECELERATION_RATES[decelerationSpeed],
    [decelerationSpeed]
  );
  
  const maxVelocity = useMemo(
    () => MAX_ROTATION_SPEED * ITEM_HEIGHT_PX * 100, // pixels per second
    []
  );
  
  const calculateVelocityWithFactor = useMemo(
    () => (distance: number) => calculateVelocity(distance, decelerationFactor),
    [decelerationFactor]
  );
  
  const isComplete = useMemo(
    () => (distance: number) => Math.abs(distance) < COMPLETION_THRESHOLD,
    []
  );
  
  const createInitialState = useMemo(
    () => (wheelCircumference: number): PhysicsState => ({
      totalRotations,
      spinDuration: duration,
      currentRotation: 0,
      targetRotation: totalRotations * wheelCircumference,
      velocity: 0,
      maxVelocity,
      decelerationFactor,
      wheelCircumference
    }),
    [totalRotations, duration, maxVelocity, decelerationFactor]
  );
  
  return {
    duration,
    totalRotations,
    decelerationFactor,
    maxVelocity,
    calculateVelocity: calculateVelocityWithFactor,
    isComplete,
    createInitialState
  };
}