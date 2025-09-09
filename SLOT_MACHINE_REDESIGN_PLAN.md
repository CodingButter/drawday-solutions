# Slot Machine Wheel Redesign Implementation Plan

## Executive Summary

This document outlines the comprehensive plan to redesign the slot machine wheel animation system to implement a more mathematically precise and predictable rotation and deceleration system with improved dual-array management.

## Current System Analysis

### Current Implementation

1. **Subset Management**: Uses 100-entry subset (50 first + 50 last participants)
2. **Animation**: Division-based easing with configurable deceleration divisor
3. **Winner Positioning**: Places winner at index 50 after subset swap
4. **Settings**: `minSpinDuration` (seconds) and `decelerationRate` (slow/medium/fast)
5. **Swap Timing**: Occurs at 15% animation progress

### Issues with Current System

1. Winner positioning at index 50 requires complex offset calculations
2. No direct control over rotation speed/count
3. Physics calculations don't follow the circular wheel model precisely
4. Subset swap timing is arbitrary (15% progress)

## New System Requirements

### Core Requirements

1. **Fixed Display**: Always show exactly 100 ticket numbers
2. **Circular Mathematics**: Use circumference = 2πr where r = 50 units
3. **User Controls**:
   - Spin Duration: short/medium/long (controls total rotations at constant max speed)
   - Deceleration Speed: slow/medium/fast (controls easing)
4. **Dual Array System**:
   - Array 1: First 50 tickets
   - Array 2: Last 50 tickets
   - Swap at 50% of total rotations
5. **Winner Positioning**: Winner at index 0 after swap (simpler math)
6. **Edge Cases**:
   - Handle < 100 participants (repeat to fill)
   - Handle winners at boundary positions
   - Handle very small participant lists

## Code Organization Principles

### File Size Limit

**CRITICAL**: No single file should exceed 200 lines of code. This ensures:

- Better readability and maintainability
- Easier testing and debugging
- Clear separation of concerns
- Faster code reviews

### Proposed File Structure

```
packages/spinners/src/slot-machine/
├── SlotMachineWheel.tsx              (< 150 lines - Main component)
├── constants/
│   ├── physics.ts                    (< 50 lines - Physics constants)
│   └── visual.ts                     (< 50 lines - Visual constants)
├── hooks/
│   ├── useSlotMachineAnimation.ts    (< 150 lines - Animation hook)
│   ├── useArrayManagement.ts         (< 100 lines - Array swap logic)
│   └── useWheelPhysics.ts           (< 100 lines - Physics calculations)
├── utils/
│   ├── array-helpers.ts              (< 100 lines - Array manipulation)
│   ├── position-calculator.ts        (< 100 lines - Position math)
│   └── winner-positioning.ts         (< 100 lines - Winner placement)
├── components/
│   ├── SlotMachineFrame.tsx         (existing, already < 200 lines)
│   ├── SlotMachineSegment.tsx       (existing, already < 200 lines)
│   └── WheelCanvas.tsx              (< 150 lines - Canvas rendering)
└── types/
    └── slot-machine.ts              (< 100 lines - Type definitions)
```

## Implementation Strategy

### Phase 1: Mathematical Foundation (Breaking Down Large Files)

#### Current Problem

The current `SlotMachineWheel.tsx` is 717 lines - way too large! We need to break it down.

#### Refactored Structure

##### File: `constants/physics.ts` (< 50 lines)

```javascript
// Constants
const WHEEL_RADIUS = 50; // units
const TICKETS_COUNT = 100; // always 100 visible
const CIRCUMFERENCE = 2 * Math.PI * WHEEL_RADIUS; // ~314.159 units
const UNIT_ANGLE = (2 * Math.PI) / TICKETS_COUNT; // radians per ticket
const ITEM_HEIGHT = CIRCUMFERENCE / TICKETS_COUNT; // ~3.14159 units per ticket
const MAX_ROTATION_SPEED = 5; // Constant max rotations per second

export const SPIN_DURATIONS = {
  short: 2, // 2 seconds (10 rotations at max speed)
  medium: 3, // 3 seconds (15 rotations at max speed)
  long: 5, // 5 seconds (25 rotations at max speed)
};

export const DECELERATION_RATES = {
  slow: 0.95, // Gradual slowdown
  medium: 0.9, // Moderate slowdown
  fast: 0.85, // Quick stop
};
```

##### File: `utils/position-calculator.ts` (< 100 lines)

```javascript
import { UNIT_ANGLE, WHEEL_RADIUS, ITEM_HEIGHT } from '../constants/physics';

export function getTicketPosition(index: number, rotation: number) {
  const angle = (index * UNIT_ANGLE) + rotation;
  return {
    x: WHEEL_RADIUS * Math.cos(angle),
    y: WHEEL_RADIUS * Math.sin(angle)
  };
}

export function calculateWheelPosition(
  topIndex: number,
  pixelOffset: number,
  subsetLength: number
) {
  const normalizedPos = (topIndex * ITEM_HEIGHT) + pixelOffset;
  return normalizedPos % (subsetLength * ITEM_HEIGHT);
}

export function getCenterParticipantIndex(
  topIndex: number,
  subsetLength: number
): number {
  return (topIndex + 2) % subsetLength; // Center is 2 items down
}
```

##### File: `hooks/useWheelPhysics.ts` (< 100 lines)

```javascript
import {
  MAX_ROTATION_SPEED,
  SPIN_DURATIONS,
  DECELERATION_RATES,
  ITEM_HEIGHT
} from '../constants/physics';

interface PhysicsState {
  totalRotations: number;
  spinDuration: number;
  currentRotation: number;
  targetRotation: number;
  velocity: number;
  maxVelocity: number;
  decelerationFactor: number;
}

export function useWheelPhysics(
  spinDuration: keyof typeof SPIN_DURATIONS,
  decelerationSpeed: keyof typeof DECELERATION_RATES
) {
  const duration = SPIN_DURATIONS[spinDuration];
  const totalRotations = duration * MAX_ROTATION_SPEED;
  const decelerationFactor = DECELERATION_RATES[decelerationSpeed];

  const calculateVelocity = (distance: number): number => {
    const velocity = distance * decelerationFactor;
    const minVelocity = Math.abs(distance) > 500 ? 20 :
                       Math.abs(distance) > 100 ? 5 :
                       Math.abs(distance) > 10 ? 0.5 : 0.05;

    return Math.abs(velocity) < minVelocity ?
      (velocity > 0 ? minVelocity : -minVelocity) : velocity;
  };

  return {
    duration,
    totalRotations,
    decelerationFactor,
    calculateVelocity
  };
}
```

### Phase 2: Dual Array Management (Separated into Small Files)

##### File: `types/slot-machine.ts` (< 100 lines)

```typescript
export interface WheelArrays {
  topArray: Participant[]; // 50 tickets currently in top half
  bottomArray: Participant[]; // 50 tickets currently in bottom half
  hasSwapped: boolean;
  swapPoint: number; // 50% of totalRotations
}

export interface AnimationState {
  isSpinning: boolean;
  currentPosition: number;
  targetPosition: number;
  startTime: number;
}
```

##### File: `utils/array-helpers.ts` (< 100 lines)

```javascript
import { Participant } from '@raffle-spinner/storage';

export function sortByTicketNumber(participants: Participant[]): Participant[] {
  return [...participants].sort((a, b) => {
    const aNum = parseInt(a.ticketNumber.replace(/\D/g, "")) || 0;
    const bNum = parseInt(b.ticketNumber.replace(/\D/g, "")) || 0;
    return aNum - bNum;
  });
}

export function fillToHundred(participants: Participant[]): Participant[] {
  const result = [...participants];
  while (result.length < 100) {
    const toAdd = Math.min(participants.length, 100 - result.length);
    result.push(...participants.slice(0, toAdd));
  }
  return result;
}

export function findWinnerIndex(
  participants: Participant[],
  targetTicket: string
): number {
  return participants.findIndex(p =>
    p.ticketNumber === targetTicket
  );
}
```

##### File: `hooks/useArrayManagement.ts` (< 100 lines)

```javascript
import { useState, useCallback } from 'react';
import { Participant } from '@raffle-spinner/storage';
import { WheelArrays } from '../types/slot-machine';
import {
  sortByTicketNumber,
  fillToHundred,
  findWinnerIndex
} from '../utils/array-helpers';

export function useArrayManagement(participants: Participant[]) {
  const [arrays, setArrays] = useState<WheelArrays>(() =>
    initializeArrays(participants)
  );

  const initializeArrays = (participants: Participant[]): WheelArrays => {
    const sorted = sortByTicketNumber(participants);

    if (sorted.length <= 100) {
      const filled = fillToHundred(sorted);
      return {
        topArray: filled.slice(0, 50),
        bottomArray: filled.slice(50, 100),
        hasSwapped: false,
        swapPoint: 0.5
      };
    }

    return {
      topArray: sorted.slice(0, 50),
      bottomArray: sorted.slice(-50),
      hasSwapped: false,
      swapPoint: 0.5
    };
  };

  const swapForWinner = useCallback((targetTicket: string) => {
    const sorted = sortByTicketNumber(participants);
    const winnerIndex = findWinnerIndex(sorted, targetTicket);

    if (winnerIndex === -1) return arrays;

    // Position winner at index 0
    const newArrays = createWinnerArrays(sorted, winnerIndex);
    setArrays(newArrays);
    return newArrays;
  }, [participants, arrays]);

  return { arrays, swapForWinner, initializeArrays };
}
```

### Phase 3: Animation System

#### New Animation Hook

```javascript
function useSlotMachineAnimationV2({
  participants,
  targetTicketNumber,
  spinDuration,      // NEW: replaces minSpinDuration (short/medium/long)
  decelerationSpeed, // RENAMED: was decelerationRate
  onSpinComplete,
  onError
}) {
  // Calculate physics
  const duration = SPIN_DURATIONS[spinDuration]; // seconds
  const totalRotations = duration * MAX_ROTATION_SPEED;
  const decelerationFactor = DECELERATION_RATES[decelerationSpeed];
  const wheelCircumference = TICKETS_COUNT * ITEM_HEIGHT;

  // Initialize arrays
  const [arrays, setArrays] = useState(() => initializeArrays(participants));

  // Animation loop
  function animate(timestamp: number) {
    const progress = currentRotation / totalRotations;

    // Swap at 50% progress
    if (!arrays.hasSwapped && progress >= 0.5) {
      const newArrays = swapArraysForWinner(arrays, targetTicketNumber, participants);
      setArrays(newArrays);

      // Recalculate target position with winner at index 0
      targetRotation = remainingRotations * wheelCircumference;
    }

    // Apply easing
    const distance = targetRotation - currentRotation;
    const velocity = distance * decelerationFactor;
    currentRotation += Math.max(velocity, MIN_VELOCITY);

    // Check completion
    if (Math.abs(distance) < 0.01) {
      // Winner is at index 0, which should be at center
      const centerOffset = 2; // Visual center is 2 items down
      const finalPosition = centerOffset * ITEM_HEIGHT;
      onSpinComplete(arrays.topArray[0]); // Winner is at index 0
    }
  }
}
```

### Phase 4: Settings UI Update

#### New Settings Interface

```typescript
interface SpinnerSettingsV2 {
  spinDuration: "short" | "medium" | "long"; // NEW: replaces minSpinDuration
  decelerationSpeed: "slow" | "medium" | "fast"; // RENAMED from decelerationRate
}
```

#### Updated Settings Component

```jsx
<Card>
  <CardHeader>
    <CardTitle>Spinner Physics Settings</CardTitle>
  </CardHeader>
  <CardContent>
    {/* Spin Duration Control */}
    <div className="space-y-2">
      <Label>Spin Duration</Label>
      <Select value={settings.spinDuration} onValueChange={updateSpinDuration}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="short">Short (2 seconds)</SelectItem>
          <SelectItem value="medium">Medium (3 seconds)</SelectItem>
          <SelectItem value="long">Long (5 seconds)</SelectItem>
        </SelectContent>
      </Select>
      <p className="text-xs text-muted-foreground">
        Controls how long the wheel spins at maximum speed
      </p>
    </div>

    {/* Deceleration Speed Control */}
    <div className="space-y-2">
      <Label>Deceleration Speed</Label>
      <Select
        value={settings.decelerationSpeed}
        onValueChange={updateDecelerationSpeed}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="slow">Slow (Gradual stop)</SelectItem>
          <SelectItem value="medium">Medium (Balanced)</SelectItem>
          <SelectItem value="fast">Fast (Quick stop)</SelectItem>
        </SelectContent>
      </Select>
      <p className="text-xs text-muted-foreground">
        How quickly the wheel slows down after reaching max speed
      </p>
    </div>
  </CardContent>
</Card>
```

## Migration Strategy

### Database/Storage Migration

```javascript
// Migration function for existing settings
function migrateSettings(oldSettings: OldSpinnerSettings): SpinnerSettingsV2 {
  return {
    // Map minSpinDuration to spinDuration
    spinDuration: oldSettings.minSpinDuration <= 2 ? 'short' :
                  oldSettings.minSpinDuration <= 4 ? 'medium' : 'long',

    // Keep decelerationRate as decelerationSpeed
    decelerationSpeed: oldSettings.decelerationRate
  };
}
```

### Backward Compatibility

- Detect old settings format and auto-migrate
- Preserve user preferences where possible
- Default new users to medium/medium

## Testing Plan

### Unit Tests

1. **Position Calculations**
   - Verify circumference math
   - Test ticket positioning at various rotations
   - Validate center alignment

2. **Array Management**
   - Test initial array creation
   - Verify swap at 50% progress
   - Confirm winner at index 0 after swap
   - Test edge cases (< 100 participants)

3. **Animation Physics**
   - Test rotation counts for each speed
   - Verify deceleration curves
   - Confirm final positioning accuracy

### Integration Tests

1. **Full Animation Cycle**
   - Start → Accelerate → Swap → Decelerate → Stop
   - Verify winner is centered
   - Test with various participant counts

2. **Settings Persistence**
   - Save/load new settings format
   - Migration from old format
   - Cross-browser compatibility

### Edge Cases

1. **Small Lists** (< 100 participants)
   - 1 participant (extreme case)
   - 50 participants (half full)
   - 99 participants (nearly full)

2. **Boundary Winners**
   - First participant wins
   - Last participant wins
   - Middle participant wins

3. **Large Lists** (> 5000 participants)
   - Performance remains at 60fps
   - Memory usage acceptable
   - Swap happens smoothly

## Implementation Timeline

### Week 1: Foundation

- [ ] Create feature branch `feature/slot-machine-physics-v2`
- [ ] Implement new position calculation system
- [ ] Update types and interfaces
- [ ] Write unit tests for math functions

### Week 2: Core Logic

- [ ] Implement dual array management
- [ ] Create new animation hook
- [ ] Update SlotMachineWheel component
- [ ] Integration testing

### Week 3: UI & Polish

- [ ] Update settings UI components
- [ ] Implement settings migration
- [ ] Add visual debugging tools
- [ ] Performance optimization

### Week 4: Testing & Release

- [ ] Comprehensive testing
- [ ] Bug fixes
- [ ] Documentation update
- [ ] Merge to development branch

## Risk Assessment

### Technical Risks

1. **Performance Impact**: New calculations might affect FPS
   - Mitigation: Profile and optimize hot paths
2. **Visual Artifacts**: Array swap might cause flicker
   - Mitigation: Smooth transition, preload assets

3. **Settings Migration**: Users might lose preferences
   - Mitigation: Careful migration logic, backup old settings

### User Experience Risks

1. **Learning Curve**: New settings might confuse users
   - Mitigation: Clear labels, helpful tooltips
2. **Different Behavior**: Animation might feel different
   - Mitigation: A/B testing, gather feedback

## Success Criteria

1. **Functional Requirements**
   - [ ] Wheel always displays exactly 100 tickets
   - [ ] Winner lands precisely at center
   - [ ] Settings control animation as specified
   - [ ] Arrays swap at 50% progress

2. **Performance Requirements**
   - [ ] Maintains 60fps with 5000+ participants
   - [ ] Smooth animation without stutters
   - [ ] Quick response to user input

3. **Quality Requirements**
   - [ ] All tests passing
   - [ ] No regression in existing features
   - [ ] Clean, maintainable code
   - [ ] Comprehensive documentation

## Appendix

### Mathematical Proofs

#### Circumference Calculation

```
Given: r = 50 units, tickets = 100
Circumference = 2πr = 2π(50) = 100π ≈ 314.159 units
Item Height = Circumference / tickets = 100π / 100 = π ≈ 3.14159 units
```

#### Easing Formula

```
newPosition = currentPosition + (targetPosition - currentPosition) * decelerationFactor
As decelerationFactor < 1, position asymptotically approaches target
```

### Visual Diagrams

```
Initial State (0-99):
[0-49]    <- Top Array
[50-99]   <- Bottom Array

After Swap (Winner at 75):
[75-124]  <- Top Array (winner at index 0)
[25-74]   <- Bottom Array

Final Position:
Center -> [75] <- WINNER
          [76]
          [77]
          ...
```

### Code References

- Main Component: `/packages/spinners/src/slot-machine/SlotMachineWheel.tsx`
- Animation Hook: `/packages/spinners/src/slot-machine/hooks/useSlotMachineAnimation.ts`
- Settings UI: `/apps/extension/src/components/options/SpinnerSettings.tsx`
- Types: `/packages/types/src/index.ts`

---

This plan provides a comprehensive roadmap for implementing the new slot machine physics system. The focus is on mathematical precision, predictable behavior, and maintaining excellent performance while improving the user experience.
