'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  isExtensionContext,
  isAllowedInExtension,
  sanitizeExtensionUrl,
} from '@/lib/extension-utils';

/**
 * Extension Layout Client Component
 *
 * Handles route protection and navigation management for extension pages
 */
export default function ExtensionLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Only enforce restrictions if we're in extension context (iframe)
    const checkAndEnforceRoutes = () => {
      // Check if we're in an iframe (extension context)
      const inIframe = typeof window !== 'undefined' && window.self !== window.top;

      if (inIframe) {
        // We're in extension context - ensure we're on allowed routes
        if (!isAllowedInExtension(pathname)) {
          console.warn(
            `[Extension Guard] Blocked navigation to ${pathname} - redirecting to options`
          );
          router.replace('/live-spinner/options');
          return;
        }
      }
    };

    checkAndEnforceRoutes();
  }, [pathname, router]);

  // Override link clicks to prevent navigation outside extension routes
  useEffect(() => {
    const inIframe = typeof window !== 'undefined' && window.self !== window.top;

    if (!inIframe) {
      // Not in extension context, no need to override
      return;
    }

    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');

      if (!link) return;

      const href = link.getAttribute('href');
      if (!href) return;

      // Check if this is an external link
      if (href.startsWith('http://') || href.startsWith('https://')) {
        // Allow external links - they'll open in new tab
        return;
      }

      // Check if this is an allowed internal route
      if (!isAllowedInExtension(href)) {
        e.preventDefault();
        console.warn(`[Extension Guard] Blocked navigation to ${href}`);

        // If it's a login/register link, redirect to extension-specific auth
        if (href.includes('/login')) {
          router.push('/live-spinner/auth/login?returnTo=/live-spinner/options');
        } else if (href.includes('/register')) {
          router.push('/live-spinner/auth/register?returnTo=/live-spinner/options');
        } else {
          // For other links, just stay on current page or go to options
          router.push('/live-spinner/options');
        }
      }
    };

    // Add event listener to intercept all link clicks
    document.addEventListener('click', handleLinkClick, true);

    return () => {
      document.removeEventListener('click', handleLinkClick, true);
    };
  }, [router]);

  // Override browser navigation (back/forward buttons)
  useEffect(() => {
    const inIframe = typeof window !== 'undefined' && window.self !== window.top;

    if (!inIframe) {
      return;
    }

    const handlePopState = (e: PopStateEvent) => {
      const currentPath = window.location.pathname;

      if (!isAllowedInExtension(currentPath)) {
        console.warn(`[Extension Guard] Blocked history navigation to ${currentPath}`);
        // Push back to options page instead
        window.history.pushState(null, '', '/live-spinner/options');
        router.replace('/live-spinner/options');
      }
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [router]);

  // No wrapper needed, just return children with protection active
  return <>{children}</>;
}
