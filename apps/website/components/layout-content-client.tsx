'use client';

import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

interface LayoutContentClientProps {
  children: ReactNode;
  navigation: ReactNode;
  footer: ReactNode;
}

export function LayoutContentClient({ children, navigation, footer }: LayoutContentClientProps) {
  const pathname = usePathname();

  // Don't show nav/footer on live-spinner pages (they will be iframed)
  const isLiveSpinnerPage = pathname?.startsWith('/live-spinner');
  // Don't show nav/footer on auth pages (for clean iframe experience)
  const isAuthPage = pathname?.startsWith('/auth');

  if (isLiveSpinnerPage || isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {navigation}
      <main className="flex-1">{children}</main>
      {footer}
    </div>
  );
}
