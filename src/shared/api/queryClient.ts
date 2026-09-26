import { QueryClient } from '@tanstack/react-query';
import { ApiError } from './ApiError';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 5 * 60_000,
      refetchOnWindowFocus: false,
      // An expired session or a denied permission will not fix itself on retry.
      retry: (failureCount, error) =>
        !(error instanceof ApiError && (error.isUnauthorized || error.isForbidden)) && failureCount < 2,
    },
    mutations: { retry: false },
  },
});
