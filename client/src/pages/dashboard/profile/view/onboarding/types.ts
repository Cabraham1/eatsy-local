import * as z from "zod";

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ACCEPTED_FILE_TYPES = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];

export const onboardingFormSchema = z.object({
  bio: z
    .string()
    .min(50, "Bio must be at least 50 characters")
    .max(500, "Bio must not exceed 500 characters"),
  bank_account_number: z.string().min(10, "Please enter a valid account number"),
  bank_name: z.string().min(2, "Please enter your bank name"),
  account_holder_name: z.string().min(2, "Please enter account holder name"),
  id_document: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, "File size must be less than 5MB")
    .refine(
      (file) => ACCEPTED_FILE_TYPES.includes(file.type),
      "Only .jpg, .jpeg, .png and .pdf files are accepted"
    ),
});

export type OnboardingFormValues = z.infer<typeof onboardingFormSchema>;

