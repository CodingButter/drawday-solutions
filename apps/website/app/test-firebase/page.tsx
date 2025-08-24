'use client';

import { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function TestFirebasePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [firebaseConfig, setFirebaseConfig] = useState<any>(null);

  useEffect(() => {
    // Check auth state
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // Get Firebase config for debugging
    setFirebaseConfig({
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.substring(0, 10) + '...',
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      alert('Signed out successfully');
    } catch (error) {
      console.error('Sign out error:', error);
      alert('Failed to sign out');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Firebase Authentication Test</h1>
        
        {/* Firebase Config Status */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Firebase Configuration</h2>
          <div className="space-y-2">
            <p className="text-sm">
              <span className="font-medium">API Key:</span> {firebaseConfig?.apiKey || 'Not configured'}
            </p>
            <p className="text-sm">
              <span className="font-medium">Auth Domain:</span> {firebaseConfig?.authDomain || 'Not configured'}
            </p>
            <p className="text-sm">
              <span className="font-medium">Project ID:</span> {firebaseConfig?.projectId || 'Not configured'}
            </p>
          </div>
        </div>

        {/* Auth Status */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Authentication Status</h2>
          {loading ? (
            <p>Checking authentication...</p>
          ) : user ? (
            <div className="space-y-2">
              <p className="text-green-600 font-medium">✓ Authenticated</p>
              <p className="text-sm">
                <span className="font-medium">UID:</span> {user.uid}
              </p>
              <p className="text-sm">
                <span className="font-medium">Email:</span> {user.email}
              </p>
              <p className="text-sm">
                <span className="font-medium">Display Name:</span> {user.displayName || 'Not set'}
              </p>
              <button
                onClick={handleSignOut}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div>
              <p className="text-red-600 font-medium">✗ Not authenticated</p>
              <p className="text-sm mt-2">Please register or login to test authentication.</p>
            </div>
          )}
        </div>

        {/* Test Links */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Test Authentication Flow</h2>
          <div className="space-y-2">
            <a
              href="/register"
              className="block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-center"
            >
              Go to Registration Page
            </a>
            <a
              href="/login"
              className="block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-center"
            >
              Go to Login Page
            </a>
            <a
              href="/dashboard"
              className="block px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 text-center"
            >
              Go to Dashboard (Protected)
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}