'use client';

import { useEffect } from 'react';

interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  winner: string;
  winnerGlow: string;
}

interface ThemeApplierProps {
  colors?: ThemeColors;
}

/**
 * Applies theme colors as CSS variables to the document root
 * This enables dynamic theming across the entire application
 */
export function ThemeApplier({ colors }: ThemeApplierProps) {

  useEffect(() => {
    if (!colors) return;

    // Convert hex to RGB for better CSS variable support
    const hexToRgb = (hex: string) => {
      // Remove the # if present
      hex = hex.replace('#', '');
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      return `${r} ${g} ${b}`;
    };

    // Apply theme colors as CSS variables
    const root = document.documentElement;
    
    // Set HSL values for primary (for shadcn/ui compatibility)
    const primaryHsl = hexToHsl(colors.primary);
    root.style.setProperty('--primary', primaryHsl);
    root.style.setProperty('--primary-foreground', '0 0% 100%'); // White text on primary
    
    // Set RGB values for other colors
    root.style.setProperty('--background', hexToRgb(colors.background));
    root.style.setProperty('--foreground', hexToRgb(colors.foreground));
    root.style.setProperty('--card', hexToRgb(colors.card));
    root.style.setProperty('--card-foreground', hexToRgb(colors.cardForeground));
    root.style.setProperty('--secondary', hexToRgb(colors.secondary));
    root.style.setProperty('--accent', hexToRgb(colors.accent));
    
    // Set raw hex values for direct use
    root.style.setProperty('--color-primary', colors.primary);
    root.style.setProperty('--color-secondary', colors.secondary);
    root.style.setProperty('--color-accent', colors.accent);
    root.style.setProperty('--color-background', colors.background);
    root.style.setProperty('--color-foreground', colors.foreground);
    root.style.setProperty('--color-card', colors.card);
    root.style.setProperty('--color-card-foreground', colors.cardForeground);
    root.style.setProperty('--color-winner', colors.winner);
    root.style.setProperty('--color-winner-glow', colors.winnerGlow);
    
    console.log('Applied theme colors to CSS variables:', colors);
  }, [colors]);

  return null;
}

// Helper function to convert hex to HSL (for shadcn/ui)
function hexToHsl(hex: string): string {
  // Remove the # if present
  hex = hex.replace('#', '');
  
  // Convert hex to RGB
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }
  
  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}