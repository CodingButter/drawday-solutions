import React, { useEffect, useState } from 'react';
import { getStorageEnvironment } from '@raffle-spinner/storage';
import ExtensionAuth from './ExtensionAuth';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

interface DirectusUser {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
}

export default function AuthGuard({ children, requireAuth = true }: AuthGuardProps) {
  const [user, setUser] = useState<DirectusUser | null>(null);
  const [loading, setLoading] = useState(true);
  const isWebMode = getStorageEnvironment() === 'web';

  useEffect(() => {
    // Skip auth in development mode if specified
    if (!requireAuth && isWebMode) {
      setLoading(false);
      return;
    }

    // Check stored Directus auth state
    const checkAuth = () => {
      const storedUser = localStorage.getItem('directus_user');
      const storedToken = localStorage.getItem('directus_token');
      const storedExpires = localStorage.getItem('directus_expires');

      if (storedUser && storedToken && storedExpires) {
        const expires = parseInt(storedExpires);
        if (Date.now() < expires) {
          try {
            setUser(JSON.parse(storedUser));
          } catch {
            // Invalid stored data
            localStorage.removeItem('directus_user');
            localStorage.removeItem('directus_token');
            localStorage.removeItem('directus_expires');
          }
        }
      }
      setLoading(false);
    };

    checkAuth();
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
    return <ExtensionAuth onSuccess={() => setUser} />;
  }

  return <>{children}</>;
}
