'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button, Input, Alert, AlertDescription } from '@raffle-spinner/ui';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles, Chrome } from 'lucide-react';
import { login } from '@/lib/directus-auth';

export default function ExtensionLoginClient() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const searchParams = useSearchParams();
  const router = useRouter();

  // Always redirect to options page after login in extension context
  const redirectTo = '/live-spinner/options';

  useEffect(() => {
    // Prevent navigation to regular website pages
    const checkContext = () => {
      // If somehow accessed outside of iframe, redirect to main login
      if (typeof window !== 'undefined' && window.self === window.top) {
        router.push('/login');
      }
    };
    checkContext();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      console.log('Extension login attempt for:', formData.email);
      const result = await login(formData.email, formData.password);
      console.log('Extension login successful');

      // Always redirect to options page in extension context
      router.push(redirectTo);
    } catch (error: any) {
      console.error('Extension login error:', error);
      setError(error.message || 'Failed to sign in. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Extension Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm">
            <Chrome className="w-4 h-4" />
            Chrome Extension
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-2xl flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-purple-400" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2">Sign In to DrawDay Spinner</h1>
          <p className="text-gray-400">Access your professional live draw tools</p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert className="mb-6 bg-red-500/10 border-red-500/20">
            <AlertDescription className="text-red-400">{error}</AlertDescription>
          </Alert>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-10 bg-gray-900 border-gray-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                placeholder="your@email.com"
                required
                autoComplete="email"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-10 pr-10 bg-gray-900 border-gray-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                placeholder="Enter your password"
                required
                autoComplete="current-password"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-white transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Forgot Password Link */}
          <div className="flex justify-end">
            <Link
              href="/live-spinner/auth/forgot-password"
              className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white h-12"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Sign In
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>
        </form>

        {/* Register Link */}
        <div className="mt-8 text-center">
          <p className="text-gray-400">
            Don't have an account?{' '}
            <Link
              href="/live-spinner/auth/register"
              className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
            >
              Create Account
            </Link>
          </p>
        </div>

        {/* Extension Info */}
        <div className="mt-8 p-4 rounded-lg bg-gray-900 border border-gray-800">
          <p className="text-xs text-gray-500 text-center">
            This login is for the DrawDay Spinner Chrome extension only. Your data is secure and
            encrypted.
          </p>
        </div>
      </div>
    </div>
  );
}
