/**
 * useApi Hook
 *
 * React hook for interacting with the API client
 * Provides loading states, error handling, and automatic re-renders
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import apiClient, { ApiResponse, ApiEvent, ApiEventHandler, api } from '@/lib/api-client';

interface UseApiState<T = any> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
  autoFetch?: boolean;
}

export function useApi<T = any>(
  fetcher?: () => Promise<ApiResponse<T>>,
  options: UseApiOptions = {}
) {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const mountedRef = useRef(true);

  // Auto-fetch on mount if requested
  useEffect(() => {
    if (options.autoFetch && fetcher) {
      execute();
    }

    return () => {
      mountedRef.current = false;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const execute = useCallback(async (customFetcher?: () => Promise<ApiResponse<T>>) => {
    const fetchFn = customFetcher || fetcher;
    if (!fetchFn) return;

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetchFn();

      if (!mountedRef.current) return;

      if (response.ok) {
        setState({
          data: response.data,
          loading: false,
          error: null,
        });
        options.onSuccess?.(response.data);
      } else {
        const errorMsg = response.error || 'Request failed';
        setState({
          data: null,
          loading: false,
          error: errorMsg,
        });
        options.onError?.(errorMsg);
      }

      return response;
    } catch (error: any) {
      if (!mountedRef.current) return;

      const errorMsg = error.message || 'An unexpected error occurred';
      setState({
        data: null,
        loading: false,
        error: errorMsg,
      });
      options.onError?.(errorMsg);

      return {
        ok: false,
        error: errorMsg,
        status: 0,
      } as ApiResponse<T>;
    }
  }, [fetcher, options]);

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
  }, []);

  return {
    ...state,
    execute,
    reset,
    refetch: execute,
  };
}

// Hook for subscribing to API events
export function useApiEvent(
  event: ApiEvent,
  handler: ApiEventHandler,
  deps: React.DependencyList = []
) {
  useEffect(() => {
    const unsubscribe = apiClient.on(event, handler);
    return unsubscribe;
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps
}

// Pre-configured hooks for common resources

export function useCompetitions() {
  return useApi(() => api.competitions.list(), { autoFetch: true });
}

export function useCompetition(id: string | null) {
  return useApi(
    id ? () => api.competitions.get(id) : undefined,
    { autoFetch: !!id }
  );
}

export function useSettings() {
  return useApi(() => api.settings.get(), { autoFetch: true });
}

export function useDrawHistory(raffleId?: string) {
  return useApi(() => api.drawHistory.list(raffleId), { autoFetch: true });
}

// Mutation hooks with automatic refetch triggers

export function useCreateCompetition() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = useCallback(async (data: any) => {
    setLoading(true);
    setError(null);

    const response = await api.competitions.create(data);

    setLoading(false);

    if (!response.ok) {
      setError(response.error || 'Failed to create competition');
      throw new Error(response.error);
    }

    return response.data;
  }, []);

  return { create, loading, error };
}

export function useUpdateCompetition() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = useCallback(async (id: string, data: any) => {
    setLoading(true);
    setError(null);

    const response = await api.competitions.update(id, data);

    setLoading(false);

    if (!response.ok) {
      setError(response.error || 'Failed to update competition');
      throw new Error(response.error);
    }

    return response.data;
  }, []);

  return { update, loading, error };
}

export function useDeleteCompetition() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteCompetition = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);

    const response = await api.competitions.delete(id);

    setLoading(false);

    if (!response.ok) {
      setError(response.error || 'Failed to delete competition');
      throw new Error(response.error);
    }

    return response.data;
  }, []);

  return { delete: deleteCompetition, loading, error };
}

// Export everything
export default useApi;