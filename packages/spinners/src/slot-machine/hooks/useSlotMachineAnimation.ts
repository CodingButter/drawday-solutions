/**
 * useSlotMachineAnimation Hook
 * 
 * Animation system with precise physics and dual-array management
 */

import { useCallback, useRef, useEffect } from "react";
import { Participant } from "@raffle-spinner/storage";
import { normalizeTicketNumber } from "@raffle-spinner/utils";
import { SpinDuration, DecelerationSpeed, VIEWPORT_CENTER } from "../constants/physics";
import { ITEM_HEIGHT_PX } from "../constants/visual";
import { useWheelPhysics } from "./useWheelPhysics";

interface AnimationOptions {
  participants: Participant[];
  targetTicketNumber: string;
  spinDuration: SpinDuration;
  decelerationSpeed: DecelerationSpeed;
  onSpinComplete: (winner: Participant) => void;
  onError?: (error: string) => void;
  onPositionUpdate: (position: number) => void;
  initialPosition?: number;
}

interface AnimationControls {
  spin: () => void;
  cancel: () => void;
  isSpinning: boolean;
}

/**
 * Slot machine animation hook with precise physics
 */
export function useSlotMachineAnimation({
  participants: initialParticipants,
  targetTicketNumber,
  spinDuration,
  decelerationSpeed,
  onSpinComplete,
  onError,
  onPositionUpdate,
  initialPosition = 0,
}: AnimationOptions): AnimationControls {
  
  const animationRef = useRef<number | null>(null);
  const isSpinningRef = useRef(false);
  const hasSwappedRef = useRef(false);
  const startTimeRef = useRef<number>(0);
  const currentPositionRef = useRef<number>(0);
  
  // Physics calculations
  const physics = useWheelPhysics({ spinDuration, decelerationSpeed });
  
  // Store callbacks in refs
  const onSpinCompleteRef = useRef(onSpinComplete);
  const onPositionUpdateRef = useRef(onPositionUpdate);
  
  useEffect(() => {
    onSpinCompleteRef.current = onSpinComplete;
    onPositionUpdateRef.current = onPositionUpdate;
  }, [onSpinComplete, onPositionUpdate]);
  
  /**
   * Cancel animation
   */
  const cancel = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    isSpinningRef.current = false;
    hasSwappedRef.current = false;
  }, []);
  
  /**
   * Start spin animation
   */
  const spin = useCallback(() => {
    console.log('🎰 Starting spin animation');
    
    if (isSpinningRef.current) {
      console.log('Already spinning, ignoring');
      return;
    }
    
    // Validate inputs
    if (initialParticipants.length === 0) {
      onError?.("No participants available");
      return;
    }
    
    // Find the winner index in the current participants
    const normalizedTarget = normalizeTicketNumber(targetTicketNumber);
    const winnerIndex = initialParticipants.findIndex(p => 
      normalizeTicketNumber(p.ticketNumber) === normalizedTarget
    );
    
    if (winnerIndex === -1) {
      onError?.(`Ticket ${targetTicketNumber} not found`);
      return;
    }
    
    // Initialize animation state
    isSpinningRef.current = true;
    hasSwappedRef.current = false;
    startTimeRef.current = performance.now();
    currentPositionRef.current = initialPosition;
    
    // Calculate physics based on actual number of participants
    const wheelCircumference = initialParticipants.length * ITEM_HEIGHT_PX;
    const totalRotations = physics.totalRotations;
    
    // Calculate final position to land on winner at center
    // Winner is at winnerIndex, we want it at viewport center (index 2)
    // Position = (winnerIndex - VIEWPORT_CENTER) * ITEM_HEIGHT_PX
    const winnerOffset = (winnerIndex - VIEWPORT_CENTER) * ITEM_HEIGHT_PX;
    const totalSpinDistance = totalRotations * wheelCircumference;
    
    // Calculate where we want to end up (winner centered)
    const desiredFinalPosition = winnerOffset;
    
    // Calculate how far we need to travel to get there with multiple rotations
    // We want to spin totalRotations times and land at the desired position
    let targetPosition = currentPositionRef.current + totalSpinDistance;
    
    // Adjust to land at the exact winner position
    const currentModulo = targetPosition % wheelCircumference;
    const adjustment = desiredFinalPosition - currentModulo;
    targetPosition += adjustment;
    
    // Ensure we're spinning forward (add a full rotation if needed)
    if (targetPosition <= currentPositionRef.current) {
      targetPosition += wheelCircumference;
    }
    
    console.log('🎯 Animation initialized:', {
      duration: physics.duration,
      totalRotations,
      winnerIndex,
      winnerTicket: initialParticipants[winnerIndex].ticketNumber,
      currentPosition: currentPositionRef.current,
      targetPosition,
      distance: targetPosition - currentPositionRef.current,
      wheelCircumference,
      participantCount: initialParticipants.length
    });
    
    // Animation loop
    const animate = (_currentTime: number) => {
      if (!isSpinningRef.current) return;
      
      // Calculate position with easing
      const distance = targetPosition - currentPositionRef.current;
      const velocity = physics.calculateVelocity(distance);
      
      // Check if animation is complete (either very close or velocity is negligible)
      // Use a larger threshold (1 pixel) and velocity threshold for quicker completion
      const isDistanceComplete = Math.abs(distance) < 1; // Within 1 pixel
      const isVelocityNegligible = Math.abs(velocity) < 0.1; // Very slow movement
      
      if (physics.isComplete(distance) || (isDistanceComplete && isVelocityNegligible)) {
        // Animation complete - snap to exact position
        currentPositionRef.current = targetPosition;
        const displayPosition = currentPositionRef.current % wheelCircumference;
        onPositionUpdateRef.current(displayPosition);
        
        const winner = initialParticipants[winnerIndex];
        
        console.log('✅ Animation complete:', {
          finalPosition: displayPosition,
          winner: winner.ticketNumber,
          finalDistance: distance,
          finalVelocity: velocity
        });
        
        isSpinningRef.current = false;
        animationRef.current = null;
        
        // Immediately trigger winner callback
        onSpinCompleteRef.current(winner);
        return;
      }
      
      // Apply velocity
      currentPositionRef.current += velocity * (16 / 1000); // Normalize to 60fps
      
      // Update display position
      const displayPosition = currentPositionRef.current % wheelCircumference;
      onPositionUpdateRef.current(displayPosition);
      
      // Continue animation
      animationRef.current = requestAnimationFrame(animate);
    };
    
    // Start animation
    animationRef.current = requestAnimationFrame(animate);
  }, [
    initialParticipants,
    targetTicketNumber,
    physics,
    onError,
    initialPosition
  ]);
  
  return {
    spin,
    cancel,
    isSpinning: isSpinningRef.current
  };
}