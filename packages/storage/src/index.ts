/**
 * Storage Package Entry Point
 *
 * Purpose: Main export file for the storage package, providing access to types,
 * storage adapters, and default storage instance for the application.
 *
 * SRS Reference:
 * - Data Layer: Storage package public API
 * - Package Architecture: Storage layer exports
 */

export * from "./types";
export * from "./storage-adapter";
export * from "./chrome-storage-adapter";
export * from "./local-storage-adapter";
export * from "./api-storage-adapter";
export {
  createStorageAdapter,
  getStorageEnvironment,
  type StorageEnvironment,
} from "./storage-factory";

import { createStorageAdapter } from "./storage-factory";

// Create storage adapter based on environment
// Will auto-detect Chrome extension vs web environment
// In web environment with auth, will use API storage
const createDefaultStorage = () => {
  // Check if we're in web environment with potential auth
  if (
    typeof window !== "undefined" &&
    !chrome?.storage?.local &&
    (localStorage.getItem("directus_auth_token") ||
      localStorage.getItem("userId"))
  ) {
    return createStorageAdapter("api");
  }
  return createStorageAdapter("auto");
};

export const storage = createDefaultStorage();
