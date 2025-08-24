'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Mail,
  ArrowRight,
  Loader2,
  CheckCircle,
  Shield,
  KeyRound,
  Sparkles,
  Zap,
  Chrome,
  Star,
  ArrowLeft,
  Lock,
  AlertCircle,
} from 'lucide-react';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [mounted, setMounted] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send reset email');
      }

      // Success
      setEmailSent(true);
      setSuccessMessage('🔗 Password reset email sent! Check your inbox and spam folder.');
    } catch (err: any) {
      setError(err.message || 'Failed to send password reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (loading) return;

    setLoading(true);
    setError('');

    // Wait a moment before allowing resend
    setTimeout(async () => {
      await handleSubmit({
        preventDefault: () => {},
      } as React.FormEvent);
    }, 1000);
  };

  if (!mounted) return null;

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
                {emailSent ? (
                  <CheckCircle className="w-10 h-10 text-white" />
                ) : (
                  <KeyRound className="w-10 h-10 text-white" />
                )}
              </div>
              <h2 className="text-4xl font-bold text-white mb-2 animate-fadeIn">
                {emailSent ? 'Check Your Email' : 'Reset Password'}
              </h2>
              <p className="text-gray-400">
                {emailSent
                  ? "We've sent you a secure link to reset your password"
                  : 'Enter your email to receive a password reset link'}
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

            {!emailSent ? (
              // Email form
              <form className="space-y-5" onSubmit={handleSubmit}>
                {/* Email field with floating label */}
                <div className="relative group">
                  <div
                    className={`absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg blur opacity-0 group-hover:opacity-30 transition-opacity duration-300`}
                  />
                  <div className="relative">
                    <Mail
                      className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-colors ${
                        emailFocused ? 'text-purple-500' : 'text-gray-400'
                      }`}
                    />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="w-full pl-10 pr-3 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:bg-white/10 transition-all"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setEmailFocused(true)}
                      onBlur={() => setEmailFocused(false)}
                    />
                    {emailFocused && (
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
                  disabled={loading}
                  className="relative group w-full py-3 px-4 border border-transparent rounded-lg text-white font-medium overflow-hidden transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500" />
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 blur-xl transition-opacity" />
                  <span className="relative flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Sending Reset Link...
                      </>
                    ) : (
                      <>
                        <Mail className="w-5 h-5" />
                        Send Reset Link
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </span>
                </button>
              </form>
            ) : (
              // Post-send UI
              <div className="space-y-6 text-center animate-fadeIn">
                <div className="space-y-4 text-gray-300">
                  <p className="text-sm leading-relaxed">
                    We've sent a secure password reset link to{' '}
                    <span className="text-white font-medium">{email}</span>
                  </p>
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="flex items-start gap-3 text-xs text-gray-400">
                      <AlertCircle className="w-4 h-4 mt-0.5 text-blue-400 flex-shrink-0" />
                      <div className="text-left space-y-1">
                        <p>The link will expire in 1 hour for security</p>
                        <p>Check your spam folder if you don't see it</p>
                        <p>Click the link and follow the instructions</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Resend button */}
                <button
                  onClick={handleResend}
                  disabled={loading}
                  className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors flex items-center gap-2 mx-auto disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Resending...
                    </>
                  ) : (
                    <>
                      Didn't receive it? Resend
                      <ArrowRight className="w-3 h-3" />
                    </>
                  )}
                </button>
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
                Secure Reset
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <CheckCircle className="w-4 h-4" />
                Encrypted Link
              </div>
            </div>
          </div>

          {/* Floating feature cards */}
          <div className="absolute -right-20 top-10 bg-white/5 backdrop-blur-md rounded-lg p-3 border border-white/10 transform rotate-3 hover:rotate-0 transition-transform hidden xl:block">
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-green-400" />
              <span className="text-xs text-white">Bank-level Security</span>
            </div>
          </div>

          <div className="absolute -left-20 bottom-10 bg-white/5 backdrop-blur-md rounded-lg p-3 border border-white/10 transform -rotate-3 hover:rotate-0 transition-transform hidden xl:block">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <span className="text-xs text-white">Instant Recovery</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick stats sidebar (visible on larger screens) */}
      <div className="hidden lg:flex lg:w-96 items-center justify-center bg-gradient-to-br from-purple-500/5 to-pink-500/5 relative p-8">
        <div className="relative z-10">
          <h3 className="text-2xl font-bold text-white mb-8">Secure Recovery</h3>

          <div className="space-y-6">
            {[
              {
                icon: Shield,
                color: 'text-green-400',
                title: 'Military-grade Security',
                desc: 'Your data is always protected',
              },
              {
                icon: Zap,
                color: 'text-yellow-400',
                title: 'Instant Reset',
                desc: 'Get back to your account in minutes',
              },
              {
                icon: CheckCircle,
                color: 'text-blue-400',
                title: 'Verified Process',
                desc: 'Trusted by 10,000+ users',
              },
              {
                icon: Star,
                color: 'text-orange-400',
                title: '99.9% Success Rate',
                desc: 'Reliable password recovery',
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

          {/* Security indicator */}
          <div className="mt-12 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-gray-400">Security Status</span>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-xs text-green-400">Active Protection</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-400 to-blue-400 animate-pulse"
                  style={{ width: '100%' }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>SSL Encrypted</span>
                <span>GDPR Compliant</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
