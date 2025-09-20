/**
 * Array Helper Functions for Slot Machine
 *
 * Utilities for manipulating participant arrays
 */

import { Participant } from "@raffle-spinner/storage";
import { normalizeTicketNumber } from "@raffle-spinner/utils";
import { SUBSET_SIZE } from "../constants/physics";

/**
 * Sort participants by ticket number
 */
export function sortByTicketNumber(participants: Participant[]): Participant[] {
  return [...participants].sort((a, b) => {
    const aNum = parseInt(a.ticketNumber.replace(/\D/g, "")) || 0;
    const bNum = parseInt(b.ticketNumber.replace(/\D/g, "")) || 0;
    return aNum - bNum;
  });
}

/**
 * Fill array to exactly 100 entries by repeating participants
 */
export function fillToHundred(participants: Participant[]): Participant[] {
  if (participants.length === 0) return [];

  const result = [...participants];
  while (result.length < SUBSET_SIZE) {
    const toAdd = Math.min(participants.length, SUBSET_SIZE - result.length);
    result.push(...participants.slice(0, toAdd));
  }
  return result.slice(0, SUBSET_SIZE);
}

/**
 * Find the index of the winner in the participants array
 */
export function findWinnerIndex(
  participants: Participant[],
  targetTicket: string,
): number {
  const normalizedTarget = normalizeTicketNumber(targetTicket);
  return participants.findIndex(
    (p) => normalizeTicketNumber(p.ticketNumber) === normalizedTarget,
  );
}

/**
 * Create initial display subset with virtual scrolling for large datasets
 */
export function createInitialSubset(
  sortedParticipants: Participant[],
): Participant[] {
  // For small lists, repeat to fill to 100
  if (sortedParticipants.length < SUBSET_SIZE) {
    return fillToHundred(sortedParticipants);
  }

  // For medium lists (100-5000), return all participants
  if (sortedParticipants.length <= 5000) {
    return sortedParticipants;
  }

  // For large lists (>5000), use a sliding window approach
  // We'll virtualize the array by only keeping what we need in memory
  // This prevents memory issues with 100k+ entry raffles

  // Create a virtual representation:
  // Keep first 2500 and last 2500 for smooth wrapping
  // The animation will need to handle loading more as needed
  const windowSize = 2500;
  const firstWindow = sortedParticipants.slice(0, windowSize);
  const lastWindow = sortedParticipants.slice(-windowSize);

  return [...firstWindow, ...lastWindow];
}

/**
 * Create winner-centered subset for slot machine landing
 */
export function createWinnerSubset(
  sortedParticipants: Participant[],
  targetTicket: string,
): Participant[] {
  const winnerIndex = findWinnerIndex(sortedParticipants, targetTicket);

  if (winnerIndex === -1) {
    // Winner not found, return initial subset
    return createInitialSubset(sortedParticipants);
  }

  // For small lists, handle specially
  if (sortedParticipants.length <= SUBSET_SIZE) {
    const filled = fillToHundred(sortedParticipants);

    // Rotate array to place winner at index 0
    const currentWinnerIndex = findWinnerIndex(filled, targetTicket);
    if (currentWinnerIndex === -1 || currentWinnerIndex === 0) {
      return filled;
    }

    // Rotate the array
    return [
      ...filled.slice(currentWinnerIndex),
      ...filled.slice(0, currentWinnerIndex),
    ];
  }

  // For medium lists (100-5000), create subset with winner in view
  if (sortedParticipants.length <= 5000) {
    // Return all participants - they're already in memory
    return sortedParticipants;
  }

  // For large lists (>5000), create a window around the winner
  // This ensures we can display the winner without loading entire array
  const windowSize = 2500;
  const halfWindow = Math.floor(windowSize / 2);

  // Calculate window bounds centered on winner
  const startIdx = winnerIndex - halfWindow;
  const endIdx = winnerIndex + halfWindow;

  // Handle wrap-around for circular array
  if (startIdx < 0) {
    // Include items from end of array
    const wrapCount = Math.abs(startIdx);
    const endSlice = sortedParticipants.slice(-wrapCount);
    const startSlice = sortedParticipants.slice(0, endIdx);
    return [...endSlice, ...startSlice];
  } else if (endIdx > sortedParticipants.length) {
    // Include items from start of array
    const wrapCount = endIdx - sortedParticipants.length;
    const mainSlice = sortedParticipants.slice(startIdx);
    const startSlice = sortedParticipants.slice(0, wrapCount);
    return [...mainSlice, ...startSlice];
  } else {
    // Simple slice, no wrap needed
    return sortedParticipants.slice(startIdx, endIdx);
  }
}
