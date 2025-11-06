import { useMutation } from "@tanstack/react-query";
import {
  api,
  setAuthToken,
  removeAuthToken,
  setRefreshToken,
  getRefreshToken,
  removeRefreshToken,
} from "@/lib/constants/api-client";
import { API_ENDPOINTS } from "@/lib/constants/config";
import {  User } from "@shared/schema";
import { ILoginCredentials, ILoginResponse, IRegisterCredentials, IRegisterResponse, IResendOtpRequest, IResetPasswordRequest, IVerifyOtpRequest } from "@/types/auths";
import { IResetPasswordConfirmRequest } from "@/types/auths";


// API functions
const login = async (credentials: ILoginCredentials): Promise<ILoginResponse> => {
  const response = await api.post<ILoginResponse>(API_ENDPOINTS.auth.login, credentials, {
    skipAuth: true,
  });

  if (response.data?.tokens) {
    if (response.data.tokens.access) {
      setAuthToken(response.data.tokens.access);
    }
    if (response.data.tokens.refresh) {
      setRefreshToken(response.data.tokens.refresh);
    }
  }

  return response.data!;
};

const register = async (credentials: IRegisterCredentials): Promise<IRegisterResponse> => {
  const response = await api.post<IRegisterResponse>(API_ENDPOINTS.auth.register, credentials, {
    skipAuth: true,
  });

  if (response.data?.token) {
    setAuthToken(response.data.token);
  }

  return response.data!;
};

const verifyLoginOtp = async (data: IVerifyOtpRequest): Promise<ILoginResponse> => {
  const response = await api.post<ILoginResponse>(API_ENDPOINTS.auth.verifyLoginOtp, data, {
    skipAuth: true,
  });

  if (response.data?.tokens) {
    if (response.data.tokens.access) {
      setAuthToken(response.data.tokens.access);
    }
    if (response.data.tokens.refresh) {
      setRefreshToken(response.data.tokens.refresh);
    }
  }

  return response.data!;
};

const verifyRegistrationOtp = async (data: IVerifyOtpRequest): Promise<ILoginResponse> => {
  const response = await api.post<ILoginResponse>(API_ENDPOINTS.auth.verifyRegistrationOtp, data, {
    skipAuth: true,
  });

  if (response.data?.tokens?.access) {
    setAuthToken(response.data.tokens.access);
  }

  return response.data!;
};

const resendOtp = async (data: IResendOtpRequest): Promise<{ message: string }> => {
  const response = await api.post<{ message: string }>(
    API_ENDPOINTS.auth.resendRegistrationOtp,
    data,
    { skipAuth: true }
  );

  return response.data!;
};

const logout = async (): Promise<void> => {
  const refreshToken = getRefreshToken();

  try {
    if (refreshToken) {
      await api.post(API_ENDPOINTS.auth.logout, { refresh: refreshToken });
    }
  } finally {
    removeAuthToken();
    removeRefreshToken();
  }
};

const getCurrentUser = async (): Promise<User | null> => {
  try {
    const response = await api.get<User>(API_ENDPOINTS.auth.me);
    return response.data || null;
  } catch (error) {
    removeAuthToken();
    removeRefreshToken();
    return null;
  }
};

const resetPassword = async (data: IResetPasswordRequest): Promise<{ message: string }> => {
  const response = await api.post<{ message: string }>(API_ENDPOINTS.auth.resetPassword, data, {
    skipAuth: true,
  });

  return response.data!;
};

const resetPasswordConfirm = async (
  data: IResetPasswordConfirmRequest
): Promise<{ message: string }> => {
  const response = await api.post<{ message: string }>(
    API_ENDPOINTS.auth.resetPasswordConfirm,
    data,
    { skipAuth: true }
  );

  return response.data!;
};

export const authService = {
  login,
  register,
  verifyLoginOtp,
  verifyRegistrationOtp,
  resendOtp,
  logout,
  getCurrentUser,
  resetPassword,
  resetPasswordConfirm,
};

// Hooks (for direct use in components)
export const useLogin = () => {
  const { isPending, error, mutate, mutateAsync } = useMutation({
    mutationKey: ["auth", "login"],
    mutationFn: login,
  });

  return {
    isLoading: isPending,
    error,
    login: mutate,
    loginAsync: mutateAsync,
  };
};

export const useRegister = () => {
  const { isPending, error, mutate, mutateAsync } = useMutation({
    mutationKey: ["auth", "register"],
    mutationFn: register,
  });

  return {
    isLoading: isPending,
    error,
    register: mutate,
    registerAsync: mutateAsync,
  };
};

export const useVerifyLoginOtp = () => {
  const { isPending, error, mutate, mutateAsync } = useMutation({
    mutationKey: ["auth", "verify-login-otp"],
    mutationFn: verifyLoginOtp,
  });

  return {
    isLoading: isPending,
    error,
    verifyOtp: mutate,
    verifyOtpAsync: mutateAsync,
  };
};

export const useVerifyRegistrationOtp = () => {
  const { isPending, error, mutate, mutateAsync } = useMutation({
    mutationKey: ["auth", "verify-registration-otp"],
    mutationFn: verifyRegistrationOtp,
  });

  return {
    isLoading: isPending,
    error,
    verifyOtp: mutate,
    verifyOtpAsync: mutateAsync,
  };
};

export const useResendOtp = () => {
  const { isPending, error, mutate, mutateAsync } = useMutation({
    mutationKey: ["auth", "resend-otp"],
    mutationFn: resendOtp,
  });

  return {
    isLoading: isPending,
    error,
    resendOtp: mutate,
    resendOtpAsync: mutateAsync,
  };
};

export const useLogout = () => {
  const { isPending, error, mutate, mutateAsync } = useMutation({
    mutationKey: ["auth", "logout"],
    mutationFn: logout,
  });

  return {
    isLoading: isPending,
    error,
    logout: mutate,
    logoutAsync: mutateAsync,
  };
};

export const useResetPassword = () => {
  const { isPending, error, mutate, mutateAsync } = useMutation({
    mutationKey: ["auth", "reset-password"],
    mutationFn: resetPassword,
  });

  return {
    isLoading: isPending,
    error,
    resetPassword: mutate,
    resetPasswordAsync: mutateAsync,
  };
};

export const useResetPasswordConfirm = () => {
  const { isPending, error, mutate, mutateAsync } = useMutation({
    mutationKey: ["auth", "reset-password-confirm"],
    mutationFn: resetPasswordConfirm,
  });

  return {
    isLoading: isPending,
    error,
    confirmReset: mutate,
    confirmResetAsync: mutateAsync,
  };
};
