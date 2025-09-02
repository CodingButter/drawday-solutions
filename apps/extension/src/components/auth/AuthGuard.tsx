import React, { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import {
  auth,
  getStoredAuthState,
  saveAuthState,
  clearAuthState,
} from '@/services/firebase-config';
import { syncSettingsOnLogin } from '@/services/settings-sync';
import { getStorageEnvironment } from '@raffle-spinner/storage';
import ExtensionAuth from './ExtensionAuth';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean; // Allow disabling auth for development
}

export default function AuthGuard({ children, requireAuth = true }: AuthGuardProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const isWebMode = getStorageEnvironment() === 'web';

  useEffect(() => {
    // Skip auth in development mode if specified
    if (!requireAuth && isWebMode) {
      setLoading(false);
      return;
    }

    // Check stored auth state first for faster load
    getStoredAuthState().then((storedUser) => {
      if (storedUser) {
        setUser(storedUser as User);
      }
    });

    // Subscribe to auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      setLoading(false);

      if (user) {
        // Save to storage for persistence
        await saveAuthState(user);
        // Sync settings from Firebase
        await syncSettingsOnLogin(user);
      } else {
        // Clear from storage
        await clearAuthState();
      }
    });

    return () => unsubscribe();
  }, [requireAuth, isWebMode]);

  // In development mode with auth disabled, show the app directly
  if (!requireAuth && isWebMode) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <ExtensionAuth onSuccess={() => {}} />;
  }

  return <>{children}</>;
}
