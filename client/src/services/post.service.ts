import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/constants/api-client";
import { API_ENDPOINTS } from "@/lib/constants/config";
import { ICreatePostRequest, ICreatePostResponse } from "@/types/post";

// API functions
const createPost = async (data: ICreatePostRequest): Promise<ICreatePostResponse> => {
  // Create FormData for multipart/form-data
  const formData = new FormData();

  // Append caption if provided
  if (data.caption?.trim()) {
    formData.append("caption", data.caption.trim());
  }

  // Append media files if provided (direct file upload)
  if (data.media && data.media.length > 0) {
    data.media.forEach((file) => {
      formData.append("media", file);
    });
  }

  // Append media_ids if provided (presigned URL flow)
  if (data.media_ids && data.media_ids.length > 0) {
    data.media_ids.forEach((id) => {
      formData.append("media_ids", id.toString());
    });
  }

  // Append price if provided
  if (data.price?.trim()) {
    formData.append("price", data.price.trim());
  }

  // Append is_available (always include this as it has a default value)
  formData.append("is_available", (data.is_available ?? true).toString());

  // Append location data if provided
  if (data.location_latitude?.trim()) {
    formData.append("location_latitude", data.location_latitude.trim());
  }
  if (data.location_longitude?.trim()) {
    formData.append("location_longitude", data.location_longitude.trim());
  }
  if (data.location_address?.trim()) {
    formData.append("location_address", data.location_address.trim());
  }

  // Send FormData - The API client interceptor will handle Content-Type automatically
  const response = await api.post<ICreatePostResponse>(API_ENDPOINTS.social.createPost, formData);

  return response.data!;
};

export const postService = {
  createPost,
};

// Hook for creating a post
export const useCreatePost = () => {
  const queryClient = useQueryClient();

  const { isPending, error, mutate, mutateAsync } = useMutation({
    mutationKey: ["social", "create-post"],
    mutationFn: createPost,
    onSuccess: () => {
      // Invalidate posts queries to refetch
      queryClient.invalidateQueries({ queryKey: ["social", "posts"] });
    },
  });

  return {
    isLoading: isPending,
    error,
    createPost: mutate,
    createPostAsync: mutateAsync,
  };
};
