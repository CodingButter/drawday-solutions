'use client';

import { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db } from '@/services/firebase-config';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Button } from '@raffle-spinner/ui';
import { Input } from '@raffle-spinner/ui';
import { Label } from '@raffle-spinner/ui';
import { Alert, AlertDescription } from '@raffle-spinner/ui';
import { Eye, EyeOff, Loader2, User, Mail, Lock, CheckCircle } from 'lucide-react';
import { cn } from '@raffle-spinner/utils';

interface RegisterFormProps {
  onSuccess?: () => void;
  onLoginClick?: () => void;
  className?: string;
}

export function RegisterForm({ 
  onSuccess, 
  onLoginClick,
  className
}: RegisterFormProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate password strength
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);

    try {
      // Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // Update user profile
      await updateProfile(userCredential.user, {
        displayName: `${formData.firstName} ${formData.lastName}`
      });

      // Create user document in Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        displayName: `${formData.firstName} ${formData.lastName}`,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        role: 'user',
        subscription: {
          plan: 'trial',
          status: 'active',
          startDate: serverTimestamp(),
        }
      });

      // Create default settings
      await setDoc(doc(db, 'userSettings', userCredential.user.uid), {
        userId: userCredential.user.uid,
        spinner: {
          minSpinDuration: 3,
          decelerationRate: 'medium',
          soundEnabled: false,
        },
        theme: {
          spinnerStyle: {
            nameColor: '#ffffff',
            ticketColor: '#a0a0a0',
            backgroundColor: '#1a1a1a',
            canvasBackground: '#0a0a0a',
            borderColor: '#333333',
            highlightColor: '#ffd700',
            nameSize: 'large',
            ticketSize: 'medium',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            topShadowOpacity: 0.8,
            bottomShadowOpacity: 0.8,
            shadowSize: 60,
            shadowColor: '#000000',
          },
          branding: {
            logoPosition: 'center',
            showCompanyName: true,
          },
        },
        createdAt: serverTimestamp(),
        lastUpdated: serverTimestamp(),
      });

      setSuccess(true);

      // Check if we're in an iframe (extension)
      if (window.parent !== window) {
        window.parent.postMessage({ 
          type: 'AUTH_SUCCESS', 
          user: { 
            email: formData.email,
            displayName: `${formData.firstName} ${formData.lastName}`
          } 
        }, '*');
      }

      // Call success callback after a short delay
      setTimeout(() => {
        onSuccess?.();
      }, 2000);
    } catch (error: any) {
      console.error('Registration error:', error);
      
      // User-friendly error messages
      if (error.code === 'auth/email-already-in-use') {
        setError('An account with this email already exists.');
      } else if (error.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else if (error.code === 'auth/weak-password') {
        setError('Password is too weak. Please use at least 6 characters.');
      } else {
        setError(error.message || 'Failed to create account. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (success) {
    return (
      <div className={cn("space-y-4", className)}>
        <div className="text-center space-y-4">
          <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
            <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-bold">Account Created Successfully!</h2>
          <p className="text-muted-foreground">
            Welcome to DrawDay Spinner! Redirecting you to your dashboard...
          </p>
          <div className="flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">
              <User className="inline h-4 w-4 mr-1" />
              First Name
            </Label>
            <Input
              id="firstName"
              name="firstName"
              type="text"
              placeholder="John"
              value={formData.firstName}
              onChange={handleInputChange}
              required
              disabled={isLoading}
              autoComplete="given-name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">
              <User className="inline h-4 w-4 mr-1" />
              Last Name
            </Label>
            <Input
              id="lastName"
              name="lastName"
              type="text"
              placeholder="Doe"
              value={formData.lastName}
              onChange={handleInputChange}
              required
              disabled={isLoading}
              autoComplete="family-name"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">
            <Mail className="inline h-4 w-4 mr-1" />
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleInputChange}
            required
            disabled={isLoading}
            autoComplete="email"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">
            <Lock className="inline h-4 w-4 mr-1" />
            Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Create a password"
              value={formData.password}
              onChange={handleInputChange}
              required
              disabled={isLoading}
              autoComplete="new-password"
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

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">
            <Lock className="inline h-4 w-4 mr-1" />
            Confirm Password
          </Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
              disabled={isLoading}
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              tabIndex={-1}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            'Create Account'
          )}
        </Button>
      </form>

      {onLoginClick && (
        <div className="text-center text-sm">
          <span className="text-muted-foreground">Already have an account? </span>
          <button
            type="button"
            onClick={onLoginClick}
            className="text-primary hover:underline font-medium"
          >
            Sign in
          </button>
        </div>
      )}

      <p className="text-xs text-center text-muted-foreground">
        By creating an account, you agree to our{' '}
        <a href="/terms" className="underline hover:text-primary">
          Terms of Service
        </a>{' '}
        and{' '}
        <a href="/privacy" className="underline hover:text-primary">
          Privacy Policy
        </a>
      </p>
    </div>
  );
}