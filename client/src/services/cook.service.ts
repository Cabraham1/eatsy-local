import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/constants/api-client";
import { API_ENDPOINTS } from "@/lib/constants/config";
import { CACHE_TIMES } from "@/lib/constants/cache";

export type VerificationStatus = "not_submitted" | "under_review" | "verified" | "rejected";

export interface OnboardingStatusResponse {
  cook: number;
  bio: string;
  verification_status: VerificationStatus;
  id_document_url: string;
  bank_account_number: string;
  bank_name: string;
  account_holder_name: string;
  rejection_reason: string | null;
  verified_at: string | null;
  verified_by: number | null;
  cook_user: {
    username: string;
    email: string;
    first_name: string;
    last_name: string;
  };
  created_at: string;
  updated_at: string;
}

export interface OnboardingFormData {
  bio: string;
  bank_account_number: string;
  bank_name: string;
  account_holder_name: string;
  id_document: File;
}

// API functions
const getOnboardingStatus = () =>
  api.get<OnboardingStatusResponse>(API_ENDPOINTS.cooks.onboardingStatus).then((res) => res.data);

const submitOnboarding = (formData: FormData) =>
  api
    .post(API_ENDPOINTS.cooks.onboard, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => res.data);

// Hooks
export const useOnboardingStatus = () => {
  return useQuery<OnboardingStatusResponse>({
    queryKey: ["cook", "onboarding-status"],
    queryFn: getOnboardingStatus,
    retry: false,
    ...CACHE_TIMES.NONE,
  });
};

export const useSubmitOnboarding = () => {
  const { isPending, error, mutate, mutateAsync } = useMutation({
    mutationKey: ["cook", "submit-onboarding"],
    mutationFn: submitOnboarding,
  });

  return {
    isLoading: isPending,
    error,
    submitOnboarding: mutate,
    submitOnboardingAsync: mutateAsync,
  };
};

