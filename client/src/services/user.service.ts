import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/constants/api-client";
import { API_ENDPOINTS } from "@/lib/constants/config";
import { IChangePasswordRequest, IUpdateProfileRequest, IRoleChangeRequest } from "@/types/auths";

// API functions
const updateProfile = (payload: IUpdateProfileRequest) =>
  api.put(API_ENDPOINTS.users.updateProfile, payload).then((res) => res.data);

const changePassword = (payload: IChangePasswordRequest) =>
  api.post(API_ENDPOINTS.users.changePassword, payload).then((res) => res.data);

const deleteAccount = () => api.delete(API_ENDPOINTS.users.deleteAccount).then((res) => res.data);

const requestRoleChange = (payload: IRoleChangeRequest) =>
  api.post(API_ENDPOINTS.users.roleChangeRequest, payload).then((res) => res.data);

// Hooks
export const useUpdateProfile = () => {
  const { isPending, error, mutate, mutateAsync } = useMutation({
    mutationKey: ["user", "update-profile"],
    mutationFn: updateProfile,
  });

  return {
    isLoading: isPending,
    error,
    updateProfile: mutate,
    updateProfileAsync: mutateAsync,
  };
};

export const useChangePassword = () => {
  const { isPending, error, mutate, mutateAsync } = useMutation({
    mutationKey: ["user", "change-password"],
    mutationFn: changePassword,
  });

  return {
    isLoading: isPending,
    error,
    changePassword: mutate,
    changePasswordAsync: mutateAsync,
  };
};

export const useDeleteAccount = () => {
  const { isPending, error, mutate, mutateAsync } = useMutation({
    mutationKey: ["user", "delete-account"],
    mutationFn: deleteAccount,
  });

  return {
    isLoading: isPending,
    error,
    deleteAccount: mutate,
    deleteAccountAsync: mutateAsync,
  };
};

export const useRequestRoleChange = () => {
  const { isPending, error, mutate, mutateAsync } = useMutation({
    mutationKey: ["user", "role-change-request"],
    mutationFn: requestRoleChange,
  });

  return {
    isLoading: isPending,
    error,
    requestRoleChange: mutate,
    requestRoleChangeAsync: mutateAsync,
  };
};
