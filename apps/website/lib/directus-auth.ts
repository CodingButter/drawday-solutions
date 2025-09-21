// Directus Authentication Service - Uses Next.js API routes
export interface DirectusUser {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
}

export interface AuthResponse {
  access_token: string;
  expires: number;
  refresh_token: string;
}

export async function login(
  email: string,
  password: string
): Promise<{ user: DirectusUser; tokens: AuthResponse }> {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Login failed');
  }

  const data = await response.json();

  console.log('Login response data:', data);

  // Store tokens in localStorage - tokens are at root level
  localStorage.setItem('directus_auth_token', data.access_token);
  localStorage.setItem('directus_refresh_token', data.refresh_token);
  // Directus returns expires in milliseconds (e.g., 900000 for 15 minutes)
  const expiresAt = Date.now() + data.expires;
  localStorage.setItem('directus_expires', expiresAt.toString());

  // Store user info
  localStorage.setItem('directus_user', JSON.stringify(data.user));

  return {
    user: data.user,
    tokens: {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires: data.expires
    }
  };
}

export async function register(
  email: string,
  password: string,
  firstName?: string,
  lastName?: string
) {
  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      password,
      first_name: firstName,
      last_name: lastName,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Registration failed');
  }

  const data = await response.json();

  // If tokens are provided (auto-login successful), store them
  if (data.tokens) {
    localStorage.setItem('directus_token', data.tokens.access_token);
    localStorage.setItem('directus_refresh_token', data.tokens.refresh_token);
    // Directus returns expires in milliseconds (e.g., 900000 for 15 minutes)
    const expiresAt = Date.now() + data.tokens.expires;
    localStorage.setItem('directus_expires', expiresAt.toString());
    localStorage.setItem('directus_user', JSON.stringify(data.user));
    return { user: data.user, tokens: data.tokens };
  }

  // Otherwise, prompt for manual login
  return await login(email, password);
}

export async function logout() {
  const token = localStorage.getItem('directus_token');

  if (token) {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  // Clear local storage
  localStorage.removeItem('directus_auth_token');
  localStorage.removeItem('directus_refresh_token');
  localStorage.removeItem('directus_expires');
  localStorage.removeItem('directus_user');
}

export function getStoredUser(): DirectusUser | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const userStr = localStorage.getItem('directus_user');
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }
  return null;
}

export function getStoredToken(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  return localStorage.getItem('directus_auth_token');
}

export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  const token = getStoredToken();
  const expiresStr = localStorage.getItem('directus_expires');

  if (!token || !expiresStr) {
    return false;
  }

  const expires = parseInt(expiresStr);
  return Date.now() < expires;
}

export async function refreshToken(): Promise<string | null> {
  const refreshTokenValue = localStorage.getItem('directus_refresh_token');

  if (!refreshTokenValue) {
    return null;
  }

  try {
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshTokenValue }),
    });

    if (!response.ok) {
      throw new Error('Token refresh failed');
    }

    const data = await response.json();

    // Update stored tokens
    localStorage.setItem('directus_token', data.tokens.access_token);
    // Directus returns expires in milliseconds (e.g., 900000 for 15 minutes)
    const expiresAt = Date.now() + data.tokens.expires;
    localStorage.setItem('directus_expires', expiresAt.toString());

    if (data.tokens.refresh_token) {
      localStorage.setItem('directus_refresh_token', data.tokens.refresh_token);
    }

    return data.tokens.access_token;
  } catch (error) {
    await logout();
    return null;
  }
}

// Import extension bridge for triggering updates
import { getExtensionBridge } from './extension-bridge';

// Helper function to make authenticated requests with automatic token refresh
export async function authenticatedFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  let token = getStoredToken();

  // Check if token is expired and try to refresh
  if (!isAuthenticated()) {
    token = await refreshToken();
    if (!token) {
      // Clear auth state and redirect to login
      await logout();
      if (typeof window !== 'undefined') {
        // Check if we're in an iframe (extension context)
        const inIframe = window.self !== window.top;
        const currentPath = window.location.pathname;

        // Determine the correct login page
        if (inIframe || currentPath.startsWith('/live-spinner')) {
          // Extension context or extension pages - use extension login
          window.location.href =
            '/live-spinner/auth/login?returnTo=' + encodeURIComponent(currentPath);
        } else {
          // Regular website - use main login
          window.location.href = '/login?returnTo=' + encodeURIComponent(currentPath);
        }
      }
      throw new Error('Authentication required. Please log in again.');
    }
  }

  // Make the initial request
  const requestOptions = {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  };

  let response = await fetch(url, requestOptions);

  // If we get 401, try to refresh token and retry once
  if (response.status === 401) {
    token = await refreshToken();
    if (token) {
      // Retry with new token
      requestOptions.headers = {
        ...requestOptions.headers,
        Authorization: `Bearer ${token}`,
      };
      response = await fetch(url, requestOptions);
    } else {
      // Token refresh failed, logout and redirect
      await logout();
      if (typeof window !== 'undefined') {
        // Check if we're in an iframe (extension context)
        const inIframe = window.self !== window.top;
        const currentPath = window.location.pathname;

        // Determine the correct login page
        if (inIframe || currentPath.startsWith('/live-spinner')) {
          // Extension context or extension pages - use extension login
          window.location.href =
            '/live-spinner/auth/login?returnTo=' + encodeURIComponent(currentPath);
        } else {
          // Regular website - use main login
          window.location.href = '/login?returnTo=' + encodeURIComponent(currentPath);
        }
      }
      throw new Error('Authentication required. Please log in again.');
    }
  }

  // Trigger extension update on successful mutations (POST, PUT, PATCH, DELETE)
  const method = (options.method || 'GET').toUpperCase();
  const isMutation = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method);

  if (isMutation && response.ok) {
    // Delay to ensure backend has processed the change
    // DELETE operations may take longer to propagate
    const delay = method === 'DELETE' ? 750 : 200;

    setTimeout(() => {
      const bridge = getExtensionBridge();
      console.log(`[authenticatedFetch] Triggering update after ${method} to ${url} with ${delay}ms delay`);
      bridge.triggerSettingsUpdate({
        type: 'api-mutation',
        method,
        url,
        timestamp: Date.now()
      });
    }, delay);
  }

  return response;
}
