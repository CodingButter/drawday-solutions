/**
 * Extension Context Detection Utilities
 *
 * Utilities to detect if the app is running within the Chrome extension context
 * and manage extension-specific behavior
 */

/**
 * Check if the current page is loaded within a Chrome extension iframe
 * This checks for:
 * 1. Being in an iframe
 * 2. Running on a chrome-extension:// URL (parent)
 * 3. Being on a /live-spinner/* route
 */
export function isExtensionContext(): boolean {
  if (typeof window === 'undefined') return false;

  try {
    // Check if we're in an iframe
    const inIframe = window.self !== window.top;

    // Check if we're on a /live-spinner/* route
    const isExtensionRoute = window.location.pathname.startsWith('/live-spinner/');

    // Check for extension-specific query parameter
    const params = new URLSearchParams(window.location.search);
    const hasExtensionParam = params.get('context') === 'extension';

    return inIframe && (isExtensionRoute || hasExtensionParam);
  } catch (e) {
    // If we can't access window.top due to cross-origin, we might be in extension
    return window.location.pathname.startsWith('/live-spinner/');
  }
}

/**
 * Get the appropriate login URL based on context
 */
export function getLoginUrl(returnTo?: string): string {
  if (isExtensionContext()) {
    const url = '/live-spinner/auth/login';
    if (returnTo) {
      return `${url}?returnTo=${encodeURIComponent(returnTo)}`;
    }
    return url;
  }

  const url = '/login';
  if (returnTo) {
    return `${url}?from=${encodeURIComponent(returnTo)}`;
  }
  return url;
}

/**
 * Get the appropriate register URL based on context
 */
export function getRegisterUrl(returnTo?: string): string {
  if (isExtensionContext()) {
    const url = '/live-spinner/auth/register';
    if (returnTo) {
      return `${url}?returnTo=${encodeURIComponent(returnTo)}`;
    }
    return url;
  }

  return '/register';
}

/**
 * Get the post-login redirect URL based on context
 */
export function getPostLoginRedirect(): string {
  if (isExtensionContext()) {
    // Always redirect to options page in extension context
    return '/live-spinner/options';
  }

  // Regular website redirects to dashboard
  return '/dashboard';
}

/**
 * Check if a URL is allowed in extension context
 * Only /live-spinner/* routes are allowed
 */
export function isAllowedInExtension(url: string): boolean {
  try {
    const urlObj = new URL(url, window.location.origin);
    return urlObj.pathname.startsWith('/live-spinner/');
  } catch {
    // If it's a relative path
    return url.startsWith('/live-spinner/');
  }
}

/**
 * Sanitize navigation URL for extension context
 * Prevents navigation outside of allowed routes
 */
export function sanitizeExtensionUrl(url: string): string {
  if (!isExtensionContext()) {
    return url;
  }

  if (isAllowedInExtension(url)) {
    return url;
  }

  // Redirect to options page if trying to navigate outside allowed routes
  return '/live-spinner/options';
}
