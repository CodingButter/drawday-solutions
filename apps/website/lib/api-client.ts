/**
 * Centralized API Client
 *
 * Single source of truth for all backend operations with:
 * - Automatic authentication handling
 * - Event hooks for CRUD operations
 * - Extension bridge integration
 * - Error handling and retries
 */

import { getStoredToken, isAuthenticated, refreshToken, logout } from './directus-auth';
import { getExtensionBridge } from './extension-bridge';

// Types for API responses
export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  status: number;
  ok: boolean;
}

// Event types
export type ApiEvent = 'beforeRequest' | 'afterRequest' | 'onCreate' | 'onRead' | 'onUpdate' | 'onDelete' | 'onError';
export type ApiEventHandler = (event: ApiEventData) => void | Promise<void>;

export interface ApiEventData {
  type: ApiEvent;
  method: string;
  url: string;
  data?: any;
  response?: any;
  error?: any;
}

// Hook system for extending functionality
class ApiHooks {
  private handlers: Map<ApiEvent, Set<ApiEventHandler>> = new Map();

  on(event: ApiEvent, handler: ApiEventHandler): () => void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set());
    }
    this.handlers.get(event)!.add(handler);

    // Return unsubscribe function
    return () => {
      this.handlers.get(event)?.delete(handler);
    };
  }

  async emit(event: ApiEvent, data: Omit<ApiEventData, 'type'>): Promise<void> {
    const handlers = this.handlers.get(event);
    if (!handlers) return;

    const eventData: ApiEventData = { type: event, ...data };

    // Run handlers in parallel
    await Promise.all(
      Array.from(handlers).map(handler =>
        Promise.resolve(handler(eventData)).catch(err =>
          console.error(`Error in ${event} handler:`, err)
        )
      )
    );
  }
}

// Main API Client class
class ApiClient {
  private hooks = new ApiHooks();
  private baseUrl = '';
  private extensionBridge = getExtensionBridge();

  constructor() {
    // Register default hook to trigger extension updates on mutations
    this.on('afterRequest', async (event) => {
      const isMutation = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(event.method);
      if (isMutation && event.response?.ok) {
        console.log(`[API] Triggering extension update after ${event.method} to ${event.url}`);

        // Delay to ensure backend has processed the change
        // DELETE operations may take longer to propagate
        const delay = event.method === 'DELETE' ? 750 : 200;

        setTimeout(() => {
          console.log(`[API] Mutation completed, triggering update after ${delay}ms delay`);
          this.extensionBridge.triggerSettingsUpdate({
            type: 'api-mutation',
            method: event.method,
            url: event.url,
            timestamp: Date.now()
          });
        }, delay);
      }
    });

    // Register CRUD-specific hooks
    this.on('afterRequest', async (event) => {
      if (!event.response?.ok) return;

      switch (event.method) {
        case 'POST':
          await this.hooks.emit('onCreate', event);
          break;
        case 'GET':
          await this.hooks.emit('onRead', event);
          break;
        case 'PUT':
        case 'PATCH':
          await this.hooks.emit('onUpdate', event);
          break;
        case 'DELETE':
          await this.hooks.emit('onDelete', event);
          break;
      }
    });
  }

  // Hook registration
  on(event: ApiEvent, handler: ApiEventHandler): () => void {
    return this.hooks.on(event, handler);
  }

  // Core request method with authentication
  private async request<T = any>(
    url: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const method = (options.method || 'GET').toUpperCase();

    // Emit before request event
    await this.hooks.emit('beforeRequest', { method, url, data: options.body });

    try {
      // Get auth token
      let token = getStoredToken();

      // Check if token is expired and try to refresh
      if (!isAuthenticated()) {
        token = await refreshToken();
        if (!token) {
          await this.handleAuthError();
          throw new Error('Authentication required');
        }
      }

      // Build request options
      const requestOptions: RequestInit = {
        ...options,
        method,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
          Authorization: `Bearer ${token}`,
        },
      };

      // Make the request
      let response = await fetch(url, requestOptions);

      // Handle 401 - try to refresh token and retry once
      if (response.status === 401) {
        token = await refreshToken();
        if (token) {
          requestOptions.headers = {
            ...requestOptions.headers,
            Authorization: `Bearer ${token}`,
          };
          response = await fetch(url, requestOptions);
        } else {
          await this.handleAuthError();
          throw new Error('Authentication required');
        }
      }

      // Parse response
      let data: T | undefined;
      const contentType = response.headers.get('content-type');

      if (contentType?.includes('application/json')) {
        try {
          data = await response.json();
        } catch (e) {
          console.warn('Failed to parse JSON response:', e);
        }
      }

      const result: ApiResponse<T> = {
        data,
        status: response.status,
        ok: response.ok,
        error: response.ok ? undefined : `Request failed with status ${response.status}`
      };

      // Emit after request event
      await this.hooks.emit('afterRequest', {
        method,
        url,
        data: options.body,
        response: result
      });

      return result;

    } catch (error: any) {
      const errorResult: ApiResponse<T> = {
        status: 0,
        ok: false,
        error: error.message || 'Network error'
      };

      // Emit error event
      await this.hooks.emit('onError', {
        method,
        url,
        data: options.body,
        error
      });

      return errorResult;
    }
  }

  private async handleAuthError() {
    await logout();
    if (typeof window !== 'undefined') {
      const inIframe = window.self !== window.top;
      const currentPath = window.location.pathname;

      if (inIframe || currentPath.startsWith('/live-spinner')) {
        window.location.href = '/live-spinner/auth/login?returnTo=' + encodeURIComponent(currentPath);
      } else {
        window.location.href = '/login?returnTo=' + encodeURIComponent(currentPath);
      }
    }
  }

  // CRUD Operations

  async get<T = any>(url: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.request<T>(url + queryString, { method: 'GET' });
  }

  async post<T = any>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T = any>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T = any>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T = any>(url: string): Promise<ApiResponse<T>> {
    return this.request<T>(url, { method: 'DELETE' });
  }

  // File upload
  async upload(url: string, file: File | Blob, fieldName = 'file'): Promise<ApiResponse> {
    const formData = new FormData();
    formData.append(fieldName, file);

    const token = getStoredToken();

    return this.request(url, {
      method: 'POST',
      headers: {
        // Don't set Content-Type, let browser set it with boundary
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
  }
}

// Create singleton instance
const apiClient = new ApiClient();

// Export instance and types
export default apiClient;
export { ApiClient };

// Convenience exports for common operations
export const api = {
  // Competitions
  competitions: {
    list: () => apiClient.get('/api/competitions'),
    get: (id: string) => apiClient.get(`/api/competitions/${id}`),
    create: (data: any) => apiClient.post('/api/competitions', data),
    update: (id: string, data: any) => apiClient.put(`/api/competitions/${id}`, data),
    delete: (id: string) => apiClient.delete(`/api/competitions/${id}`),
  },

  // Settings
  settings: {
    get: () => apiClient.get('/api/user-settings'),
    update: (data: any) => apiClient.put('/api/user-settings', data),
  },

  // Draw History
  drawHistory: {
    list: (raffleId?: string) => apiClient.get('/api/draw-history', raffleId ? { raffleId } : undefined),
    create: (data: any) => apiClient.post('/api/draw-history', data),
  },

  // Auth
  auth: {
    login: (email: string, password: string) =>
      apiClient.post('/api/auth/login', { email, password }),
    logout: () => apiClient.post('/api/auth/logout'),
    register: (data: any) => apiClient.post('/api/auth/register', data),
  },

  // Files
  files: {
    upload: (file: File | Blob) => apiClient.upload('/api/upload-file', file),
  },

  // Generic request for custom endpoints
  request: apiClient.request.bind(apiClient),
  on: apiClient.on.bind(apiClient),
};