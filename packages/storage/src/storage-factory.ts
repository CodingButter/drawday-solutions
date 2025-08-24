/**
 * Storage Factory
 *
 * Purpose: Factory for creating the appropriate storage adapter based on
 * the runtime environment (Chrome extension or web browser).
 *
 * SRS Reference:
 * - Data Layer: Storage abstraction layer architecture
 * - Development Mode: Environment-based adapter selection
 */

import { StorageAdapter } from "./storage-adapter";
import { ChromeStorageAdapter } from "./chrome-storage-adapter";
import { LocalStorageAdapter } from "./local-storage-adapter";

export type StorageEnvironment = "chrome-extension" | "web" | "auto";

/**
 * Detects if running in a Chrome extension context
 */
function isChromeExtension(): boolean {
  try {
    return (
      typeof chrome !== "undefined" &&
      chrome?.storage &&
      chrome?.storage?.local &&
      typeof chrome?.storage?.local?.get === "function"
    );
  } catch {
    return false;
  }
}

/**
 * Creates a storage adapter based on the specified environment
 * @param environment - The target environment or "auto" to detect
 * @returns The appropriate storage adapter instance
 */
export function createStorageAdapter(
  environment: StorageEnvironment = "auto",
): StorageAdapter {
  // Manual environment selection
  if (environment === "chrome-extension") {
    if (!isChromeExtension()) {
      // Chrome extension storage requested but not available, falling back to localStorage
      return new LocalStorageAdapter();
    }
    return new ChromeStorageAdapter();
  }

  if (environment === "web") {
    return new LocalStorageAdapter();
  }

  // Auto-detect environment
  if (isChromeExtension()) {
    // Detected Chrome extension environment, using chrome.storage
    return new ChromeStorageAdapter();
  } else {
    // Detected web environment, using localStorage
    return new LocalStorageAdapter();
  }
}

/**
 * Get the current storage environment
 */
export function getStorageEnvironment(): "chrome-extension" | "web" {
  return isChromeExtension() ? "chrome-extension" : "web";
}
