'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@raffle-spinner/ui';
import { RegisterForm } from '@/components/auth/RegisterForm';

function RegisterPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isInIframe, setIsInIframe] = useState(false);
  
  // Check if we're in an iframe (extension)
  useEffect(() => {
    setIsInIframe(window.parent !== window);
  }, []);
  
  // Get redirect from URL params, defaulting to /live-spinner/options for iframe (extension)
  const fromParam = searchParams?.get('from');
  const redirectParam = searchParams?.get('redirect');
  const defaultRedirect = isInIframe ? '/live-spinner/options' : '/dashboard';
  const redirectTo = redirectParam || fromParam || defaultRedirect;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Create Your Account
          </CardTitle>
          <CardDescription className="text-center">
            Join DrawDay Spinner and start managing your raffles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RegisterForm 
            onSuccess={() => router.push(redirectTo)}
            onLoginClick={() => router.push(`/auth/login?redirect=${encodeURIComponent(redirectTo)}`)}
            redirectTo={redirectTo}
          />
        </CardContent>
      </Card>
    </div>
  );
}

export default function ExtensionRegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Loading...</CardTitle>
          </CardHeader>
        </Card>
      </div>
    }>
      <RegisterPageContent />
    </Suspense>
  );
}