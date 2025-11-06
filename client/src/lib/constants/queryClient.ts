import { QueryClient, DefaultOptions } from "@tanstack/react-query";
import { api, ApiClientError } from "./api-client";

const queryConfig: DefaultOptions = {
  queries: {
    refetchOnWindowFocus: false,
    retry: (failureCount, error) => {
      if (error instanceof ApiClientError && error.statusCode === 401) {
        return false;
      }
      return failureCount < 2;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  },
  mutations: {
    retry: false,
  },
};

export const queryClient = new QueryClient({
  defaultOptions: queryConfig,
});

export type GetQueryFnOptions = {
  on401?: "returnNull" | "throw";
};

/**
 * Query function wrapper for react-query that uses axios-based API client
 * @deprecated Consider using direct service calls instead (e.g., userService, authService)
 */
export function getQueryFn({ on401 = "throw" }: GetQueryFnOptions = {}) {
  return async ({ queryKey }: { queryKey: readonly unknown[] }) => {
    const endpoint = queryKey[0] as string;

    try {
      const response = await api.get(endpoint);
      return response.data;
    } catch (error) {
      if (error instanceof ApiClientError && error.statusCode === 401) {
        if (on401 === "returnNull") {
          return null;
        }
      }
      throw error;
    }
  };
}
