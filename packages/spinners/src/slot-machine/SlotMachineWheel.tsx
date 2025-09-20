/**
 * SlotMachineWheel Component
 * 
 * Slot machine with precise physics and modular structure
 * Displays exactly 100 participants with dual-array management
 */

import { useState, useEffect } from "react";
import { 
  BaseSpinnerProps, 
  DEFAULT_SPINNER_THEME,
  SpinnerTheme 
} from "../types";
import { WheelCanvas } from "./components/WheelCanvas";
import { useArrayManagement } from "./hooks/useArrayManagement";
import { useSlotMachineAnimation } from "./hooks/useSlotMachineAnimation";
import { SlotMachineSettings } from "./types/slot-machine";
import { SpinDuration, DecelerationSpeed, VIEWPORT_CENTER } from "./constants/physics";
import { CANVAS_WIDTH, CANVAS_HEIGHT, ITEM_HEIGHT_PX } from "./constants/visual";

export interface SlotMachineWheelProps extends BaseSpinnerProps {
  /** Settings with spin duration and deceleration speed */
  settings?: SlotMachineSettings;
  /** Canvas dimensions */
  canvasWidth?: number;
  canvasHeight?: number;
  /** Show debug info */
  showDebug?: boolean;
}


/**
 * Convert theme to internal format
 */
function convertTheme(theme: SpinnerTheme) {
  return {
    colors: {
      primary: "#007BFF",
      secondary: "#FF1493",
      accent: "#FFD700",
      background: theme.canvasBackground || "#09090b",
      foreground: "#fafafa",
      card: "#09090b",
      cardForeground: "#fafafa",
      winner: theme.highlightColor || "#FFD700",
      winnerGlow: theme.highlightColor || "#FFD700",
    },
    spinnerStyle: {
      type: "slotMachine" as const,
      backgroundColor: theme.backgroundColor || "#1a1a1a",
      canvasBackground: theme.canvasBackground || "#09090b",
      borderColor: theme.borderColor || "#FFD700",
      highlightColor: theme.highlightColor || "#FF1493",
      nameColor: theme.nameColor || "#fafafa",
      ticketColor: theme.ticketColor || "#FFD700",
      fontFamily: theme.fontFamily || "system-ui",
      nameSize: theme.nameSize || "large",
      ticketSize: theme.ticketSize || "extra-large",
      topShadowOpacity: theme.topShadowOpacity ?? 0.3,
      bottomShadowOpacity: theme.bottomShadowOpacity ?? 0.3,
      shadowSize: theme.shadowSize ?? 30,
      shadowColor: theme.shadowColor,
    },
    branding: {
      logoPosition: "center" as const,
      showCompanyName: false,
    },
  };
}

/**
 * SlotMachineWheel - Precise physics with dual-array management
 */
export function SlotMachineWheel({
  participants,
  targetTicketNumber = "",
  settings,
  isSpinning,
  onSpinComplete,
  onError,
  theme = DEFAULT_SPINNER_THEME,
  className,
  canvasWidth = CANVAS_WIDTH,
  canvasHeight = CANVAS_HEIGHT,
  showDebug = false,
}: SlotMachineWheelProps) {
  
  // Use default settings if not provided
  const finalSettings = settings || {
    spinDuration: "medium" as SpinDuration,
    decelerationSpeed: "medium" as DecelerationSpeed
  };
  const internalTheme = convertTheme(theme);
  
  // State - position maintains the wheel's current rotation
  // Start with first ticket centered (need negative offset since center is at index 2)
  const initialPosition = -VIEWPORT_CENTER * ITEM_HEIGHT_PX;
  const [position, setPosition] = useState(initialPosition);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Reset position only when participants length changes (new competition selected)
  // Don't reset on same competition to keep winner visible
  useEffect(() => {
    setPosition(initialPosition);
  }, [participants.length, initialPosition]);
  
  // Array management - just get the display subset, no swapping needed
  const {
    displaySubset
  } = useArrayManagement({
    participants,
    targetTicketNumber
  });
  
  // Animation hook
  const { spin, cancel } = useSlotMachineAnimation({
    participants: displaySubset,
    targetTicketNumber,
    spinDuration: finalSettings.spinDuration,
    decelerationSpeed: finalSettings.decelerationSpeed,
    initialPosition: position, // Pass current position to maintain wheel state
    onSpinComplete: (winner) => {
      setIsAnimating(false);
      // Trigger immediately
      onSpinComplete(winner);
    },
    onError: (error) => {
      setIsAnimating(false);
      onError?.(error);
    },
    onPositionUpdate: setPosition
  });
  
  // Handle spin start/stop
  useEffect(() => {
    if (isSpinning && !isAnimating) {
      console.log('🎰 Starting spin for ticket:', targetTicketNumber);
      setIsAnimating(true);
      // Don't reset position or arrays - keep wheel state
      spin();
    } else if (!isSpinning && isAnimating) {
      console.log('🛑 Stopping spin');
      setIsAnimating(false);
      cancel();
    }
  }, [isSpinning, targetTicketNumber]);
  
  return (
    <div className={`relative w-full flex items-center justify-center rounded-lg p-4 ${className || ""}`}>
      <WheelCanvas
        participants={displaySubset}
        position={position}
        theme={internalTheme}
        targetTicketNumber={targetTicketNumber}
        showDebug={showDebug}
        canvasWidth={canvasWidth}
        canvasHeight={canvasHeight}
      />
    </div>
  );
}