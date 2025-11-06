export interface ICreatePostRequest {
  caption?: string;
  media?: File[];
  media_ids?: number[];
  price?: string;
  is_available?: boolean;
  location_latitude?: string;
  location_longitude?: string;
  location_address?: string;
}

export interface IPost {
  id: number;
  caption?: string;
  media: IPostMedia[];
  price?: string;
  is_available: boolean;
  location_latitude?: string;
  location_longitude?: string;
  location_address?: string;
  created_at: string;
  updated_at: string;
  cook_id: number;
  likes_count: number;
  comments_count: number;
}

export interface IPostMedia {
  id: number;
  media_url: string;
  media_type: "image" | "video";
  thumbnail_url?: string;
  order: number;
}

export interface ICreatePostResponse {
  post: IPost;
  message?: string;
}

export type MediaFile = {
  file: File;
  preview: string;
  type: "image" | "video";
};
