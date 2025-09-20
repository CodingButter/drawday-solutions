/**
 * Delete Confirmation Dialog Component
 *
 * Purpose: Modal dialog to confirm deletion of competitions with clear
 * messaging and cancel/confirm actions.
 *
 * SRS Reference:
 * - FR-1.6: Competition Management (deletion with confirmation)
 */

import React, { useEffect } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@raffle-spinner/ui';
import type { Competition } from '@/contexts';

interface DeleteConfirmDialogProps {
  open: boolean;
  competition: Competition | null;
  onConfirm: () => void;
  onCancel: () => void;
  isClearAll?: boolean;
}

export function DeleteConfirmDialog({
  open,
  competition,
  onConfirm,
  onCancel,
  isClearAll = false,
}: DeleteConfirmDialogProps) {
  
  // Use effect to debug state changes and cleanup
  useEffect(() => {
    
    // Cleanup on unmount or when dialog closes
    return () => {
      // Remove any lingering body styles that prevent scrolling
      document.body.style.pointerEvents = '';
      document.body.style.overflow = '';
    };
  }, [open, competition]);
  
  // Inject critical styles for dialog positioning
  React.useEffect(() => {
    if (open) {
      const styleId = 'delete-dialog-fix-styles';
      let styleEl = document.getElementById(styleId) as HTMLStyleElement;
      
      if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = styleId;
        styleEl.innerHTML = `
          /* Overlay backdrop */
          [data-radix-dialog-overlay], 
          [data-radix-alert-dialog-overlay],
          [data-state="open"] + [data-radix-presence-slot] {
            position: fixed !important;
            inset: 0 !important;
            z-index: 9998 !important;
            background: rgba(0, 0, 0, 0.8) !important;
            backdrop-filter: blur(4px) !important;
            animation: fadeIn 0.15s ease-out !important;
          }
          
          /* Main dialog container */
          [role="alertdialog"] {
            position: fixed !important;
            left: 50% !important;
            top: 50% !important;
            transform: translate(-50%, -50%) !important;
            z-index: 9999 !important;
            background: #1e293b !important;
            border: 1px solid rgba(255, 255, 255, 0.1) !important;
            border-radius: 1rem !important;
            padding: 1.75rem !important;
            max-width: 28rem !important;
            width: calc(100% - 2rem) !important;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5) !important;
            animation: dialogSlideIn 0.2s ease-out !important;
          }
          
          /* Title styling */
          [role="alertdialog"] h2 {
            color: #f8fafc !important;
            font-size: 1.25rem !important;
            font-weight: 600 !important;
            margin-bottom: 0.75rem !important;
          }
          
          /* Description text */
          [role="alertdialog"] .text-sm {
            color: rgba(248, 250, 252, 0.7) !important;
            line-height: 1.5 !important;
          }
          
          /* Strong text emphasis */
          [role="alertdialog"] strong {
            color: #fbbf24 !important;
            font-weight: 600 !important;
          }
          
          /* Footer button container */
          [role="alertdialog"] > div:last-child {
            display: flex !important;
            gap: 0.75rem !important;
            justify-content: flex-end !important;
            margin-top: 1.5rem !important;
            padding-top: 1.5rem !important;
            border-top: 1px solid rgba(255, 255, 255, 0.1) !important;
          }
          
          /* Cancel button */
          [role="alertdialog"] button:first-of-type {
            padding: 0.5rem 1rem !important;
            background: transparent !important;
            border: 1px solid rgba(255, 255, 255, 0.2) !important;
            color: #cbd5e1 !important;
            border-radius: 0.5rem !important;
            font-weight: 500 !important;
            transition: all 0.2s !important;
            cursor: pointer !important;
          }
          
          [role="alertdialog"] button:first-of-type:hover {
            background: rgba(255, 255, 255, 0.05) !important;
            border-color: rgba(255, 255, 255, 0.3) !important;
            color: #f8fafc !important;
          }
          
          /* Delete button */
          [role="alertdialog"] button:last-of-type {
            padding: 0.5rem 1rem !important;
            background: #dc2626 !important;
            border: 1px solid #dc2626 !important;
            color: white !important;
            border-radius: 0.5rem !important;
            font-weight: 500 !important;
            transition: all 0.2s !important;
            cursor: pointer !important;
          }
          
          [role="alertdialog"] button:last-of-type:hover {
            background: #b91c1c !important;
            border-color: #b91c1c !important;
            box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3) !important;
          }
          
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
          
          @keyframes dialogSlideIn {
            from {
              opacity: 0;
              transform: translate(-50%, -48%) scale(0.96);
            }
            to {
              opacity: 1;
              transform: translate(-50%, -50%) scale(1);
            }
          }
        `;
        document.head.appendChild(styleEl);
      }
      
      return () => {
        // Clean up on unmount
        if (styleEl && styleEl.parentNode) {
          styleEl.parentNode.removeChild(styleEl);
        }
      };
    }
  }, [open]);
  
  return (
    <>
      <AlertDialog open={open} onOpenChange={(isOpen) => {
        if (!isOpen) {
          onCancel();
        }
      }}>
        <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{isClearAll ? 'Clear All Competitions?' : 'Delete Competition?'}</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-2">
              <div>
                {isClearAll ? (
                  <>Are you sure you want to delete <strong>all competitions</strong>?</>
                ) : (
                  <>
                    Are you sure you want to delete{' '}
                    <strong>{competition ? competition.name : 'this competition'}</strong>?
                  </>
                )}
              </div>
              <div className="text-sm">
                {isClearAll ? (
                  <>This will permanently remove all competitions and their participants. This action cannot be undone.</>
                ) : (
                  competition && (
                    <>
                      This will permanently remove {competition.participants?.length || 0} participants from this
                      competition. This action cannot be undone.
                    </>
                  )
                )}
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isClearAll ? 'Clear All' : 'Delete Competition'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </>
  );
}
