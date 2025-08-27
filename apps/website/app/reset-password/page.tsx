'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  CheckCircle,
  Shield,
  KeyRound,
  Sparkles,
  Zap,
  Star,
  ArrowLeft,
  AlertCircle,
  Check,
  X,
} from 'lucide-react';

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [mounted, setMounted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);
  const [resetComplete, setResetComplete] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const tokenParam = searchParams.get('token');
    setToken(tokenParam);

    if (!tokenParam) {
      setError('Invalid reset link. Please request a new password reset.');
      setTokenValid(false);
    } else {
      // Here you would typically validate the token with your API
      setTokenValid(true);
    }
  }, [searchParams]);

  // Mouse tracking for interactive gradient
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (formRef.current) {
        const rect = formRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Password strength calculator
  useEffect(() => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    setPasswordStrength(strength);
  }, [password]);

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 1) return 'bg-red-500';
    if (passwordStrength <= 2) return 'bg-orange-500';
    if (passwordStrength <= 3) return 'bg-yellow-500';
    if (passwordStrength <= 4) return 'bg-green-500';
    return 'bg-green-600';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 1) return 'Weak';
    if (passwordStrength <= 2) return 'Fair';
    if (passwordStrength <= 3) return 'Good';
    if (passwordStrength <= 4) return 'Strong';
    return 'Very Strong';
  };

  const passwordRequirements = [
    { met: password.length >= 8, text: 'At least 8 characters' },
    { met: /[a-z]/.test(password) && /[A-Z]/.test(password), text: 'Upper & lowercase letters' },
    { met: /\d/.test(password), text: 'At least one number' },
    { met: /[^A-Za-z0-9]/.test(password), text: 'At least one special character' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (passwordStrength < 2) {
      setError('Please choose a stronger password');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Password reset failed');
      }

      // Success
      setResetComplete(true);
      setSuccessMessage('🎉 Password reset successful! You can now log in with your new password.');

      // Redirect to login after delay
      setTimeout(() => {
        router.push('/login?reset=success');
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Password reset failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  // Invalid token state
  if (tokenValid === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-night relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 via-transparent to-orange-500/20" />
          <div className="absolute top-20 left-10 w-72 h-72 bg-red-500/20 rounded-full blur-3xl animate-pulse" />
        </div>

        <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8 shadow-2xl max-w-md w-full mx-4">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl mb-4">
              <AlertCircle className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Invalid Reset Link</h2>
            <p className="text-gray-400 mb-6">
              This password reset link is invalid or has expired.
            </p>
            <Link
              href="/forgot-password"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
            >
              <KeyRound className="w-4 h-4" />
              Request New Reset
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex relative overflow-hidden bg-night">
      {/* Animated background with particle effect */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-transparent to-pink-500/20" />

        {/* Animated orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse animation-delay-2000" />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-bounce-slow" />

        {/* Floating particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 10}s`,
                animationDuration: `${10 + Math.random() * 20}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 relative z-10">
        <div ref={formRef} className="max-w-md w-full relative">
          {/* Interactive gradient that follows mouse */}
          <div
            className="absolute inset-0 opacity-30 pointer-events-none"
            style={{
              background: `radial-gradient(circle 200px at ${mousePosition.x}px ${mousePosition.y}px, rgba(168, 85, 247, 0.3), transparent)`,
            }}
          />

          {/* Glassmorphism card */}
          <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8 shadow-2xl">
            {/* Logo and heading */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mb-4 transform hover:rotate-12 transition-transform duration-300">
                {resetComplete ? (
                  <CheckCircle className="w-10 h-10 text-white" />
                ) : (
                  <Lock className="w-10 h-10 text-white" />
                )}
              </div>
              <h2 className="text-4xl font-bold text-white mb-2 animate-fadeIn">
                {resetComplete ? 'Reset Complete!' : 'Set New Password'}
              </h2>
              <p className="text-gray-400">
                {resetComplete
                  ? 'Your password has been successfully updated'
                  : 'Choose a strong password for your account'}
              </p>
            </div>

            {/* Success message */}
            {successMessage && (
              <div className="mb-6 rounded-lg bg-green-900/20 border border-green-500/50 p-4 animate-slideDown">
                <div className="flex items-center gap-2 text-sm text-green-400">
                  <CheckCircle className="w-4 h-4" />
                  {successMessage}
                </div>
              </div>
            )}

            {!resetComplete ? (
              // Password reset form
              <form className="space-y-5" onSubmit={handleSubmit}>
                {/* New Password field */}
                <div className="relative group">
                  <div
                    className={`absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg blur opacity-0 group-hover:opacity-30 transition-opacity duration-300`}
                  />
                  <div className="relative">
                    <Lock
                      className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-colors ${
                        passwordFocused ? 'text-purple-500' : 'text-gray-400'
                      }`}
                    />
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      className="w-full pl-10 pr-10 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:bg-white/10 transition-all"
                      placeholder="New password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setPasswordFocused(true)}
                      onBlur={() => setPasswordFocused(false)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                    {passwordFocused && (
                      <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse" />
                    )}
                  </div>
                </div>

                {/* Password strength indicator */}
                {password && (
                  <div className="space-y-2 animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">Password strength</span>
                      <span
                        className={`text-xs font-medium ${passwordStrength > 2 ? 'text-green-400' : 'text-orange-400'}`}
                      >
                        {getPasswordStrengthText()}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                        style={{ width: `${(passwordStrength / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Password requirements */}
                {passwordFocused && (
                  <div className="space-y-1 animate-fadeIn">
                    {passwordRequirements.map((req, index) => (
                      <div key={index} className="flex items-center gap-2">
                        {req.met ? (
                          <Check className="h-4 w-4 text-green-400" />
                        ) : (
                          <X className="h-4 w-4 text-gray-600" />
                        )}
                        <span className={`text-xs ${req.met ? 'text-green-400' : 'text-gray-500'}`}>
                          {req.text}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Confirm Password field */}
                <div className="relative group">
                  <div
                    className={`absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg blur opacity-0 group-hover:opacity-30 transition-opacity duration-300`}
                  />
                  <div className="relative">
                    <Lock
                      className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-colors ${
                        confirmPasswordFocused ? 'text-purple-500' : 'text-gray-400'
                      }`}
                    />
                    <input
                      id="confirm-password"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      className="w-full pl-10 pr-10 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:bg-white/10 transition-all"
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      onFocus={() => setConfirmPasswordFocused(true)}
                      onBlur={() => setConfirmPasswordFocused(false)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                    {confirmPassword && password && (
                      <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
                        {confirmPassword === password ? (
                          <Check className="h-5 w-5 text-green-400" />
                        ) : (
                          <X className="h-5 w-5 text-red-400" />
                        )}
                      </div>
                    )}
                    {confirmPasswordFocused && (
                      <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse" />
                    )}
                  </div>
                </div>

                {/* Error message */}
                {error && (
                  <div className="rounded-lg bg-red-900/20 border border-red-500/50 p-3 animate-shake">
                    <div className="flex items-center gap-2 text-sm text-red-400">
                      <AlertCircle className="w-4 h-4" />
                      {error}
                    </div>
                  </div>
                )}

                {/* Submit button with ripple effect */}
                <button
                  type="submit"
                  disabled={loading || passwordStrength < 2}
                  className="relative group w-full py-3 px-4 border border-transparent rounded-lg text-white font-medium overflow-hidden transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500" />
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 blur-xl transition-opacity" />
                  <span className="relative flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Updating Password...
                      </>
                    ) : (
                      <>
                        <KeyRound className="w-5 h-5" />
                        Update Password
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </span>
                </button>
              </form>
            ) : (
              // Success state
              <div className="space-y-6 text-center animate-fadeIn">
                <div className="space-y-4 text-gray-300">
                  <p className="text-lg leading-relaxed">
                    You can now log in with your new password
                  </p>
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="text-sm text-gray-400 space-y-2">
                      <p>✓ Password successfully updated</p>
                      <p>✓ Account security enhanced</p>
                      <p>✓ All sessions refreshed</p>
                    </div>
                  </div>
                </div>

                {/* Auto redirect info */}
                <p className="text-sm text-gray-500">
                  Redirecting to login page in a few seconds...
                </p>
              </div>
            )}

            {/* Back to login link */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <Link
                href="/login"
                className="text-sm text-gray-400 hover:text-white transition-colors flex items-center justify-center gap-2 group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Login
              </Link>
            </div>

            {/* Security badges */}
            <div className="flex items-center justify-center gap-4 mt-6 pt-6 border-t border-white/10">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Shield className="w-4 h-4" />
                Encrypted
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <CheckCircle className="w-4 h-4" />
                Secure Reset
              </div>
            </div>
          </div>

          {/* Floating feature cards */}
          <div className="absolute -right-20 top-10 bg-white/5 backdrop-blur-md rounded-lg p-3 border border-white/10 transform rotate-3 hover:rotate-0 transition-transform hidden xl:block">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-400" />
              <span className="text-xs text-white">Secure Update</span>
            </div>
          </div>

          <div className="absolute -left-20 bottom-10 bg-white/5 backdrop-blur-md rounded-lg p-3 border border-white/10 transform -rotate-3 hover:rotate-0 transition-transform hidden xl:block">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <span className="text-xs text-white">Fresh Start</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick stats sidebar (visible on larger screens) */}
      <div className="hidden lg:flex lg:w-96 items-center justify-center bg-gradient-to-br from-purple-500/5 to-pink-500/5 relative p-8">
        <div className="relative z-10">
          <h3 className="text-2xl font-bold text-white mb-8">Password Security</h3>

          <div className="space-y-6">
            {[
              {
                icon: Shield,
                color: 'text-green-400',
                title: 'Bank-level Encryption',
                desc: 'Your password is always secure',
              },
              {
                icon: Zap,
                color: 'text-yellow-400',
                title: 'Instant Activation',
                desc: 'New password works immediately',
              },
              {
                icon: CheckCircle,
                color: 'text-blue-400',
                title: 'Verified Process',
                desc: 'Trusted security protocols',
              },
              {
                icon: Star,
                color: 'text-orange-400',
                title: 'Best Practices',
                desc: 'Following security standards',
              },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 group cursor-pointer">
                <div className="flex-shrink-0 w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center group-hover:bg-white/10 transition-colors">
                  <item.icon className={`w-6 h-6 ${item.color}`} />
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">{item.title}</h4>
                  <p className="text-gray-400 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Security tips */}
          <div className="mt-12 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
            <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
              <Lock className="w-4 h-4 text-purple-400" />
              Security Tips
            </h4>
            <div className="space-y-2 text-sm text-gray-400">
              <p>• Use a unique password for each account</p>
              <p>• Include numbers, symbols, and mixed case</p>
              <p>• Consider using a password manager</p>
              <p>• Enable two-factor authentication</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
