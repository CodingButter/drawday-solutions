'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@raffle-spinner/ui';
import { LoginForm } from '@/components/auth/LoginForm';

export default function ExtensionLoginPage() {
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
            Sign In to DrawDay Spinner
          </CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm 
            onSuccess={() => router.push(redirectTo)}
            onRegisterClick={() => router.push('/auth/register')}
            redirectTo={redirectTo}
          />
        </CardContent>
      </Card>
    </div>
  );
}