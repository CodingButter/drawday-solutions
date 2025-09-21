/**
 * Layout for Extension Pages
 *
 * Provides context-aware navigation and route protection for extension pages
 */

import type { Metadata } from 'next';
import ExtensionLayoutClient from './extension-layout-client';

export const metadata: Metadata = {
  title: 'DrawDay Spinner Extension',
  robots: 'noindex, nofollow', // Prevent indexing of extension-specific pages
};

export default function LiveSpinnerLayout({ children }: { children: React.ReactNode }) {
  // Wrap with client component for route protection and navigation management
  return <ExtensionLayoutClient>{children}</ExtensionLayoutClient>;
}
