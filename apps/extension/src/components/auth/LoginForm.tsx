import React, { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/services/firebase-config';
import { Button } from '@raffle-spinner/ui';
import { Input } from '@raffle-spinner/ui';
import { Label } from '@raffle-spinner/ui';
import { Alert } from '@raffle-spinner/ui';
import { getStorageEnvironment } from '@raffle-spinner/storage';

interface LoginFormProps {
  onSuccess: () => void;
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const isWebMode = getStorageEnvironment() === 'web';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    try {
      if (isRegistering) {
        // Registration flow
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }

        if (password.length < 6) {
          setError('Password must be at least 6 characters');
          setLoading(false);
          return;
        }

        await createUserWithEmailAndPassword(auth, email, password);
        setSuccessMessage('Account created successfully!');
        setTimeout(() => {
          onSuccess();
        }, 1000);
      } else {
        // Login flow
        await signInWithEmailAndPassword(auth, email, password);
        onSuccess();
      }
    } catch (err: unknown) {
      const error = err as { code?: string; message?: string };
      if (error.code === 'auth/email-already-in-use') {
        setError('An account with this email already exists');
      } else if (error.code === 'auth/weak-password') {
        setError('Password is too weak');
      } else if (error.code === 'auth/user-not-found') {
        setError('No account found with this email');
      } else if (error.code === 'auth/wrong-password') {
        setError('Invalid password');
      } else if (error.code === 'auth/invalid-email') {
        setError('Invalid email address');
      } else {
        setError(error.message || 'Operation failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const openRegistrationPage = () => {
    const registrationUrl = 'https://drawday-spinner.vercel.app/register';

    if (isWebMode) {
      // In web mode, open in new tab
      window.open(registrationUrl, '_blank');
    } else {
      // In extension mode, use chrome.tabs API
      try {
        chrome.tabs.create({ url: registrationUrl });
      } catch {
        // Fallback if chrome.tabs is not available
        window.open(registrationUrl, '_blank');
      }
    }
  };

  const toggleMode = () => {
    setIsRegistering(!isRegistering);
    setError('');
    setSuccessMessage('');
    setConfirmPassword('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-sm bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            DrawDay Spinner
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {isRegistering ? 'Create your account' : 'Sign in to use the extension'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
              disabled={loading}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
              disabled={loading}
              className="mt-1"
            />
          </div>

          {isRegistering && (
            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Confirm your password"
                disabled={loading}
                className="mt-1"
              />
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <p className="text-sm">{error}</p>
            </Alert>
          )}

          {successMessage && (
            <Alert className="bg-green-50 border-green-200">
              <p className="text-sm text-green-800">{successMessage}</p>
            </Alert>
          )}

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            disabled={loading}
          >
            {loading
              ? isRegistering
                ? 'Creating account...'
                : 'Signing in...'
              : isRegistering
                ? 'Create Account'
                : 'Sign In'}
          </Button>
        </form>

        <div className="text-center space-y-2">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {isRegistering ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              type="button"
              onClick={toggleMode}
              className="font-medium text-purple-600 hover:text-purple-500 dark:text-purple-400 dark:hover:text-purple-300"
            >
              {isRegistering ? 'Sign In' : 'Register'}
            </button>
          </p>

          {!isRegistering && (
            <p className="text-xs text-gray-500 dark:text-gray-500">
              Or{' '}
              <button
                type="button"
                onClick={openRegistrationPage}
                className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
              >
                register on website
              </button>
            </p>
          )}
        </div>

        {isWebMode && (
          <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-500">
              🔧 Development mode - Using localStorage
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
