/**
 * Local Storage Polling Hook
 *
 * Provides real-time synchronization with localStorage changes,
 * useful for cross-tab communication and monitoring storage updates.
 */

'use client';

import { useEffect, useRef } from 'react';

interface PollingOptions {
  key: string;
  interval?: number;
  onUpdate?: (value: any) => void;
}

export function useLocalStoragePolling({ key, interval = 500, onUpdate }: PollingOptions) {
  const lastValueRef = useRef<string | null>(null);

  useEffect(() => {
    const checkForUpdates = () => {
      try {
        const currentValue = localStorage.getItem(key);
        
        // Check if value has changed
        if (currentValue !== lastValueRef.current) {
          lastValueRef.current = currentValue;
          
          if (onUpdate && currentValue) {
            try {
              const parsed = JSON.parse(currentValue);
              onUpdate(parsed);
            } catch {
              // If not JSON, pass raw value
              onUpdate(currentValue);
            }
          }
        }
      } catch (error) {
        console.error('Error polling localStorage:', error);
      }
    };

    // Initial check
    checkForUpdates();

    // Set up polling interval
    const intervalId = setInterval(checkForUpdates, interval);

    // Also listen for storage events (cross-tab updates)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key) {
        checkForUpdates();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key, interval, onUpdate]);
}

// Hook for polling multiple keys
export function useMultipleLocalStoragePolling(
  configs: PollingOptions[],
  globalInterval?: number
) {
  configs.forEach(config => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useLocalStoragePolling({
      ...config,
      interval: config.interval || globalInterval || 500
    });
  });
}