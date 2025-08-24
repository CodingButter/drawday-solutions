'use client';

import { useState, useEffect } from 'react';
import { signInWithPopup, signInWithRedirect, getRedirectResult } from 'firebase/auth';
import { auth, googleProvider, githubProvider } from '@/lib/firebase';

export default function TestAuthPage() {
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs((prev) => [...prev, `${new Date().toISOString()}: ${message}`]);
    console.log(message);
  };

  useEffect(() => {
    addLog('Component mounted');

    // Check for redirect result
    getRedirectResult(auth)
      .then((result) => {
        if (result) {
          addLog(`Redirect result received: ${result.user?.email}`);
          setUser(result.user);
        } else {
          addLog('No redirect result');
        }
      })
      .catch((error) => {
        addLog(`Redirect error: ${error.code} - ${error.message}`);
        setError(`Redirect error: ${error.code}`);
      });

    // Check current user
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        addLog(`Auth state changed: User logged in - ${user.email}`);
        setUser(user);
      } else {
        addLog('Auth state changed: No user');
      }
    });

    return () => unsubscribe();
  }, []);

  const testGooglePopup = async () => {
    setLoading(true);
    setError('');
    addLog('Testing Google popup...');

    try {
      const result = await signInWithPopup(auth, googleProvider);
      addLog(`Google popup success: ${result.user.email}`);
      setUser(result.user);
    } catch (error: any) {
      addLog(`Google popup error: ${error.code} - ${error.message}`);
      setError(`Error: ${error.code} - ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testGoogleRedirect = async () => {
    setLoading(true);
    setError('');
    addLog('Testing Google redirect...');

    try {
      await signInWithRedirect(auth, googleProvider);
      addLog('Redirect initiated');
    } catch (error: any) {
      addLog(`Google redirect error: ${error.code} - ${error.message}`);
      setError(`Error: ${error.code} - ${error.message}`);
      setLoading(false);
    }
  };

  const testGitHubPopup = async () => {
    setLoading(true);
    setError('');
    addLog('Testing GitHub popup...');

    try {
      const result = await signInWithPopup(auth, githubProvider);
      addLog(`GitHub popup success: ${result.user.email}`);
      setUser(result.user);
    } catch (error: any) {
      addLog(`GitHub popup error: ${error.code} - ${error.message}`);
      setError(`Error: ${error.code} - ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testGitHubRedirect = async () => {
    setLoading(true);
    setError('');
    addLog('Testing GitHub redirect...');

    try {
      await signInWithRedirect(auth, githubProvider);
      addLog('Redirect initiated');
    } catch (error: any) {
      addLog(`GitHub redirect error: ${error.code} - ${error.message}`);
      setError(`Error: ${error.code} - ${error.message}`);
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await auth.signOut();
      setUser(null);
      addLog('Signed out successfully');
    } catch (error: any) {
      addLog(`Sign out error: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Firebase Auth Test Page</h1>

        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Current Status</h2>
          <p>User: {user ? `${user.email} (${user.uid})` : 'Not logged in'}</p>
          <p>Loading: {loading ? 'Yes' : 'No'}</p>
          {error && <p className="text-red-400 mt-2">Error: {error}</p>}
        </div>

        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Authentication Methods</h2>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={testGooglePopup}
              disabled={loading || !!user}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-4 py-2 rounded"
            >
              Google (Popup)
            </button>
            <button
              onClick={testGoogleRedirect}
              disabled={loading || !!user}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-4 py-2 rounded"
            >
              Google (Redirect)
            </button>
            <button
              onClick={testGitHubPopup}
              disabled={loading || !!user}
              className="bg-gray-700 hover:bg-gray-600 disabled:bg-gray-600 px-4 py-2 rounded"
            >
              GitHub (Popup)
            </button>
            <button
              onClick={testGitHubRedirect}
              disabled={loading || !!user}
              className="bg-gray-700 hover:bg-gray-600 disabled:bg-gray-600 px-4 py-2 rounded"
            >
              GitHub (Redirect)
            </button>
          </div>
          {user && (
            <button
              onClick={signOut}
              className="mt-4 bg-red-600 hover:bg-red-700 px-4 py-2 rounded w-full"
            >
              Sign Out
            </button>
          )}
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Debug Logs</h2>
          <div className="bg-gray-900 p-4 rounded h-64 overflow-y-auto font-mono text-sm">
            {logs.map((log, index) => (
              <div key={index} className="mb-1">
                {log}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 text-sm text-gray-400">
          <p>Firebase Project: bettermade-spinpick</p>
          <p>Auth Domain: bettermade-spinpick.firebaseapp.com</p>
          <p>Test URL: http://localhost:3001/test-auth</p>
        </div>
      </div>
    </div>
  );
}
