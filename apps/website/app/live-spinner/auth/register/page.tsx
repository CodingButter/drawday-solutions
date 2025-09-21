/**
 * Extension-Specific Register Page
 *
 * Registration page for Chrome extension users that redirects to login after registration
 */

import type { Metadata } from 'next';
import { Suspense } from 'react';
import ExtensionRegisterClient from './extension-register-client';

export const metadata: Metadata = {
  title: 'Create Account - DrawDay Spinner Extension',
  description: 'Create your DrawDay Spinner Chrome extension account.',
  robots: 'noindex, nofollow', // Prevent indexing of extension-specific pages
};

export default function ExtensionRegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-950 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-purple-400/30 border-t-purple-400 rounded-full animate-spin" />
        </div>
      }
    >
      <ExtensionRegisterClient />
    </Suspense>
  );
}
