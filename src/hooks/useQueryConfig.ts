import { QueryKey, UseQueryOptions } from '@tanstack/react-query';

const DEFAULT_STALE_TIME = 5 * 60 * 1000;

const DEFAULT_CACHE_TIME = 10 * 60 * 1000;

// kinda option that is used to override query options
type QueryConfigOptions = Partial<{
  staleTime: number;
  cacheTime: number;
  refetchOnWindowFocus: boolean;
  refetchOnMount: boolean;
  refetchOnReconnect: boolean;
  retry: boolean | number;
  retryDelay: number;
}>;

/**
 * 
 * @param options - to override default query options
 * @returns 
 */
export const useQueryConfig = <TData = unknown, TError = unknown>(
  options?: QueryConfigOptions
): Partial<UseQueryOptions<TData, TError>> => {
  return {
    staleTime: DEFAULT_STALE_TIME,
    cacheTime: DEFAULT_CACHE_TIME,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
    retry: 1,
    ...options,
  };
};

/**
 * create consistent query keys
 * @param scope 
 * @param params 
 * @returns 
 */
export const createQueryKey = (scope: string, ...params: any[]): QueryKey => {
  return [scope, ...(params.filter(p => p !== undefined))];
};

/**
 * query keys for the app
 */
export const queryKeys = {
  queue: {
    all: ['queue'] as const,
    timeSort: ['queue', 'time'] as const,
    donationSort: ['queue', 'donation'] as const,
    detail: (id: string) => ['queue', 'detail', id] as const,
  },
  spotify: {
    search: (query: string) => ['spotify', 'search', query] as const,
  },
}; 