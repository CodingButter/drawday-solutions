/**
 * useArrayManagement Hook
 * 
 * Manages the dual array system for the slot machine wheel
 */

import { useState, useCallback, useEffect } from "react";
import { Participant } from "@raffle-spinner/storage";
import { WheelArrays, DisplaySubset } from "../types/slot-machine";
import { 
  sortByTicketNumber, 
  createInitialSubset,
  createWinnerSubset,
  findWinnerIndex
} from "../utils/array-helpers";
import { SUBSET_HALF, SWAP_POINT } from "../constants/physics";

interface UseArrayManagementProps {
  participants: Participant[];
  targetTicketNumber: string;
}

interface UseArrayManagementReturn {
  displaySubset: Participant[];
  arrays: WheelArrays;
  swapForWinner: () => DisplaySubset;
  resetArrays: () => void;
  hasSwapped: boolean;
}

/**
 * Hook for managing the dual array system
 */
export function useArrayManagement({
  participants,
  targetTicketNumber
}: UseArrayManagementProps): UseArrayManagementReturn {
  
  const [arrays, setArrays] = useState<WheelArrays>(() => 
    initializeArrays(participants)
  );
  
  const [displaySubset, setDisplaySubset] = useState<Participant[]>(() => {
    const sorted = sortByTicketNumber(participants);
    return createInitialSubset(sorted);
  });
  
  /**
   * Initialize arrays with first 50 and last 50 participants
   */
  function initializeArrays(participants: Participant[]): WheelArrays {
    const sorted = sortByTicketNumber(participants);
    const initial = createInitialSubset(sorted);
    
    return {
      topArray: initial.slice(0, SUBSET_HALF),
      bottomArray: initial.slice(SUBSET_HALF),
      hasSwapped: false,
      swapPoint: SWAP_POINT
    };
  }
  
  /**
   * Swap arrays to position winner at index 0
   */
  const swapForWinner = useCallback((): DisplaySubset => {
    if (arrays.hasSwapped) {
      // Already swapped, return current state
      return {
        participants: displaySubset,
        winnerIndex: findWinnerIndex(displaySubset, targetTicketNumber)
      };
    }
    
    const sorted = sortByTicketNumber(participants);
    const winnerSubset = createWinnerSubset(sorted, targetTicketNumber);
    const winnerIndex = findWinnerIndex(winnerSubset, targetTicketNumber);
    
    // Update arrays
    const newArrays: WheelArrays = {
      topArray: winnerSubset.slice(0, SUBSET_HALF),
      bottomArray: winnerSubset.slice(SUBSET_HALF),
      hasSwapped: true,
      swapPoint: SWAP_POINT
    };
    
    setArrays(newArrays);
    setDisplaySubset(winnerSubset);
    
    console.log('🔄 Arrays swapped for winner:', {
      targetTicket: targetTicketNumber,
      winnerIndex,
      firstTicket: winnerSubset[0]?.ticketNumber,
      tickets0to4: winnerSubset.slice(0, 5).map(p => p.ticketNumber)
    });
    
    return {
      participants: winnerSubset,
      winnerIndex
    };
  }, [arrays.hasSwapped, displaySubset, participants, targetTicketNumber]);
  
  /**
   * Reset arrays to initial state
   */
  const resetArrays = useCallback(() => {
    const newArrays = initializeArrays(participants);
    const sorted = sortByTicketNumber(participants);
    const initial = createInitialSubset(sorted);
    
    setArrays(newArrays);
    setDisplaySubset(initial);
  }, [participants]);
  
  // Reset when participants change
  useEffect(() => {
    resetArrays();
  }, [participants.length]); // Only reset on length change to avoid unnecessary resets
  
  return {
    displaySubset,
    arrays,
    swapForWinner,
    resetArrays,
    hasSwapped: arrays.hasSwapped
  };
}