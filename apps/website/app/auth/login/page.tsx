'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import LoginForm from '@/components/auth/LoginForm';

export default function LoginPage() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/dashboard';

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            DrawDay Spinner
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Professional raffle management made simple
          </p>
        </div>

        <LoginForm redirectTo={redirectTo} />

        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{' '}
            <Link
              href="/auth/register"
              className="font-medium text-purple-600 hover:text-purple-500 dark:text-purple-400"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}