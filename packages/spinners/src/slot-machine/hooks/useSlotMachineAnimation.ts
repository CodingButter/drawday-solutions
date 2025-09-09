/**
 * useSlotMachineAnimation Hook
 *
 * Manages the animation logic for the slot machine spinner,
 * including physics calculations and subset swapping.
 */

import { useCallback, useRef, useEffect } from "react";
import { Participant, SpinnerSettings } from "@raffle-spinner/storage";
import { normalizeTicketNumber } from "@raffle-spinner/utils";

interface AnimationOptions {
  participants: Participant[];
  targetTicketNumber: string;
  settings?: SpinnerSettings;
  onSpinComplete: (winner: Participant) => void;
  onError?: (error: string) => void;
  onPositionUpdate: (position: number) => void;
  getParticipants?: () => Participant[];
  onMaxVelocity?: () => number;
  itemHeight?: number;
}

interface AnimationControls {
  spin: () => void;
  cancel: () => void;
}

// Animation constants
const ITEM_HEIGHT = 80;

export function useSlotMachineAnimation({
  participants: initialParticipants,
  targetTicketNumber,
  settings,
  onSpinComplete,
  onError,
  onPositionUpdate,
  getParticipants,
  onMaxVelocity,
  itemHeight = ITEM_HEIGHT,
}: AnimationOptions): AnimationControls {
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const isSpinningRef = useRef(false);
  
  // Store callbacks in refs to avoid dependency issues
  const onSpinCompleteRef = useRef(onSpinComplete);
  const onPositionUpdateRef = useRef(onPositionUpdate);
  
  useEffect(() => {
    onSpinCompleteRef.current = onSpinComplete;
    onPositionUpdateRef.current = onPositionUpdate;
  }, [onSpinComplete, onPositionUpdate]);

  /**
   * Find the winner participant by ticket number
   */
  const findWinner = useCallback(
    (searchParticipants: Participant[]): Participant | undefined => {
      const normalizedTarget = normalizeTicketNumber(targetTicketNumber);
      return searchParticipants.find(
        (p) => normalizeTicketNumber(p.ticketNumber) === normalizedTarget,
      );
    },
    [targetTicketNumber],
  );

  /**
   * Cancel any ongoing animation
   */
  const cancel = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    isSpinningRef.current = false;
  }, []);

  /**
   * Start the spin animation
   */
  const spin = useCallback(() => {
    console.log('useSlotMachineAnimation: spin() called');
    // Prevent multiple simultaneous spins
    if (isSpinningRef.current) {
      console.log('useSlotMachineAnimation: Already spinning, returning');
      return;
    }

    // Get current participants (initial subset)
    const currentParticipants = getParticipants
      ? getParticipants()
      : initialParticipants;

    console.log('useSlotMachineAnimation: Initial participants count:', currentParticipants.length);

    if (currentParticipants.length === 0) {
      console.error('useSlotMachineAnimation: No participants available');
      onError?.("No participants available");
      return;
    }
    
    // Trigger subset swap immediately to get winner subset
    // This ensures we know the exact winner position before calculating physics
    let winnerSubset = currentParticipants;
    let actualWinnerIndex = -1;
    
    if (onMaxVelocity) {
      // Swap to winner subset right away
      const swapResult = onMaxVelocity();
      console.log('Pre-spin subset swap, winner index:', swapResult);
      
      if (getParticipants) {
        winnerSubset = getParticipants();
        actualWinnerIndex = winnerSubset.findIndex(
          p => normalizeTicketNumber(p.ticketNumber) === normalizeTicketNumber(targetTicketNumber)
        );
        console.log('Winner found at index:', actualWinnerIndex, 'in subset of', winnerSubset.length);
      }
    }
    
    // Find the winner
    const winner = findWinner(winnerSubset);
    if (!winner) {
      console.error('Winner not found in subset!');
      onError?.(`Ticket ${targetTicketNumber} not found`);
      return;
    }
    
    // If we couldn't find the winner index, try again
    if (actualWinnerIndex === -1) {
      actualWinnerIndex = winnerSubset.findIndex(
        p => normalizeTicketNumber(p.ticketNumber) === normalizeTicketNumber(targetTicketNumber)
      );
    }
    
    if (actualWinnerIndex === -1) {
      console.error('Could not find winner index in subset');
      onError?.('Could not position winner correctly');
      return;
    }

    // Physics constants based on actual winner position
    const MAX_ROTATION_SPEED = 3; // Max rotations per second
    const wheelCircumference = winnerSubset.length * itemHeight;
    
    // Calculate the exact final resting position based on actual winner index
    // The center position is at index 2 (0-based, with 5 visible items)
    const viewportCenter = 2 * itemHeight; // Index 2 is the center
    const finalRestingPosition = actualWinnerIndex * itemHeight - viewportCenter;
    
    console.log('Animation physics:', {
      targetTicket: targetTicketNumber,
      actualWinnerIndex,
      wheelCircumference,
      itemHeight,
      viewportCenter,
      finalRestingPosition
    });
    
    // Get user settings
    const duration = (settings?.minSpinDuration || 3) * 1000; // Convert to ms
    
    // Deceleration divisor - lower values = faster deceleration
    const decelerationDivisor = settings?.decelerationRate === 'slow' ? 15 : 
                                settings?.decelerationRate === 'fast' ? 5 : 10;
    
    // Calculate total rotations based on duration and max speed
    // Start with base rotations at max speed
    const baseRotations = MAX_ROTATION_SPEED * (duration / 1000);
    
    // Add some extra rotations for natural feel (minimum 3 full rotations)
    const totalRotations = Math.max(3, Math.floor(baseRotations * 0.8)) + Math.random() * 0.5;
    
    // Calculate exact target position (in total pixels traveled)
    // This ensures we land exactly on index 50
    const targetPosition = totalRotations * wheelCircumference + finalRestingPosition;

    const physics = {
      duration,
      targetPosition,
      currentPosition: 0,
      finalRestingPosition,
      rotationSpeed: MAX_ROTATION_SPEED * wheelCircumference, // pixels per second
      decelerationDivisor,
      wheelCircumference,
    };

    // Track animation state
    isSpinningRef.current = true;
    startTimeRef.current = performance.now();
    let currentPosition = 0;
    let lastTimestamp = performance.now();
    
    console.log('useSlotMachineAnimation: Starting animation with physics:', physics);

    // Animation loop using division-based easing
    const animate = (currentTime: number) => {
      if (!isSpinningRef.current) {
        console.log('useSlotMachineAnimation: Animation cancelled');
        return;
      }

      const deltaTime = currentTime - lastTimestamp;
      lastTimestamp = currentTime;

      // Calculate position using division-based easing
      // This gradually pulls current position closer to target position
      const remainingDistance = physics.targetPosition - currentPosition;
      
      // Check if we're close enough to stop
      if (Math.abs(remainingDistance) < 0.5) {
        // Animation complete - we're at the target
        currentPosition = physics.targetPosition;
        
        // Calculate final display position
        const displayPosition = currentPosition % physics.wheelCircumference;
        onPositionUpdateRef.current(displayPosition);
        
        // Animation complete
        console.log('Animation complete:', {
          finalPosition: displayPosition,
          targetPosition: physics.targetPosition,
          winner: winner?.ticketNumber,
          targetTicket: targetTicketNumber
        });
        
        isSpinningRef.current = false;
        animationRef.current = null;
        onSpinCompleteRef.current(winner);
        return;
      }
      
      // Apply division-based easing to gradually approach target
      // The divisor controls deceleration rate (smaller = faster deceleration)
      const velocity = remainingDistance / physics.decelerationDivisor;
      
      // Ensure minimum velocity for smooth animation until very close to target
      const minVelocity = Math.abs(remainingDistance) > 100 ? 10 : 1;
      const actualVelocity = Math.abs(velocity) < minVelocity ? 
        (velocity > 0 ? minVelocity : -minVelocity) : velocity;
      
      // Update position based on velocity and frame time
      currentPosition += actualVelocity * (deltaTime / 16); // Normalize to 60fps
      
      // Calculate display position (wrap to current rotation)
      const displayPosition = currentPosition % physics.wheelCircumference;
      onPositionUpdateRef.current(displayPosition);

      // Continue animation
      animationRef.current = requestAnimationFrame(animate);
    };

    // Start animation
    console.log('useSlotMachineAnimation: Starting requestAnimationFrame');
    animationRef.current = requestAnimationFrame(animate);
  }, [
    initialParticipants,
    targetTicketNumber,
    settings,
    findWinner,
    onSpinComplete,
    onError,
    onPositionUpdate,
    getParticipants,
    onMaxVelocity,
    itemHeight,
  ]);

  return {
    spin,
    cancel,
  };
}
