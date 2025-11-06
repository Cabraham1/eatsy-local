import { createContext, ReactNode, useContext, useEffect } from "react";
import { useQuery, useMutation, UseMutationResult } from "@tanstack/react-query";
import { User as SelectUser, InsertUser } from "@shared/schema";
import { queryClient } from "../lib/constants/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { authService } from "@/services/auth.service";
import {
  ApiClientError,
  getAuthToken,
  removeAuthToken,
  removeRefreshToken,
} from "@/lib/constants/api-client";
import { CACHE_TIMES } from "@/lib/constants/cache";
import { isTokenValid, getTokenExpiration } from "@/lib/constants/token-validator";
import { ILoginCredentials, IRegisterResponse } from "@/types/auths";

interface VerifyOtpData {
  email: string;
  otp: string;
}

interface ResendOtpData {
  email: string;
}

interface ResetPasswordData {
  email: string;
}

interface ResetPasswordConfirmData {
  email: string;
  otp: string;
  new_password: string;
}

interface AuthContextType {
  user: SelectUser | null;
  isLoading: boolean;
  isFetching: boolean;
  error: Error | null;
  refetch: () => void;
  loginMutation: UseMutationResult<SelectUser, Error, ILoginCredentials>;
  logoutMutation: UseMutationResult<void, Error, void>;
  registerMutation: UseMutationResult<IRegisterResponse, Error, InsertUser>;
  verifyLoginOtpMutation: UseMutationResult<SelectUser, Error, VerifyOtpData>;
  verifyRegistrationOtpMutation: UseMutationResult<boolean, Error, VerifyOtpData>;
  resendOtpMutation: UseMutationResult<{ message: string }, Error, ResendOtpData>;
  resetPasswordMutation: UseMutationResult<{ message: string }, Error, ResetPasswordData>;
  resetPasswordConfirmMutation: UseMutationResult<
    { message: string },
    Error,
    ResetPasswordConfirmData
  >;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const useGetCurrentUser = () => {
  const token = getAuthToken();

  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      try {
        return await authService.getCurrentUser();
      } catch (error) {
        if (error instanceof ApiClientError && error.statusCode === 401) {
          return null;
        }
        throw error;
      }
    },
    enabled: !!token,
    retry: false,
    ...CACHE_TIMES.LONG,
    refetchOnWindowFocus: true,
  });
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const { data: user, error, isLoading, isFetching, refetch } = useGetCurrentUser();

  // Monitor token expiration and auto-logout
  useEffect(() => {
    const checkTokenValidity = () => {
      const token = getAuthToken();

      if (token && !isTokenValid(token)) {
        // Token is invalid or expired
        removeAuthToken();
        removeRefreshToken();
        queryClient.setQueryData(["auth", "me"], null);
        queryClient.clear();

        if (window.location.pathname !== "/auth" && window.location.pathname !== "/") {
          setLocation("/auth");
          toast({
            variant: "warning",
            title: "Session Expired",
            description: "Your session has expired. Please login again.",
          });
        }
      }
    };

    // Check immediately
    checkTokenValidity();

    // Check every minute
    const interval = setInterval(checkTokenValidity, 60000);

    // Also check before token expires
    const token = getAuthToken();
    if (token) {
      const expiration = getTokenExpiration(token);
      if (expiration) {
        const timeUntilExpiry = expiration - Date.now();
        if (timeUntilExpiry > 0 && timeUntilExpiry < 24 * 60 * 60 * 1000) {
          // Set timeout to check right before expiration
          const expiryTimeout = setTimeout(checkTokenValidity, timeUntilExpiry - 5000);
          return () => {
            clearInterval(interval);
            clearTimeout(expiryTimeout);
          };
        }
      }
    }

    return () => clearInterval(interval);
  }, [setLocation, toast]);

  const loginMutation = useMutation({
    mutationFn: async (credentials: ILoginCredentials): Promise<SelectUser> => {
      const response = await authService.login(credentials);
      if (response.tokens?.access) {
        const userData = await authService.getCurrentUser();
        if (userData) {
          return userData;
        }
        throw new Error("Failed to fetch user data");
      }
      throw new Error("Login failed: No tokens received");
    },
    onSuccess: (userData) => {
      queryClient.setQueryData(["auth", "me"], userData);
      refetch();
      setLocation("/for-you");
      toast({
        variant: "success",
        title: "Login successful",
        description: `Welcome back, ${userData.fullName || userData.username}!`,
      });
    },
    onError: (error: Error) => {
      const message = error instanceof ApiClientError ? error.message : "Invalid email or password";
      toast({
        variant: "destructive",
        title: "Login failed",
        description: message,
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (credentials: InsertUser) => {
      return await authService.register(credentials);
    },
    onSuccess: (response) => {
      toast({
        variant: "info",
        title: "Registration successful",
        description: response.message || "Please verify OTP sent to your email/SMS.",
      });
    },
    onError: (error: Error) => {
      const message = error instanceof ApiClientError ? error.message : "Could not create account";
      toast({
        title: "Registration failed",
        description: message,
      });
    },
  });

  const verifyLoginOtpMutation = useMutation({
    mutationFn: async (data: VerifyOtpData): Promise<SelectUser> => {
      const response = await authService.verifyLoginOtp(data);
      if (response.tokens?.access) {
        const userData = await authService.getCurrentUser();
        if (userData) {
          return userData;
        }
        throw new Error("Failed to fetch user data");
      }
      throw new Error("OTP verification failed: No tokens received");
    },
    onSuccess: (userData) => {
      queryClient.setQueryData(["auth", "me"], userData);
      refetch();
      setLocation("/home");
      toast({
        variant: "success",
        title: "Login successful",
        description: `Welcome back, ${userData.fullName || userData.username}!`,
      });
    },
    onError: (error: Error) => {
      const message =
        error instanceof ApiClientError ? error.message : "Invalid OTP. Please try again.";
      toast({
        title: "Verification failed",
        description: message,
        variant: "destructive",
      });
    },
  });

  const verifyRegistrationOtpMutation = useMutation({
    mutationFn: async (data: VerifyOtpData): Promise<boolean> => {
      await authService.verifyRegistrationOtp(data);
      return true;
    },
    onSuccess: () => {
      toast({
        variant: "success",
        title: "Registration verified successfully",
        description: "Please login with your credentials to continue.",
      });
    },
    onError: (error: Error) => {
      const message =
        error instanceof ApiClientError ? error.message : "Invalid OTP. Please try again.";
      toast({
        title: "Verification failed",
        description: message,
        variant: "destructive",
      });
    },
  });

  const resendOtpMutation = useMutation({
    mutationFn: async (data: ResendOtpData) => {
      return await authService.resendOtp(data);
    },
    onSuccess: (response) => {
      toast({
        variant: "info",
        title: "OTP Resent",
        description: response.message || "A new OTP has been sent to your email/SMS.",
      });
    },
    onError: (error: Error) => {
      const message =
        error instanceof ApiClientError ? error.message : "Failed to resend OTP. Please try again.";
      toast({
        title: "Resend failed",
        description: message,
        variant: "destructive",
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      queryClient.setQueryData(["auth", "me"], null);
      queryClient.clear();
      setLocation("/");

      toast({
        variant: "info",
        title: "Logged out",
        description: "You have been successfully logged out",
      });
    },
    onError: () => {
      queryClient.setQueryData(["auth", "me"], null);
      queryClient.clear();
      setLocation("/");
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: async (data: ResetPasswordData) => {
      return await authService.resetPassword(data);
    },
    onSuccess: (response) => {
      toast({
        variant: "info",
        title: "OTP Sent",
        description: response.message || "Password reset OTP has been sent to your email.",
      });
    },
    onError: (error: Error) => {
      const message =
        error instanceof ApiClientError ? error.message : "Failed to send OTP. Please try again.";
      toast({
        title: "Failed to send OTP",
        description: message,
        variant: "destructive",
      });
    },
  });

  const resetPasswordConfirmMutation = useMutation({
    mutationFn: async (data: ResetPasswordConfirmData) => {
      return await authService.resetPasswordConfirm(data);
    },
    onSuccess: (response) => {
      toast({
        variant: "success",
        title: "Password Reset Successful",
        description: response.message || "Your password has been reset successfully.",
      });
    },
    onError: (error: Error) => {
      const message =
        error instanceof ApiClientError
          ? error.message
          : "Failed to reset password. Please try again.";
      toast({
        title: "Password Reset Failed",
        description: message,
        variant: "destructive",
      });
    },
  });

  const contextValue: AuthContextType = {
    user: user as SelectUser | null,
    isLoading,
    isFetching,
    error: error as Error | null,
    refetch,
    loginMutation,
    logoutMutation,
    registerMutation,
    verifyLoginOtpMutation,
    verifyRegistrationOtpMutation,
    resendOtpMutation,
    resetPasswordMutation,
    resetPasswordConfirmMutation,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}

// Custom hook to use the auth context
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
