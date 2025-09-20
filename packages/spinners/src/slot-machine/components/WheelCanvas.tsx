/**
 * WheelCanvas Component
 * 
 * Handles canvas rendering for the slot machine wheel
 */

import React, { useRef, useEffect, useCallback } from "react";
import { Participant } from "@raffle-spinner/storage";
import { 
  CANVAS_WIDTH, 
  CANVAS_HEIGHT,
  WHEEL_WIDTH,
  ITEM_HEIGHT_PX,
  VISIBLE_ITEMS,
  VIEWPORT_HEIGHT,
  PERSPECTIVE_SCALE
} from "../constants/visual";
import { calculateWheelPosition } from "../utils/position-calculator";
import { drawSlotMachineSegment } from "./SlotMachineSegment";
import { drawSlotMachineFrame } from "./SlotMachineFrame";

interface WheelCanvasProps {
  participants: Participant[];
  position: number;
  theme: any; // Theme type from parent
  targetTicketNumber?: string;
  showDebug?: boolean;
  canvasWidth?: number;
  canvasHeight?: number;
}

/**
 * Canvas component for rendering the slot machine wheel
 */
export const WheelCanvas: React.FC<WheelCanvasProps> = ({
  participants,
  position,
  theme,
  targetTicketNumber,
  showDebug = false,
  canvasWidth = CANVAS_WIDTH,
  canvasHeight = CANVAS_HEIGHT
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  /**
   * Draw the wheel at the current position
   */
  const drawWheel = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || participants.length === 0) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    
    // Draw background
    const bgColor = theme?.spinnerStyle?.canvasBackground || "#09090b";
    const bgGradient = ctx.createLinearGradient(0, 0, 0, canvasHeight);
    bgGradient.addColorStop(0, adjustBrightness(bgColor, -20));
    bgGradient.addColorStop(0.5, bgColor);
    bgGradient.addColorStop(1, adjustBrightness(bgColor, -20));
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    
    // Calculate wheel position
    const wheelPos = calculateWheelPosition(position, participants.length);
    
    // Draw participants
    for (let i = -2; i <= VISIBLE_ITEMS + 2; i++) {
      let participantIndex = (wheelPos.topParticipantIndex + i) % participants.length;
      if (participantIndex < 0) {
        participantIndex += participants.length;
      }
      
      const participant = participants[participantIndex];
      const yPosition = i * ITEM_HEIGHT_PX - wheelPos.pixelOffset + 40;
      
      // Draw segment
      drawSlotMachineSegment({
        participant,
        yPos: yPosition,
        itemIndex: participantIndex,
        itemHeight: ITEM_HEIGHT_PX,
        viewportHeight: VIEWPORT_HEIGHT,
        wheelWidth: WHEEL_WIDTH,
        canvasWidth,
        perspectiveScale: PERSPECTIVE_SCALE,
        ctx,
        theme,
      });
      
      // Debug info
      if (showDebug && i === 2) {
        ctx.save();
        ctx.fillStyle = "rgba(255, 0, 0, 0.8)";
        ctx.font = "10px monospace";
        ctx.fillText("← CENTER", 140, yPosition + ITEM_HEIGHT_PX / 2);
        if (participant?.ticketNumber === targetTicketNumber) {
          ctx.fillStyle = "rgba(0, 255, 0, 0.8)";
          ctx.fillText("✓ WINNER", 200, yPosition + ITEM_HEIGHT_PX / 2);
        }
        ctx.restore();
      }
    }
    
    // Draw frame
    drawSlotMachineFrame({
      ctx,
      canvasWidth,
      viewportHeight: VIEWPORT_HEIGHT,
      theme,
    });
    
    // Draw shadows
    drawShadows(ctx, canvasWidth, canvasHeight, theme);
  }, [participants, position, theme, targetTicketNumber, showDebug, canvasWidth, canvasHeight]);
  
  // Redraw when position or participants change
  useEffect(() => {
    drawWheel();
  }, [drawWheel]);
  
  return (
    <canvas
      ref={canvasRef}
      width={canvasWidth}
      height={canvasHeight}
      className="max-w-full h-auto rounded-lg shadow-2xl"
      style={{ imageRendering: "crisp-edges" }}
    />
  );
};

/**
 * Helper function to adjust color brightness
 */
function adjustBrightness(color: string, percent: number): string {
  if (color.startsWith("#")) {
    const num = parseInt(color.replace("#", ""), 16);
    const r = Math.max(0, Math.min(255, ((num >> 16) & 255) + percent));
    const g = Math.max(0, Math.min(255, ((num >> 8) & 255) + percent));
    const b = Math.max(0, Math.min(255, (num & 255) + percent));
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
  }
  return color;
}

/**
 * Draw shadow overlays
 */
function drawShadows(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  theme: any
) {
  const topOpacity = theme?.spinnerStyle?.topShadowOpacity ?? 0.3;
  const bottomOpacity = theme?.spinnerStyle?.bottomShadowOpacity ?? 0.3;
  const shadowSize = (theme?.spinnerStyle?.shadowSize ?? 30) / 100;
  const shadowColor = theme?.spinnerStyle?.shadowColor || "#1a1a1a";
  
  const rgb = hexToRgb(shadowColor);
  
  // Top shadow
  if (topOpacity > 0) {
    const topHeight = height * shadowSize;
    const topGradient = ctx.createLinearGradient(0, 0, 0, topHeight);
    topGradient.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${topOpacity})`);
    topGradient.addColorStop(1, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0)`);
    ctx.fillStyle = topGradient;
    ctx.fillRect(0, 0, width, topHeight);
  }
  
  // Bottom shadow
  if (bottomOpacity > 0) {
    const bottomHeight = height * shadowSize;
    const bottomStart = height - bottomHeight;
    const bottomGradient = ctx.createLinearGradient(0, bottomStart, 0, height);
    bottomGradient.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0)`);
    bottomGradient.addColorStop(1, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${bottomOpacity})`);
    ctx.fillStyle = bottomGradient;
    ctx.fillRect(0, bottomStart, width, bottomHeight);
  }
}

/**
 * Convert hex color to RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 26, g: 26, b: 26 };
}