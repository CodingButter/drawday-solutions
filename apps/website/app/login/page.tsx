/**
 * Login Page - DrawDay Solutions
 * 
 * Impressive login page with glassmorphism effects, animated backgrounds,
 * social login options, and stunning visual design matching the brand theme.
 */

import type { Metadata } from 'next';
import { Suspense } from 'react';
import LoginClient from './login-client';

export const metadata: Metadata = {
  title: 'Sign In - DrawDay Spinner | Professional Live Draw Management',
  description: 'Sign in to your DrawDay Spinner account and access professional live draw management tools trusted by UK\'s leading raffle companies.',
  keywords: 'login, sign in, drawday spinner, live draw, raffle software, competition management',
};

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-night flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-purple-400/30 border-t-purple-400 rounded-full animate-spin" />
    </div>}>
      <LoginClient />
    </Suspense>
  );
}