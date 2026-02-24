'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { createDirectus, authentication, rest, registerUser, updateMe } from '@directus/sdk';

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'https://cms.drawday.app';

const directus = createDirectus(DIRECTUS_URL).with(authentication('json')).with(rest());

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    companyName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      const nameParts = formData.fullName.trim().split(/\s+/);
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      // Register via Directus public registration
      await directus.request(
        registerUser(formData.email, formData.password, {
          first_name: firstName,
          last_name: lastName,
        })
      );

      // Login to get a token
      await directus.login(formData.email, formData.password);

      // Update custom fields on own profile
      await directus.request(
        updateMe({
          phone: formData.phone || null,
          company_name_input: formData.companyName || null,
        } as Record<string, unknown>)
      );

      setSuccess(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed';
      if (message.includes('already')) {
        setError('An account with this email already exists.');
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <>
        <Navigation />
        <main className="min-h-screen bg-night flex items-center justify-center px-4 pt-20">
          <div className="w-full max-w-md text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-950/50 border border-emerald-800 flex items-center justify-center mb-6">
              <svg
                className="w-8 h-8 text-emerald-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-3">Account Created</h1>
            <p className="text-gray-400 mb-6">
              Your account has been created. You can now sign in.
            </p>
            <Link
              href="/login"
              className="inline-block bg-drawday-gold hover:bg-drawday-gold/90 text-drawday-navy font-semibold py-2.5 px-6 rounded-lg transition-colors"
            >
              Go to Sign In
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-night flex items-center justify-center px-4 pt-20 pb-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
            <p className="text-gray-400">Set up your company account to get started</p>
          </div>

          <div className="bg-gray-900/50 rounded-2xl p-8 border border-gray-800">
            {error && (
              <div className="mb-4 p-3 bg-red-950/30 border border-red-900/50 rounded-lg">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium text-gray-300 mb-1.5"
                >
                  Full Name *
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="John Smith"
                  required
                  disabled={loading}
                  autoComplete="name"
                  className="w-full px-4 py-2.5 bg-gray-950 border border-gray-700 rounded-lg focus:ring-2 focus:ring-drawday-gold/50 focus:border-drawday-gold outline-none text-white placeholder-gray-500 disabled:opacity-50"
                />
              </div>

              <div>
                <label
                  htmlFor="companyName"
                  className="block text-sm font-medium text-gray-300 mb-1.5"
                >
                  Company Name *
                </label>
                <input
                  id="companyName"
                  name="companyName"
                  type="text"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="Acme Raffles Ltd"
                  required
                  disabled={loading}
                  autoComplete="organization"
                  className="w-full px-4 py-2.5 bg-gray-950 border border-gray-700 rounded-lg focus:ring-2 focus:ring-drawday-gold/50 focus:border-drawday-gold outline-none text-white placeholder-gray-500 disabled:opacity-50"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1.5">
                  Phone
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+44 7700 900000"
                  disabled={loading}
                  autoComplete="tel"
                  className="w-full px-4 py-2.5 bg-gray-950 border border-gray-700 rounded-lg focus:ring-2 focus:ring-drawday-gold/50 focus:border-drawday-gold outline-none text-white placeholder-gray-500 disabled:opacity-50"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1.5">
                  Email *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@company.com"
                  required
                  disabled={loading}
                  autoComplete="email"
                  className="w-full px-4 py-2.5 bg-gray-950 border border-gray-700 rounded-lg focus:ring-2 focus:ring-drawday-gold/50 focus:border-drawday-gold outline-none text-white placeholder-gray-500 disabled:opacity-50"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-300 mb-1.5"
                >
                  Password *
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="At least 6 characters"
                  required
                  disabled={loading}
                  autoComplete="new-password"
                  className="w-full px-4 py-2.5 bg-gray-950 border border-gray-700 rounded-lg focus:ring-2 focus:ring-drawday-gold/50 focus:border-drawday-gold outline-none text-white placeholder-gray-500 disabled:opacity-50"
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-300 mb-1.5"
                >
                  Confirm Password *
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repeat your password"
                  required
                  disabled={loading}
                  autoComplete="new-password"
                  className="w-full px-4 py-2.5 bg-gray-950 border border-gray-700 rounded-lg focus:ring-2 focus:ring-drawday-gold/50 focus:border-drawday-gold outline-none text-white placeholder-gray-500 disabled:opacity-50"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-drawday-gold hover:bg-drawday-gold/90 disabled:opacity-50 text-drawday-navy font-semibold py-2.5 rounded-lg transition-colors"
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-gray-400">Already have an account? </span>
              <Link href="/login" className="text-drawday-gold hover:underline font-medium">
                Sign in
              </Link>
            </div>

            <p className="mt-4 text-xs text-center text-gray-500">
              By creating an account, you agree to our{' '}
              <Link href="/privacy" className="underline hover:text-gray-400">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
