'use client';

import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@raffle-spinner/ui';
import { Input } from '@raffle-spinner/ui';
import { Label } from '@raffle-spinner/ui';
import { Alert, AlertDescription } from '@raffle-spinner/ui';
import { Eye, EyeOff, Loader2, Mail, Lock, Wand2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoginFormProps {
  onSuccess?: () => void;
  onRegisterClick?: () => void;
  redirectTo?: string;
  className?: string;
  showMagicLink?: boolean;
}

export function LoginForm({ 
  onSuccess, 
  onRegisterClick,
  redirectTo = '/dashboard',
  className,
  showMagicLink = true
}: LoginFormProps) {
  const [loginMethod, setLoginMethod] = useState<'email' | 'magic'>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      
      // Check if we're in an iframe (extension)
      if (window.parent !== window) {
        window.parent.postMessage({ type: 'AUTH_SUCCESS', user: { email } }, '*');
      }
      
      // If redirectTo is provided and we're on the website, navigate there
      if (redirectTo && typeof window !== 'undefined') {
        window.location.href = redirectTo;
        return; // Don't call onSuccess if we're already redirecting
      }
      
      onSuccess?.();
    } catch (error: any) {
      console.error('Login error:', error);
      
      // User-friendly error messages
      if (error.code === 'auth/user-not-found') {
        setError('No account found with this email address.');
      } else if (error.code === 'auth/wrong-password') {
        setError('Incorrect password. Please try again.');
      } else if (error.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else if (error.code === 'auth/too-many-requests') {
        setError('Too many failed attempts. Please try again later.');
      } else {
        setError(error.message || 'Failed to sign in. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth/magic-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMagicLinkSent(true);
      } else {
        setError(data.error || 'Failed to send magic link');
      }
    } catch (error) {
      console.error('Magic link error:', error);
      setError('Failed to send magic link. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (magicLinkSent) {
    return (
      <div className={cn("space-y-4", className)}>
        <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
          <AlertDescription className="text-green-800 dark:text-green-200">
            <strong>Check your email!</strong><br />
            We've sent a magic link to {email}. Click the link in your email to sign in.
          </AlertDescription>
        </Alert>
        <Button
          variant="outline"
          onClick={() => setMagicLinkSent(false)}
          className="w-full"
        >
          Back to Login
        </Button>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Login Method Toggle */}
      {showMagicLink && (
        <div className="flex rounded-lg bg-muted p-1">
          <button
            type="button"
            className={cn(
              "flex-1 py-2 px-3 rounded-md transition-all duration-200 text-sm font-medium",
              loginMethod === 'email' 
                ? "bg-background shadow-sm" 
                : "text-muted-foreground hover:text-foreground"
            )}
            onClick={() => setLoginMethod('email')}
          >
            Email & Password
          </button>
          <button
            type="button"
            className={cn(
              "flex-1 py-2 px-3 rounded-md transition-all duration-200 text-sm font-medium flex items-center justify-center gap-2",
              loginMethod === 'magic' 
                ? "bg-background shadow-sm" 
                : "text-muted-foreground hover:text-foreground"
            )}
            onClick={() => setLoginMethod('magic')}
          >
            <Wand2 className="h-4 w-4" />
            Magic Link
          </button>
        </div>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={loginMethod === 'email' ? handleEmailLogin : handleMagicLink} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">
            <Mail className="inline h-4 w-4 mr-1" />
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
            autoComplete="email"
          />
        </div>

        {loginMethod === 'email' && (
          <div className="space-y-2">
            <Label htmlFor="password">
              <Lock className="inline h-4 w-4 mr-1" />
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {loginMethod === 'email' ? 'Signing in...' : 'Sending magic link...'}
            </>
          ) : (
            loginMethod === 'email' ? 'Sign In' : 'Send Magic Link'
          )}
        </Button>
      </form>

      {loginMethod === 'email' && (
        <div className="text-center text-sm">
          <a 
            href="/forgot-password" 
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            Forgot your password?
          </a>
        </div>
      )}

      {onRegisterClick && (
        <div className="text-center text-sm">
          <span className="text-muted-foreground">Don't have an account? </span>
          <button
            type="button"
            onClick={onRegisterClick}
            className="text-primary hover:underline font-medium"
          >
            Sign up
          </button>
        </div>
      )}
    </div>
  );
}