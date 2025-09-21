/**
 * Register Page - DrawDay Solutions
 *
 * Impressive register page with glassmorphism effects, animated backgrounds,
 * and stunning visual design matching the login page and brand theme.
 */

import type { Metadata } from 'next';
import { Suspense } from 'react';
import RegisterClient from './register-client';

export const metadata: Metadata = {
  title: 'Create Account - DrawDay Spinner | Professional Live Draw Management',
  description:
    "Create your DrawDay Spinner account and access professional live draw management tools trusted by UK's leading raffle companies.",
  keywords:
    'register, sign up, create account, drawday spinner, live draw, raffle software, competition management',
};

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-night flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-purple-400/30 border-t-purple-400 rounded-full animate-spin" />
        </div>
      }
    >
      <RegisterClient />
    </Suspense>
  );
}
