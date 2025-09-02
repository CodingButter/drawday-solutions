'use client';

import { usePathname } from 'next/navigation';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';

export function LayoutContent({ children }: { children: React.ReactNode }) {
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
      <Navigation />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}