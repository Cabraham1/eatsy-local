import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { isTokenValid } from "./token-validator";

export const config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || "https://api.plattr.org",
} as const;

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  status_code?: number;
  timestamp?: string;
  request_id?: string;
  errors?: Record<string, string[]>;
}

export interface ApiError {
  success: false;
  message: string;
  status_code: number;
  errors?: Record<string, string[]>;
}

export class ApiClientError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public errors?: Record<string, string[]>
  ) {
    super(message);
    this.name = "ApiClientError";
  }
}

// Token management
const TOKEN_STORAGE_KEY = "eatsy_access_token";
const REFRESH_TOKEN_STORAGE_KEY = "eatsy_refresh_token";

export function getAuthToken(): string | null {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function setAuthToken(token: string): void {
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
}

export function removeAuthToken(): void {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);
}

export function setRefreshToken(token: string): void {
  localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, token);
}

export function removeRefreshToken(): void {
  localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
}

// Create axios instance
const apiClient = axios.create({
  baseURL: config.apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

// Extend AxiosRequestConfig to include skipAuth
declare module "axios" {
  export interface AxiosRequestConfig {
    skipAuth?: boolean;
  }
}

// Request interceptor - Handle authentication
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Skip auth for certain endpoints (check config.skipAuth, not headers)
    const skipAuth = config.skipAuth === true;

    if (!skipAuth) {
      const token = getAuthToken();
      if (token) {
        // Validate token before using it
        if (!isTokenValid(token)) {
          removeAuthToken();
          removeRefreshToken();
          throw new ApiClientError("Your session has expired. Please login again.", 401);
        }
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    // Handle FormData: Remove Content-Type header to let Axios set it with boundary
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally and unwrap responses
apiClient.interceptors.response.use(
  (response) => {
    // Unwrap the response if it's wrapped in { success, data, message }
    const data = response.data as ApiResponse;

    // If response has the wrapped structure
    if (data && typeof data === "object" && "success" in data) {
      // Check if the request was successful
      if (data.success === false) {
        // API returned error with 2xx status code
        throw new ApiClientError(data.message || "Request failed", response.status, data.errors);
      }

      // Unwrap successful response if data field exists
      if ("data" in data) {
        response.data = data.data;
      }
    }

    return response;
  },
  (error: AxiosError) => {
    // Handle different types of errors
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data as ApiError;

      // Handle 401 Unauthorized
      if (status === 401) {
        removeAuthToken();
        removeRefreshToken();

        if (!window.location.pathname.startsWith("/auth")) {
          window.location.href = "/auth";
        }
      }

      throw new ApiClientError(
        data.message || `HTTP ${status}: ${error.message}`,
        status,
        data.errors
      );
    }

    // Network error
    if (error.request) {
      throw new ApiClientError("Network error. Please check your connection.", 0);
    }

    // Something else happened
    throw new ApiClientError(error.message || "An unexpected error occurred", 500);
  }
);

export const api = apiClient;
