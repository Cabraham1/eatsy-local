import { z } from "zod";

// Frontend-only types using Zod; no DB or server dependencies

export const userSchema = z.object({
  id: z.number(),
  username: z.string(),
  password: z.string().optional(),
  email: z.string().email(),
  fullName: z.string().optional(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  middle_name: z.string().optional(),
  phone: z.string().optional(),
  userType: z.union([z.literal("customer"), z.literal("cook"), z.literal("user")]).optional(),
  role: z.string().optional(),
  bio: z.string().optional(),
  profileImage: z.string().optional(),
  location: z.string().optional(),
  cuisine: z.string().optional(),
  isFeaturedCook: z.boolean().optional(),
  is_active: z.boolean().optional(),
  is_premium: z.boolean().optional(),
  two_fa_enabled: z.boolean().optional(),
  created_at: z.string().optional(),
  date_joined: z.string().optional(),
  preferences: z.any().optional(),
});

export const dishSchema = z.object({
  id: z.number(),
  cookId: z.number(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
  originalPrice: z.number().nullable().optional(),
  imageUrl: z.string().url(),
  prepTime: z.string(),
  isAvailable: z.boolean().optional(),
  isPopular: z.boolean().optional(),
  hasVeganOption: z.boolean().optional(),
  rating: z.number().optional(),
  ratingCount: z.number().optional(),
  tags: z.array(z.string()),
  createdAt: z.date().optional(),
});

export const orderSchema = z.object({
  id: z.number(),
  customerId: z.number(),
  cookId: z.number(),
  status: z.string(),
  totalAmount: z.number(),
  deliveryFee: z.number(),
  orderDate: z.date(),
  items: z.array(z.any()).optional(),
});

export const orderItemSchema = z.object({
  id: z.number(),
  orderId: z.number(),
  dishId: z.number(),
  quantity: z.number(),
  price: z.number(),
});

export const storySchema = z.object({
  id: z.number(),
  title: z.string(),
  imageUrl: z.string().url(),
  type: z.union([z.literal("category"), z.literal("cuisine"), z.literal("cook")]),
  referenceId: z.number().optional(),
  createdAt: z.date(),
});

export type User = z.infer<typeof userSchema>;
export type Dish = z.infer<typeof dishSchema>;
export type Order = z.infer<typeof orderSchema>;
export type OrderItem = z.infer<typeof orderItemSchema>;
export type Story = z.infer<typeof storySchema>;

export const insertUserSchema = userSchema.partial({
  id: true,
  isFeaturedCook: true,
});
export type InsertUser = z.infer<typeof insertUserSchema>;

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
export type LoginCredentials = z.infer<typeof loginSchema>;
