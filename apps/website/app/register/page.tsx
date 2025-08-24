'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  Check,
  X,
  ArrowRight,
  Zap,
  Shield,
  Trophy,
  Users,
} from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordFocus, setPasswordFocus] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      // Use Firebase Client SDK directly
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update display name
      await updateProfile(user, {
        displayName: `${firstName} ${lastName}`,
      });

      // Create user document in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email,
        firstName,
        lastName,
        createdAt: new Date().toISOString(),
        role: 'user',
        extensionEnabled: true,
        plan: 'free',
      });

      // Send welcome email via API (optional)
      try {
        await fetch('/api/auth/send-welcome-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, firstName }),
        });
      } catch (emailError) {
        console.error('Failed to send welcome email:', emailError);
      }

      // Redirect to dashboard after successful registration (user is already logged in)
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Registration error:', err);
      
      // Handle specific Firebase errors
      if (err.code === 'auth/email-already-in-use') {
        setError('Email already registered');
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid email address');
      } else if (err.code === 'auth/operation-not-allowed') {
        setError('Email/password accounts are not enabled');
      } else if (err.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters');
      } else {
        setError(err.message || 'Registration failed');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex relative overflow-hidden bg-night">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/20 via-transparent to-neon-pink/20" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-neon-purple/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-neon-pink/30 rounded-full blur-3xl animate-pulse animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-neon-purple/10 to-neon-pink/10 rounded-full blur-3xl animate-spin-slow" />
      </div>

      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-md w-full">
          {/* Logo and heading */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-neon-purple to-neon-pink rounded-2xl mb-4 animate-bounce-slow">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-white mb-2">Create Account</h2>
            <p className="text-gray-400">Join thousands of competition hosts</p>
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Name fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-neon-purple to-neon-pink rounded-lg blur opacity-25 group-hover:opacity-40 transition" />
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="first-name"
                    name="firstName"
                    type="text"
                    required
                    className="w-full pl-10 pr-3 py-3 bg-night-light border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon-purple transition-all"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
              </div>

              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-neon-purple to-neon-pink rounded-lg blur opacity-25 group-hover:opacity-40 transition" />
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="last-name"
                    name="lastName"
                    type="text"
                    required
                    className="w-full pl-10 pr-3 py-3 bg-night-light border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon-purple transition-all"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Email field */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-neon-purple to-neon-pink rounded-lg blur opacity-25 group-hover:opacity-40 transition" />
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="w-full pl-10 pr-3 py-3 bg-night-light border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon-purple transition-all"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password field */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-neon-purple to-neon-pink rounded-lg blur opacity-25 group-hover:opacity-40 transition" />
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  className="w-full pl-10 pr-10 py-3 bg-night-light border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon-purple transition-all"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setPasswordFocus(true)}
                  onBlur={() => setPasswordFocus(false)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
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
            {passwordFocus && (
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
              <div className="absolute inset-0 bg-gradient-to-r from-neon-purple to-neon-pink rounded-lg blur opacity-25 group-hover:opacity-40 transition" />
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="confirm-password"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  className="w-full pl-10 pr-10 py-3 bg-night-light border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neon-purple transition-all"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition"
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
              </div>
            </div>

            {/* Terms checkbox */}
            <div className="flex items-start">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="mt-1 h-4 w-4 text-neon-purple focus:ring-neon-purple border-gray-700 rounded bg-night-light"
              />
              <label htmlFor="terms" className="ml-2 text-sm text-gray-400">
                I agree to the{' '}
                <Link href="/terms" className="text-neon-purple hover:text-neon-purple/80">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-neon-purple hover:text-neon-purple/80">
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Error message */}
            {error && (
              <div className="rounded-lg bg-red-900/20 border border-red-500/50 p-3 animate-shake">
                <div className="text-sm text-red-400">{error}</div>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="relative group w-full py-3 px-4 border border-transparent rounded-lg text-white font-medium bg-gradient-to-r from-neon-purple to-neon-pink hover:from-neon-purple/90 hover:to-neon-pink/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neon-purple disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="relative flex items-center justify-center">
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Creating account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </span>
            </button>


            {/* Sign in link */}
            <p className="text-center text-sm text-gray-400">
              Already have an account?{' '}
              <Link
                href="/login"
                className="font-medium text-neon-purple hover:text-neon-purple/80 transition"
              >
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* Right side - Features */}
      <div className="hidden lg:flex lg:flex-1 items-center justify-center bg-gradient-to-br from-neon-purple/10 to-neon-pink/10 relative">
        <div className="max-w-md px-8">
          <h3 className="text-2xl font-bold text-white mb-8">Why choose DrawDay?</h3>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-neon-purple/20 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-neon-purple" />
              </div>
              <div>
                <h4 className="text-white font-semibold mb-1">Lightning Fast</h4>
                <p className="text-gray-400 text-sm">
                  Run draws with thousands of participants in seconds
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-neon-pink/20 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-neon-pink" />
              </div>
              <div>
                <h4 className="text-white font-semibold mb-1">Secure & Fair</h4>
                <p className="text-gray-400 text-sm">
                  Transparent, auditable draws that build trust
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <Trophy className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h4 className="text-white font-semibold mb-1">Professional Tools</h4>
                <p className="text-gray-400 text-sm">Everything you need for live competitions</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h4 className="text-white font-semibold mb-1">Join 10,000+ Hosts</h4>
                <p className="text-gray-400 text-sm">Trusted by competition organizers worldwide</p>
              </div>
            </div>
          </div>

          <div className="mt-12 p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
            <p className="text-gray-300 italic">
              "DrawDay transformed our live draws. The professional presentation and transparent
              process have significantly increased viewer trust and engagement."
            </p>
            <div className="flex items-center gap-3 mt-4">
              <div className="w-10 h-10 bg-gradient-to-br from-neon-purple to-neon-pink rounded-full" />
              <div>
                <p className="text-white font-semibold text-sm">Sarah Johnson</p>
                <p className="text-gray-400 text-xs">Competition Host</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
