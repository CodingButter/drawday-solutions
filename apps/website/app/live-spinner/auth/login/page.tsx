/**
 * Extension-Specific Login Page
 *
 * Login page for Chrome extension users that redirects to /live-spinner/options after login
 */

import type { Metadata } from 'next';
import { Suspense } from 'react';
import ExtensionLoginClient from './extension-login-client';

export const metadata: Metadata = {
  title: 'Sign In - DrawDay Spinner Extension',
  description: 'Sign in to your DrawDay Spinner Chrome extension account.',
  robots: 'noindex, nofollow', // Prevent indexing of extension-specific pages
};

export default function ExtensionLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-950 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-purple-400/30 border-t-purple-400 rounded-full animate-spin" />
        </div>
      }
    >
      <ExtensionLoginClient />
    </Suspense>
  );
}
