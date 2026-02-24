'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { createDirectus, authentication, rest } from '@directus/sdk';

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || 'https://cms.drawday.app';

const directus = createDirectus(DIRECTUS_URL).with(authentication('json')).with(rest());

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await directus.login(email, password);
      router.push('/');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sign in failed';
      if (message.includes('Invalid') || message.includes('credentials')) {
        setError('Invalid email or password.');
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-night flex items-center justify-center px-4 pt-20">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Sign In</h1>
            <p className="text-gray-400">Sign in to your DrawDay account</p>
          </div>

          <div className="bg-gray-900/50 rounded-2xl p-8 border border-gray-800">
            {error && (
              <div className="mb-4 p-3 bg-red-950/30 border border-red-900/50 rounded-lg">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1.5">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  disabled={loading}
                  autoComplete="current-password"
                  className="w-full px-4 py-2.5 bg-gray-950 border border-gray-700 rounded-lg focus:ring-2 focus:ring-drawday-gold/50 focus:border-drawday-gold outline-none text-white placeholder-gray-500 disabled:opacity-50"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-drawday-gold hover:bg-drawday-gold/90 disabled:opacity-50 text-drawday-navy font-semibold py-2.5 rounded-lg transition-colors"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-gray-400">Don&apos;t have an account? </span>
              <Link href="/register" className="text-drawday-gold hover:underline font-medium">
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
